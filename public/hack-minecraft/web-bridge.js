/* Browser replacement for Kano's Qt WebChannel bindings.
 * Runs the recovered Hack Minecraft UI against the Make Minecraft PE runtime.
 */
(function () {
  'use strict';
  var frame, readyPromise, playing = false, dialog, returningTab = false;
  var outsideListeners = [];
  window.Kano = window.Kano || {};
  window.Kano.MakeMinecraft = window.Kano.MakeMinecraft || {};
  var core = window.Kano.Core = {};
  if (!location.hash) history.replaceState(null, '', location.pathname + '#/');
  function host() { return document.querySelector('make-minecraft'); }
  function callback(cb, value) { if (typeof cb === 'function') cb(value); return value; }
  function game() { return frame && frame.contentWindow; }
  function command(text) {
    var g = game();
    if (!g || !g.Module || !g.KanoMCPI) throw Error('Minecraft is still loading.');
    return g.KanoMCPI.rawCommand(text, g.Module);
  }
  function forwardKey(event) {
    if (event.key === 'Tab') {
      if (event.type !== 'keydown' || !playing || event.repeat) { event.preventDefault(); event.stopImmediatePropagation(); return; }
      returningTab = true;
      event.preventDefault(); event.stopImmediatePropagation();
      var app = host();
      if (app && app.dispatch) app.dispatch({type: 'CHANGE_EDITOR_MODE', mode: 'code'});
      return;
    }
    // The recovered power engine listens in the editor window; gameplay is in
    // the same-origin game frame. Forward powers without blocking SDL movement.
    var copy = new KeyboardEvent(event.type, {
      key: event.key, code: event.code, keyCode: event.keyCode, which: event.which,
      shiftKey: event.shiftKey, ctrlKey: event.ctrlKey, altKey: event.altKey,
      metaKey: event.metaKey, repeat: event.repeat, bubbles: true
    });
    document.body.dispatchEvent(copy);
  }
  window.addEventListener('keydown', function (event) {
    if (event.key === 'Tab' && event.repeat) { event.preventDefault(); event.stopImmediatePropagation(); }
  }, true);
  window.addEventListener('keyup', function (event) {
    if (event.key === 'Tab' && returningTab) { returningTab = false; event.preventDefault(); event.stopImmediatePropagation(); }
  }, true);
  function ensureGame() {
    if (readyPromise) return readyPromise;
    readyPromise = new Promise(function (resolve, reject) {
      frame = document.createElement('iframe');
      frame.id = 'hack-minecraft-game'; frame.title = 'Minecraft Pocket Edition';
      frame.src = '/make-minecraft/original-ui/port/game/index.html';
      frame.allow = 'autoplay; fullscreen';
      frame.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;border:0;z-index:0;visibility:hidden;background:black';
      frame.addEventListener('load', function () {
        var g = game();
        g.addEventListener('keydown', forwardKey, true);
        g.addEventListener('keyup', forwardKey, true);
        g.addEventListener('mousedown', function () { outsideListeners.forEach(function (fn) { fn(); }); });
      });
      document.body.appendChild(frame);
      var started = Date.now();
      function check() {
        var g = game();
        if (g && g.Module && g.Module.calledRun && g.KanoMCPI) { resolve(g); return; }
        if (Date.now() - started > 120000) { reject(Error('Minecraft could not start.')); return; }
        setTimeout(check, 200);
      }
      check();
    });
    return readyPromise;
  }
  function setFrame(x, y, width, height) {
    var app = host();
    if (app) app.style.cssText = 'position:fixed;z-index:2;left:' + x + 'px;top:' + y + 'px;width:' + width + 'px;height:' + height + 'px;';
    return Promise.resolve();
  }
  core.AppWindow = {
    init: function () { return Promise.resolve(); },
    get screenWidth() { return window.innerWidth; },
    get screenHeight() { return window.innerHeight; },
    get width() { return host() ? host().offsetWidth : innerWidth; },
    get height() { return host() ? host().offsetHeight : innerHeight; },
    topBarVisible: false,
    setPosition: function (x, y, cb) { var app = host(); if (app) { app.style.left=x+'px'; app.style.top=y+'px'; } callback(cb); },
    resize: function (w, h, cb) { var app=host(); if(app){app.style.width=w+'px';app.style.height=h+'px';} callback(cb); },
    setFrame: setFrame,
    outsideClick: { connect: function (fn) { outsideListeners.push(fn); } },
    close: function () { window.top.location.href = '/'; },
    closeDialog: function () { if (dialog) { dialog.remove(); dialog=null; } },
    openDialog: function (url) {
      if (window.controlsDialogShown) return;
      core.AppWindow.closeDialog();
      dialog=document.createElement('dialog');
      dialog.style.cssText='padding:0;border:0;background:transparent;max-width:70vw;';
      var img=document.createElement('img'); img.src=url; img.style.maxWidth='70vw';
      dialog.appendChild(img);document.body.appendChild(dialog);dialog.showModal();
      dialog.addEventListener('click',function(){window.controlsDialogShown=true;core.AppWindow.closeDialog();});
      dialog.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key==='Escape'){window.controlsDialogShown=true;core.AppWindow.closeDialog();}});
    }
  };
  core.Profile = {
    userToken: null,
    init: function () { return Promise.resolve(); },
    loadAppStateVariable: function (app, variable) {
      try { return Promise.resolve(JSON.parse(localStorage.getItem('hack-minecraft.profile:'+app+':'+variable))); }
      catch (e) { return Promise.resolve(null); }
    },
    saveAppStateVariable: function (app, variable, value) {
      localStorage.setItem('hack-minecraft.profile:'+app+':'+variable,JSON.stringify(value));
      return Promise.resolve(value);
    },
    loadAppState: function (app) { return this.loadAppStateVariable(app,'state'); },
    saveAppState: function (app,value) { return this.saveAppStateVariable(app,'state',value); }
  };
  core.Minecraft = {
    init: function () { return Promise.resolve(); },
    initialise: function (cb) { return ensureGame().then(function(){callback(cb);}); },
    startMinecraft: function (cb) { return ensureGame().then(function(){callback(cb);}); },
    setupMinecraft: function (cb) { callback(cb); return Promise.resolve(); },
    completeSetup: function () { return ensureGame(); },
    stopMinecraft: function (cb) { this.grabInputFromMinecraft(); callback(cb); },
    releaseInputToMinecraft: function () {
      playing=true; ensureGame().then(function(g){
        frame.style.visibility='visible';
        if(g.Module._webResumeForMake)g.Module._webResumeForMake();
        frame.focus();
      });
    },
    grabInputFromMinecraft: function () {
      playing=false;
      var g=game();
      if(g){if(g.document.exitPointerLock)g.document.exitPointerLock();if(g.Module&&g.Module._webHotfixPause&&g.mcMenuOpen===false)g.Module._webHotfixPause();}
      if(frame)frame.style.visibility='hidden';
      window.focus();
    },
    sendCustomCmd: function (text, cb) {
      var result='';String(text).split('\n').forEach(function(line){if(line.trim())result=command(line);});
      return callback(cb,result);
    },
    chatPost: function (text, cb) { return callback(cb,command('chat.post('+String(text).replace(/\n/g,' ')+')')); },
    getTile: function (cb) {
      var fields=String(command('player.getTile()')).trim().split(',').map(Number);
      if(fields.length!==3||fields.some(function(n){return !Number.isFinite(n);}))throw Error('Open Kano World in Minecraft before using powers.');
      return callback(cb,{x:fields[0],y:fields[1],z:fields[2]});
    },
    getPosition: function (cb) {var f=String(command('player.getPos()')).trim().split(',').map(Number);return callback(cb,{x:f[0],y:f[1],z:f[2]});},
    setPosition: function (x,y,z,cb) {return callback(cb,command('player.setPos('+[x,y,z].join(',')+')'));},
    setBlock: function () {return command('world.setBlock('+Array.from(arguments).filter(function(v){return typeof v!=='function';}).join(',')+')');},
    setBlocks: function () {return command('world.setBlocks('+Array.from(arguments).filter(function(v){return typeof v!=='function';}).join(',')+')');},
    getBlock: function(x,y,z,cb){return callback(cb,Number(command('world.getBlock('+[x,y,z].join(',')+')')));}
  };
  window.addEventListener('resize',function(){
    var app=host();if(!app||!app.state||!app.state.editor)return;
    if(app.state.editor.mode==='code')setFrame(50,50,innerWidth-100,innerHeight-100);
  });
}());
