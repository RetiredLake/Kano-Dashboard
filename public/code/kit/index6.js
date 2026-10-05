define(["./chunk-fdc6718c.js","./chunk-3c505003.js","./chunk-95fc273d.js","./chunk-bb3b379f.js","./chunk-63981443.js","./chunk-0552f067.js","./chunk-c5460259.js","./chunk-93a2d04f.js","./chunk-19bce21e.js","./chunk-8b3412b4.js","./chunk-654f977c.js","./chunk-bbbf26f6.js","./chunk-2b452c28.js","./chunk-7658960f.js","./chunk-e86f6c80.js","./chunk-33d51465.js","./chunk-be7f2d6a.js","./chunk-42d2b7ff.js","./chunk-5472545b.js","./chunk-9968f662.js","./chunk-83c85edb.js","./chunk-f8a285e9.js","./chunk-e8284588.js","./chunk-e1d3b61d.js","./chunk-dac62d81.js","./chunk-3ec8d6ce.js","./chunk-5be10de5.js","./chunk-a33d2420.js","./chunk-d555f264.js","./chunk-7e191bbc.js","./chunk-b593cb26.js","./chunk-73cb4c23.js","./chunk-a4335312.js","./chunk-75c10612.js","./chunk-6da1ebd5.js","./chunk-dce7f082.js","./chunk-86ecdd4d.js","./chunk-90a58e12.js","./chunk-ede86d1c.js","./chunk-9842783d.js","./chunk-d52b5dbe.js","./chunk-cf7144da.js","./chunk-a03fd3f9.js","./chunk-a86cbd6e.js","./chunk-20f407ed.js","./chunk-30c1c965.js","./chunk-52525535.js","./chunk-d7e151a4.js"],function(e,t,n,i,o,s,r,c,a,l,d,u,h,p,k,f,g,m,b,v,j,x,w,E,y,P,_,S,D,I,A,R,B,q,O,U,$,C,W,z,M,G,N,T,K,L,F,H){"use strict";class V extends n.SceneWorkspaceViewProvider{setup(e){this.editor=e,this.root=document.createElement("ka-workspace-wand"),this.root.width=800,this.root.height=600,this.root.storeId=this.editor.store.id,this.editor.registerEvent("win"),this.editor.registerEvent("lose"),this.subscriptions=new t.Subscriptions}onInject(){const e=document.createElement("ka-challenge-end-dialog");e.setAttribute("id","end-dialog"),e.rootUrl=this.editor.output.outputProfile.root,this.root.parentElement.appendChild(e)}onDispose(){this.subscriptions.dispose()}}class X extends s.AppModule{constructor(){super(),this.addMethod("onAppStarts","_whenAppStarts")}static get id(){return"events"}_whenAppStarts(e){e()}}class J extends n.WandOutputProfile{setup(e){this.root=e,this._provider=document.createElement("ka-output-wand"),this._provider.setAttribute("slot","workspace");const t=r.CustomSpeakerFactory(this.root.replace("/profiles/hoc-2018","/profiles/wand"));this.scenePlugin=new n.ScenePlugin("sandbox"),this.partsPlugin=new o.PartsOutputPlugin([o.Hardware],[t,i.Mouse])}get plugins(){return[this.scenePlugin,this.partsPlugin]}get modules(){const e=super.modules.filter(e=>"wand"!==e.id&&"events"!==e.id);return e.push(X),e}}customElements.define("ka-simple-link",class extends(u.Store.StateReceiver(e.PolymerElement)){static get template(){return e.html`
            <style>
                :host {
                    display: block;
                }
                .wrapper {
                    padding: 15px 15px 30px;
                    max-width: 360px;
                    text-align: center;
                }
                .title {
                    color: #414A51;
                    padding-top: 20px;
                    padding-bottom: 10px;
                    font-weight: bold;
                    font-size: 20px;
                }
                .description {
                    color: #414A51;
                    max-width: 240px;
                    margin: 0 auto;
                }
                .bold {
                    font-weight: bold;
                }
                .link {
                    height: 29px;
                    display: inline-flex;
                    margin-top: 18px;
                }
                img {
                    width: 100%;
                }
                .button {
                    border-radius: 40px;
                    padding: 4px 16px;
                    color: white;
                    background-color: var(--color-kano-orange);
                    border: none;
                    font-family: var(--font-body);
                    text-decoration: none;
                    font-size: 16px;
                    margin: 0 8px;
                    font-weight: bold;
                }
            </style>
            <div class="wrapper">
                <div class="image" hidden$="[[_hideImage()]]">
                    <img src$="[[_computeImageSrc(rootUrl)]]"/>
                </div>
                <div class="title">
                    [[info.title]]
                </div>
                <div class="description">
                    [[info.description]]
                </div>
                <div class="link">
                    <a href="[[link]]" target="_blank" class="button">[[info.button]]</a>
                </div>
            </div>
        `}static get properties(){return{link:{type:String,default:"http://world.kano.me"},info:{type:Object},rootUrl:String}}_hideImage(){return!this.info.image}_computeImageSrc(e){return e&&this.info.image?`${e}${this.info.image}`:""}});class Q extends s.Plugin{constructor(e){super(),this.root=e,this._onDidRequestExit=new c.EventEmitter}get onDidRequestExit(){return this._onDidRequestExit.event}onInstall(e){e.activityBar.registerEntry({title:"Back",icon:`${this.root}/assets/activity-bar/back.svg`,size:e.activityBar.size.BIG,important:!0}).onDidActivate(()=>this._onDidRequestExit.fire());const t=document.createElement("ka-simple-link");t.link="http://world.kano.me",t.info={title:"Great work!",description:"Keep leveling up...check out Kano World for more creative coding challenges.",button:"Let's Go!"},this.userStatusEntry=e.activityBar.registerTooltipEntry({title:"World",icon:r.ironIconDataURI("kwc-ui-icons:user"),root:t})}}class Y extends(u.Store.StateReceiver(d.mixinBehaviors([a.PaperDialogBehavior],e.PolymerElement))){static get template(){return e.html`<style>:host{font-family:var(--font-body);background:#fff;border-radius:8px;display:flex;flex-direction:column;align-items:center}:host :focus{outline:0}</style><div class=info><ka-simple-link info=[[info]] link=[[link]] root-url=[[rootUrl]]></ka-simple-link></div>`}static get is(){return"ka-challenge-end-dialog"}static get properties(){return{withBackdrop:{type:Boolean,value:!0},modal:{type:Boolean,value:!1},link:{value:"http://kano.me/wand"},rootUrl:{value:"/./profiles/hoc-2018"},info:{value:{title:"Amazing job!",description:"Get the full experience with Kano Coding Wand",button:"Learn More",image:"/assets/wand-dialog.png"}}}}}window.customElements.define(Y.is,Y);const Z={name:"events",verbose:"Events",type:"module",color:"#5fc9f3",symbols:[{name:"onAppStarts",verbose:"when App starts",type:"function",parameters:[{name:"callback",verbose:"",returnType:Function}],blockly:{postProcess:e=>(delete e.previousStatement,delete e.nextStatement,e)}}]};class ee extends n.WandEditorProfile{constructor(e){super(e,"",{}),this._onDidRequestExit=new c.EventEmitter}onInstall(e){this._provider=new V(e),super.onInstall(e),this.editor=e,e.creation.disable(),this._outputProfile=new J(this.root),this.partsPlugin=new o.PartsPlugin(this.outputProfile.partsPlugin),this._activityBarPlugin=new Q(this.root),this._activityBarPlugin.onDidRequestExit(()=>this._onDidRequestExit.fire());const t=this.editor.plugins.filter(e=>e.challengeActions&&"kano-app-challenge"===e.rootEl.localName);t&&t.length>0&&c.subscribeDOM(t[0].rootEl,"challenge-completed",e=>{this._challengeCompleted(e)})}_challengeCompleted(e){this.editor.rootEl.parentElement.$.banner.$["banner-save-button"].hidden=!0;const t=[e.detail],n=this.editor.workspaceProvider;let i=localStorage.getItem("hoc-2018");if(i=i?i.split(","):[],t&&i.indexOf(t[0])<0){const e=i.concat(t);localStorage.setItem("hoc-2018",e),5===e.length&&n.root.parentElement.children["end-dialog"].open()}}get onDidRequestExit(){return this._onDidRequestExit.event}get outputProfile(){return this._outputProfile}get toolbox(){const e=super.toolbox.filter(e=>{const t=e.id||e.name;return"wand"!==t&&"events"!==t});return e.unshift(Z),e}}function te(e){return{editor:new ee(e.profilePath,e.config.API_URL),output:new J(e.profilePath)}}return h.DeferedActivation.register(h.EXTENSION_POINTS.CODE,function(e){const t=te(e);t.editor.onDidRequestExit(()=>p.historyBack()),e.code.setEditorProfile(t.editor),e.code.setOutputProfile(t.output)}),te});