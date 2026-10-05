define(["require","./chunk-fdc6718c.js","./chunk-654f977c.js","./chunk-e86f6c80.js","./chunk-be7f2d6a.js","./chunk-8b3412b4.js","./chunk-a86cbd6e.js","./chunk-d52b5dbe.js","./chunk-e1d3b61d.js","./chunk-6aae4cc8.js","./chunk-87c098bb.js","./chunk-7e191bbc.js","./chunk-bbbf26f6.js","./chunk-9ed3bf9d.js","./chunk-d323c1b3.js","./chunk-9d10fca3.js","./chunk-39b53efd.js","./chunk-20f407ed.js","./chunk-7658960f.js","./chunk-ede86d1c.js","./chunk-4d3465f9.js","./chunk-42d2b7ff.js","./chunk-e8d4628a.js","./chunk-f8a285e9.js","./chunk-86ecdd4d.js","./chunk-30c1c965.js","./chunk-0552f067.js","./chunk-92065960.js","./chunk-dce7f082.js","./chunk-8423fd0a.js","./chunk-93a2d04f.js","./chunk-2567a2a0.js","./chunk-52525535.js","./chunk-73cb4c23.js","./chunk-7f3f247c.js","./chunk-c7742851.js","./chunk-facfe867.js","./chunk-33d51465.js","./chunk-5472545b.js","./chunk-9968f662.js","./chunk-83c85edb.js","./chunk-90a58e12.js","./chunk-bf2c299c.js","./chunk-6da1ebd5.js","./chunk-e8284588.js","./chunk-30130fed.js","./chunk-dac62d81.js"],function(e,t,o,a,i,s,n,r,l,c,d,h,p,u,m,g,v,f,w,_,b,k,y,x,S,E,C,T,D,P,U,M,L,A,F,I,R,$,O,B,j,N,V,z,H,Y,G){"use strict";o.Polymer({is:"iron-location",_template:null,properties:{path:{type:String,notify:!0,value:function(){return window.decodeURIComponent(window.location.pathname)}},query:{type:String,notify:!0,value:function(){return window.location.search.slice(1)}},hash:{type:String,notify:!0,value:function(){return window.decodeURIComponent(window.location.hash.slice(1))}},dwellTime:{type:Number,value:2e3},urlSpaceRegex:{type:String,value:""},encodeSpaceAsPlusInQuery:{type:Boolean,value:!1},_urlSpaceRegExp:{computed:"_makeRegExp(urlSpaceRegex)"},_lastChangedAt:{type:Number},_initialized:{type:Boolean,value:!1}},hostAttributes:{hidden:!0},observers:["_updateUrl(path, query, hash)"],created:function(){this.__location=window.location},attached:function(){this.listen(window,"hashchange","_hashChanged"),this.listen(window,"location-changed","_urlChanged"),this.listen(window,"popstate","_urlChanged"),this.listen(document.body,"click","_globalOnClick"),this._lastChangedAt=window.performance.now()-(this.dwellTime-200),this._initialized=!0,this._urlChanged()},detached:function(){this.unlisten(window,"hashchange","_hashChanged"),this.unlisten(window,"location-changed","_urlChanged"),this.unlisten(window,"popstate","_urlChanged"),this.unlisten(document.body,"click","_globalOnClick"),this._initialized=!1},_hashChanged:function(){this.hash=window.decodeURIComponent(this.__location.hash.substring(1))},_urlChanged:function(){this._dontUpdateUrl=!0,this._hashChanged(),this.path=window.decodeURIComponent(this.__location.pathname),this.query=this.__location.search.substring(1),this._dontUpdateUrl=!1,this._updateUrl()},_getUrl:function(){var e=window.encodeURI(this.path).replace(/\#/g,"%23").replace(/\?/g,"%3F"),t="";this.query&&(t="?"+this.query.replace(/\#/g,"%23"),t=this.encodeSpaceAsPlusInQuery?t.replace(/\+/g,"%2B").replace(/ /g,"+").replace(/%20/g,"+"):t.replace(/\+/g,"%2B").replace(/ /g,"%20"));var o="";return this.hash&&(o="#"+window.encodeURI(this.hash)),e+t+o},_updateUrl:function(){if(!this._dontUpdateUrl&&this._initialized&&(this.path!==window.decodeURIComponent(this.__location.pathname)||this.query!==this.__location.search.substring(1)||this.hash!==window.decodeURIComponent(this.__location.hash.substring(1)))){var e=this._getUrl(),t=new URL(e,this.__location.protocol+"//"+this.__location.host).href,o=window.performance.now(),a=this._lastChangedAt+this.dwellTime>o;this._lastChangedAt=o,a?window.history.replaceState({},"",t):window.history.pushState({},"",t),this.fire("location-changed",{},{node:window})}},_globalOnClick:function(e){if(!e.defaultPrevented){var t=this._getSameOriginLinkHref(e);t&&(e.preventDefault(),t!==this.__location.href&&(window.history.pushState({},"",t),this.fire("location-changed",{},{node:window})))}},_getSameOriginLinkHref:function(e){if(0!==e.button)return null;if(e.metaKey||e.ctrlKey)return null;for(var t=o.dom(e).path,a=null,i=0;i<t.length;i++){var s=t[i];if("A"===s.tagName&&s.href){a=s;break}}if(!a)return null;if("_blank"===a.target)return null;if(("_top"===a.target||"_parent"===a.target)&&window.top!==window)return null;if(a.download)return null;var n,r,l,c=a.href;if(n=null!=document.baseURI?new URL(c,document.baseURI):new URL(c),r=this.__location.origin?this.__location.origin:this.__location.protocol+"//"+this.__location.host,n.origin)l=n.origin;else{var d=n.host,h=n.port,p=n.protocol;("https:"===p&&"443"===h||"http:"===p&&"80"===h)&&(d=n.hostname),l=p+"//"+d}if(l!==r)return null;var u=n.pathname+n.search+n.hash;return"/"!==u[0]&&(u="/"+u),u=u.replace(/^\/\/\//,"/"),this._urlSpaceRegExp&&!this._urlSpaceRegExp.test(u)?null:new URL(u,this.__location.href).href},_makeRegExp:function(e){return RegExp(e)}}),o.Polymer({is:"iron-query-params",_template:null,properties:{paramsString:{type:String,notify:!0,observer:"paramsStringChanged"},paramsObject:{type:Object,notify:!0},_dontReact:{type:Boolean,value:!1}},hostAttributes:{hidden:!0},observers:["paramsObjectChanged(paramsObject.*)"],paramsStringChanged:function(){this._dontReact=!0,this.paramsObject=this._decodeParams(this.paramsString),this._dontReact=!1},paramsObjectChanged:function(){this._dontReact||(this.paramsString=this._encodeParams(this.paramsObject).replace(/%3F/g,"?").replace(/%2F/g,"/").replace(/'/g,"%27"))},_encodeParams:function(e){var t=[];for(var o in e){var a=e[o];""===a?t.push(encodeURIComponent(o)):a&&t.push(encodeURIComponent(o)+"="+encodeURIComponent(a.toString()))}return t.join("&")},_decodeParams:function(e){for(var t={},o=(e=(e||"").replace(/\+/g,"%20")).split("&"),a=0;a<o.length;a++){var i=o[a].split("=");i[0]&&(t[decodeURIComponent(i[0])]=decodeURIComponent(i[1]||""))}return t}});class q extends(p.Store.StateReceiver(t.PolymerElement)){static get template(){return t.html`
            <style>
                :host {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    padding: 6px 0;
                    background: white;
                }
                .container {
                    flex: 1;
                    display: flex;
                    flex-direction: row;
                    width: 960px;
                    justify-content: space-between;
                }
                .items {
                    display: flex;
                    flex-direction: row;
                    position: relative;
                }
                iron-selector a.iron-selected {
                    background-color: #03426d;
                    color: white;
                }
                iron-selector #challenges.iron-selected {
                    background-color: #03426d;
                }
                iron-selector #demo.iron-selected {
                    background-color: #03426d;
                }
                iron-selector #creations.iron-selected {
                    background-color: #03426d;
                }
                iron-selector #profile.iron-selected {
                    background-color: #03426d;
                }
                iron-selector {
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    justify-content: center;
                }
                .masthead a {
                    border-radius: 40px;
                    padding: 5.5px 16px;
                    color: var(--color-grey);
                    background-color: white;
                    font-family: var(--font-body);
                    text-decoration: none;
                    font-size: 16px;
                    height: initial;
                    margin: 0 16px;
                    font-weight: bold;
                    transition: all linear 150ms;
                }
                .masthead a:not(.iron-selected):hover {
                    color: #414A51;
                }
                kwc-drop-down:not(#profile-drop-down) {
                    --kwc-drop-down: {
                        top: 48px;
                        width: 230px;
                    };
                }
                kwc-drop-down-item {
                    text-align: left;
                    color: var(--color-chateau);
                    margin: 0;

                    --kwc-drop-down-item-content {
                        display: flex;
                        flex-direction: row;
                        align-items: center;
                    }
                }
                .items button,
                .items a {
                    display: block;
                    align-self: center;
                    margin: 0px;
                    color: #9FA4A8;
                }
                button.icon,
                a.icon {
                    background: none;
                    border: none;
                    cursor: pointer;
                    border-radius: 50%;
                }
                button.icon iron-icon,
                a.icon iron-icon {
                    width: 16px;
                    height: 16px;
                    color: var(--color-grey);
                }
                button.icon.focus iron-icon,
                a.icon.focus iron-icon {
                    color: white;
                }
                button.icon.focus,
                a.icon.focus {
                    background: #9FA4A8;
                }
                button.icon {
                    outline: none;
                    padding: 0.57em 0.6em;
                }
                a.icon {
                    outline: none;
                    padding: 7px 8px;
                }
                button.icon,
                a.icon,
                .avatar,
                paper-spinner {
                    margin-left: 16px;
                }
                kwc-drop-down iron-icon {
                    width: 14px;
                    margin-right: 8px;
                }
                kwc-drop-down button {
                    border: 0px;
                    background: transparent;
                    width: 100%;
                    padding: 0px;
                }
                .avatar {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    background: #5C6674;
                }
                [hidden] {
                    display: none !important;
                }
                .wand-dropdown {
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                }
                .main-icon {
                    width: 48px;
                    height: 48px;
                }
                .main-icon > * {
                    width: 100%;
                    height: 100%;
                }
                .wand-dropdown span {
                    font-family: var(--font-body);
                    color: #414A51;
                    font-weight: bold;
                    padding-left: 14px;
                    font-size: 18px;
                }
                kwc-drop-down-item.info:hover {
                    background-color: white;
                    cursor: initial;
                }
                kwc-drop-down-item.head {
                    padding: 0;
                }
                kwc-drop-down-item.not-interactive:hover {
                    background-color: white;
                    cursor: initial;
                }
                kwc-drop-down-item:hover {
                    --kwc-drop-down-item-icon-hover-color: var(--color-kano-orange);
                }
                kwc-drop-down-item.not-interactive:hover {
                    --kwc-drop-down-item-icon-hover-color: var(--color-grey);
                }
                #profile-drop-down .content {
                    height: 100px;
                    padding: 0 22px 0 9px;
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    white-space: nowrap;
                }
                #profile-drop-down iron-image {
                    width: 85px;
                    height: 85px;
                }
                #profile-drop-down .text-content {
                    text-align: left;
                    font-family: var(--font-body);
                    margin-left: 5px;
                }
                #profile-drop-down .text-content p {
                    margin: 0;
                }
                #profile-drop-down .text-content p.title {
                    color: #5B6674;
                    font-weight: bold;
                    font-size: 18px;
                }
                #profile-drop-down .text-content p.subtitle {
                    color: #9FA4A8;
                    font-size: 14px;
                    margin-top: 1px;
                }
                .profile {
                    height: 40px;
                }
                @media only screen and (max-width : 992px) {
                    .container {
                        width: 87%;
                    }
                }
            </style>
            <div class="container">
                <div class="items">
                    <div class="wand-dropdown">
                        <div class="main-icon" id="icon" style$="width: [[iconSize]]px;"></div>
                        <span>[[heading]]</span>
                    </div>
                </div>
                <iron-selector class="masthead" selectable="a" selected="[[view]]" attr-for-selected="id" hidden$="[[_isHeaderHidden(header.length)]]">
                    <dom-repeat items="[[header]]">
                        <template>
                            <a href\$="[[item.linkTo]]" id\$="[[item.id]]">
                                [[item.label]]
                            </a>
                        </template>
                    </dom-repeat>
                </iron-selector>
                <div class="items" hidden$="[[_isSettingsHidden(authDisabled, profileDisabled)]]">
                    <button on-tap="_openSettings" id="settings-button" class$="icon [[_computeSettingsButtonClass(opened)]]">
                        <iron-icon icon="ka-icons:settings"></iron-icon>
                    </button>
                    <a href="/profile" class="profile" hidden$="[[_isUserAvatarHidden(user, authDisabled)]]">
                        <paper-spinner active hidden$="[[!uploadingAvatar]]"></paper-spinner>
                        <iron-image class="avatar" src$="[[user.avatar]]" sizing="cover" hidden$="[[uploadingAvatar]]"></iron-image>
                    </a>
                    <kwc-drop-down id="settings-drop-down"
                                   caret-position="center"
                                   align="right"
                                   opened="{{opened}}">
                        <a href="/auth/login" on-tap="closeDropDown" hidden$="[[hasUser(user)]]">
                            <kwc-drop-down-item icon="ka-icons:help">Login</kwc-drop-down-item>
                        </a>
                        <button id="update-button" on-tap="update" hidden$="[[!userDismissed]]">
                            <kwc-drop-down-item icon="ka-icons:logout">Update now</kwc-drop-down-item>
                        </button>
                        <button on-tap="logout" hidden$="[[!hasUser(user)]]">
                            <kwc-drop-down-item icon="ka-icons:logout">Logout</kwc-drop-down-item>
                        </button>
                    </kwc-drop-down>
                    <kwc-drop-down
                        id="profile-drop-down"
                        caret-position="center"
                        align="center">
                        <div class="content">
                            <iron-image src$="[[rewardCollected]]" sizing="contain"></iron-image>
                            <div class="text-content">
                                <p class="title">Added to avatar</p>
                                <p class="subtitle">Select <b>Profile</b> to edit your avatar</p>
                            </div>
                        </div>
                    </kwc-drop-down>
                </div>
            </div>
        `}static get is(){return"ka-navbar"}static get properties(){return{demos:{linkState:"demos.list"},creationsDisabled:{linkState:"creations.disabled"},profileDisabled:{linkState:"profile.disabled"},authDisabled:{linkState:"auth.disabled"},view:{type:String,linkState:"routing.view"},user:{type:String,linkState:u.userProp(u.USER_TYPES.AUTHENTICATED,"profile")},userDismissed:{linkState:"updater.userDismissed",value:null},mapPath:{type:String,linkState:"currentMap"},header:{computed:"_updateHeader(mapPath, demos.length, creationsDisabled, profileDisabled)"},uploadingAvatar:{linkState:"users.authenticated.uploadingAvatar"},heading:String,iconSize:Number}}connectedCallback(){super.connectedCallback(),window.addEventListener("show-reward-collected",this.showRewardCollected.bind(this))}_isUserAvatarHidden(e,t){return t||!e}_isSettingsHidden(e,t){return e||t}_isHeaderHidden(e){return e<=1}addSettingsEntry(e,t){t>50?this.$["settings-drop-down"].appendChild(e):this.$["settings-drop-down"].insertBefore(e,this.$["update-button"])}setIconTemplate(e){this._clearIcon();const t=e.cloneNode(!0);this.$.icon.appendChild(t.content)}_clearIcon(){for(;this.$.icon.lastChild;)this.$.icon.removeChild(this.$.icon.lastChild)}_openSettings(e){if(this.$["settings-drop-down"].opened)return;const t=this.$["settings-button"];q.positionDropDown(this.$["settings-drop-down"],t),this.$["settings-drop-down"].open(),e.stopPropagation(),e.preventDefault()}closeDropDown(){this.$["settings-drop-down"].close()}_updateHeader(){const e=[];return e.push({label:"Challenges",linkTo:`/map/${this.mapPath}`,id:"challenges"}),this.demos.length&&e.push({label:"Play",linkTo:"/demo",id:"demo"}),this.creationsDisabled||e.push({label:"Kano World",linkTo:"/creations",id:"creations"}),this.profileDisabled||e.push({label:"Profile",linkTo:"/profile",id:"profile"}),e}static positionDropDown(e,t){let o;const a=t.getBoundingClientRect(),i=getComputedStyle(e).getPropertyValue("--kwc-drop-down_-_width");if(""===i)o=a.right;else{const e=parseFloat(i);o=a.right+e/2-a.width/2}e.style.position="fixed",e.style.left=`${o}px`,e.style.top=`${a.top+a.height}px`}hasUser(e){return!!e}logout(){this.dispatchEvent(new CustomEvent("logout",{bubbles:!0,composed:!0})),this.closeDropDown()}update(){this.dispatchEvent(new CustomEvent("update",{bubbles:!0,composed:!0})),this.closeDropDown()}_computeSettingsButtonClass(e){return e?"focus":""}showRewardCollected(e){this.rewardCollected=e.detail;const t=this.shadowRoot.querySelector("#profile"),o=this.$["profile-drop-down"],a=t.getBoundingClientRect();o.style.position="fixed",o.style.top="80px",o.style.left=`calc(${a.left}px + ${a.width/2}px - 148px)`,o.open()}}window.customElements.define(q.is,q);class Z extends(p.Store.StateReceiver(t.PolymerElement)){static get template(){return t.html`
            <style>
                :host {
                    display: flex;
                    flex-direction: column;
                }
                ka-navbar[hidden] {
                    display: none;
                }
                ka-navbar {
                    /* ShadyCSS fix*/
                    flex: initial;
                }
                ::slotted(*) {
                    flex: 1;
                    overflow: hidden;
                    -webkit-overflow-scrolling: touch;
                }
            </style>

            <ka-navbar hidden$="[[navbarHidden]]"></ka-navbar>
            <slot></slot>
        `}static get is(){return"ka-page"}static get properties(){return{navbarHidden:{type:Boolean,linkState:"navbarHidden"}}}}window.customElements.define(Z.is,Z);const X=c.SharesActionsFactory(c.FEED_TYPES.USER),W=u.UserActionsFactory(u.USER_TYPES.SELECTED),K=u.UserActionsFactory(u.USER_TYPES.AUTHENTICATED);window.customElements.define("ka-view-user",class extends(p.Store.StateReceiver(t.PolymerElement)){static get template(){return t.html`
            ${c.fullscreenNav}
            <style>
                :host {
                    display: flex;
                    flex-direction: column;
                    font-family: var(--font-body);
                }
                ka-profile {
                    flex: 1;
                }
                div[slot="avatar"] {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    padding: 0 40px 44px;
                    height: 100%;
                    box-sizing: border-box;
                    pointer-events: none;
                }
                div[slot="avatar"] iron-image {
                    width: 100%;
                    height: 100%;
                }
                div[slot="avatar"]::before {
                    content: '';
                    background-color: rgba(0,0,0,0.2);
                    width: 100%;
                    height: calc(40px + 15%);
                    position: absolute;
                    bottom: 0px;
                    left: 0;
                }
                .nav {
                    background: #5a6675;
                }
            </style>
            <div class="nav">
                <button on-click="_back">
                    <div class="icon back">
                        <iron-icon icon="kwc-ui-icons:arrow"></iron-icon>
                    </div>
                    <span>Back</span>
                </button>
                <button on-click="_exit">
                    <span>Close</span>
                    <div class="icon close">
                        <iron-icon icon="kwc-ui-icons:close"></iron-icon>
                    </div>
                </button>
            </div>
            <ka-profile user="[[user]]"
                        auth-user="[[authUser]]"
                        auth-user-following="[[authFollowing]]"
                        progress="[[progress]]"
                        badges="[[badges]]"
                        subnav="[[subnav]]"
                        follows-page="[[followsPage]]"
                        follows="[[follows]]"
                        header-background=""
                        link-prefix="[[linkPrefix]]/[[user.username]]"
                        loading="[[loading]]"
                        loading-level="[[loadingLevel]]"
                        follow-disabled="[[processingFollowing]]"
                        on-follow-click="_onFollowClicked"
                        on-unfollow-click="_onUnfollowClicked"
                        on-user-click="_userClicked">
                <div slot="avatar">
                    <iron-image sizing="contain" preload fade src="[[_fullAvatar(user.avatar)]]"></iron-image>
                </div>
                <ka-creations-feed slot="creations"
                                   shares="[[shares]]"
                                   loading="[[sharesLoading]]"
                                   page-count="[[sharesPageCount]]"
                                   page="[[sharesPage]]"
                                   on-page-changed="_feedPageChanged"
                                   on-like-click="_likeClicked"
                                   on-user-click="_userClicked"
                                   on-comment-click="_commentClicked"
                                   on-creation-click="_onCreationClick"
                                   user="[[authUser]]"
                                   liked="[[liked]]"
                                   ></ka-creations-feed>
                <ka-profile-about slot="about"
                                  user="[[user]]"
                                  root="[[config.root]]"
                                  on-bio-changed="_bioChanged"></ka-profile-about>
            </ka-profile>
        `}static get properties(){return{username:{linkState:"routing.pathParams.username",observer:"_updateUser"},subnav:{linkState:"routing.pathParams.subnav",observer:"_updateShares"},followsPage:{linkState:"routing.pathParams.follows"},user:{linkState:u.userProp(u.USER_TYPES.SELECTED,"profile"),observer:"_getSelectedUserShareInfo"},loading:{linkState:u.userProp(u.USER_TYPES.SELECTED,"loading")},progress:{linkState:u.userProp(u.USER_TYPES.SELECTED,"progress")},badges:{linkState:u.userProp(u.USER_TYPES.SELECTED,"badges")},follows:{linkState:u.userProp(u.USER_TYPES.SELECTED,"follows")},loadingLevel:{linkState:u.userProp(u.USER_TYPES.SELECTED,"loadingLevel")},authUser:{linkState:u.userProp(u.USER_TYPES.AUTHENTICATED,"profile")},authFollowing:{linkState:u.userProp(u.USER_TYPES.AUTHENTICATED,"follows.following")},processingFollowing:{linkState:u.userProp(u.USER_TYPES.AUTHENTICATED,"processingFollowing")},liked:{linkState:u.userProp(u.USER_TYPES.AUTHENTICATED,"likes")},shares:{linkState:c.feedProp(c.FEED_TYPES.USER,"shares")},sharesLoading:{linkState:c.feedProp(c.FEED_TYPES.USER,"loading")},sharesPageSize:{linkState:c.feedProp(c.FEED_TYPES.USER,"pageSize")},sharesPageCount:{linkState:c.feedProp(c.FEED_TYPES.USER,"pageCount")},sharesPage:{linkState:c.feedProp(c.FEED_TYPES.USER,"page"),observer:"_sharesPageChanged"},config:{linkState:"config"},headerBackground:String,linkPrefix:String,exitLink:String}}get userModel(){if(!this._userModel){const{config:e}=this.getState();this._userModel=g.UserFactory(e.API_URL)}return this._userModel}get progressModel(){if(!this._progressModel){const{config:e}=this.getState();this._progressModel=v.ProgressFactory(e.API_URL)}return this._progressModel}get sharesModel(){if(!this._sharesModel){const{config:e}=this.getState();this._sharesModel=f.SharesFactory(e.API_URL)}return this._sharesModel}_fullAvatar(e){return e?e.replace("head.png","full.png"):""}connectedCallback(){super.connectedCallback();const{config:e}=this.getState();this.headerBackground=`${e.root}assets/armature/avatar_background.svg`,W.setFollows({}),W.setUser({}),W.setBadges([]),X.set([]),W.setLoading(!0),W.setLoadingLevel(!0);const t=[];this.getLikes(),this.authFollowing||t.push(this.fetchAuthFollows()),t.push(this.fetchUser()),Promise.all(t).then(()=>Promise.all([this.getFollows(),this.getShares(),this.getLevel(),this.getBadges()])).then(()=>{W.setLoading(!1)})}_getSelectedUserShareInfo(){Promise.all([this.getFollows(),this.getShares(),this.getLevel(),this.getBadges()])}_updateUser(){this.fetchUser(this.username)}_updateShares(){"creations"!==this.subnav&&this.subnav||this.getShares()}fetchUser(e){return W.setLoading(!0),this.userModel.getUser(e||this.username).then(e=>{W.setUser(e),W.setLoading(!1)}).catch(e=>{throw W.setLoading(!1),e})}fetchAuthFollows(){return this.userModel.getFollows(this.authUser.id).then(e=>{K.setFollows(e)})}getBadges(){W.setLoadingBadges(!0),this.progressModel.getBadges(this.user.id).then(e=>{W.setBadges(e),W.setLoadingBadges(!1)}).catch(e=>{throw W.setLoadingBadges(!1),e})}getShares(){this.user&&this.user.id&&(X.setLoading(!0),this.sharesModel.getFromUser(this.user.id).then(e=>{this.feed=e,X.setPageCount(this.feed.getPagesCount(this.sharesPageSize)),X.setPage(null),X.setPage(1)}))}_feedPageChanged(e){const t=e.detail.value;X.setPage(t)}_sharesPageChanged(){this.sharesPage&&this.feed&&(0===this.sharesPageCount?(X.set([]),X.setLoading(!1),this.scroll(0,0)):this.sharesPage<=this.sharesPageCount&&(X.setLoading(!0),this.feed.getPage(this.sharesPage,this.sharesPageSize).then(e=>{X.set(e),X.setLoading(!1),this.scroll(0,0)})))}getFollows(){return this.userModel.getFollows(this.user.id).then(e=>{W.setFollows(e)})}getLevel(){W.setLoadingLevel(!0),this.progressModel.getUserLevelAndXP(this.user.id).then(e=>{W.setLoadingLevel(!1),W.setUserProgress(e)})}_back(){const{routingHistory:e}=this.getState();e[e.length-2]?w.historyBack():this._exit()}_exit(){w.navigateTo(this.exitLink)}getLikes(){return this.userModel.getLikes(this.authUser.id).then(e=>{K.setLikes(e)})}_likeClicked(e){const t=e.detail.id;e.detail.liked?this.sharesModel.deleteLike(t).then(()=>{this.getLikes(),X.updateLikeCount(t,-1)}):this.sharesModel.recordLike(t).then(()=>{this.getLikes(),X.updateLikeCount(t,1)})}_userClicked(e){const t=e.detail;t===this.authUser.username?w.navigateTo("/profile"):w.navigateTo(`${this.linkPrefix}/${t}`)}_onFollowClicked(e){const t=e.detail;K.setProcessingFollowing(!0),this.userModel.follow(t.id).then(()=>{K.follow(t),K.setProcessingFollowing(!1)}).catch(e=>{throw K.setProcessingFollowing(!1),e})}_onUnfollowClicked(e){const t=e.detail;t.id!==this.authUser.id&&(K.setProcessingFollowing(!0),this.userModel.unfollow(t.id).then(()=>{K.unfollow(t),K.setProcessingFollowing(!1)}).catch(e=>{throw K.setProcessingFollowing(!1),e}))}_onCreationClick(e){const t=e.detail;w.navigateTo(`${this.linkPrefix}/${this.user.username}/creations/${t}`)}}),o.Polymer({_template:t.html`
    <style>
        /** Button default */
        :host{
            height: 48px;
            min-width: 150px;
            display: inline-block;
        }
        button {
            height: 100%;
            width: 100%;
            line-height: 48px;
            outline: none;
            overflow: hidden;
            padding: 0 22px;
            white-space: nowrap;
            cursor: pointer;
            display: inline-block;

            background-color: var(--kwc-mega-button-bg-color, rgba(255, 255, 255, 1));
            color: var(--kwc-mega-button-color, var(--color-abbey));

            border-color: var(--kwc-mega-button-border, var(--color-stone));
            border-style: solid;
            border-width: 1px;
            border-radius: 5px;

            font-size: 16px;
            font-family: var(--kwc-mega-button-font, var(--font-body));
            font-weight: bold;

            text-align: center;
            text-transform: uppercase;

        }
        iron-icon, button {
            transition-property: background-color, border-color, color;
            transition-duration: 0.3s;
            transition-timing-function: ease;
        }
        button iron-icon {
            display: inline-block;
            vertical-align: middle;
            margin-right: 5px;
            bottom: 2px;
            color: var(--kwc-mega-button-icon, var(--color-kano-orange));
        }

        :host(:hover) button,
        :host(:focus) button {
            color: var(--kwc-mega-button-color-hover, white);
            background-color: var(--kwc-mega-button-bg-hover, var(--color-kano-orange));
        }
        :host(:hover) button iron-icon,
        :host(:focus) button iron-icon {
            color: var(--kwc-mega-button-icon-hover, white);
        }

        /** Disabled button */
        :host([disabled]) button,
        :host([disabled]) button iron-icon,
        :host([disabled]:hover) button,
        :host([disabled]:focus) button {
            background-color: var(--kwc-mega-button-disabled-bg-color, var(--color-grey));
            cursor: default;
            color: var(--kwc-mega-button-disabled-color, var(--color-chateau));
            border-color: var(--kwc-mega-button-disabled-border, var(--color-stone));
        }
    </style>
    <button disabled\$="[[disabled]]">
        <template is="dom-if" if="[[_displayIcon]]">
            <iron-icon icon="[[iconId]]"></iron-icon>
        </template>
        <slot id="content"></slot>
    </button>
