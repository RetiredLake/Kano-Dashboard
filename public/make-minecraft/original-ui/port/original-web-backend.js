/* Backend adapter for the preserved original Kano interface. */
(function () {
    'use strict';
    var key = 'kano.make-minecraft.original-web.progress.v1';
    var level = Number(localStorage.getItem(key)) || 1;
    level = Math.max(1, Math.min(14, level));
    var files = {};
    var lastError = 'No errors';
    // The short Sites route gets copies of old workspace caches, never deletes
    // or overwrites either profile. Progress itself already uses a stable key.
    if (location.pathname === '/make-minecraft/minecraft/' || location.pathname === '/make-minecraft/minecraft/index.html') {
        var oldBases = [
            location.origin + '/make-minecraft/original-ui/make-minecraft/minecraft/',
            location.origin + '/make-minecraft/original-ui/make-minecraft/minecraft/index.html',
            location.origin + '/make-minecraft/minecraft/',
            location.origin + '/make-minecraft/minecraft/index.html'
        ];
        var newBase = location.origin + location.pathname;
        for (var cached = 1; cached <= 14; cached++) {
            var suffix = '#project' + cached;
            oldBases.some(function (oldBase) {
                if (localStorage.getItem(newBase + suffix) === null && localStorage.getItem(oldBase + suffix) !== null) {
                    localStorage.setItem(newBase + suffix, localStorage.getItem(oldBase + suffix));
                }
                return localStorage.getItem(newBase + suffix) !== null;
            });
        }
        oldBases.some(function (oldBase) {
            if (localStorage.getItem(newBase + '#playground') === null && localStorage.getItem(oldBase + '#playground') !== null) {
                localStorage.setItem(newBase + '#playground', localStorage.getItem(oldBase + '#playground'));
            }
            return localStorage.getItem(newBase + '#playground') !== null;
        });
    }
    var gameFrame, gameStage;
    var filePrefix = 'kano.make-minecraft.original-web.file:';
    function saved(name) { return files[name] === undefined ? localStorage.getItem(filePrefix + name) : files[name]; }
    function store(name, source) { files[name] = String(source); localStorage.setItem(filePrefix + name, files[name]); }
    var editorFocus;
    function hideGame() {
        if (!gameStage || gameStage.style.display === 'none') return;
        var game = gameFrame.contentWindow;
        if (game.Module && game.Module._webHotfixPause && game.mcMenuOpen === false) {
            game.Module._webHotfixPause();
        }
        var gameDocument = gameFrame.contentDocument;
        if (gameDocument.exitPointerLock) gameDocument.exitPointerLock();
        if (gameDocument.fullscreenElement && gameDocument.exitFullscreen) {
            gameDocument.exitFullscreen().catch(function () {});
        }
        gameStage.style.display = 'none';
        window.focus();
        if (editorFocus && editorFocus.isConnected) editorFocus.focus();
    }
    function returnOnTab(event) {
        if ((event.key !== 'Tab' && event.code !== 'Tab') ||
                !gameStage || gameStage.style.display === 'none') return;
        event.preventDefault();
        event.stopImmediatePropagation();
        hideGame();
    }
    window.addEventListener('keydown', returnOnTab, true);
    function showGame() {
        if (!gameStage || gameStage.style.display === 'none') editorFocus = document.activeElement;
        if (!gameFrame) {
            gameStage = document.createElement('div');
            gameStage.style.cssText = 'position:fixed;inset:0;background:black;z-index:100000;';
            gameFrame = document.createElement('iframe');
            gameFrame.title = 'Minecraft PE 0.6.1 alpha';
            gameFrame.id = 'original-game-frame';
            gameFrame.src = new URL('../../port/game/index.html', document.baseURI).href;
            gameFrame.style.cssText = 'width:100%;height:100%;border:0;';
            gameFrame.allow = 'fullscreen; autoplay';
            gameFrame.addEventListener('load', function () {
                gameFrame.contentWindow.addEventListener('keydown', returnOnTab, true);
            });
            gameStage.appendChild(gameFrame);
            var back = document.createElement('button');
            back.textContent = 'Back to Make Minecraft';
            back.style.cssText = 'position:absolute;right:12px;top:12px;z-index:2;';
            back.onclick = hideGame;
            gameStage.appendChild(back);
            document.body.appendChild(gameStage);
        }
        gameStage.style.display = 'block';
        gameFrame.focus();
        return gameFrame.contentWindow;
    }
    function launch(callback, onlyShow) {
        showGame();
        if (onlyShow) { if (callback) callback(0); return; }
        var deadline = Date.now() + 120000;
        function runWhenReady() {
            var game = gameFrame.contentWindow;
            var ready = false;
            try {
                ready = game.Module && game.Module.calledRun && game.KanoMCPI &&
                    game.KanoMCPI.rawCommand('player.getPos()', game.Module).trim().split(',').length === 3;
                if (ready && game.Module._webResumeForMake) {
                    ready = !!game.Module._webResumeForMake();
                }
            } catch (error) { ready = false; }
            if (!ready && Date.now() < deadline) { setTimeout(runWhenReady, 250); return; }
            var promise = ready ? game.KanoLessons.run(saved('mc_script.py') || '', {
                allowTimedStop: [11, 12].indexOf(Number(window.Project.getLastVisited())) !== -1
            }) : Promise.resolve({ok: false, error: 'Open Kano World in Minecraft, then press Make again.'});
            promise.then(function (result) {
                lastError = result.ok ? 'No errors' : result.error;
                document.getElementById('makingGame').style.display = 'none';
                if (callback) callback(result.ok ? 0 : 1);
            }).catch(function (error) {
                lastError = String(error);
                document.getElementById('makingGame').style.display = 'none';
                if (callback) callback(1);
            });
        }
        runWhenReady();
    }
    // Preserve both code fragments in order, like Kano's original diff merge.
    function diffLines(first, second) {
        var a = String(first || '').match(/[^\n]*\n|[^\n]+$/g) || [];
        var b = String(second || '').match(/[^\n]*\n|[^\n]+$/g) || [];
        if (a.length * b.length > 1000000) throw Error('Code is too large to merge safely');
        var table = Array.from({length: a.length + 1}, function () { return new Uint32Array(b.length + 1); });
        for (var i = a.length - 1; i >= 0; i--) for (var j = b.length - 1; j >= 0; j--) {
            table[i][j] = a[i] === b[j] ? table[i + 1][j + 1] + 1 : Math.max(table[i + 1][j], table[i][j + 1]);
        }
        var merged = [], additions = 0; i = 0; j = 0;
        while (i < a.length || j < b.length) {
            if (i < a.length && j < b.length && a[i] === b[j]) { merged.push(a[i++]); j++; }
            else if (i < a.length && (j === b.length || table[i + 1][j] >= table[i][j + 1])) merged.push(a[i++]);
            else { merged.push(b[j++]); additions++; }
        }
        return {code: merged.join(''), additions: additions};
    }
    function download(name, text) {
        var link = document.createElement('a');
        var url = URL.createObjectURL(new Blob([text], {type: 'text/plain'}));
        link.href = url; link.download = name;
        document.body.appendChild(link); link.click(); link.remove();
        setTimeout(function () { URL.revokeObjectURL(url); }, 60000);
    }
    function asset(name) {
        if (name.indexOf('make-minecraft/') === 0) name = '../../' + name;
        var url = new URL(name, document.baseURI);
        if (url.origin !== location.origin) throw Error('External file read is not supported');
        var request = new XMLHttpRequest();
        request.open('GET', url.href, false);
        request.send();
        if (request.status !== 200) throw Error('Cannot read preserved asset: ' + name);
        return request.responseText;
    }
    var xp = JSON.parse(asset('../../port/xp.json'))['make-minecraft'].level;
    // Browser compatibility fixes shared with the native original UI adapter.
    new MutationObserver(function () {
        document.querySelectorAll('image').forEach(function (image) {
            var href = image.getAttribute('xlink:href');
            if (href && image.getAttribute('href') !== href) image.setAttribute('href', href);
        });
    }).observe(document.documentElement, {
        childList: true, subtree: true, attributes: true, attributeFilter: ['xlink:href']
    });
    window.addEventListener('load', function () {
        window.removeEventListener('load', window.Project.onload);
        Object.keys(window.toolbox).forEach(function (key) {
            var original = window.toolbox[key];
            if (typeof original !== 'function') return;
            window.toolbox[key] = function () {
                var holder = document.createElement('div');
                holder.innerHTML = original.apply(this, arguments);
                holder.querySelectorAll('category').forEach(function (category) {
                    if (!category.hasAttribute('label')) {
                        category.setAttribute('label', category.getAttribute('name').replace(/^x-/, ''));
                    }
                });
                return holder.innerHTML;
            };
        });
        window.Project.onload();
    }, { once: true, capture: true });
    window.backend.call = function (method) {
        var args = Array.prototype.slice.call(arguments, 1);
        var callback = typeof args[args.length - 1] === 'function' ? args.pop() : null;
        var result;
        switch (method) {
        case 'load_level': result = level; break;
        case 'arg_level': result = 'make'; break;
        case 'save_level_and_calculate_xp_diff':
            var previous = level;
            level = Math.max(level, Math.min(14, Number(args[0]) || 1));
            localStorage.setItem(key, String(level));
            result = 0;
            for (var earned = previous; earned < level; earned++) result += xp[String(earned)] || 0;
            break;
        case 'readFile': result = saved(args[0]); if (result === null) result = asset(args[0]); break;
        case 'save':
            store(args[0], args[1] || '');
            if (args[0] !== 'mc_script.py') download(args[0], args[1] || '');
            result = true; break;
        case '_get_errors': result = lastError; break;
        case 'get_xp': result = JSON.stringify(xp); break;
        // The archived Challenge.setScreenshot deliberately discards this data.
        // Its old file:// screenshot read must not abort browser exports.
        case 'read_image': result = ''; break;
        case 'launch': launch(callback, args.length > 0); return;
        case 'reset_world':
            if (!gameFrame || !gameFrame.contentWindow.KanoMakeBackend) {
                lastError = 'Open the game and quit to its title before resetting Kano World.';
                result = 1; break;
            }
            return gameFrame.contentWindow.KanoMakeBackend.call('reset_world', callback);
        case 'play_intro':
            var video = document.createElement('video');
            video.controls = true;
            video.src = new URL('../../kano-video-files/videos/minecraft.mp4', document.baseURI).href;
            var dialog = document.createElement('dialog');
            video.style.cssText = 'width: min(80vw,960px);max-height:80vh';
            var close = document.createElement('button'); close.textContent = 'Close';
            close.onclick = function () { video.pause(); dialog.close(); dialog.remove(); };
            dialog.addEventListener('cancel', function () { video.pause(); dialog.remove(); });
            dialog.appendChild(video); dialog.appendChild(close); document.body.appendChild(dialog);
            dialog.showModal(); break;
        case 'count_new_lines_of_code': result = diffLines(saved('mc_script.py'), args[0]).additions; break;
        case 'merge_code': result = diffLines(args[0], args[1]).code; break;
        case 'ship': result = 'cannot login'; break;
        case 'save_challenge': store(args[0] + '.xml', args[2]); store(args[0] + '.json', JSON.stringify({title: args[0], description: args[1]})); download(args[0] + '.xml', args[2]); result = 1; break;
        case 'chooseFile': case 'web_load':
            var input = document.createElement('input'); input.type = 'file'; input.accept = '.xml,.py';
            input.onchange = function () {
                if (!input.files.length) { if (callback) callback(''); return; }
                var file = input.files[0];
                file.text().then(function (text) { store(file.name, text); if (callback) callback(method === 'web_load' ? text : file.name); });
            };
            input.addEventListener('cancel', function () { if (callback) callback(''); });
            input.click(); return;
        case 'exit': window.top.location.href = '/'; break;
        case 'launch_forum': window.open(args[0], '_blank', 'noopener'); break;
        case 'play_sound':
            new Audio(new URL(args[0], document.baseURI).href).play().catch(function () {});
            break;
        case 'update_stats':
            var statsKey = 'kano.make-minecraft.original-web.stats.v1';
            var stats = JSON.parse(localStorage.getItem(statsKey) || '[]');
            stats.push(args); localStorage.setItem(statsKey, JSON.stringify(stats)); break;
        case 'on_web_load': case 'log': break;
        default: throw Error('Original web backend method not yet adapted: ' + method);
        }
        if (callback) callback(result);
        return result;
    };
}());
