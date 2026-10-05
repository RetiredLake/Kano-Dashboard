define(["require","./chunk-fdc6718c.js","./chunk-bbbf26f6.js","./chunk-f8a285e9.js","./chunk-7658960f.js","./chunk-e1d3b61d.js","./chunk-654f977c.js","./chunk-a4335312.js","./chunk-04ad14cf.js","./chunk-e8284588.js","./chunk-42d2b7ff.js","./chunk-5472545b.js","./chunk-9968f662.js","./chunk-19bce21e.js","./chunk-73cb4c23.js","./chunk-83c85edb.js","./chunk-bf2c299c.js","./chunk-30c1c965.js"],function(e,t,s,a,r,o,i,n,l,c,g,h,p,d,u,m,w,v){"use strict";window.customElements.define("kwc-rewards-avatar",class extends(s.Store.StateReceiver(t.PolymerElement)){static get template(){return t.html`
            <style>
                :host {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    font-family: var(--font-body);
                }
                *:focus {
                    outline: none;
                }
                img {
                    width: 425px;
                }
                .level {
                    color: #FFB300;
                    font-weight: bold;
                    font-size: 16.5px;
                    text-transform: uppercase;
                    margin-top: 12px;
                }
                p {
                    color: #9FA4A8;
                    font-weight: bold;
                    font-size: 25px;
                    margin: 16px 0 8px;
                }
                button {
                    color: #FFF;
                    text-transform: uppercase;
                    font-weight: bold;
                    border: none;
                    border-radius: 25px;
                    background-color: #FF6A00;
                    padding: 9px 18px;
                    margin-top: 25.5px;
                    cursor: pointer;
                    font-family: var(--font-body);
                }
                .progress {
                    margin-top: 25px;
                    position: relative;
                }
                .progress span {
                    background-color: #FFB300;
                    color: #FFF;
                    font-weight: bold;
                    font-size: 11px;
                    padding: 2px 8px;
                    border-radius: 2px;
                    position: absolute;
                    top: -19px;
                    transform: translateX(-50%);
                }
                .progress .arrow {
                    width: 0;
                    height: 0;
                    border-left: 5px solid transparent;
                    border-right: 5px solid transparent;
                    border-top: 5px solid #FFB300;
                    position: absolute;
                    bottom: -5px;
                    left: 50%;
                    transform: translateX(-50%);
                }
                .progress progress {
                    height: 10px;
                    -webkit-appearance: none;
                    appearance: none;
                }
                .progress progress[value]::-webkit-progress-bar {
                    background-color: #E3E3E3;
                    border-radius: 9px;
                }
                .progress progress[value]::-webkit-progress-value {
                    background-color: #FFB300;
                    border-radius: 9px;
                }
            </style>
            <img src\$="[[userProfile.avatarFull]]">
            <p>[[userProfile.username]]</p>
            <div class="progress">
                <span>
                    [[commaFormatted(value)]]
                    <div class="arrow"></div>
                </span>
                <progress max="[[maximum]]" value="[[adjustedValue]]" id="progress"></progress>
            </div>
            <span class="level">Level [[level]]</span>
            <button on-click="_continue">Continue</button>
        `}static get properties(){return{config:{type:Object,linkState:"config"},userProfile:{type:Object,linkState:"users.authenticated.profile"},max:{type:Number},value:{type:Number},complete:{type:Number,observer:"setProgressPosition"},level:{type:Number}}}setProgressPosition(){const e=this.shadowRoot.querySelector(".progress span"),t=100*this.complete,s=e.offsetWidth,a=Math.floor(this.max-(this.value-this.value*this.complete));this.maximum=a||this.max;const r=Math.floor(this.maximum/100*t);this.adjustedValue=0===r?1:r,e.style.left=`${t}%`,0===s&&this.waitForProgressSize()}waitForProgressSize(){setTimeout(()=>{this.setProgressPosition()},0)}commaFormatted(e){return e.toString().replace(/\B(?=(\d{3})+(?!\d))/g,",")}_continue(){this.dispatchEvent(new CustomEvent("avatar-clicked-continue",{bubbles:!0,composed:!0}))}});window.customElements.define("kwc-rewards-reward",class extends t.PolymerElement{static get template(){return t.html`
            <style>
                :host {
                    display: flex;
                    justify-content: center;
                    font-family: var(--font-body);
                }
                iron-pages div {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }
                *:focus {
                    outline: none;
                }
                span {
                    color: #FFB300;
                    font-weight: bold;
                    font-size: 16.5px;
                    text-transform: uppercase;
                    margin: 24.5px 0 70px;
                }
                p {
                    color: #9FA4A8;
                    font-weight: bold;
                    font-size: 25px;
                    margin: 4px 0;
                }
                button {
                    color: #FFF;
                    text-transform: uppercase;
                    font-weight: bold;
                    border: none;
                    border-radius: 25px;
                    background-color: #FF6A00;
                    padding: 9px 18px;
                    cursor: pointer;
                    font-family: var(--font-body);
                }
                [page="open"] span {
                    margin-bottom: 103px;
                }
                img.double-size {
                    width: 50%;
                }
                [page="collect"] img {
                    max-width: 260px;
                }
            </style>
            <iron-pages selected="[[page]]" attr-for-selected="page" fallback-selection="close">
                <div page="close">
                    <img src$="[[closeImage]]" class="double-size">
                    <span>Mystery avatar accessory</span>
                    <button on-click="_openReward">Open</button>
                </div>
                <div page="open">
                    <img src$="[[openImage]]" class="double-size">
                    <span>Mystery avatar accessory</span>
                </div>
                <div page="collect">
                    <img src$="[[collectImage]]">
                    <span>Mystery avatar accessory</span>
                    <button on-click="_collect">Collect</button>
                </div>
            </iron-pages>
        `}static get properties(){return{page:{type:String,value:"close"},closeImage:{type:String},openImage:{type:String},collectImage:{type:String},time:{type:Number,value:2e3}}}_openReward(){this.set("page","open"),setTimeout(()=>{this.set("page","collect")},this.time)}_collect(){this.dispatchEvent(new CustomEvent("reward-collected",{detail:this.collectImage,bubbles:!0,composed:!0}))}});window.customElements.define("kwc-rewards-finish",class extends(s.Store.StateReceiver(t.PolymerElement)){static get template(){return t.html`
            <style>
                :host {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    font-family: var(--font-body);
                }
                *:focus {
                    outline: none;
                }
                h3,
                p {
                    max-width: 600px;
                }
                h3 {
                    color: #1a1a1a;
                    font-weight: bold;
                    font-size: 35px;
                    margin: 16px 0 32px;
                    text-align: center;
                }
                p {
                    color: #9FA4A8;
                    font-weight: bold;
                    font-size: 16px;
                    margin: 16px 0 8px;
                    text-align: center;
                    line-height: 1.25em;
                }
                button {
                    color: #FFF;
                    text-transform: uppercase;
                    font-weight: bold;
                    border: none;
                    border-radius: 25px;
                    background-color: #FF6A00;
                    padding: 9px 18px;
                    margin-top: 25.5px;
                    cursor: pointer;
                    font-family: var(--font-body);
                }
            </style>
            <h3>Well done, [[user.username]]</h3>
            <p>You've completed the first 40 challenges! 30 more will be coming soon.</p>
            <p>In the meantime try playing on Kano World, remixing the challenges to make them even better, or making something brand new.</p>
            <button on-click="_continue">KANO WORLD</button>
        `}static get properties(){return{user:{type:String,linkState:"users.authenticated.profile"}}}_continue(){r.navigateTo("/creations")}});window.customElements.define("kwc-rewards-pages",class extends t.PolymerElement{static get template(){return t.html`
            <style>
                :host {
                    display: inherit;
                }
            </style>
            <iron-pages selected="[[type]]" attr-for-selected="page-name">
                <kwc-rewards-avatar
                    page-name="avatar"
                    max="[[max]]"
                    value="[[value]]"
                    complete="[[complete]]"
                    level="[[level]]">
                </kwc-rewards-avatar>
                <kwc-rewards-reward
                    page-name="reward"
                    page="[[page]]"
                    close-image="[[closeImage]]"
                    open-image="[[openImage]]"
                    collect-image="[[collectImage]]"
                    time="[[time]]">
                </kwc-rewards-reward>
                <kwc-rewards-finish
                    page-name="finish">
                </kwc-rewards-finish>
            </iron-pages>
        `}static get properties(){return{type:{type:String,value:"avatar"},max:{type:Number},value:{type:Number},complete:{type:Number},level:{type:Number},page:{type:String,value:"close"},closeImage:{type:String},openImage:{type:String},collectImage:{type:String},time:{type:Number,value:2e3}}}});const f=s.Store.types(["UPDATE_CURRENT_MAP"]);s.Store.addMutator(function(e){switch(e.type){case f.UPDATE_CURRENT_MAP:this.set("state.currentMap",e.mapId)}});const b={updateCurrentMap(e){s.Store.dispatch({type:f.UPDATE_CURRENT_MAP,mapId:e})}};class y extends(s.Store.StateReceiver(t.PolymerElement)){static get template(){return t.html`<style>:host{display:flex;flex-direction:column;align-items:center;position:relative;font-family:var(--font-body);background:#ffd394}#container>*,ka-code-challenge{position:absolute;top:0;bottom:0;left:0;width:100%;overflow:hidden}#container{flex:1;width:100%}#rewards-dialog{width:80%;height:80%;border-radius:8px}#rewards-dialog>[dialog-dismiss]{height:35px;position:absolute;top:0;right:0;cursor:pointer}#rewards{height:calc(100% - 48px);display:flex;align-items:center;justify-content:center}</style><template is=dom-if if=[[challengeView]] restamp=""><ka-code-challenge challenges-root=[[_challengesRoot]] on-challenge-completed=_onChallengeCompleted code-manager=[[codeManager]]></ka-code-challenge></template><div id=container></div><paper-dialog id=rewards-dialog with-backdrop=""><img src$=[[config.root]]assets/rewards/close.svg role=button dialog-dismiss=""><kwc-rewards-pages id=rewards on-avatar-clicked-continue=_onAvatarContinue on-reward-collected=_onRewardCollected></kwc-rewards-pages></paper-dialog>`}static get is(){return"ka-view-map"}static get properties(){return{challengeId:{type:String,linkState:"routing.pathParams.id",observer:"challengeIdChanged",value:null},view:{type:String,linkState:"routing.view"},path:{type:String,linkState:"routing.path",observer:"_pathChanged"},config:{type:Object,linkState:"config",observer:"configChanged"},authenticatedUser:{linkState:"users.authenticated.profile",observer:"userChanged",value:null},mapId:{type:String,linkState:"routing.pathParams.submap",observer:"mapIdChanged"},challengeView:{type:Boolean,observer:"_challengeViewChanged"}}}static get observers(){return["_timeoutChallengeView(challengeId, view)"]}connectedCallback(){if(super.connectedCallback(),!this.viewManager)throw new Error("No challenge view manager was provided");this._challengesRoot=this.viewManager.getChallengesRoot(),this.challenges=this.viewManager._sets.home.challenges,this.challengesModel=l.ChallengesFactory(this.config.API_URL);const e=this.viewManager.getChallengesRule();this.authenticatedUser&&this.authenticatedUser.id&&this.challengesModel.getChallenges(e).then(e=>this.viewManager.setProgress(e))}challengeIdChanged(){this.loadKanoCode()}_timeoutChallengeView(){setTimeout(()=>{"challenges"===this.view&&(this.challengeId?this.challengeView=!0:this.challengeView=!1)},0)}_challengeViewChanged(){this.challengeView?this.viewManager.removeElement():this.viewManager.inject(this.$.container)}userChanged(){if(this.challengesModel){const e=this.viewManager.getChallengesRule();this.authenticatedUser&&this.authenticatedUser.id&&this.challengesModel.getChallenges(e).then(e=>this.viewManager.setProgress(e))}this.checkUserProgress()}configChanged(e){this.challengesModel=l.ChallengesFactory(e.API_URL),this.userChanged()}mapIdChanged(){void 0!==this.mapId&&(b.updateCurrentMap(this.mapId),this.viewManager.selectSet(this.mapId))}loadKanoCode(){return new Promise(function(t,s){e(["./ka-code-challenge.js"],t,s)})}_onChallengeCompleted(e){const t=e.detail,s=JSON.parse(localStorage.getItem(`user-progress-${this.authenticatedUser.id}`)),a=+new Date;let r;t["hp-avatar-assets"]&&(r=t["hp-avatar-assets"].changes.newlyUnlocked);let o=s;null===o&&(o={}),void 0===o.levels&&(o.levels={}),void 0===o["hp-avatar-assets"]&&(o["hp-avatar-assets"]={});let i={};if(t.levels&&(i[a]=t.levels.progress),t.levels&&t.levels.progress&&(o.levels[a]=t.levels.progress),r&&r.length>0&&(o["hp-avatar-assets"][a]=r),t["hp-challenges"]){const e=t["hp-challenges"].progress;this.viewManager.setProgress(e);const{newCompleted:s}=t["hp-challenges"].changes,{completed:a}=e,r=Object.keys(this.challenges).length,i=s.length>0&&a.length>=r;o["hp-challenges-completed"]=i}localStorage.setItem(`user-progress-${this.authenticatedUser.id}`,JSON.stringify(o))}checkUserProgress(){if(this.authenticatedUser&&(this.userProgress=JSON.parse(localStorage.getItem(`user-progress-${this.authenticatedUser.id}`)),this.userProgress)){const e=this.userProgress.levels,t=this.userProgress["hp-avatar-assets"],s=this.userProgress["hp-challenges-completed"];this.rewardsDialog=this.$["rewards-dialog"],s?this.showFinishedModal():e&&Object.keys(e).length>0?this.showAvatarProgress():t&&Object.keys(t).length>0&&this.showRewardsProgress()}}showFinishedModal(){this.userProgress.challenges;this.$.rewards.type="finish",this._openRewardsDialog(),this.userProgress["hp-challenges-completed"]=!1,localStorage.setItem(`user-progress-${this.authenticatedUser.id}`,JSON.stringify(this.userProgress))}showAvatarProgress(e=null){const t=this.userProgress.levels;let s,a,r=this.$.rewards;r.type="avatar",e?(a=t[e],this.lastProgressKey=e):(s=Object.keys(t)[0],this.lastProgressKey=s,a=t[s]),r.max=a["next-threshold"],r.value=a.xp,r.complete=a.complete,r.level=a.level,this._openRewardsDialog();const o=Object.assign({},this.userProgress);o.levels=void 0,localStorage.setItem(`user-progress-${this.authenticatedUser.id}`,JSON.stringify(o))}_onAvatarContinue(){const e=this.lastProgressKey;this.removeProgress("levels",e);const t=this.userProgress.levels,s=Object.keys(t).indexOf(e)+1,a=Object.keys(t)[s];if(void 0!==a)this.showAvatarProgress(a);else{const e=this.userProgress["hp-avatar-assets"];Object.keys(e).length>0?this.showRewardsProgress():this._closeRewardsDialog()}}showRewardsProgress(e=null){if(this.config){const t=this.userProgress["hp-avatar-assets"];let s,a,r=this.$.rewards;r.type="reward",e?(a=t[e],this.lastProgressKey=e):(s=Object.keys(t)[0],this.lastProgressKey=s,a=t[s]),r.page="open",r.page="close",r.closeImage=`${this.config.root}assets/avatar/assets/trunk_closed.png`,r.openImage=`${this.config.root}assets/avatar/assets/trunk_open.png`,r.collectImage=`${this.config.root}assets/avatar/assets/${a}.png`,r.time=1500,this._openRewardsDialog();const o=Object.assign({},this.userProgress);o["hp-avatar-assets"]=void 0,localStorage.setItem(`user-progress-${this.authenticatedUser.id}`,JSON.stringify(o))}}_onRewardCollected(e){const t=this.lastProgressKey;this.removeProgress("hp-avatar-assets",t);const s=this.userProgress["hp-avatar-assets"];0===Object.keys(s).length&&this.dispatchEvent(new CustomEvent("show-reward-collected",{detail:e.detail,bubbles:!0,composed:!0}));const a=Object.keys(s).indexOf(t)+1,r=Object.keys(s)[a];void 0!==r?this.showRewardsProgress(r):this._closeRewardsDialog()}removeProgress(e,t){delete this.userProgress[e][t],localStorage.setItem(`user-progress-${this.authenticatedUser.id}`,JSON.stringify(this.userProgress))}_openRewardsDialog(){this.rewardsDialog.opened||this.rewardsDialog.open()}_closeRewardsDialog(){this.rewardsDialog.close()}_pathChanged(e){e.startsWith("/map/")&&this.checkUserProgress()}}window.customElements.define(y.is,y)});