`,is:"kwc-mega-button",properties:{disabled:{type:Boolean,value:!1,reflectToAttribute:!0},_displayIcon:{type:Boolean,computed:"_iconProvided(iconId)"},iconId:{type:String}},_iconProvided:e=>null!=e});const Q={"make-music":"music","make-light":"art","kano-draw":"art","make-apps":"app",lightboard:"app"},J={};customElements.define("kwc-share-player",class extends t.PolymerElement{static get template(){return t.html`
        <style>
            :host {
                display: block;
                width: 100%;
                background: var(--kwc-share-player-background, --color-chateau);
                max-height: var(--kwc-share-player-height, 480px);
                height: var(--kwc-share-player-height, 480px);
                box-sizing: border-box;
                position: relative;
            }
            kwc-app-player,
            kwc-art-player {
                animation: fade-in 200ms linear;
            }
        </style>
        <template is="dom-if" if="[[_usePlayer('app', _player)]]" restamp>
            <kwc-app-player share="[[share]]" display-code="[[displayCode]]" on-hide-code="_hideCode">
                <slot slot="hardware" name="hardware-list"></slot>
            </kwc-app-player>
        </template>
        <template is="dom-if" if="[[_usePlayer('art', _player)]]" restamp>
            <kwc-art-player share="[[share]]" display-code="[[displayCode]]"></kwc-art-player>
        </template>
        <template is="dom-if" if="[[_usePlayer('music', _player)]]" restamp>
            <kwc-music-player share="[[share]]"></kwc-music-player>
        </template>
        <template is="dom-if" if="[[_usePlayer('default', _player)]]" restamp>
            <kwc-player share="[[share]]"></kwc-player>
        </template>
    `}static get properties(){return{displayCode:{type:Boolean,value:!1,notify:!0},share:{type:Object,value:()=>({})},_player:{type:String,value:""}}}static get observers(){return["_shareChanged(share.*)"]}_shareChanged(e){const t=e.base;let o;t&&Object.keys(t).length&&(o=Q[t.app]||"default",J[o]?this.set("_player",o):this.lazyImport(o).then(()=>{J[o]=!0,this.set("_player",o)}))}lazyImport(t){switch(t){case"app":return new Promise(function(t,o){e(["./kwc-app-player.js"],t,o)});case"art":return new Promise(function(t,o){e(["./kwc-art-player.js"],t,o)});case"music":return new Promise(function(t,o){e(["./kwc-music-player.js"],t,o)});default:return new Promise(function(t,o){e(["./kwc-player.js"],t,o)})}}_usePlayer(e,t){return e===t}_hideCode(e){this.displayCode=!1,this.dispatchEvent(new CustomEvent("hide-code",{detail:e.detail}))}}),o.Polymer({_template:t.html`
        <style>
            :host {
                @apply --layout-vertical;
                @apply --layout-center;
                @apply --layout-justified;
                width: 100%;
            }
            :host([tombstone]) * {
                visibility: hidden;
            }
            :host([hidden]) {
                display: none !important;
            }
            .input-comment {
                @apply --layout-horizontal;
                border-bottom: 1px solid #F6F7F9;
                padding: 24px 0;
                margin: 0;
                width: 100%;
            }
            .comment-avatar {
                border-radius: 50%;
                flex: none;
                height: 40px;
                margin: 0 24px;
                overflow: hidden;
                position: relative;
                width: 40px;
            }
            .avatar {
                height: 40px;
                width: 40px;
                cursor: pointer;
            }
            .comment .avatar {
                cursor: pointer;
            }
            iron-image {
                height: 32px;
                width: 32px;
                border-radius: 50%;
            }
            .comment-form {
                @apply --layout-flex-2;
            }
            .comment-box {
                border: 1px solid #F6F7F9;
                border-radius: 3px;
                box-sizing: border-box;
                font-family: var(--font-body);
                font-size: 16px;
                line-height: 20px;
                padding: 8px 16px 8px 16px;
                width: 100%;
            }
            .comment-box:focus {
                border-color: var(--color-azure);
                outline: 0;
            }
            .comment-form-actions {
                padding: 16px 0 0 0;
            }
            .comment {
                @apply --layout-horizontal;
                @apply --layout-start;
                border-bottom: 1px solid #F6F7F9;
                padding: 24px 0;
                width: 100%;
            }
            .comment.posting {
                opacity: 0.6;
            }
            .content {
                @apply --layout-flex-2;
                font-size: 16px;
                font-family: var(--font-body);
                color: var(--color-abbey);
                max-width: 450px;
            }
            .comment-header {
                margin: 0;
            }
            .content p {
                margin: 0;
                width: 100%;
            }
            .content .date {
                font-size: 14px;
                font-family: var(--font-body);
                color: var(--color-grey);
            }
            p {
                font-family: var(--font-body);
                color: var(--color-chateau);
                font-size: 16px;
                line-height: 20px;
                word-wrap: break-word;
            }
            .comment-body {
                color: var(--color-black);
                min-height: 20px;
            }
            .comment-error {
                color: var(--color-cinnabar);
                padding-top: 8px;
            }
            .comment:hover .action.delete,
            .comment:hover .action.flag {
                visibility: visible;
            }
            .author {
                color: var(--color-kano-orange);
                cursor: pointer;
                font-weight: bold;
                margin-right: 5px;
            }
            .actions {
                @apply --layout-end;
                @apply --layout-vertical;
                flex: none;
                width: calc(15% - 40px);
            }
            .control-actions {
                @apply --layout-horizontal;
                @apply --layout-center;
                @apply --layout-end-justified;
            }
            .action:focus {
                outline: 0;
            }
            .action.delete,
            .action.flag {
                -webkit-appearance: none;
                background: transparent;
                border: 0;
                border-radius: 3px;
                color: var(--color-stone);
                cursor: pointer;
            }
            .action.delete:hover,
            .action.flag:hover {
                color: var(--color-carnation);
            }
            .action.flag.flagged {
                color: var(--color-carnation);
                visibility: visible;
            }
            .action .icon {
                height: 16px;
                width: 16px;
            }
            #retry {
                margin-top: 10px;
                line-height: 15px;
                height:25px;
            }
            iron-list {
                width: 100%;
                height: 100%
            }
            .loader {
                margin-top: 20px;
            }
            .loader[hidden] {
                display: block;
            }
            :host([loader-status="off"]) #loader {
                display: none;
            }
            :host([loader-status="disabled"]) #loader {
                background-color: var(--color-porcelain);
                color: rgba(41, 47, 53, 1);
            }
            :host([retry-button="hide"]) #retry {
                display: none;
            }
            .submit-button,
            .cancel-button {
                border: none;
                border-radius: 16px;
                height: 32px;
                padding: 0 15px;
                font-family: var(--font-body);
                font-size: 16px;
                font-weight: bold;
                transition: all 0.15s ease;
            }
            .submit-button {
                background: #F6F7F9;
            }
            .submit-button:not([disabled]) {
                color: #3F4A52;
            }
            .cancel-button {
                background: transparent;
                color: #9EA4A8;
            }
            .submit-button:focus,
            .cancel-button:focus {
                outline: none;
            }
            .submit-button:not([disabled]):hover,
            .cancel-button:hover {
                cursor: pointer;
                color: #090A0A;
            }
            .submit-button:not([disabled]):hover {
                background-color: #E5E8EC;
            }
            @media all and (max-width: 360px) {
                .comment-form-actions {
                    @apply --layout-vertical;
                    @apply --layout-start;
                    @apply --layout-start-justified;
                }
                .comment-form-actions kwc-button ~ kwc-button {
                    margin: 8px 0 0 0;
                }
            }
            @media all and (min-width: 361px) {
                .comment-form-actions {
                    @apply --layout-horizontal;
                    @apply --layout-center;
                    @apply --layout-start-justified;
                }
                .comment-form-actions kwc-button ~ kwc-button {
                    margin: 0 0 0 8px;
                }
            }
            :host *[hidden] {
                display: none;
            }
        </style>

        <div class="input-comment">
            <div class="comment-avatar">
                <iron-image class="avatar" src\$="[[_avatar]]" sizing="cover" preload="" fade=""></iron-image>
            </div>
            <form class="comment-form" on-submit="_submitComment">
                <input id="comment-input" class="comment-box" type="text" placeholder\$="[[_placeholderText]]" value="{{_comment::input}}" disabled\$="[[posting]]" on-focus="_toggleFormControls" on-keydown="_dialogKeydown">
                <!-- <div class="comment-form-actions" hidden\$="[[!_displayFormActions]]"> -->
                <div class="comment-form-actions">
                    <button class="submit-button" type="submit" on-tap="_submitComment" disabled="[[!_commentValid]]">
                        Submit
                    </button>
                    <button class="cancel-button" on-tap="_cancelComment">
                        Cancel
                    </button>
                </div>
            </form>
        </div>
        <template is="dom-repeat" items="[[comments]]" as="comment">
            <div id\$="[[comment.id]]" class\$="comment [[_computePostingClass(comment)]]">
                <div class="comment-avatar">
                    <iron-image class="avatar" src\$="[[_computeAvatar(comment.author)]]" sizing="cover" preload="" fade="" on-tap="_userTapped"></iron-image>
                </div>
                <div class="content">
                    <p class="comment-header">
                        <span class="author" on-tap="_userTapped">
                            {{comment.author.username}}
                        </span>
                        <span class="date">
                            [[_timeSince(comment.date_created, comments.*)]] ago
                        </span>
                    </p>
                    <p class="comment-body">
                        <span inner-h-t-m-l="[[_lb(comment.text)]]"></span>
                    </p>
                    <p class="comment-error" hidden\$="[[!comment.error]]">
                        [[comment.error]]
                    </p>
                </div>
                <div class="actions">
                    <div class="control-actions">
                        <template is="dom-if" if="[[_commentIsDeletable(comment.author.id, user.id, user.admin_level)]]">
                            <button type="button" class="action delete" on-tap="_deleteButtonTapped">
                                <iron-icon class="icon" icon="kwc-ui-icons:rubbish-bin"></iron-icon>
                            </button>
                        </template>
                        <button type="button" class\$="[[_computeFlagClass(comment.*)]]" on-tap="_flagButtonTapped">
                            <iron-icon class="icon" icon="kwc-social-icons:flag"></iron-icon>
                        </button>
                    </div>
                    <kwc-button id="retry" on-tap="_retryButtonTapped" hidden\$="[[!comment.error]]" type="warning" transparent="">
                        retry
                    </kwc-button>
                </div>
            </div>
        </template>
        <kwc-button class="loader" id="loader" type="secondary" on-tap="_loadMoreData">
            Load more
        </kwc-button>
    `,is:"kwc-social-comments",properties:{_avatar:{type:String,computed:"_computeAvatar(user)"},_comment:{type:String,value:""},_commentValid:{type:Boolean,computed:"_commentIsValid(_comment)"},comments:{type:Array,value:()=>[],notify:!0},commentFlags:{type:Array,value:()=>[],notify:!0},defaultAvatar:{type:String,value:"https://s3.amazonaws.com/kano-avatars/default-avatar.svg"},_displayFormActions:{type:Boolean,value:!1},itemId:{type:String},nextPage:{type:Number,value:0,observer:"_onDataLoad"},_placeholderText:{type:String,computed:"_computePlaceholderText(comments)"},posting:{type:Boolean,value:!1},loaderStatus:{type:String,value:"off",reflectToAttribute:!0},retryButton:{type:String,reflectToAttribute:!0},user:{type:Object,value:()=>({})}},_dialogKeydown(e){8===e.keyCode&&e.stopPropagation()},_cancelComment(){this._comment="",this._displayFormActions=!1},_toggleFormControls(){this._displayFormActions=!0},_commentIsValid(){return!(!this._comment||/^ *$/.test(this._comment))},_computeAvatar(e){return e&&e.avatar||this.defaultAvatar},_onDataLoad(){this.$.loader.disabled=!1},_loadMoreData(){this.itemId&&!this.$.loader.disabled&&(this.$.loader.disabled=!0,this.dispatchEvent(new CustomEvent("load-comment",{detail:{id:this.itemId}})))},_createDate:e=>new Date(e),_commentIsDeletable:(e,t,o)=>e===t||o>0,_computeFlag(e){return!(!e||!this.user)&&e.some(e=>e.author===this.user.id)},_computeCommentFlag(e){return 0!==this.commentFlags.length&&this.commentFlags.some(t=>t===e.id)},_computeFlagClass(e){let t;return`action flag ${t=e.base.flags?this._computeFlag(e.base.flags)?"flagged":"unflagged":this._computeCommentFlag(e.base)?"flagged":"unflagged"}`},_computePlaceholderText:e=>e&&e.length?"Leave a comment":"Be the first to comment",_computePostingClass:e=>`${e.posting?"posting":""}${e.error?"error":""}`,_computeErrorClass:e=>e?"error":"",_computeErrorState:e=>!!e||"",_deleteButtonTapped(e){const t=e.model.comment.id;t&&this.dispatchEvent(new CustomEvent("delete-comment",{detail:{index:e.model.index,id:t}}))},_isHintHidden:()=>!0,_lb(e){const t=document.createElement("div");return t.textContent=e,t.innerHTML.replace(/\n/g,"<br>")},_flagButtonTapped(e){const t=e.model.index,o=this.comments[t].id;let a;if(this.comments[t].flags){if(a=this._computeFlag(this.comments[t].flags))return}else a=this._computeCommentFlag(this.comments[t]);if(a)return e.path[1].setAttribute("class","action flag unflagged"),void this.dispatchEvent(new CustomEvent("unflag-comment",{detail:{index:t,id:o}}));e.path[1].setAttribute("class","action flag flagged"),this.dispatchEvent(new CustomEvent("flag-comment",{detail:{index:t,id:o}}))},_retryButtonTapped(){this.set("retryButton","hide"),this.dispatchEvent(new CustomEvent("post-comment",{detail:{value:this.comments[0].text,retry:!0}}))},_submitComment(e){e.preventDefault();const t=this.$["comment-input"];this._commentValid&&(this.retryButton=null,this._displayFormActions=!1,t&&t.blur(),this.dispatchEvent(new CustomEvent("post-comment",{detail:{value:this._comment}})),this._comment="")},_timeSince(e){const t=new Date(Date.parse(e)),o=Math.floor((new Date-t)/1e3);let a=Math.floor(o/31536e3);return a>=1?this.multipleCheck(a,"year"):(a=Math.floor(o/2592e3))>=1?this.multipleCheck(a,"month"):(a=Math.floor(o/86400))>=1?this.multipleCheck(a,"day"):(a=Math.floor(o/3600))>=1?this.multipleCheck(a,"hour"):(a=Math.floor(o/60))>=1?this.multipleCheck(a,"minute"):Math.floor(o)+" seconds"},multipleCheck(e,t){const o=`${e} ${t}`;return 1===e?o:`${o}s`},_userTapped(e){const t=e.model.index,o=this.comments[t].author;o&&this.dispatchEvent(new CustomEvent("view-user",{detail:{id:o.id,username:o.username}}))}}),o.Polymer({_template:t.html`
        <style>
            @keyframes fade-in {
                from {
                    opacity: 0;
                }
                to {
                    opacity: 1;
                }
            }
            :host {
                background-color: white;
                border-radius: 0 0 3px 3px;
                display: block;
                overflow: auto;
                font-family: var(--font-body);
                @apply --kw-share-detail;
            }
            :host * {
                box-sizing: border-box;
            }
            :host *[hidden] {
                display: none !important;
            }
            .share {
                @apply --layout-vertical;
                @apply --layout-center;
                display: flex;
                width: 100%;
            }
            .content-prefix {
                background: var(--kw-share-detail-share-background, var(--color-chateau));
                width: 100%;
            }
            .share-content {
                background: var(--kw-share-detail-share-background, var(--color-chateau));
                width: 100%;
                box-sizing: border-box;
                position: relative;
            }
            .share-content .loading {
                color: white;
                transition: opacity 200ms linear;
            }
            :host(.loaded) .share-content .loading {
                opacity: 0;
            }
            #share-container {
                display: flex;
                flex-direction: column;
                justify-content: center;
                animation: fade-in 200ms linear;
                z-index: 10;
            }
            .share-content .content {
                min-height: var(--kw-share-detail-player-height, 480px);
                height: var(--kw-share-detail-player-height, 480px);
                position: relative;
            }
            #share-container,
            .share-content .loading,
            .share-content .content .featured,
            .share-content .loading .overlay {
                @apply --layout-fit;
            }
            .share-content .loading .overlay {
                @apply --layout-vertical;
                @apply --layout-center;
                @apply --layout-center-justified;
            }
            .share-content .content,
            kwc-share-player {
                background-color: transparent;
                height: 100%;
                margin: 0 auto;
                max-width: 800px;
                width: 100%;
            }
            .share-content .content .featured {
                padding: 0 8px;
                z-index: 20;
            }
            .featured {
                background-color: transparent;
                margin: 0;
            }
            kwc-share-player {
                --kwc-share-player-height: 480px;
                position: relative;
            }
            @media all and (max-width: 680px) {
                .share-content .content .featured,
                #share-container>* {
                    max-height: calc(100% - 60px);
                    padding: 0 20px;
                }
            }
            @media all and (min-width: 681px) {
                .share-content .content .featured,
                #share-container>* {
                    max-height: calc(100% - 50px);
                }
            }
            .share-detail {
                max-width: var(--content-width);
                position: relative;
                width: 100%;
                z-index: 0;
            }
            .header {
                @apply --layout-horizontal;
            }
            .avatar-wrapper {
                flex: none;
                overflow: hidden;
                width: 48px;
                height: 48px;
                border-radius: 50%;
                position: relative;
                margin: 0 20px;
            }
            .avatar {
                border-radius: 50%;
                cursor: pointer;
                height: 48px;
                overflow: hidden;
                width: 48px;
            }
            .detail {
                width: 100%;
            }
            .title {
                font-size: 24px;
                line-height: 28px;
                margin: 0;
                display: block;
                @apply --layout-horizontal;
            }
            .title .text {
                @apply --layout-flex-auto;
                color: #333;
            }
            .title .featured-icon {
                @apply --layout-end;
                height: 28px;
                width: 28px;
                margin-left: 6px;
            }
            .title ::slotted(iron-icon) {
                height: 28px;
                margin-top: -10px;
                width: 28px;
            }
            .attribution {
                font-weight: normal;
                margin: 0;
                color: #9FA4A8;
            }
            .author {
                cursor: pointer;
                font-weight: bold;
            }
            .description {
                color: var(--color-chateau);
                line-height: 20px;
                margin: 0;
            }
            .description:not(:empty) {
                font-size: 16px;
                margin: 8px 0 0 0;
            }
            .social-section {
                border-top: 1px solid var(--color-porcelain);
            }
            kw-social-comment {
                width: 100%;
            }
            .actions {
                @apply --layout-horizontal;
                @apply --layout-start-justified;
                @apply --layout-wrap;
                margin-top: 5px;
            }
            .actions kwc-share-action {
                margin: 5px 0px;
                margin-right: 10px;
                position: relative;
            }
            .actions kwc-share-action:last-child {
                margin-right: 0px;
            }
            .actions kwc-share-action paper-spinner-lite {
                height: 18px;
                width: 18px;
                position: absolute;
                top: 9px;
                display: block;
                margin: auto;
            }
            kwc-share-action.like {
                --kwc-share-action-icon-hover-color: var(--color-carnation);
                --kwc-share-action-wrapper-active-color: var(--color-carnation);
                --kwc-share-action-wrapper-active-hover-color: var(--color-carnation);
                --kwc-share-action-label-active-color: #fff;
                --kwc-share-action-icon-active-color: #fff;
            }
            kwc-share-action.remix {
                --kwc-share-action-icon-hover-color: var(--color-kano-orange);
            }
            kwc-share-action.view-code {
                --kwc-share-action-icon-hover-color: var(--color-dodger-blue);
            }
            #more-actions-button {
                margin-left: auto;
            }
            #more-actions-button .ellipsis {
                width: 21px;
                height: 21px;
                overflow: hidden;
            }
            #more-actions-button .ellipsis iron-icon {
                width: 30px;
                height: 30px;
                margin-top: -4px;
                margin-left: -4px;
            }
            #more-actions-menu {
                transform: translate(-64px, 10px);
            }
            #more-actions-menu kwc-drop-down-item {
                min-width: 150px;
            }
            kwc-drop-down-item.feature {
                --kwc-drop-down-item-icon-hover-color: var(--color-kano-orange);
            }
            kwc-drop-down-item.delete {
                --kwc-drop-down-item-icon-hover-color: var(--color-dodger-blue);
            }
            kwc-drop-down-item.flag {
                --kwc-drop-down-item-icon-hover-color: var(--color-carnation);
            }
            kwc-drop-down-item.flagged {
                --kwc-drop-down-item-icon-color: var(--color-carnation);
            }
            .social-actions {
                @apply --layout-horizontal;
                @apply --layout-start-justified;
                list-style: none;
                margin: 0;
                padding: 0;
            }
            .social-action {
                box-sizing: border-box;
                margin-right: 16px;
            }
            .social-button {
                border: 0;
                border-radius: 3px;
                color: white;
                cursor: pointer;
                padding: 8px;
                text-transform: uppercase;
                transition: 0.3s ease;
            }
            .social-button:focus {
                outline: 0;
            }
            .social-button.facebook {
                background-color: var(--color-facebook);
            }
            .social-button.twitter {
                background-color: var(--color-twitter);
            }
            .social-button.email {
                background-color: var(--color-kano-orange);
            }
            .social-button .action-icon {
                height: 16px;
                width: 16px;
            }
            .sidebar-section-header {
                font-weight: bold;
                margin-bottom: 10px
            }
            .parts-used-list {
                @apply --layout-horizontal;
                @apply --layout-start-justified;
                @apply --layout-wrap;
                list-style: none;
                margin: 0;
                padding: 0;
            }
            .parts-used-list a {
                margin-right: 6px;
                margin-bottom: 6px;
                padding: 5px 10px 5px 8px;
                border-radius: 5px;
                color: var(--color-chateau);
                background-color: #f6f7f9;
                text-decoration: none;
                @apply --layout-flex-none;
                @apply --layout-horizontal;
                @apply --layout-center-justified;
            }
            .parts-used-list a:hover {
                background-color: #e5e8eC;
            }
            .parts-used-list a.inactive:hover {
                background-color: #f6f7f9;
                cursor: not-allowed;
            }
            .parts-used-list iron-icon {
                color: var(--color-grey);
                width: 24px;
                height: 24px;
                margin-right: 3px;
            }
            .parts-used-list .label {
                line-height: 24px;
            }
            .social,
            .related-shares,
            .parts-used-list {
                margin-bottom: 30px;
            }
            .stats {
                margin: 8px 0px 21px 0px;
                color: var(--color-grey);
                font-size: 13px;
            }
            .stats span {
                margin-right: 15px;
            }
            .related-shares-list {
                @apply --layout-horizontal;
                @apply --layout-wrap;
                margin-top: -5px;
                margin-left: -5px;
                margin-bottom: -5px;
                min-width: 250px;
            }
            .related-shares-cover {
                border: 1px solid var(--color-porcelain);
                width: 114px;
                height: 82px;
                margin: 5px;
                --kwc-share-cover-spritesheet: {
                    width: 160px;
                    transform: translateX(-40px);
                }
            }
            :host([tombstone]) .avatar,
            :host([tombstone]) .avatar-wrapper {
                background: var(--color-grey-lightest);
                color: transparent;
            }
            :host([tombstone]) .title {
                width: 200px;
                height: 22px;
                background: var(--color-grey-lightest);
                color: transparent;
            }
            :host([tombstone]) .attribution {
                position: relative;
                width: 100px;
                height: 16px;
                background: var(--color-grey-lightest);
                color: transparent;
                margin-top: 6px;
            }
            :host([tombstone]) .description {
                width: 100%;
                height: 36px;
                background: var(--color-grey-lightest);
                color: transparent;
                margin-top: 6px;
                margin-bottom: 12px;
            }
            :host([tombstone]) .supplementary-details,
            :host([tombstone]) #share-container,
            :host([tombstone]) .social {
                opacity: 0.3;
            }
            .no-margin {
                margin: 0;
            }
            @media all and (max-width: 780px) {
                .share-detail {
                    @apply --layout-vertical;
                    padding: 16px 16px;
                }
                .supplementary-details {
                    @apply --layout-vertical;
                    padding: 36px 0 0 0;
                }
                .supplementary-details .actions {
                    margin: 0 0 36px 0;
                }
            }
            @media all and (min-width: 581px) and (max-width: 780px) {
                .supplementary-details {
                    padding: 0 0 0 36px;
                }
                .actions,
                .social {
                    @apply --layout-flex-auto;
                }
                .supplementary-details > * {
                    margin-right: 18px;
                }
            }
            @media all and (min-width: 781px) {
                #share-container {
                    padding: 0 60px;
                }
                .share-detail {
                    @apply --layout-horizontal;
                    max-width: 888px;
                }
                .main-details {
                    @apply --layout-flex-8;
                    padding: 32px 44px 32px 8px;
                }
                .supplementary-details {
                    @apply --layout-flex-4;
                    color: var(--color-grey);
                    padding: 32px 40px 32px 44px;
                }
            }
        </style>
        <div id="share" class="share">
            <div class="content-prefix">
                <slot name="content::before"></slot>
            </div>
            <div class="share-content">
                <div class="loading">
                    <div class="overlay">
                        <paper-spinner-lite class="spinner" active=""></paper-spinner-lite>
                    </div>
                </div>
                <div class="content">
                    <div id="share-container">
                        <slot name="player::before"></slot>
                        <kwc-share-player share="[[shareData]]" display-code="{{displayCode}}">
                        </kwc-share-player>
                        <slot name="player::after"></slot>
                    </div>
                </div>
                <slot name="share-hardware"></slot>
            </div>
            <div class="content-suffix">
                <slot name="content::after"></slot>
            </div>
            <div class="share-detail">
                <div class="main-details">
                    <div class="header">
                        <div class="avatar-wrapper">
                            <iron-image class="avatar" src\$="[[_avatarUrl]]" sizing="cover" on-tap="_onUserTapped" preload="" fade="">
                                        </iron-image>
                        </div>
                        <div class="detail">
                            <h3 class="title">
                                <slot name="title-icon"></slot>
                                <div class="text">[[shareData.title]]</div>
                                <iron-image class="featured-icon" src\$="[[_featuredIconUrl]]" sizing="contain" hidden\$="[[!featured]]" preload="" fade="">
                                </iron-image>
                            </h3>
                            <h4 class="attribution">by
                                <a class="author" on-tap="_onUserTapped">[[shareData.username]]
                                   </a>
                            </h4>
                            <p class="description">[[shareData.description]]</p>
                            <div class="actions">
                            <template is="dom-if" if="[[!_sharedByUser]]">
                                <kwc-share-action class="like" icon="kwc-ui-icons:like" on-tap="_onLikeTapped" active="[[liked]]">
                                    [[_computedLikeButtonText(liked)]]
                                    <paper-spinner-lite active="[[submitingLike]]">
                                    </paper-spinner-lite>
                                </kwc-share-action>
                                </template>
                                <template is="dom-if" if="[[_showRemixButton(shareData, canRemix)]]">
                                    <kwc-share-action class="remix" icon="kwc-ui-icons:remix" on-tap="_onRemixTapped">Remix</kwc-share-action>
                                </template>
                                <template is="dom-if" if="[[_showCodeButton(shareData)]]">
                                    <kwc-share-action class="view-code" icon-id="kwc-social-icons:code" on-tap="_toggleCodeView">View&nbsp;code</kwc-share-action>
                                </template>
                                <kwc-share-action id="more-actions-button" on-tap="_onMoreActionsTapped" active="[[dropDownOpened]]">
                                    <div class="ellipsis">
                                        <iron-icon icon="kwc-ui-icons:ellipsis"></iron-icon>
                                    </div>
                                    <kwc-drop-down id="more-actions-menu" caret-position="center" opened="{{dropDownOpened}}">
                                        <template is="dom-if" if="[[_showFeaturedButton(shareData, currentUser.admin_level)]]">
                                            <kwc-drop-down-item class="feature" icon="kwc-ui-icons:rosette" on-tap="_onFeatureTapped">[[_computeFeatureButtonText(featured)]]</kwc-drop-down-item>
                                        </template>
                                        <template is="dom-if" if="[[_displayMetaActions]]">
                                            <kwc-drop-down-item class="delete" icon="kwc-ui-icons:rubbish-bin" on-tap="_onDeleteTapped">Delete</kwc-drop-down-item>
                                        </template>
                                        <kwc-drop-down-item id="drop-down-flag" class\$="flag no-margin [[_computeFlagStatus(flags.*)]]" icon="kwc-social-icons:flag" on-tap="_onFlagTapped"></kwc-drop-down-item>
                                    </kwc-drop-down>
                                </kwc-share-action>
                            </div>
                            <div class="stats">
                                <span hidden\$="[[!likes.length]]">[[likes.length]] Likes</span>
                                <span hidden\$="[[!comments.count]]">[[comments.count]] Comments</span>
                                <span hidden\$="[[!shareData.views_count]]">[[shareData.views_count]] Views</span>
                            </div>
                        </div>
                    </div>
                    <div class="social">
                        <!-- Set up with support for showing lists of
                                 likes and remixes in future, when the API support
                                 is available -->
                        <iron-pages id="social-sections" selected="[[_section]]" attr-for-selected="section-name" fallback-selection="comments">
                            <div section-name="comments" class="social-section">
                                <kwc-social-comments id="comments" comments="[[comments.entries]]" default-avatar="[[_defaultCommentAvatarUrl]]" next-page="[[comments.page]]" item-id="[[shareData.id]]" tombstone\$="[[!shareData]]" user="[[currentUser]]" loader-status="[[commentLoaderStatus]]" comment-flags="[[commentFlags]]" on-delete-comment="_handleDeleteComment" on-load-comment="_handleLoadComment" on-post-comment="_handlePostComment" on-flag-comment="_handleFlagComment" on-unflag-comment="_handleUnflagComment" on-view-user="_handleViewUser">
                                                     </kwc-social-comments>
                            </div>
                        </iron-pages>
                    </div>
                </div>
                <div class="supplementary-details">
                    <template is="dom-if" if="[[_showRelatedShares(related)]]">
                        <div class="related-shares">
                            <div class="sidebar-section-header">More from [[shareData.username]]</div>
                            <div class="related-shares-list">
                                <template is="dom-repeat" items="[[related]]">
                                    <a href="[[item.targetUrl]]">
                                        <kwc-share-cover class="related-shares-cover" image-url="[[item.imageUrl]]" spritesheet-url="[[item.spritesheetUrl]]">
                                        </kwc-share-cover>
                                    </a>
                                </template>
                            </div>
                        </div>
                    </template>
                    <template is="dom-if" if="[[_anyHardwareUsed(shareData.hardware)]]">
                        <div class="parts-used">
                            <div class="sidebar-section-header">Parts Used</div>
                            <ul class="parts-used-list">
                                <template is="dom-repeat" items="[[shareData.hardware]]">
                                    <li>
                                        <a href\$="[[_getLinkForPartId(item.product)]]" class\$="[[_computePartsLinkClass(item.product)]]">
                                            <iron-icon icon="kwc-part-icons:[[item.product]]"></iron-icon>
                                            <div class="label">[[_getLabelForPartId(item.product)]]</div>
                                        </a>
                                    </li>
                                </template>
                            </ul>
                        </div>
                    </template>
                    <div class="social" hidden$="[[hideSocial]]">
                        <div class="sidebar-section-header">Share</div>
                        <ul class="social-actions">
                            <li class="social-action">
                                <button class="social-button facebook" on-tap="_onFacebookTapped">
                                    <iron-icon class="action-icon" icon="kwc-social-icons:facebook"></iron-icon>
                                </button>
                            </li>
                            <li class="social-action">
                                <button class="social-button twitter" on-tap="_onTwitterTapped">
                                    <iron-icon class="action-icon" icon="kwc-social-icons:twitter"></iron-icon>
                                </button>
                            </li>
                            <li class="social-action">
                                <button class="social-button email" on-tap="_onEmailTapped">
                                    <iron-icon class="action-icon" icon="kwc-social-icons:share"></iron-icon>
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
`,is:"kwc-share-detail",properties:{shareData:{type:Object},displayCode:{type:Boolean,value:!1},canRemix:{type:Boolean,value:!1},loaded:{type:Boolean,value:!1,notify:!0},_avatarUrl:{type:String,computed:"_computeAvatarUrl(shareData)"},comments:{type:Object,value:()=>({})},commentLoaderStatus:{type:String,computed:"_computeLoaderStatus(comments.*)"},flags:{type:Object,value:()=>({}),observer:"updateFlagButton"},commentFlags:{type:Array,computed:"_computeCommentFlags(flags.*)"},_defaultCommentAvatarUrl:{type:String,value:()=>c.assets.avatar},_displayMetaActions:{type:Boolean,computed:"_computeMetaActionDisplay(_sharedByUser, _userIsAdmin)"},featured:{type:Boolean,value:!1,reflectToAtrribute:!0},featuredIconUrl:{type:String,value:null},_featuredIconUrl:{type:String,computed:"_computeFeaturedIconUrl(featuredIconUrl)"},currentUser:{type:Object,value:()=>({})},_section:{type:String,value:"comments"},likes:{type:Array,value:()=>[]},liked:{type:Boolean,computed:"_computeLiked(likes.*, currentUser)"},submitingLike:{type:Boolean,value:!1},_sharedByUser:{type:Boolean,computed:"_computeSharedByUser(shareData, currentUser)"},_userIsAdmin:{type:Boolean,computed:"_computeUserIsAdmin(currentUser.admin_level)"},knownParts:{type:Object,value:()=>({"motion-sensor":{label:"Motion sensor",link:"https://kano.me/store/products/motion-sensor-kit"},lightboard:{label:"Pixel kit",link:"https://kano.me/store/products/pixel-kit"},speaker:{label:"Speaker"},"gyro-accelerometer":{label:"Tilt sensor"},microphone:{label:"Microphone"}})},related:{type:Array},hideSocial:{type:Boolean,value:!1}},observers:["_shareDataChanged(shareData.*)"],_computeAvatarUrl:e=>e?e.userAvatar?e.userAvatar:c.assets.avatar:"",_computeLoaderStatus(e){const t=e.base;return t&&t.page?"on":"off"},_computeFlagged(e){return!(!e||!e.shares||0===e.shares.length)&&e.shares.some(e=>e===this.shareData.id)},updateFlagButton(){const e=this._computeFlagged(this.flags)?"Unflag":"Flag";this.$["drop-down-flag"].innerText=e},_computeFlagStatus(){return this.flags&&this.flags.shares&&0!==this.flags.shares.length&&this._computeFlagged(this.flags)?"flagged":"unflagged"},_computeCommentFlags(){return this.flags?this.flags.comments:[]},_computeFeaturedIconUrl(){return this.featuredIconUrl?this.featuredIconUrl:c.assets.featured},_computeFeatureClass:e=>`action-button feature ${e?"featured":"default"}`,_computeSharedByUser:(e,t)=>!(!e||!t)&&e.userId===t.id,_computeLiked(e,t){if(!e||!t)return!1;if(Array.isArray(e.base)){const o=e.base;if(o&&o.length&&t){return o.some(e=>e.user===t.id)}}else if(e.base.userLikes.length>0&&this.shareData&&this.shareData.id){return e.base.userLikes.indexOf(this.shareData.id)>=0}return!1},_computeLikeClass:e=>`action-button like ${e?"liked":"not-liked"}`,_computedLikeButtonText:e=>e?"Liked":"Like",_computeFeatureButtonText:e=>e?"Un-staff pick":"Staff pick",_getLabelForPartId(e){return this.knownParts&&this.knownParts[e]?this.knownParts[e].label:e},_getLinkForPartId(e){return this.knownParts&&this.knownParts[e]&&this.knownParts[e].link?this.knownParts[e].link:null},_computeNavItemClass:(e,t)=>`nav-item ${e===t?"active":"inactive"}`,_computeMetaActionDisplay:(e,t)=>e||t,_computeUserIsAdmin:e=>e&&e>0,_computePartsLinkClass(e){return this._getLinkForPartId(e)?"":"inactive"},_shareDataChanged(e){const t=e.base;return t&&t.id?this.toggleClass("loaded",!0):null},_showComments(){this.set("_section","comments")},_showLikes(){this.set("_section","likes")},_showCodeButton(e){let t;return!(!e||!e.attachment_url||(t=e.attachment_url.split(".").pop(),-1===["html","draw","lightcode"].indexOf(t)))},_showRemixButton:(e,t)=>!(!e||!t),_showFeaturedButton:(e,t)=>e&&t,_showMoreActions(e,t,o){return this._showFeaturedButton(e,t)||o},_showRelatedShares:e=>e&&e.length>0,_anyHardwareUsed:e=>e&&e.length>0,_onDeleteTapped(){this.dispatchEvent(new CustomEvent("action-click",{detail:{action:"delete",id:this.shareData?this.shareData.id:null,slug:this.shareData?this.shareData.slug:null}}))},_onFeatureTapped(){this.dispatchEvent(new CustomEvent("action-click",{detail:{action:"feature",feature:!this.shareData.featured,id:this.shareData.id}}))},_onLikeTapped(){this._sharedByUser||this.submitingLike||this.dispatchEvent(new CustomEvent("action-click",{detail:{action:"like",liked:!this.liked,shareId:this.shareData?this.shareData.id:null,shareUserId:this.shareData?this.shareData.userId:null,userId:this.currentUser?this.currentUser.id:null}}))},_onRemixTapped(){const e=this.shareData;e&&this.dispatchEvent(new CustomEvent("action-click",{detail:{action:"remix",shareId:e.id,shareSlug:e.slug,shareType:e.app}}))},_onFlagTapped(){const e=this._computeFlagged(this.flags),t=e?"unflagged":"flagged",o=this.$["drop-down-flag"];o.setAttribute("class",`flag ${t}`),o.innerText=e?"Flag":"Unflag",this.dispatchEvent(new CustomEvent("action-click",{detail:{action:"flag",id:this.shareData?this.shareData.id:null,flag:e}}))},_onMoreActionsTapped(e){e.preventDefault(),e.stopPropagation(),this.$["more-actions-menu"].toggle()},_toggleCodeView(){const e=!this.displayCode;this.set("displayCode",e)},_onUserTapped(){this.shareData&&this.dispatchEvent(new CustomEvent("view-user",{detail:{id:this.shareData.userId,username:this.shareData.username}}))},_onEmailTapped(){this.dispatchEvent(new CustomEvent("social-share",{detail:{action:"email",share:this.shareData}}))},_onFacebookTapped(){this.dispatchEvent(new CustomEvent("social-share",{detail:{action:"facebook",share:this.shareData}}))},_onTwitterTapped(){this.dispatchEvent(new CustomEvent("social-share",{detail:{action:"twitter",share:this.shareData}}))},_handleDeleteComment(e){this.dispatchEvent(new CustomEvent("delete-comment",{detail:e.detail}))},_handlePostComment(e){this.dispatchEvent(new CustomEvent("post-comment",{detail:e.detail}))},_handleLoadComment(e){this.dispatchEvent(new CustomEvent("load-comment",{detail:e.detail}))},_handleFlagComment(e){this.dispatchEvent(new CustomEvent("flag-comment",{detail:e.detail}))},_handleUnflagComment(e){this.dispatchEvent(new CustomEvent("unflag-comment",{detail:e.detail}))},_handleViewUser(e){this.dispatchEvent(new CustomEvent("view-user",{detail:e.detail}))},_handleHardwareClick(e){const t=e.path.find(e=>void 0!==e.href).href;this.dispatchEvent(new CustomEvent("hardware-click",{detail:{link:t}}))}});const ee=p.Store.types(["SET_LOADING_COMMENTS","SET_COMMENTS","SET_UPLOADING_COMMENT","ADD_COMMENT","UPDATE_POSTING_COMMENT","DELETE_COMMENT","SET_DELETING_COMMENT","SET_UPLOADING_COMMENT_FLAG","SET_REMOVING_COMMENT_FLAG"]);p.Store.addMutator(function(e){switch(e.type){case ee.SET_LOADING_COMMENTS:this.set(`state.feed.${e.feed}.loadingComments`,e.isLoading);break;case ee.SET_COMMENTS:this.set(`state.feed.${e.feed}.comments`,e.comments);break;case ee.SET_UPLOADING_COMMENT:this.set(`state.feed.${e.feed}.uploadingComment`,e.state);break;case ee.ADD_COMMENT:this.splice(`state.feed.${e.feed}.comments`,0,0,e.comment);break;case ee.UPDATE_POSTING_COMMENT:{const t=this.get(`state.feed.${e.feed}.comments`),o=t.findIndex(e=>e.posting),a=t[o],i=Object.assign({},a,{comment:e.comment.comment});this.splice(`state.feed.${e.feed}.comments`,o,1,i);break}case ee.SET_DELETING_COMMENT:this.set(`state.feed.${e.feed}.deletingComment`,e.state);break;case ee.DELETE_COMMENT:{const t=this.get(`state.feed.${e.feed}.comments`).findIndex(t=>t.id===e.commentId);this.splice(`state.feed.${e.feed}.comments`,t,1);break}case ee.SET_UPLOADING_COMMENT_FLAG:this.set(`state.feed.${e.feed}.uploadingCommentFlag`,e.state);break;case ee.SET_REMOVING_COMMENT_FLAG:this.set(`state.feed.${e.feed}.removingCommentFlag`,e.state)}});const te=e=>{const t=E.ClientFactory(e),o=new E.CommentClient(t),a=new E.ShareClient(t);return{getComments:e=>a.getComments(e).then(e=>o.getListByIds(e.map(e=>e.id))),postComment:(e,t)=>o.post(e,t),deleteComment:e=>o.deleteComment(e),flagComment:e=>o.flagComment(e),unflagComment:e=>o.unflagComment(e)}},oe=u.UserActionsFactory(u.USER_TYPES.AUTHENTICATED,c.FEED_TYPES.USER),ae=u.UserActionsFactory(u.USER_TYPES.SELECTED),ie=c.SharesActionsFactory(c.FEED_TYPES.CREATIONS),se=(e=>({setLoadingComments(t){p.Store.dispatch({type:ee.SET_LOADING_COMMENTS,feed:e,isLoading:t})},setComments(t){p.Store.dispatch({type:ee.SET_COMMENTS,feed:e,comments:t})},setUploadingComment(t){p.Store.dispatch({type:ee.SET_UPLOADING_COMMENT,feed:e,state:t})},addComment(t){p.Store.dispatch({type:ee.ADD_COMMENT,feed:e,comment:t})},updatePostingComment(t){p.Store.dispatch({type:ee.UPDATE_POSTING_COMMENT,feed:e,comment:t})},setDeletingComment(t){p.Store.dispatch({type:ee.SET_DELETING_COMMENT,feed:e,state:t})},deleteComment(t){p.Store.dispatch({type:ee.DELETE_COMMENT,feed:e,commentId:t})},setUploadingCommentFlag(t){p.Store.dispatch({type:ee.SET_UPLOADING_COMMENT_FLAG,feed:e,state:t})},setRemovingCommentFlag(t){p.Store.dispatch({type:ee.SET_REMOVING_COMMENT_FLAG,feed:e,state:t})}}))(c.FEED_TYPES.CREATIONS);class ne extends(p.Store.StateReceiver(t.PolymerElement)){static get template(){return t.html`
            ${c.fullscreenNav}
            <style>
                :host {
                    display: flex;
                    flex-direction: column;
                    background: var(--ka-background, white);
                    overflow-y: overlay;
                    font-family: var(--font-body);
                }
                kwc-share-detail {
                    flex: 1;
                    background: #FFF;
                    --kw-share-detail-share-background: #292F35;
                }
            </style>
            <div class="nav">
                <button on-click="_back">
                    <div class="icon back">
                        <iron-icon icon="kwc-ui-icons:arrow"></iron-icon>
                    </div>
                    <span>Back</span>
                </button>
                <button on-click="_exit">
                    <span>Close</span>
                    <div class="icon close">
                        <iron-icon icon="kwc-ui-icons:close"></iron-icon>
                    </div>
                </button>
            </div>
            <kwc-share-detail
                share-data="[[_format(share)]]"
                featured="[[share.featured]]"
                comments="[[_formatComments(comments.splices)]]"
                current-user="[[_formatUser(user)]]"
                can-remix
                likes="[[_computeLikes(liked)]]"
                on-view-user="onViewUser"
                on-post-comment="_onPostComment"
                on-action-click="_onActionClick"
                on-delete-comment="_onDeleteComment"
                on-flag-comment="_onFlagComment"
                on-unflag-comment="_onUnflagComment"
                flags="[[flags]]"
                hide-social>
            </kwc-share-detail>
        `}static get is(){return"ka-view-creation"}static get properties(){return{sharesMap:{linkState:c.feedProp(c.FEED_TYPES.CREATIONS,"sharesMap")},selectedShareSlug:{linkState:"routing.pathParams.creationSlug",observer:"_selectedChanged"},share:{linkArray:"sharesMap",linkIndex:"selectedShareSlug",observer:"_shareChanged"},forceComment:{linkState:"routing.params.comment",observer:"_forceCommentChanged"},comments:{linkState:c.feedProp(c.FEED_TYPES.CREATIONS,"comments")},originPath:{type:String,value:null},config:{linkState:"config"},user:{linkState:u.userProp(u.USER_TYPES.AUTHENTICATED,"profile")},profileLinkPrefix:{type:"String",value:"users"},exitLink:String,flags:{linkState:c.feedProp(c.FEED_TYPES.USER,"flags")},liked:{type:Array,linkState:"users.authenticated.likes"}}}connectedCallback(){super.connectedCallback(),setTimeout(()=>{T.RoutingActions.toggleNavbar(!0)},0),this.getLikes(),this.creationsManager._creationsContext._callDeferedActivation().then(()=>{this.creationsManager.getOutputProfiles().forEach(e=>C.Player.registerProfile(e))})}_onActionClick(e){const{action:t}=e.detail;switch(t){case"remix":w.navigateTo(`/remix/${this.share.slug}`);break;case"delete":this._onDeleteShare(e.detail);break;case"flag":this._onFlagShareTapped(e.detail);break;case"like":this._likeShare(e.detail)}}_selectedChanged(){if(!this.selectedShareSlug)return void(this.share=null);const{sharesMap:e}=this.getState().feed.creations;e&&e[this.selectedShareSlug]||this.sharesModel.getBySlug(this.selectedShareSlug).then(e=>{ie.add(e)})}_computeLikes(){return{userLikes:this.liked}}_shareChanged(){if(!this.share)return;se.setLoadingComments(!0),this.commentsModel.getComments(this.share.id).then(e=>{se.setComments(e),se.setLoadingComments(!1)}),oe.setLoadingFlags(!0),this.userModel.getFlags().then(e=>{oe.setFlags(e),oe.setLoadingFlags(!1)});const{users:e}=this.getState();let t;e.authenticated&&(t=e.authenticated.profile.id),this.sharesModel.recordView(this.share.id,t).then(()=>{ie.updateViewCount(this.share.id)})}_format(e){return ne.legacyShareFormat(e)}static legacyShareFormat(e){return e?{id:e.id,title:e.title,username:e.username,description:e.description,hardware:e.hardware,app:e.app,slug:e.slug,cover_url:e.cover_url,attachment_url:e.attachment_url,workspace_info_url:e.workspace_info_url,lightboard_spritesheet_url:e.lightboard_spritesheet_url,spritesheet_url:e.spritesheet_url,views_count:e.view_count,userId:e.userid,userAvatar:e.userAvatar}:{}}_forceCommentChanged(){if(void 0===this.forceComment)return;const e=this.shadowRoot.querySelector("kwc-share-detail");if(!e)return;const t=e.shadowRoot.querySelector("#comments");if(!t)return;const o=t.shadowRoot.querySelector("#comment-input");o&&setTimeout(()=>{o.focus()})}getLikes(){return this.userModel.getLikes(this.user.id).then(e=>{oe.setLikes(e)})}_formatUser(e){return{id:e.id,admin_level:0,avatar:e.avatar}}_getModel(e,t){if(!this[e]){const{config:o}=this.getState();this[e]=t(o.API_URL)}return this[e]}get userModel(){return this._getModel("_userModel",g.UserFactory)}get sharesModel(){return this._getModel("_sharesModel",f.SharesFactory)}get commentsModel(){return this._getModel("_commentsModel",te)}_onDeleteShare(e){const{id:t,slug:o}=e;ie.setShareDeleting(!0),this.sharesModel.deleteShare(t).then(()=>{ie.remove(t,o)}).then(()=>{w.navigateTo("/creations"),ie.setShareDeleting(!1)}).catch(()=>{ie.setShareDeleting(!1)})}_likeShare(e){const t=e.shareId;e.liked?this.sharesModel.recordLike(t).then(()=>{this.getLikes(),ie.updateLikeCount(t,1)}):this.sharesModel.deleteLike(t).then(()=>{this.getLikes(),ie.updateLikeCount(t,-1)})}_onFlagShareTapped(e){const{id:t,flag:o}=e;o?this._unflagShare(t):this._flagShare(t)}_flagShare(e){ie.setUploadingShareFlag(!0),this.sharesModel.flagShare(e).then(()=>{const t=this.flags;t.shares.push(e),oe.setFlags(t),ie.setUploadingShareFlag(!1)}).catch(()=>{ie.setUploadingShareFlag(!1)})}_unflagShare(e){ie.setRemovingShareFlag(!0),this.sharesModel.unflagShare(e).then(()=>{const t=this.flags,o=t.shares.indexOf(e);o>-1&&t.shares.splice(o,1),oe.setFlags(t),ie.setRemovingShareFlag(!1)}).catch(()=>{ie.setRemovingShareFlag(!1)})}_onPostComment(e){const t=e.detail.value;se.setUploadingComment(!0);const o={userid:this.user.id,username:this.user.username,avatar:this.user.avatar,comment:t,created:new Date,posting:!0};se.addComment(o),this.commentsModel.postComment(this.share.id,t).then(e=>{se.setUploadingComment(!1),se.updatePostingComment(e)}).catch(()=>{se.setUploadingComment(!1)})}_onDeleteComment(e){const t=e.detail.id;t&&(se.setDeletingComment(!0),this.commentsModel.deleteComment(t).then(()=>{se.deleteComment(t),se.setDeletingComment(!1)}).catch(()=>{se.setDeletingComment(!1)}))}_onFlagComment(e){const t=e.detail.id;t&&(se.setUploadingCommentFlag(!0),this.commentsModel.flagComment(t).then(()=>{const e=this.flags;e.comments.push(t),oe.setFlags(e),se.setUploadingCommentFlag(!1)}).catch(()=>{se.setUploadingCommentFlag(!1)}))}_onUnflagComment(e){const t=e.detail.id;se.setRemovingCommentFlag(!0),this.commentsModel.unflagComment(t).then(()=>{const e=this.flags,o=e.comments.indexOf(t);o>-1&&e.comments.splice(o,1),oe.setFlags(e),se.setRemovingCommentFlag(!1)}).catch(()=>{se.setRemovingCommentFlag(!1)})}onViewUser(e){this.goToUser(e.detail.username)}goToUser(e){e===this.user.username?w.navigateTo("/profile/creations"):(this.fetchUser(e),w.navigateTo(`${this.profileLinkPrefix}/${e}`))}fetchUser(e){return ae.setLoading(!0),this.userModel.getUser(e).then(e=>{ae.setUser(e),ae.setLoading(!1)}).catch(e=>{throw ae.setLoading(!1),e})}_formatComments(){return{entries:this.comments.map(e=>({id:e.id,author:{username:e.username,id:e.userid,avatar:e.avatar},text:e.comment,date_created:e.modified||e.created})),count:this.comments.length,page:0}}_back(){const{routingHistory:e}=this.getState(),t=e[e.length-2];t&&"creations"!==t.view&&"profile"!==t.view&&"user"!==t.view?this._exit():w.historyBack()}_exit(){return w.navigateTo(this.exitLink)}}window.customElements.define(ne.is,ne);class re extends(p.Store.StateProvider(t.PolymerElement)){static get is(){return"ka-state-manager"}}window.customElements.define(re.is,re);const le=document.createElement("ka-state-manager");document.body.appendChild(le);const ce=p.Store.types(["UPDATE"]);p.Store.addMutator(function(e){switch(e.type){case ce.UPDATE:this.set("state.config",e.config)}});const de={update(e){p.Store.dispatch({type:ce.UPDATE,config:e})}},he=p.Store.types(["SET_STATE","SET_UPDATE_INFO","USER_DISMISSED","USER_CANCELLED_FIRMWARE"]);p.Store.addMutator(function(e){switch(e.type){case he.SET_STATE:this.set("state.updater.state",e.state);break;case he.SET_UPDATE_INFO:this.set("state.updater.updateInfo",e.info);break;case he.USER_DISMISSED:this.set("state.updater.userDismissed",!0)}});const pe={setState(e){p.Store.dispatch({type:he.SET_STATE,state:e})},setUpdateInfo(e){p.Store.dispatch({type:he.SET_UPDATE_INFO,info:e})},userDismissed(){p.Store.dispatch({type:he.USER_DISMISSED})}};class ue{constructor(e,t){this.backend=e,this.isSetup=!1,this.backend.setup({win32FeedUrl:t.UPDATER.WIN32_FEED_URL,darwinFeedUrl:t.UPDATER.DARWIN_FEED_URL,version:t.version}).then(e=>{this.isSetup=e,e&&(this.backend.on("checking-for-update",()=>{pe.setState("checking")}),this.backend.on("update-not-available",()=>{pe.setState("up-to-date")}),this.backend.on("update-available",()=>{pe.setState("available")}),this.backend.on("update-downloaded",e=>{pe.setState("downloaded"),pe.setUpdateInfo(e)}),this.backend.checkForUpdates())})}userDismissed(){pe.userDismissed()}checkForUpdates(){this.isSetup&&this.backend.checkForUpdates()}quitAndInstall(){this.isSetup&&this.backend.quitAndInstall()}}const me=t.html`
    <div id="wand" class="icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="30.56" height="43.48" viewBox="0 0 30.56 43.48"><defs><style>.toast-alert-wand{fill:#03426d;}</style></defs><title>toast-alert-wand</title><g id="Layer_2" data-name="Layer 2"><g id="Layer_1-2" data-name="Layer 1"><path class="toast-alert-wand" d="M7.06,32.78.75,39.08a2.57,2.57,0,0,0,3.64,3.64l6.31-6.3Z"/><path class="toast-alert-wand<" d="M29.81,13.67a2.58,2.58,0,0,0-3.64,0L9.74,30.1l3.64,3.64L29.81,17.31A2.58,2.58,0,0,0,29.81,13.67Z"/><polygon class="toast-alert-wand<" points="22.22 0 23.16 1.72 24.87 2.65 23.16 3.59 22.22 5.3 21.29 3.59 19.57 2.65 21.29 1.72 22.22 0"/><polygon class="toast-alert-wand<" points="14.59 9.4 16.03 12.04 18.65 13.46 16.03 14.9 14.59 17.51 13.17 14.9 10.54 13.46 13.17 12.04 14.59 9.4"/></g></g></svg>
    </div>
    <div id="alert" class="icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="44.6" height="44.6" viewBox="0 0 44.6 44.6"><defs><style>.toast-alert-warning{fill:#e73331;}</style></defs><title>toast-alert-warning</title><g id="Layer_2" data-name="Layer 2"><g id="Layer_1-2" data-name="Layer 1"><path class="toast-alert-warning" d="M23.57,28.42a3,3,0,0,1,3.56,2.79,2.92,2.92,0,0,1-2.77,3.52A2.89,2.89,0,0,1,20.85,32,2.92,2.92,0,0,1,23.57,28.42ZM18.91,11.59a3.41,3.41,0,0,1,2.41-1.2A3.43,3.43,0,0,1,24,11a2.64,2.64,0,0,1,.91,1.94l.53,10.55A2.25,2.25,0,0,1,23.27,26a2.21,2.21,0,0,1-2.65-1.87L18.5,13.67A2.66,2.66,0,0,1,18.91,11.59ZM44.6,22.3A22.3,22.3,0,1,0,22.3,44.6,22.29,22.29,0,0,0,44.6,22.3Z"/></g></g></svg>
    </div>
    <div id="battery" class="icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="30.56" height="43.48" viewBox="0 0 30.56 43.48"><defs><style>.toast-alert-wand{fill:#03426d;}</style></defs><title>toast-alert-wand</title><g id="Layer_2" data-name="Layer 2"><g id="Layer_1-2" data-name="Layer 1"><path class="toast-alert-wand" d="M7.06,32.78.75,39.08a2.57,2.57,0,0,0,3.64,3.64l6.31-6.3Z"/><path class="toast-alert-wand<" d="M29.81,13.67a2.58,2.58,0,0,0-3.64,0L9.74,30.1l3.64,3.64L29.81,17.31A2.58,2.58,0,0,0,29.81,13.67Z"/><polygon class="toast-alert-wand<" points="22.22 0 23.16 1.72 24.87 2.65 23.16 3.59 22.22 5.3 21.29 3.59 19.57 2.65 21.29 1.72 22.22 0"/><polygon class="toast-alert-wand<" points="14.59 9.4 16.03 12.04 18.65 13.46 16.03 14.9 14.59 17.51 13.17 14.9 10.54 13.46 13.17 12.04 14.59 9.4"/></g></g></svg>
    </div>
