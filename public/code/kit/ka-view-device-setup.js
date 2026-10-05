define(["./chunk-fdc6718c.js","./chunk-19bce21e.js","./chunk-8b3412b4.js","./chunk-654f977c.js","./chunk-bbbf26f6.js","./chunk-86ecdd4d.js","./chunk-dce7f082.js","./chunk-93a2d04f.js","./chunk-7658960f.js","./chunk-92065960.js","./chunk-8423fd0a.js","./chunk-c7742851.js","./chunk-2567a2a0.js","./chunk-b6b1b77d.js","./chunk-f7db92dd.js","./chunk-d7e151a4.js","./chunk-73cb4c23.js","./chunk-83c85edb.js","./chunk-e8284588.js","./chunk-9968f662.js","./chunk-90a58e12.js","./chunk-30130fed.js"],function(e,t,i,s,n,o,a,c,r,d,h,l,u,p,g,v,f,b,m,k,x,w){"use strict";class y extends(n.Store.StateReceiver(s.mixinBehaviors([t.PaperDialogBehavior],e.PolymerElement))){static get template(){return e.html`
            <style>
                :host {
                    width: 375px;
                    height: 160px;
                    font-family: var(--font-body);
                    background: #FFF;
                    border-radius: 8px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    padding: 15px;
                }
                :host *:focus {
                    outline: none;
                }
                .info {
                    width: 100%;
                    font-family: var(--font-body);
                    position: relative;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-evenly;
                    align-items: center;
                    flex: 1;
                }
                button {
                    letter-spacing: 1px;
                    min-width: 98px;
                    height: 32px;
                    font-size: 12px;
                    color: #FFF;
                    text-transform: uppercase;
                    border: none;
                    border-radius: 16px;
                    cursor: pointer;
                    font-family: var(--font-body);
                    background-color: var(--color-kano-orange);
                }
                button:hover {
                    background-color: var(--color-flame);
                }
                button[disabled] {
                    cursor: default;
                }
                .description {
                    font-size: 18px;
                    color: #575756;
                    margin-top: 6px;
                    margin-bottom: 0;
                    text-align: center;
                }
                button,
                .description {
                    font-weight: bold;
                }
            </style>
            <div class="info">
                <p class="description">This app uses Bluetooth to connect to your coding wand. Some devices ask for 'location' permission to access Bluetooth.</p>
                <div class="buttons">
                    <button dialog-confirm>OK</button>
                </div>
            </div>
        `}static get is(){return"ka-device-setup-dialog"}static get properties(){return{withBackdrop:{type:Boolean,value:!0},modal:{type:Boolean,value:!1}}}}window.customElements.define(y.is,y);class D extends(n.Store.StateReceiver(e.PolymerElement)){static get template(){return e.html`<style>:host{position:absolute;width:100%;height:100%;display:block;background-color:#f9f0e8;font-family:var(--font-body)}</style><ka-view-device-tool steps=[[steps]] step-index=[[stepIndex]] progress-active=[[progressActive]] on-button-callback=buttonCallback exit=[[exit]] on-button-exit=buttonExit no-button=[[scanning]] blue-light-setting=[[blueLightSetting]] green-light-setting=[[greenLightSetting]]></ka-view-device-tool><ka-device-setup-dialog id=setup-dialog on-iron-overlay-closed=_confirmDialog></ka-device-setup-dialog>`}static get is(){return"ka-view-device-setup"}static get properties(){return{scanning:{linkState:"scanning"},deviceInfo:{linkState:"deviceInfo"},config:{linkState:"config"},currentMap:{linkState:"currentMap"},user:{linkState:"users.authenticated.profile"}}}constructor(){super(),this._onDeviceUpdate=this._onDeviceUpdate.bind(this),this.set("stepIndex",0),this.progressActive=!1,this.exit="Exit"}buttonCallback(e){switch(e.detail){case"scan":this.scan();break;case"done":this.done()}}_onDeviceUpdate({data:e}){e.deviceId===this.device.deviceId&&(this.device=e.value)}connectedCallback(){super.connectedCallback(),this.onboardingModel=h.OnboardingFactory(this.config.ENV),this.dialogConfirm=!1,setTimeout(()=>{d.RoutingActions.toggleNavbar(!0)},0);const e=this._onboardingCompleted()?"Let's Go!":"Diagon Alley";this.steps=[{text:'<span class="bold">Your coding wand uses Bluetooth&reg;</span> to connect. Make sure your device\'s Bluetooth is turned on.',hasButton:!0,hasProgress:!1,button:{text:"Next",run:"scan"}},{text:"Hold your coding wand close to your tablet or computer, and<br>press its button once. Can you see the blue light flashing?",hasButton:!1,hasProgress:!0},{text:"Found your device, checking for important updates...",hasButton:!1,hasProgress:!0},{text:"Found it!",hasButton:!0,hasProgress:!1,button:{text:e,run:"done"}}]}disconnectedCallback(){super.disconnectedCallback(),this.set("stepIndex",0),this.progressActive=!1,this.blueLightSetting="hide",this.greenLightSetting="hide"}scan(){v.fromString(this.config.OS_PLATFORM)!==v.platforms.ANDROID||this.dialogConfirm?(this.set("stepIndex",1),this.progressActive=!0,this.blueLightSetting="slow-flash",h.DeviceActions.startScanning(),this.device=null,this.manager=l.DeviceManagerStore.get(),this.manager.removeListener("device-update",this._onDeviceUpdate),this._progressWatcher=new g.ProgressWatcher(25e3),this._progressWatcher.onDidGetStuck(()=>{this.set("stepIndex",0),this.progressActive=!1,this.blueLightSetting="hide",this.greenLightSetting="hide",h.DeviceActions.stopScanning(),c.AppTelemetry.trackEvent({name:"timed_out_setup"}),this.device&&(this.wand=u.ConnectedDevices.get(this.device.deviceId),this.wand.dispose(),this.device=null)}),this._progressWatcher.watch(),this._progressWatcher.update(),this.manager.searchForClosestDevice("wand",5e3).then(e=>(this.device=e,this.manager.on("device-update",this._onDeviceUpdate),u.ConnectedDevices.add(this.device),this.wand=u.ConnectedDevices.get(this.device.deviceId),this.wand.getAdvertisementName().then(e=>this.wand.vibrate(1).then(()=>{this._progressWatcher.dispose(),this.set("stepIndex",2),this.blueLightSetting="no-flash",this.greenLightSetting="slow-flash"}).then(()=>this.wand.setLed(2,65280)).then(()=>{h.DeviceActions.setName(e),h.DeviceActions.stopScanning(),this._saveDevice()})).then(()=>this.wand.getSoftwareVersion().then(e=>{h.DeviceActions.setSoftwareVersion(e);const{name:t}=this.deviceInfo,i=this.onboardingModel.setPreferedDevice("wand",t,e);h.OnboardingActions.update("wand",i),this.updater.setFeedURL(`${this.config.UPDATER.WAND_FEED_URL}&v=${e}`);const s=new c.Disposables;this.updater.onDidDownloadUpdate(()=>{if(s.dispose(),this.updater.setFrom(e),p.isBadWandVersion(this.config,e))return this._udpateWand();this.dispatchEvent(new CustomEvent("update-available")),this.set("stepIndex",3),this.progressActive=!1},this,s),this.updater.onDidFoundNoUpdate(()=>{s.dispose(),this.set("stepIndex",3),this.progressActive=!1},this,s),this.updater.checkForUpdates()})))).catch(e=>{throw this._progressWatcher.dispose(),this.set("stepIndex",0),this.blueLightSetting="hide",this.progressActive=!1,h.DeviceActions.stopScanning(),c.AppTelemetry.trackException({exception:e}),e})):this.$["setup-dialog"].open()}_onboardingCompleted(){if(this.skipOnboarding)return!0;if(!this.user)return!1;const e=localStorage.getItem(`gamification-state-${this.user.id}`);return e&&JSON.parse(e)[0].state.completed.length>=1}_udpateWand(){this.dispatchEvent(new CustomEvent("update-wand"))}_saveDevice(){h.DeviceActions.addDevice(this.device);const{name:e}=this.deviceInfo;c.AppTelemetry.trackEvent({name:"kit_registered",properties:{type:"wand",id:e}})}done(){this.wand&&this.wand.setLed(0,0);let e="diagon-alley";this._onboardingCompleted()&&(e=this.currentMap),r.navigateTo(`/map/${e}`)}buttonExit(){return this.deviceInfo&&this.deviceInfo.name?this.done():(this.dispatchEvent(new CustomEvent("cancel-setup")),r.navigateTo("/"))}_confirmDialog(e){e.detail.confirmed&&!e.detail.canceled&&(this.dialogConfirm=!0,this.scan())}}customElements.define(D.is,D)});