`;customElements.define("ka-toast",class extends t.PolymerElement{static get properties(){return{type:String,heading:String,text:String,actionLabel:String,timeout:Number,sticky:{type:Boolean,value:!1}}}static get template(){return t.html`
            <style>
                :host {
                    display: flex;
                    flex-direction: row;
                    padding: 16px;
                    background: white;
                    margin: 16px 16px 0px 16px;
                    position: relative;
                    max-width: 330px;
                    width: 330px;
                    font-family: var(--font-body);
                    border-radius: 6px;
                    color: var(--color-chateau);
                    box-shadow: 2px 5px 21px 4px rgba(0,0,0,0.2);
                    -webkit-box-shadow: 2px 5px 21px 4px rgba(0,0,0,0.2);
                    -moz-box-shadow: 2px 5px 21px 4px rgba(0,0,0,0.2);
                }
                :host(:last-of-type) {
                    margin-bottom: 16px;
                }
                :host(:only-of-type) {
                    margin: 0 16px 16px 0;
                }
                .info {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    align-items: flex-start;
                }
                .info .heading {
                    font-weight: bold;
                }
                .info .text {
                    font-size: 14px;
                    color: var(--color-grey);
                    padding-bottom: 10px;
                }
                .dismiss {
                    position: absolute;
                    cursor: pointer;
                    top: 8px;
                    right: 8px;
                    padding: 8px 3px 10px;
                    border: none;
                    border-radius: 3px;
                    color: white;
                    background-color: var(--color-grey);
                    font-size: 16px;
                    font-weight: bold;
                    line-height: 0;
                }
                .icons {
                    max-width: 100px;
                }
                .icon {
                    display: none;
                    margin: 0 26px 0 10px;
                }
                .icon svg {
                    width: 28px;
                }
                .icons.wand #wand,
                .icons.alert #alert,
                .icons.battery #battery {
                    display: block;
                }
                marked-element .markdown-html p {
                    margin: 0;
                }
            </style>
            <div class$="icons [[displayTypeIcon()]]">
                ${me}
            </div>
            <div class="info">
                <span class="heading">[[heading]]</span>
                <span class="text">
                    <marked-element markdown="[[text]]">
                        <div slot="markdown-html" class="markdown-html"></div>
                    </marked-element>
                </span>
                <kwc-button on-click="_confirm" variant="primary" size="small">[[actionLabel]]</kwc-button>
            </div>
            <button class="dismiss" on-click="_dismiss" hidden$="[[sticky]]">&times;</button>
        `}connectedCallback(){super.connectedCallback(),this._onTouchStart=this._onTouchStart.bind(this),this._onTouchEnd=this._onTouchEnd.bind(this),this._onTouchMove=this._onTouchMove.bind(this),this.addEventListener("touchstart",this._onTouchStart),this.addEventListener("touchend",this._onTouchEnd),this.addEventListener("touchmove",this._onTouchMove),void 0!==this.timeout&&(this._timeoutId=setTimeout(()=>{this.close()},this.timeout))}displayTypeIcon(){return this.type?this.type:""}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener("touchstart",this._onTouchStart),this.removeEventListener("touchend",this._onTouchEnd),this.removeEventListener("touchmove",this._onTouchMove)}_onTouchStart(e){if(this._startTouch)return;if(!e.hasOwnProperty("changedTouches"))return;this.style.transition="";const[t]=e.changedTouches;this._startTouch=t;const o=this.getBoundingClientRect();this._swipeWidth=o.width,this._animateTouch(t)}_onTouchEnd(e){if(!e.hasOwnProperty("changedTouches"))return;const[t]=e.changedTouches;t.identifier===this._startTouch.identifier&&this._endTouch()}_onTouchMove(e){if(e.hasOwnProperty("changedTouches")){for(let t=0;t<e.changedTouches.length;t+=1)if(e.changedTouches[t].identifier===this._startTouch.identifier){this._animateTouch(e.changedTouches[t]);break}}else this._velX=1}_animateTouch(e){const t=this._startTouch.clientX-e.clientX;let o=-t;o<0?o=-2*Math.log2(Math.abs(o)):this.sticky&&(o=2*Math.log2(Math.abs(o))),this.style.transform=`translateX(${o}px)`,this.style.opacity=`${1-o/this._swipeWidth}`,this._prevDx&&(this._velX=Math.max(this._prevDx-t,0)),this._prevDx=t}_endTouch(){this._swipeWidth=0,this._startTouch=null,this._velX>1&&!this.sticky?this._dismiss():(this.style.transition="all linear 100ms",this.style.transform="",this.style.opacity="")}dispose(){this.parentNode&&this.parentNode.removeChild(this)}on(...e){this.addEventListener(...e)}removeListener(...e){this.removeEventListener(...e)}_confirm(){this.dispatchEvent(new CustomEvent("confirm")),this.close()}_dismiss(){this.dispatchEvent(new CustomEvent("dismiss")),this.close()}close(){clearTimeout(this._timeoutId),this.manager&&this.manager._closeToast(this,this._velX)}});const ge=customElements.get("ka-toast");let ve;class fe{constructor(){this.root=ve||((ve=document.createElement("div")).style.position="fixed",ve.style.right="0px",ve.style.bottom="0px",document.body.appendChild(ve),ve)}showToast(e){const t=new ge;Object.assign(t,e),t.manager=this,this.root.appendChild(t);const o=t.getBoundingClientRect();return this.root.style.transition="",this.root.style.transform=`translateY(${o.height}px)`,this.root.getBoundingClientRect(),this.root.style.transition="all linear 200ms",this.root.style.transform="",t}_closeToast(e,t=1){const o=[],a=[].concat(this.root.children);for(let n=0;n<a.indexOf(e);n+=1)o.push(a[n]);const i=e.getBoundingClientRect(),s=()=>{e.removeEventListener("transitionend",s),e.dispose(),o.forEach(e=>{const t=()=>{e.removeEventListener("transitionend",t),e.style.transition=""};e.addEventListener("transitionend",t),e.style.transition="",e.style.transform=`translateY(-${i.height+16}px)`,e.getBoundingClientRect(),e.style.transition="all linear 200ms",e.style.transform=""})};e.addEventListener("transitionend",s),e.style.transition=`all linear ${Math.max(200/t,0)}ms`,e.style.transform=`translateX(${i.width}px)`,e.style.opacity="0"}}const we=u.UserActionsFactory(u.USER_TYPES.AUTHENTICATED);class _e{constructor(e,t){this.userModel=g.UserFactory(e),this.onboardingModel=P.OnboardingFactory(t),this.progressModel=v.ProgressFactory(t)}getAuthenticatedUser(){return we.setLoading(!0),this.userModel.getAuthenticatedUser().then(e=>(we.setUser(e),we.setLoading(!1),e)).catch(()=>(we.setLoading(!1),null))}getOnboarding(){const e=this.onboardingModel.fromStorage();return P.OnboardingActions.load(e),Promise.resolve(e)}setPreferedDevice(e,t){const o=this.onboardingModel.setPreferedDevice(e,t);P.OnboardingActions.update(e,o)}getLastAuth(){return Promise.resolve(this.userModel.getLastLogin())}subscribe(e,t){const o={set:(e,o)=>{t(o)},component:{notifySplices(e,o){t(o)}},property:{linkState:e},propertyName:null};return p.Store.watchers.push(o),{dispose:()=>{const e=p.Store.watchers.indexOf(o);p.Store.watchers.splice(e,1)}}}get(e){return p.Store.appStateComponent.get(`state.${e}`)}getProgress(...e){return this.progressModel.getProgress(...e)}}class be{constructor(e,t){this.from=e,this.to=t,this.resolved=new Promise(e=>{this._resolver=e})}intercept(){this._intercepted=!0}redirect(e){this.intercept(),this._redirectTo=e,this._resolver(e)}}class ke{constructor(){this._routes=[],this._interceptions=[],this._onDidUpdateRoute=new U.EventEmitter,this._onDidUpdateParams=new U.EventEmitter}get onDidUpdateRoute(){return this._onDidUpdateRoute.event}get onDidUpdateParams(){return this._onDidUpdateParams.event}registerRoute(e){return this._routes.push(e),{dispose:()=>{const t=this._routes.indexOf(e);this._routes.splice(t,1)}}}registerInterception(e){return this._interceptions.push(e),{dispose:()=>{const t=this._interceptions.indexOf(e);this._routes.splice(t,1)}}}updatePath(e,t=!1){if(e===this._prevPath)return;const o=this.matchRoute(e);!t&&this._resolveInterceptions(o)||(this._prevRoute=o,this._prevPath=e,this._onDidUpdateRoute.fire(o))}_resolveInterceptions(e){for(let t=0;t<this._interceptions.length;t+=1){const o=new be(this._prevRoute,e);if(this._interceptions[t](o),o._intercepted)return o._redirectTo&&this.updatePath(o._redirectTo),o.resolved.then(e=>{this.updatePath(e,!0)}),!0}return!1}updateParams(e){this._onDidUpdateParams.fire(e)}matchRoute(e){const t=e.replace("//host","").replace(/$\/\//,"/");for(let o=0;o<this._routes.length;o+=1){const e=this._routes[o],a=t.match(e.test);if(a){const o=a.slice(1).reduce((t,o,a)=>(t[e.params[a]]=o,t),{});if(e.redirect){let t;return t="function"==typeof e.redirect?e.redirect(o):e.redirect,this.matchRoute(t)}return{path:t,pathParams:Object.assign({},e.pathParams||{},o),view:e.view}}}return null}dispose(){}}const ye=[{test:/^\/$/,redirect:()=>"/map/home",view:"challenges"},{test:/^\/index\.html$/,view:"challenges"},{test:/^\/auth\/(.+)$/,view:"auth",params:["authView"]},{test:/^\/demo$/,view:"demo"},{test:/^\/demo\/(.+)$/,view:"challenges",pathParams:{demo:!0},params:["id"]},{test:/^\/challenges$/,view:"challenges"},{test:/^\/map\/(.+)$/,view:"challenges",params:["submap"]},{test:/^\/challenges\/(.+)$/,view:"challenges",params:["id"]},{test:/^\/remix\/(.+)$/,view:"challenges",pathParams:{remix:!0},params:["id"]}].concat([{test:/^\/creations$/,view:"creations"},{test:/^\/creations\/u\/(.+)\/creations\/(.+)$/,view:"creations",pathParams:{subnav:"creations"},params:["username","creationSlug"]},{test:/^\/creations\/u\/(.+)\/(about|creations|medals)$/,view:"creations",params:["username","subnav"]},{test:/^\/creations\/u\/(.+)\/(followers|following)$/,view:"creations",pathParams:{subnav:"follows"},params:["username","follows"]},{test:/^\/creations\/u\/(.+)$/,view:"creations",params:["username"]},{test:/^\/creations\/(.+)$/,view:"creations",params:["creationSlug"]}]).concat([{test:/^\/profile$/,redirect:"/profile/creations"},{test:/^\/profile\/(about|creations|medals)$/,view:"profile",params:["subnav"]},{test:/^\/profile\/(followers|following)$/,view:"profile",pathParams:{subnav:"follows"},params:["follows"]},{test:/^\/profile\/creations\/(.+)$/,view:"profile",pathParams:{subnav:"creations"},params:["creationSlug"]}]);class xe{constructor(e){this._deviceApi=e,this._onDidSelectDevice=new U.EventEmitter,this._onDidUpdateDevice=new U.EventEmitter}get onDidSelectDevice(){return this._onDidSelectDevice.event}get onDidUpdateDevice(){return this._onDidUpdateDevice.event}getConnectedDevice(...e){return M.ConnectedDevices.get(...e)}removeConnectedDevice(...e){return M.ConnectedDevices.remove(...e)}addConnectedDevice(...e){return M.ConnectedDevices.add(...e)}findDevice(e,t=1e4){return P.DeviceActions.startScanning(),this._deviceApi.searchForDevice(e,t).then(e=>{P.DeviceActions.stopScanning(),this.addConnectedDevice(e),P.DeviceActions.addDevice(e)}).catch(e=>{throw P.DeviceActions.stopScanning(),e})}forgetDevice(e){P.DeviceActions.removeByDevice(e),P.DeviceActions.forget()}setDeviceInfo(e,t){P.DeviceActions.setInfo(e,t)}_setSelected(e){this._onDidSelectDevice.fire(e)}_dispatchDeviceUpdate(e){P.DeviceActions.updateDevice(e.deviceId,e),M.ConnectedDevices.update(e.deviceId,e),this._onDidUpdateDevice.fire(e)}getDeviceChannel(e){if(!e)return null;const{availableChannels:t,activeChannel:o}=e;return t.find(e=>e.channel===o)}}class Se{getEditorProfile(){return this._editorProfile}getOutputProfile(){return this._outputProfile}}class Ee{constructor(){this._outputProfiles=[]}getOutputProfiles(){return this._outputProfiles}}class Ce{constructor(e){if(!(e instanceof HTMLElement))throw new Error("Could not instanciate ViewManager: provided container is not a HTMLElement");this._views=new Map,this._container=e}registerView(e){return this._views.set(e.id,e),{dispose:()=>{this._views.delete(e.id)}}}_removeView(){this._currentView&&this._container.removeChild(this._currentView.getRoot())}selectView(e){if(!this._views.has(e))throw new Error(`Could not select view '${e}': view was not registered`);this._cancellationTokenSource&&this._cancellationTokenSource.cancel();const t=this._views.get(e);if(t.createDOM(),t._ready){this._cancellationTokenSource=new U.CancellationTokenSource;const{token:e}=this._cancellationTokenSource;t._ready.then(()=>{e.isCancellationRequested||this._updateView(t)})}else this._updateView(t)}_updateView(e){this._removeView(),this._currentView=e,this._injectView()}_injectView(){this._container.appendChild(this._currentView.getRoot())}getCurrentView(){return this._currentView}dispose(){this._views.forEach(e=>e.dispose()),this._views=null,this._container=null}}class Te extends L.View{constructor(e,t){super(),this._challengesViewManager=e,this._codeManager=t}get id(){return"challenges"}_createDOM(){return new Promise(function(t,o){e(["./ka-view-map.js"],t,o)}).then(()=>{const e=document.createElement("ka-view-map");return e.viewManager=this._challengesViewManager,e.codeManager=this._codeManager,e})}}class De extends L.View{get id(){return"auth"}_createDOM(){return new Promise(function(t,o){e(["./ka-view-auth.js"],t,o)}).then(()=>document.createElement("ka-view-auth"))}}class Pe extends L.View{get id(){return"demo"}_createDOM(){return new Promise(function(t,o){e(["./ka-view-demo.js"],t,o)}).then(()=>document.createElement("ka-view-demo"))}}class Ue extends L.View{get id(){return"profile"}_createDOM(){return new Promise(function(t,o){e(["./ka-view-profile.js"],t,o)}).then(()=>document.createElement("ka-view-profile"))}}class Me extends L.View{get id(){return"creations"}_createDOM(){return new Promise(function(t,o){e(["./ka-view-creations.js"],t,o)}).then(()=>{const e=document.createElement("ka-view-creations");return e.profileLinkPrefix="creations/u",e})}}customElements.get("iron-overlay-backdrop").prototype.prepare=function(){if(this.opened&&!this.parentNode){const e=this.overlayElement,t=e&&e.parentNode?e.parentNode:document.body;o.dom(t).appendChild(this)}},customElements.get("iron-overlay-backdrop").prototype.complete=function(){!this.opened&&this.parentNode&&o.dom(this.parentNode).removeChild(this)},A.IronOverlayBehavior[2].properties._manager.value.trackBackdrop=function(e){const t=this._overlayWithBackdrop();(t||this._backdropElement)&&(this.backdropElement.style.zIndex=this._getZ(t)-1,this.backdropElement.overlayElement=e,this.backdropElement.opened=!!t,this.backdropElement.prepare())},A.IronOverlayBehavior[2].properties._manager.value.addOverlay=function(e){const t=this._overlays.indexOf(e);if(t>=0)return this._bringOverlayAtIndexToFront(t),void this.trackBackdrop(e);let o=this._overlays.length;const a=this._overlays[o-1];let i=Math.max(this._getZ(a),this._minimumZ);const s=this._getZ(e);if(a&&this._shouldBeBehindOverlay(e,a)){this._applyOverlayZ(a,i),o--;const e=this._overlays[o-1];i=Math.max(this._getZ(e),this._minimumZ)}s<=i&&this._applyOverlayZ(e,i),this._overlays.splice(o,0,e),this.trackBackdrop(e)},A.IronOverlayBehavior[2].properties._manager.value.removeOverlay=function(e){const t=this._overlays.indexOf(e);-1!==t&&(this._overlays.splice(t,1),this.trackBackdrop(e))};const Le=u.UserActionsFactory(u.USER_TYPES.AUTHENTICATED);class Ae extends(p.Store.StateReceiver(t.PolymerElement)){static get template(){return t.html`
        <style>
            * {
                -webkit-touch-callout: none;
                -webkit-user-select: none;
                -webkit-tap-highlight-color: rgba(0,0,0,0);
                user-select: none;
            }
            :host {
                display: block;
                display: flex;
                flex-direction: column;
                align-items: center;
            }
            ul {
                display: flex;
                flex-direction: row;
                justify-content: space-around;
                list-style: none;
            }
            li {
                margin: 16px;
            }
            ka-page {
                display: flex;
                flex-direction: column;
                flex: 1;
                align-self: stretch;
            }
            ka-view-user, ka-view-creation {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
            }
            #hidden {
              display: none;
            }
        </style>

        <iron-query-params
                params-string="{{__query}}"
                on-params-object-changed="_onParamsChanged">
            </iron-query-params>
            <iron-location
                on-path-changed="_onPathChanged"
                path="{{__path}}"
                query="{{__query}}"></iron-location>

        <ka-page id="navbar" nav-bar></ka-page>

        <template is="dom-if" if="[[_isViewingUser(username, creationSlug)]]" restamp>
            <ka-view-user link-prefix="[[_computeUserPrefix(view)]]" exit-link="[[_computeUserExitLink(view)]]"></ka-view-user>
        </template>

        <template is="dom-if" if="[[_isViewingCreation(creationSlug)]]" restamp>
            <ka-view-creation profile-link-prefix="[[_computeCreationProfilePrefix(view)]]"
                              exit-link="[[_computeCreationExitLink(view)]]"
                              creations-manager="[[_creationsManager]]"></ka-view-creation>
        </template>

        <div id="hidden"></div>
`}static get is(){return"ka-main"}static get properties(){return{view:{type:String,linkState:"routing.view",observer:"_viewChanged"},devices:{linkState:"devices"},selectedDeviceIndex:{linkState:"selectedDeviceIndex"},device:{linkArray:"devices",linkIndex:"selectedDeviceIndex",observer:"_selectedDeviceChanged"},deviceInfo:{linkState:"deviceInfo"},user:{linkState:"users.authenticated.profile"},userAvatar:{linkState:"users.authenticated.profile.avatar"},config:{linkState:"config"},username:{linkState:"routing.pathParams.username"},creationSlug:{linkState:"routing.pathParams.creationSlug"}}}_computeUserPrefix(e){return"creations"===e?"/creations/u":"/user"}_computeCreationProfilePrefix(e){return"creations"===e?"/creations/u":"profile"===e?"/profile/u":"/creations/u"}_computeCreationExitLink(e){return"profile"===e?"/profile":"/creations"}_computeUserExitLink(){return"/creations"}_isViewingUser(e,t){return!!e&&!t}_isViewingCreation(e){return!!e}get navbar(){return this.shadowRoot.querySelector("ka-page").shadowRoot.querySelector("ka-navbar")}constructor(){super(),this.subscriptions=new U.Disposables,this._setupRouter(),this._setupChallengesViewManager(),this._setupCodeManager(),this._setupCreationsManager()}connectedCallback(){super.connectedCallback(),this._setupDevicesManager(),this._viewManager=new Ce(this.$.navbar),this._viewManager.registerView(new Te(this._challengesViewManager,this._codeManager)),this._viewManager.registerView(new De),this._viewManager.registerView(new Pe),this._viewManager.registerView(new Ue),this._viewManager.registerView(new Me);const e=Object.assign({root:this.options.UI_ROOT,env:this.options.ENV,version:this.options.UI_VERSION},this.options);de.update(e),this._setupStateManager(),e.TELEMETRY_DISABLED||(this._telemetrySessionManager=new U.TelemetrySessionManager(U.AppTelemetry,{sessionDataGetter:this.getSessionData.bind(this)}),this._telemetryQueue=new U.AppReporter(e.TELEMETRY_ENDPOINT,this.config.version),this._telemetryQueue.start(U.AppTelemetry),this._telemetrySessionManager.start(),this.subscriptions.push(this._telemetrySessionManager,this._telemetryQueue)),this.subscriptions.push(U.subscribeDOM(this.$.navbar,"logout",this._logout.bind(this)),U.subscribeDOM(this.$.navbar,"update",this._update.bind(this)),U.subscribeDOM(this,"display-toast",e=>this._displayToast(e))),I.DeviceManagerStore.set(this.manager),M.ConnectedDevices.setManager(this.manager),this.userModel=g.UserFactory(e.API_URL),this.onlineModel=E.OnlineFactory(e.API_URL),this.manager.on("device-update",({data:e})=>{this._devicesManager._dispatchDeviceUpdate(e.value)}),this.updateManager=new ue(this.updater,e),this.subscriptions.push(U.subscribe(this.updateManager.backend,"update-downloaded",this._onUpdateDownloaded.bind(this))),this.addEventListener("check-connection",this.onlineModel.checkConnection),this.toastManager=new fe,F.Code.load(),window.goToChallenge=function(e){w.navigateTo(`/challenges/${e}`)},window.goToDemo=function(e){w.navigateTo(`/demo/${e}`)}}activate(){this._activated=!0,this._router.updatePath(this.__path),this._router.updateParams(this.__query)}_setupRouter(){this._router=new ke,ye.forEach(e=>this._router.registerRoute(e)),this._router.onDidUpdateRoute(e=>{T.RoutingActions.updateRoute(e),window.location.pathname!==e.path&&(window.history.pushState({},"",e.path),window.dispatchEvent(new CustomEvent("location-changed")))},this,this.subscriptions),this._router.onDidUpdateParams(e=>{T.RoutingActions.updateParams(e)},this,this.subscriptions),this.subscriptions.push(this._router)}_setupChallengesViewManager(){this._challengesViewManager=new R.ChallengesViewManager}_setupCodeManager(){this._codeManager=new Se}_setupCreationsManager(){this._creationsManager=new Ee}_setupDevicesManager(){this._devicesManager=new xe(this.manager)}_onPathChanged(e){this._activated&&this._router.updatePath(e.detail.value)}_onParamsChanged(e){this._activated&&this._router.updateParams(e.detail.value)}_setupStateManager(){this._stateManager=new _e(this.options.API_URL,this.options.ENV)}getSessionData(){return{user_id:this.user?this.user.id:null,kit_type:"wand",kit_id:this.deviceInfo?this.deviceInfo.name:null,platform:this.config.OS_PLATFORM,platform_version:this.config.OS_VERSION}}disconnectedCallback(){this.removeEventListener("check-connection",this.onlineModel.checkConnection),super.disconnectedCallback(),this.subscriptions.dispose(),this._refreshSession.dispose()}_displayToast(e){this.toastManager.showToast(e.detail)}_onUpdateDownloaded(e){if("device-update"===this.view||"device-setup"===this.view)return;const t=this.toastManager.showToast({type:"alert",heading:"Time to update your app",text:"A new version of the Kano App is available",actionLabel:"Install"}),o=new U.Disposables,a=U.subscribeDOM(t,"confirm",()=>{o.dispose(),this._update()}),i=U.subscribeDOM(t,"dismiss",()=>{o.dispose(),U.AppTelemetry.trackEvent({name:"update_dismissed",properties:{product:"kit-app",from:this.config.version,to:e.version}}),this.updateManager.userDismissed()});o.push(a,i)}_update(){this.updateManager.quitAndInstall()}_logout(){U.AppTelemetry.trackEvent({name:"logged_out",properties:{id:this.user.id}}),Le.logout(),this._telemetrySessionManager.refresh(),this.userModel.logout()}authNavigation(e){e?w.navigateTo("/auth/login"):w.navigateTo("/auth/signup")}_selectedDeviceChanged(){this._devicesManager._setSelected(this.device)}_viewChanged(){this.updateView(),U.AppTelemetry.trackPageView({page:location.pathname})}updateView(){this._viewManager.selectView(this.view)}}window.customElements.define(Ae.is,Ae);window.customElements.define("ka-profile-selection",class extends t.PolymerElement{static get template(){return t.html`<style>:host{display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;font-family:var(--font-body);background:#fff}.wrapper{width:252px}.header img{width:40px}.header p{font-size:19.5px;font-weight:700;color:#414a51;margin:10px 0 11px}.card{border:1px solid #000;margin-top:8px;height:60px;transition:border-color .15s ease}.card:hover{cursor:pointer;border-color:var(--ka-profile-selection-card-border-hover,#ff6900)}.card,.card img{border-radius:8px}.footer{margin-top:4px}.footer p{margin-bottom:0}.footer a,.footer p{color:#9fa4a8;text-decoration:none;font-size:13.5px;line-height:1.55}</style><div class=wrapper><div class=header><img src$=[[icon]]><p>Which kit are you using today?</p></div><div class=content><template is=dom-repeat items=[[profiles]]><div class=card role=button on-click=_profileClicked><div>[[item.label]]</div><img src$=[[item.icon]]></div></template></div><div class=footer><p>Looking for the Motion Sensor or Pixel Kit?<br>Download at<a href=https://kano.me/app target=_blank>kano.me/app</a></p></div></div>`}static get properties(){return{profiles:{type:Array},icon:{type:String}}}_profileClicked(e){const t=e.model.get("index");this.dispatchEvent(new CustomEvent("selected",{detail:t}))}})});