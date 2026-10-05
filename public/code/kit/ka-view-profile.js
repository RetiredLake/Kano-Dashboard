define(["./chunk-fdc6718c.js","./chunk-5be10de5.js","./chunk-8b3412b4.js","./chunk-654f977c.js","./chunk-f8a285e9.js","./chunk-e86f6c80.js","./chunk-75c10612.js","./chunk-e1d3b61d.js","./chunk-a86cbd6e.js","./chunk-bf2c299c.js","./chunk-be7f2d6a.js","./chunk-87c098bb.js","./chunk-d323c1b3.js","./chunk-6aae4cc8.js","./chunk-4f6b39b4.js","./chunk-bbbf26f6.js","./chunk-9d10fca3.js","./chunk-92065960.js","./chunk-9ed3bf9d.js","./chunk-39b53efd.js","./chunk-20f407ed.js","./chunk-7658960f.js","./chunk-30c1c965.js","./chunk-e8284588.js","./chunk-33d51465.js","./chunk-5472545b.js","./chunk-9968f662.js","./chunk-42d2b7ff.js","./chunk-83c85edb.js","./chunk-90a58e12.js","./chunk-86ecdd4d.js","./chunk-e8d4628a.js","./chunk-ede86d1c.js","./chunk-6da1ebd5.js","./chunk-4d3465f9.js","./chunk-dce7f082.js"],function(t,e,a,s,i,o,r,n,l,d,c,h,p,g,u,b,m,f,v,k,x,y,w,E,S,C,_,L,A,P,T,D,B,I,j,U){"use strict";var N=window.PIXI;const O=new N.loaders.Loader;class M{constructor(t){this.urls=t,this.binaryOptions={loadType:N.loaders.Resource.LOAD_TYPE.XHR,xhrType:N.loaders.Resource.XHR_RESPONSE_TYPE.BUFFER},this.resources={}}setLoaders(){M._addResource(this.urls.spritebin,this.urls.spritebin,this.binaryOptions),M._addResource(this.urls.spritedata,this.urls.spritedata),M._addResource(this.urls.spritepng,this.urls.spritepng),M._addResource(this.urls.specData,this.urls.specData)}static _addResource(t,...e){t in O.resources||O.add(t,...e)}static reset(){return O.reset()}init(){return new Promise((t,e)=>{let a;this.setLoaders();const s=(e,s)=>{O.removeListener("error",a),this.resources={bin:s[this.urls.spritebin],json:s[this.urls.spritedata],tex:s[this.urls.spritepng],spec:s[this.urls.specData]},t(this.resources)};a=(t=>{O.removeListener("complete",s),e(t)}),O.once("complete",s),O.once("error",a),O.load()})}}const F=t=>(class extends t{connectedCallback(){super.connectedCallback(),this.toolboxEl=this.shadowRoot.querySelector("kwc-avatar-toolbox"),this.stageEl=this.shadowRoot.querySelector("kwc-avatar-stage"),this.toolboxEl.rootUrl=this.rootUrl}loadAvatar(t){this.avatarLoader=new M(t)}avatarSetSlot(t){this.avatarChanged=!0;const{key:e,id:a}=t.detail.slot,s=a||"";void 0!==this.avatarData.slots[e]&&(this.stageEl.slotChange(t),this.avatarData.slots[e]=s),this.stageEl.hiddenBoneList.length&&(this.avatarData.hiddenBones=this.stageEl.hiddenBoneList)}avatarSetColorEls(t){this.stageEl.changeColorEls(t),this.avatarChanged=!0,this.avatarData.colorEls[t.detail.el]=t.detail.item}avatarImage(t){const{images:e}=t.detail;this.avatarData.images=e}avatarAssetListLoaded(t){this.toolboxEl.assetList=t.detail}updateRoot(t){this.rootUrl=t}}),R=[];class $ extends N.Container{constructor(t){super(),this.options=Object.assign({},t),this.armature=this.options.armature,this.assetList=[],this.specData={},this.changingSlot={},this.idleAnimation="",this.initSlots=[],this.hiddenBones=new Map,this.setInitialSlots=this.setInitialSlots.bind(this),this.setAddSlotsInProgress=!1}_loadDragonBones(t){-1===R.indexOf("bin")&&(e.PixiFactory.factory.parseDragonBonesData(t.bin.data),R.push("bin")),-1===R.indexOf("json")&&-1===R.indexOf("tex")&&(e.PixiFactory.factory.parseTextureAtlasData(t.json.data,t.tex.texture),R.push("json"),R.push("tex"))}load(t){const{factory:a}=e.PixiFactory;this.specData=t.spec,this.avatar=t.avatar,this.gamification=t.gamification,this._loadDragonBones(t);const s=this.specData.data;this.assetList=[],this.colorEls=s.colorEls,this.idleAnimation=s.avatar.idle,this.armatureDisplay=a.buildArmatureDisplay(this.armature),this.armature=this.armatureDisplay.armature;const{displays:i}=this.armature.armatureData.defaultSkin,o=new Map;Object.keys(i).forEach(t=>{i[t].length>1&&o.set(t,i[t])}),Array.from(o.keys()).forEach(t=>{const e={bone:"",boneCustomName:"",slots:[]};e.bone=this.armature.getBone(t);const a=e.bone.boneData.name,s=this.armature.getSlot(t),i=void 0!==this.avatar.slots[t]&&this.avatar.slots[t].length>0?this.avatar.slots[t]:"",{customisedElements:o}=this.specData.data,r=Object.keys(o).indexOf(a)>=0?o[a]:[];if(e.boneCustomName=r.customName||$.resolveName(e.bone.name),r.emptySlot){let a=new N.Sprite;a=Object.assign(a,{interactive:!0,buttonMode:!0,width:300,height:300,hashCode:0,name:"None",key:t,slot:s,index:-1,newAsset:!1,availableAsset:!0,animationData:{}}),e.slots.push(a),this.setSlot(a)}this.armature.armatureData.getSkin("default").getDisplays(t).forEach((a,o)=>{const{unlocked:n,newlyUnlocked:l}=this.gamification,d=n.indexOf(a.name)>=0,c=l.indexOf(a.name)>=0;let h={},p=[],g=!1,u=[];const b=$.resolveName(a.name);r.slots&&r.slots.length&&r.slots.forEach(t=>{t.name&&t.name===a.name&&(h=t.animation.animations.length?t.animation:{},p=t.bonesToHide&&t.bonesToHide.length?t.bonesToHide:[],g=t.image||!1,u=t.set||[])});let m=new N.Sprite(a.texture.renderTexture);m=Object.assign(m,{interactive:!0,buttonMode:!0,width:300,height:300,hashCode:a.hashCode,name:b,key:t,id:a.name,slot:s,index:o,customImage:g,set:u,newAsset:c,availableAsset:d,animationData:h,bonesToHide:p}),i.length&&i===a.name&&this.gatherInitSlots(m),e.slots.push(m)}),this.assetList.push(e)}),this.listedAssets=this.listAssets(),this.armatureDisplay.animation.gotoAndPlayByFrame(this.idleAnimation,0),this.addChild(this.armatureDisplay),setTimeout(()=>{this.setInitialSlots(this.initSlots),this.colorElsInit(),this.bonesVisibility(this.avatar.hiddenBones||[],!0),this.resetSlots()},250)}isChildOfBone(t,e){return function t(e,a){return!(!e||!e.parent)&&(e===a||t(e.parent,a))}(e,t)}toggleBone(t,e){const a=this.armature.armatureData.getBone(t),{slots:s}=this.armature.armatureData;Object.keys(s).forEach(t=>{const i=s[t];if(this.isChildOfBone(a,i)){const t=this.armature.getSlot(i.name).getDisplay();if(null!==t){if(!(this.hiddenBones.get(i.name)>0))return void(t.visible=e);t.visible=!e}}else{const t=this.armature.getSlot(i.name).getDisplay();t&&(t.visible=!e)}})}colorElsInit(){void 0!==this.colorEls&&(Object.keys(this.colorEls).forEach(t=>{const e=void 0!==this.avatar.colorEls[t]?this.avatar.colorEls[t]:2;this.colorEls[t].selected=Object.assign({},this.findColoredEls(t,e))}),this.setColoredEls())}changeColoredEls(t,e){const a=this.findColoredEls(t,e);this.colorEls[t].selected=Object.assign({},a),this.setColoredEls()}findColoredEls(t,e){return this.colorEls[t].list.find(t=>t.uid===e)}setColoredEls(t){if(void 0===this.colorEls)return;let e=[];(e=void 0!==t&&t.isArray?t:Object.keys(this.colorEls)).forEach(t=>{const e=this.colorEls[t];"number"==typeof e.selected&&(e.selected=Object.assign({},this.findColoredEls(t,e.selected)));let{hue:a,brightness:s}=e.selected;const{bonesToColor:i}=e,o=(a=this.colorToTint(a))+(s=this.colorToTint(s));i&&i.forEach(t=>{this.armature.getSlot(t).getDisplay().tint=o})})}colorToTint(t){return parseInt(t.replace("#","").slice(0,6),16)}resetSlots(){this.armature.getSlots().forEach(t=>{let e=this.hiddenBones.get(t.name);e=void 0!==e&&e>0,null!==t.getDisplay()&&(t.getDisplay().visible=!e)})}bonesVisibility(t,e){t.forEach(t=>{let a=this.hiddenBones.get(t)||0;a=e?1:0,this.hiddenBones.set(t,a)})}setSlot(t){const e=this.armature.getSlot(t.key);this.hiddenBones.set(e.name,0);const a=this.getSpriteFromIndex(e.name,e.displayIndex),s=a&&a.bonesToHide?a.bonesToHide:[];this.bonesVisibility(s,!1);const{key:i,index:o,animationData:r}=t,n=t.bonesToHide||[];this.bonesVisibility(n,!0),this.resetSlots(),this.changingSlot={slot:e,index:o,key:i,animations:[],animationIndex:0},this.animationData=r,this.setAdditionalSlots(t.set),this.animationData=t.animationData;const l=r.delay?r.delay:0;r.animations&&!this.setAddSlotsInProgress?(this.changingSlot.animations=this.changingSlot.animations.concat(r.animations),this.playAnimation(1)):setTimeout(()=>{e.displayIndex=t.index},l)}gatherInitSlots(t){this.initSlots.push(t)}setInitialSlots(t){t.forEach(t=>{this.armature.getSlot(t.key).displayIndex=t.index,this.setAdditionalSlots(t.set)})}setAdditionalSlots(t){void 0!==t&&0!==t.length&&(this.setAddSlotsInProgress=!0,t.forEach(t=>{const e=this.getSprite(t);this.setSlot(e),this.emit("avatar-set-slot",e)}),this.resetSlots(),this.setAddSlotsInProgress=!1)}playAnimation(t){this.armatureDisplay.addDBEventListener(e.EventObject.LOOP_COMPLETE,this.animationFinished,this),this.armatureDisplay.animation.fadeIn(this.changingSlot.animations[this.changingSlot.animationIndex],.2,t);const a=this.armature.getSlot(this.changingSlot.key);this.changingSlot.animationIndex===this.changingSlot.animations.length-1&&(a.displayIndex=this.changingSlot.index),this.changingSlot.animationIndex+=1}animationFinished(){this.armatureDisplay.removeDBEventListener(e.EventObject.LOOP_COMPLETE),this.changingSlot&&this.changingSlot.animations&&this.changingSlot.animations[this.changingSlot.animationIndex]?this.playAnimation(1):(this.changingSlot={},this.armature.animation.fadeIn(this.idleAnimation,.2,0))}listAssets(){const{customisedElements:t}=this.specData.data,e=Object.keys(t);return this.assetList.sort((t,a)=>e.indexOf(t.bone.name)-e.indexOf(a.bone.name)),this.assetList.forEach(e=>{if(t[e.bone.name]){const a=e.slots.length,s=e.slots.filter(t=>t.availableAsset),i=e.slots.find(t=>"None"===t.name);i&&s.splice(s.indexOf(i),1);const o=a-s.length,r=t[e.bone.name].slots.map(t=>t.name);s.sort((t,e)=>r.indexOf(t.id)-r.indexOf(e.id)),i&&s.splice(0,0,i),e.slots=s,e.lockedSlots=o}}),this.assetList}getSprite(t){const e=this.findBone(t.bone);return $.findSprite(e.slots,t.slot)}getSpriteFromIndex(t,e){const a=this.findBone(t);return a&&a.slots?a.slots.find(t=>t.index===e):null}findBone(t){return this.assetList.find(e=>e.bone.name===t)}static findSprite(t,e){return t.find(t=>t.id===e)}get hiddenBoneList(){return Array.from(this.hiddenBones.keys()).filter(t=>this.hiddenBones.get(t)>0)}static resolveName(t){return t.replace(/_/g," ").replace(/\b\w/g,t=>t.toUpperCase())}}class Y extends t.PolymerElement{static get is(){return"kwc-avatar-stage"}static get properties(){return{resources:{type:Object,observer:"onResourcesChanged"},listedAssets:{type:Array,observer:"listedAssetsChanged"}}}static get template(){return t.html`
            <style>
                :host {
                    display: block;
                    position: relative;
                }

                :host:before {
                    content: '';
                    background-color: #535e6b;
                    width: 100%;
                    height: calc(40px + 15%);
                    position: absolute;
                    bottom: -40px;
                    left: 0;
                }
            
                canvas {
                    max-width: 100%;
                }
            
                #avatarViewer {
                    text-align: center;
                    height: 100%;
                }
            
                #avatarViewer canvas {
                    margin: 0 auto;
                    height: 95%;
                    position: relative;
                }
            </style>
            <div id="avatarViewer"></div>
        `}setCreator(t,e){this.renderer.position.x=t,this.renderer.position.y=e,this.app.stage.addChild(this.renderer)}onResourcesChanged(){if(!this.resources)return;const{name:t,size:e,position:a}=this.resources.spec.data.avatarDisplay;this.renderer=new $({armature:t}),this.renderer.load(this.resources),this.listedAssets=this.renderer.listedAssets,this.app=new PIXI.Application(e.x,e.y,{transparent:!0}),this.rendererPosition={x:a.x,y:a.y},this.renderer.on("avatar-set-slot",t=>{this.setSlot(t)}),this.$.avatarViewer.appendChild(this.app.view),this.setCreator(this.rendererPosition.x,this.rendererPosition.y)}setSlot(t){this.dispatchEvent(new CustomEvent("avatar-set-slot",{detail:{slot:t}}))}slotChange(t){this.renderer.setSlot(t.detail.slot)}changeColorEls(t){this.renderer.changeColoredEls(t.detail.el,t.detail.item)}captureView(){return new Promise(t=>{this.capturedImages={};const e=this.app.renderer.plugins.extract.canvas(this.app.stage);this.renderer.toggleBone("neck",!0);const a=this.app.renderer.plugins.extract.canvas(this.app.stage);this.renderer.resetSlots(),e.toBlob(e=>{this.capturedImages.body=e,a.toBlob(e=>{this.capturedImages.head=e,this.dispatchEvent(new CustomEvent("imagecaptured",{detail:{images:this.capturedImages}})),t(this.capturedImages)},"image/png")},"image/png")})}listedAssetsChanged(){this.dispatchEvent(new CustomEvent("asset-list-loaded",{detail:this.listedAssets}))}get hiddenBoneList(){return this.renderer.hiddenBoneList}}customElements.define(Y.is,Y);class z extends t.PolymerElement{static get is(){return"kwc-avatar-asset"}static get properties(){return{slot:{type:Object},rootUrl:{type:String}}}static get template(){return t.html`
    <style>
        :host {
            display: inline-block;
            position: relative;
        }
        .new-tag {
            display: none;
            position: absolute;
            top: 20px;
            left: -8px;
            background-color: orange;
            color: white;
            padding: 5px;
            margin: 0;
            border-radius: 3px 3px 3px 0;
        }
        .new-tag p {
            font-size: 12px;
            margin: 0;
            padding: 0;
            display: block;
            font-family: var(--font-body);
            font-weight: 600;
        }
        .new-tag:before {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            transform: translateY(100%);
            width: 8px;
            height: 8px;
            box-sizing: border-box;
            border: 4px solid darkorange;
            border-left-color: transparent;
            border-bottom-color: transparent;
        }
        .new .new-tag {
            display: block;
        }
        img {
            max-width: 250px;
            margin: 5px;
            padding: 15px;
            border: 2px solid black;
            transition: all 0.3s ease-in-out;
        } 
        .avatar-asset__image {
            background-color: var(--avatar-asset-background, #f4f5f7);
            border: 4px solid var(--avatar-asset-border, transparent);
            border-radius: 6px;
            transition: all 0.3s ease-in-out;
            position: relative;
            z-index: 0;
            padding: 10px;
        }
        .avatar-asset__image:before,
        .avatar-asset__image:after {
            content: '';
            position: absolute;
            bottom: 10px;
            left: 50%;
            transform: translateX(-50%);
            border: 2px solid white;
            opacity: var(--avatar-asset-selected-show, 0);
            transition: all 0.3s ease-in-out;
            z-index: 1;
        }
        .avatar-asset__image:after {
            width: 10px;
            height: 5px;
            border-top: none;
            border-right: none;
            transform: translate(-50%,-10px) rotate(-45deg);
        }
        .avatar-asset__image:before {
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background-color: #89c33f;
        }
    </style>
        <div class$="[[_getNew(slot.newAsset)]]">
            <div class="avatar-asset__image">
                <iron-image 
                style$="width:[[ assetWidth ]]px; height:[[ assetWidth ]]px;"
                sizing="contain"
                preload
                fade
                src="[[ _getImageUrl() ]]" 
                alt="[[ _getName(slot) ]]"
                ></iron-image>
            </div>
            <div class="new-tag">
                <p>
                    NEW
                </p>
            </div>
        </div>
        `}_getImageUrl(){return this.slot?"None"===this.slot.name?`${this.rootUrl}assets/avatar/assets/default/none.png`:`${this.rootUrl}assets/avatar/assets/${this.slot.id}.png`:`${this.rootUrl}assets/avatar/assets/default/locked.png`}_getName(t){return t?t.name:"locked"}_getNew(t){return t?"new":""}}customElements.define(z.is,z);class H extends t.PolymerElement{static get is(){return"kwc-avatar-toolbox"}static get properties(){return{assetList:{type:Array,value:[],observer:"assetListLoaded"},assetWidth:{type:Number,value:110},assetPadding:{type:Number,value:16},resources:{type:Object,observer:"onResourcesChanged"}}}static get template(){return t.html`
            <style>
                :host {
                    display: block;
                    --paper-tabs-container: {
                        display: flex;
                        flex-direction: row;
                    }
                }
                .skin-swatch {
                    padding: 8px 16px;
                    background-color: var(--avatar-asset-background, #f4f5f7);
                    border-radius: 6px;
                    display: inline-block;
                    margin: 0 auto;
                }
                .skin-swatch p {
                    font-size: 12px;
                    color: #9ca4ab;
                    display: inline-block;
                    margin: 0;
                    margin-right: 16px;
                    transform: translateY(-8px);
                    padding: 0;
                }
                .skin-swatch__item {
                    width: 32px;
                    height: 32px;
                    border: 2px solid var(--avatar-creator-background-grey,#eaebed);
                    border-radius: 6px;
                    display: inline-block;
                    box-sizing: border-box;
                    transition: all 0.3s ease-in-out;
                    cursor: pointer;
                    outline: none;
                }
                .skin-swatch__item:focus {
                    outline: none;
                }
                .asset-viewer {
                    background-color: var(--avatar-creator-background-grey, #eaebed);
                    padding: 24px 36px;
                    border-radius: 9px;
                }
                #avatarViewer {
                    text-align: center
                }
                #avatarViewer canvas {
                    margin: 0 auto;
                }
                iron-selector.asset-tabs {
                    min-height: 160px;
                    display: block;
                }
                paper-icon-button {
                    display: none;
                }
                #scrollableTabs {
                    text-align: center;
                }
                #scrollableTabs #tabsContent {
                    position: static;
                }
                kwc-avatar-assets {
                    width: 160px;
                    height: 160px;
                }
                .asset-container {
                    position: relative;
                    padding: 0;
                    margin: 0;
                }
                button.arrow {
                    position: absolute;
                    top: 0;
                    bottom: 20px;
                    width: 40px;
                    background: transparent;
                    outline: none;
                    border: none;
                    z-index: 1;
                    cursor: pointer;
                }
                button.arrow:after {
                    content: '';
                    z-index: 1;
                    position: absolute;
                    top: 0;
                    bottom: 0;
                    left: 0;
                    width: 100%;
                }
                button.arrow iron-icon {
                    transform-origin: center;
                }
                button.arrow.arrow-prev {
                    left: 0;
                    transform: translateX(-100%);
                }
                button.arrow.arrow-disabled {
                    opacity: 0.3;
                    cursor: default;
                }
                button.arrow.arrow-next {
                    right: 0;
                    transform: translateX(100%);
                }
                button.arrow.arrow-prev iron-icon {
                    transform: rotate(90deg);
                }
                button.arrow.arrow-next iron-icon {
                    transform: rotate(270deg);
                }
            </style>
            <custom-style>
                <style>
                    .asset-picker {
                        background-color: var(--avatar-creator-background-medium, #404955);
                        padding: 0 15px 15px;
                        text-align: center;
                        position: relative;
                    }
                    paper-tabs.category-tabs paper-tab {
                        font-family: var(--font-body);
                        background-color: var(--avatar-creator-background-dark, #0c74c3);
                        border-radius: 6px 6px 0 0;
                        margin: 0 1px;
                        color: rgba(255,255,255,0.4);
                        transition: all 0.3s ease-in-out;
                        width: 100px;
                        @apply --kwc-avatar-toolbox-tab;
                    }
                    paper-tabs.category-tabs paper-tab:hover {
                        color: rgba(255,255,255,0.8);
                    }
                    paper-tabs.category-tabs paper-tab.iron-selected {
                        background-color: var(--avatar-creator-background-grey, #eaebed);
                        color: black;
                        @apply --kwc-avatar-toolbox-tab-selected;
                    }
                    paper-tabs.bone-tabs {
                        display: flex;
                        flex-direction: row;
                        justify-content: center;
                    }
                    paper-tabs.bone-tabs paper-tab {
                        font-family: var(--font-body);
                        font-weight: bold;
                        color: #9FA4A8;
                        border-radius: 16px;
                        height: 32px;
                        margin: 0 8px;
                    }
                    paper-tabs.bone-tabs #tabsContainer {
                        flex-start: center;
                    }
                    paper-tabs.bone-tabs paper-tab.iron-selected {
                        background-color: #9ca4ab;
                        color: white;
                        padding: 0 16px;
                    }
                    iron-selector.asset-tabs a img {
                        display: block;
                    }
                    iron-selector.skin-swatch  {
                        border: 2px solid var(--avatar-creator-background-grey,#eaebed);
                        transition: all 0.3s ease-in-out;
                        margin-top: 20px;
                    }
                    iron-selector.skin-swatch .iron-selected {
                        border: 2px solid white;
                    }
                    iron-selector.asset-tabs {
                        text-align: left;
                        transform: translateX(0);
                        transition: transform 0.4s ease-in-out
                    }
                    iron-selector.asset-tabs a {
                        max-width: 200px;
                    }
                    iron-selector.asset-tabs a.active-asset {
                        cursor: pointer;
                    }
                    iron-selector.asset-tabs a.iron-selected {
                        --avatar-asset-selected-show: 1;
                        --avatar-asset-background: #eaebed;
                        --avatar-asset-border: white;
                    }
                    --profile-tabs: {
                        display: flex;
                        flex-direction: row;
                        justify-content: center;
                    }
                    --paper-tabs-container: {
                        @apply --profile-tabs;
                    }
                    --paper-tabs-content: {
                        @apply --profile-tabs;
                    }
                    paper-tabs.category-tabs,
                    paper-tabs.bone-tabs {
                        --paper-tabs-container_-_justify-content: center;
                    }
                    paper-tab#undefined {
                        display: none;
                    }
                    #categoryTabs {
                        height: 40px;
                    }
                    iron-pages#assetListPages {
                        overflow-x: hidden;
                    }
                </style>
            </custom-style>

            <div class="asset-picker">
                <paper-tabs
                    id="categoryTabs"
                    class="category-tabs"
                    attr-for-selected="id"
                    selected="{{categoryId}}"
                    on-iron-select="categoryTabChanged"
                    noink
                    scrollable
                    no-bar>
                    <template is="dom-repeat" items="[[categories]]">
                        <paper-tab id="[[item.id]]">
                            [[item.name]]
                        </paper-tab>
                    </template>
                </paper-tabs>
                <div class="asset-viewer">
                    <template is="dom-if" if="[[availableBonesLen]]">
                        <paper-tabs
                            id="boneTabs"
                            class="bone-tabs"
                            attr-for-selected="id"
                            selected="{{boneName}}"
                            noink
                            scrollable
                            no-bar
                            on-iron-select="assetViewChanged">
                            <template is="dom-repeat" items="[[availableBones]]" >
                                <paper-tab id="[[item.bone.boneData.name]]">
                                    [[item.boneCustomName]]
                                </paper-tab>
                            </template>
                        </paper-tabs>
                    </template>
                    <iron-pages attr-for-selected="id" selected="[[boneName]]">
                        <template is="dom-repeat" items="[[assetList]]">
                            <div id="[[item.bone.boneData.name]]">
                            </div>
                        </template>
                    </iron-pages>
                    <div class="asset-container">
                        <button 
                            class$="arrow arrow-next [[_checkArrow(rightArrow)]]"
                            onclick="[[_arrowClicked]]">
                            <iron-icon icon="kwc-ui-icons:arrow"></iron-icon>
                        </button>
                        <button 
                            class$="arrow arrow-prev [[_checkArrow(leftArrow)]]"
                            onclick="[[_arrowClicked]]">
                            <iron-icon icon="kwc-ui-icons:arrow"></iron-icon>
                        </button>
                        <iron-pages
                            id="assetListPages"
                            attr-for-selected="id"
                            on-iron-select="_assetListSelected"
                            on-iron-items-changed="_assetListChanged"
                            selected="[[boneName]]">
                            <template is="dom-repeat" items="[[assetList]]">
                                <iron-selector
                                    class="asset-tabs"
                                    id="[[item.bone.name]]"
                                    selectable="a.active-asset"
                                    selected="[[item.selectedIndex]]"
                                    attr-for-selected="index"
                                    style$="width: [[_getToolboxWidth(item.slots.length)]]px">
                                    <template is="dom-repeat" items="[[_renderAllSlots(item)]]" as="slot" index-as="slotIndex" delay>
                                        <a
                                            class$="[[_computeActiveAsset(slot)]]"
                                            index="[[slotIndex]]">
                                            <kwc-avatar-asset
                                                slot="[[slot]]"
                                                asset-width="[[assetWidth]]"
                                                root-url="[[rootUrl]]"
                                                on-click="setSlot">
                                            </kwc-avatar-asset>
                                        </a>
                                    </template>
                                </iron-selector>
                            </template>
                        </iron-pages>
                    </div>
                    <template is="dom-if" if="[[colorPickerShow]]">
                        <iron-selector
                            att-for-selected="skin-id"
                            selected="{{colorDisplay.selected.uid}}"
                            class="skin-swatch"
                            selectable="button">
                            <p>[[colorDisplay.label]]</p>
                            <template is="dom-repeat" items="[[colorDisplay.list]]">
                                <button
                                skin-id="[[item.uid]]"
                                class="skin-swatch__item"
                                style$="background-color: [[item.display]]"
                                on-tap="changeColorEls"></button>
                            </template>
                        </iron-selector>
                    </template>
                </div>
            </div>
        `}constructor(){super(),this.assetListMap=new Map,this._arrowClicked=this._arrowClicked.bind(this),this.leftArrow=!0,this.rightArrow=!0,this.assetBoxWidth=this.assetWidth+2*this.assetPadding}ready(){super.ready(),this.boneTabs=[],this.boneName="",this.categories=[],this.availableBones=[],this.availableBonesLen=0,this.lastBonesLen=0,this.elementsSorted=!1}setInitialCategory(){this.categories&&this.categories[0].id&&(this.categoryId||(this.categoryId=this.categories[0].id),this.setFilteredBones())}setFilteredBones(){const t=this.$.categoryTabs.indexOf(this.$.categoryTabs.selectedItem);if(!this.categories[t])return;const e=this.categories[t].list;this.availableBones=[],this.assetList.forEach(t=>{const a=t.bone.boneData.name;e.indexOf(a)>=0&&this.availableBones.push(t)}),this.lastBonesLen===this.availableBones.length?(this.availableBones.push({}),this.lastBonesLen=-1):this.lastBonesLen=this.availableBones.length,this.availableBonesLen=this.availableBones.length>1,this.availableBones.length>0?this.boneName=this.availableBones[0].bone.boneData.name:this.boneName=""}setSlot(t){t.model.slot&&this.dispatchEvent(new CustomEvent("avatar-set-slot",{detail:{slot:t.model.slot}}))}setColorPicker(){const t=Object.keys(this.colorEls).find(t=>this.colorEls[t].relatedBones.indexOf(this.boneName)>=0);if(t)return this.colorDisplay=this.colorEls[t],void(this.colorDisplay.relatedBones.indexOf(this.boneName)>=0&&(this.colorPickerShow=!0,this.colorPickerId=t));this.colorPickerShow=!1,this.colorPickerId=""}changeColorEls(t){const e=this.colorPickerId;this.dispatchEvent(new CustomEvent("avatar-change-color-el",{detail:{item:t.model.item.uid,el:e}}))}setSelectedIndex(){const{slots:t}=this.resources.avatar;let e;this.assetList.forEach((a,s)=>{const i=t[a.bone.name];i&&(e=a.slots.filter(t=>t.availableAsset)).forEach((t,e)=>{i===t.id&&(this.assetList[s].selectedIndex=e)}),this.assetList[s].selectedIndex=this.assetList[s].selectedIndex||0})}categoryTabChanged(){this.setFilteredBones(),this.setColorPicker()}assetViewChanged(t){this.boneName=t.detail.item.id,this.setColorPicker()}onResourcesChanged(){this.resources&&(this.colorEls=this.resources.spec.data.colorEls,this.categories=this.resources.spec.data.categories,this.avatar=this.resources.avatar||{},this.setColorDefaults(),this.setColorPicker(),this.setInitialCategory())}setColorDefaults(){Object.keys(this.colorEls).forEach(t=>{void 0===this.avatar.colorEls[t]&&(this.avatar.colorEls[t]=this.resources.spec.data.colorEls[t].default.uid)})}assetListLoaded(){this.assetList&&this.assetList.length&&(this.boneName||(this.boneName=this.assetList[0].bone.boneData.name),this.resources&&this.resources.avatar&&this.setSelectedIndex(),this.setColorPicker())}_assetListChanged(t){window.setTimeout(()=>{if(t.detail.addedNodes.forEach(t=>{if(t.children&&t.classList&&t.classList.contains("asset-tabs")){const e=[...t.children].filter(t=>"A"===t.nodeName).length,a={width:e*this.assetBoxWidth,childCount:e,currentX:0,node:t};this.assetListMap.set(t.id,a)}}),this.boneName){const t=this.assetListMap.get(this.boneName);t&&this._updateArrows(t)}},0)}_assetListSelected(t){const e=this.assetListMap.get(t.detail.item.id);void 0!==e&&t.detail.item.classList.contains("asset-tabs")&&this._updateArrows(e)}_updateArrows(t){const e=t.node.parentElement.clientWidth,a=Math.floor(e/this.assetBoxWidth),s=this.assetBoxWidth*a;this.rightArrow=t.currentX+s<t.width,this.leftArrow=t.currentX>0}_getToolboxWidth(t){return t*this.assetBoxWidth}_arrowClicked(t){t.stopPropagation(),t.preventDefault();const e=this.assetListMap.get(this.boneName),a=t.target.parentElement.clientWidth,s=Math.floor(a/this.assetBoxWidth),i=this.assetBoxWidth*s;let o;if(t.target.classList.contains("arrow-next")){o=e.currentX+2*i>=e.width?e.width-i:i+e.currentX}else o=(o=e.currentX-i)<0?0:o;e.node.style.transform=`translateX(-${o}px)`,e.currentX=o,this._updateArrows(e)}_checkArrow(t){return t?"arrow-active":"arrow-disabled"}_renderAllSlots(t){return t.slots=t.slots.concat(new Array(t.lockedSlots)),t.slots}_computeActiveAsset(t){return t?"active-asset":""}}customElements.define(H.is,H);const W=t=>{const e=d.GamificationClientFactory(t);return{getAvatar:()=>e.prepare().then(t=>t.getPartialProgress(e.getCurrentUserId(),["hp-avatar-assets"])).then(t=>t["hp-avatar-assets"]),unlockAssets:t=>e.prepare().then(e=>e.trigger({name:"unlock-avatar-asset",detail:{ids:t}}))}},X=g.SharesActionsFactory(g.FEED_TYPES.PROFILE),V=v.UserActionsFactory(v.USER_TYPES.AUTHENTICATED);class q extends(F(b.Store.StateReceiver(t.PolymerElement))){static get template(){return t.html`<style>:host{display:flex;--profile-theme:{display:flex;flex-direction:column;align-items:stretch;font-family:var(--font-body);background:var(--avatar-creator-background-medium)};@apply --profile-theme;--profile-tabs-link:{display:flex;flex-direction:row;justify-content:center;align-items:center;margin:0 4px;border-top-left-radius:6px;border-top-right-radius:6px;background:var(--color-abbey);color:var(--color-porcelain);text-decoration:none;font-size:16px;transition:all linear 120ms;font-weight:700;opacity:.8;min-width:110px};--profile-tabs-link-selected:{opacity:1;color:#000;background:var(--color-porcelain)};--kwc-avatar-toolbox-tab:{@apply --profile-tabs-link;};--kwc-avatar-toolbox-tab-selected:{@apply --profile-tabs-link-selected;};--paper-tabs-container:{@apply --profile-tabs;};--paper-tabs-content:{@apply --profile-tabs;};}.transition-element{transition:.5s all ease-in-out}.head{background-color:var(--color-chateau,grey);background-position:top center;background-size:contain;background-color:#5a6675;background-repeat:no-repeat;min-height:200px;height:30vh;position:relative;padding-bottom:40px}.head.is-editing{height:50vh}ka-profile{flex:1}kwc-avatar-creator .asset-picker{padding-top:0;margin-top:40px;background-color:#525c69;position:relative}kwc-avatar-creator .asset-picker paper-tabs{@apply --profile-tabs;}kwc-avatar-creator .asset-picker paper-tabs paper-tab{@apply --profile-tabs-link;}kwc-avatar-toolbox.is-editing{animation-name:loadIn;animation-duration:.5s;animation-timing-function:ease-out;animation-iteration-count:1}@keyframes loadIn{0%{transform:translateY(500px)}50%{transform:translateY(500px)}100%{transform:translateY(0)}}kwc-avatar-stage{height:calc(100% - 40px)}#avatar{height:100%;position:relative}#loading{position:absolute;top:0;left:0;width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;pointer-events:none}[hidden]{display:none!important}.edit-button{position:absolute;right:16px;bottom:10px;cursor:pointer;background-color:#79828e;color:#fff;padding:0 16px;border:none;border-radius:16px;height:32px;font-weight:700;font-family:var(--font-body);font-size:15px;letter-spacing:.3px;transition:all .3s ease-in-out}.edit-button:focus,.edit-button:hover{outline:0;background-color:#6a727b}.edit-button span.counter{position:absolute;top:-7px;right:-7px;background-color:#fe6801;border-radius:16px;display:flex;justify-content:center;align-items:center;padding:.042em .52em;border:2px solid #fff;font-size:12px}.close-button{font-size:16px;font-weight:700;color:#fff;display:inline-flex;align-items:center;position:absolute;right:16px;top:15px;cursor:pointer}.close-button .icon{width:.75em;padding:0 6px;margin-left:13px;opacity:.7;background:var(--color-grey);border-radius:3px;transition:all .1s ease-in-out}.close-button:hover .icon{background:#ff6900;opacity:1}</style><ka-profile user=[[user]] auth-user=[[user]] auth-user-following=[[follows.following]] progress=[[progress]] badges=[[badges]] subnav=[[subnav]] follows-page=[[followsPage]] follows=[[follows]] header-background="" is-editing=[[isEditing]] loading=[[loading]] loading-level=[[loadingLevel]] link-prefix=/profile on-follow-click=_onFollowClicked on-unfollow-click=_onUnfollowClicked on-user-click=_userClicked><div slot=avatar id=avatar><kwc-avatar-stage id=stage resources=[[resources]] on-imagecaptured=avatarImage on-avatar-set-slot=avatarSetSlot on-asset-list-loaded=avatarAssetListLoaded></kwc-avatar-stage><kwc-avatar-toolbox hidden\$=[[!isEditing]] class$="transition-element [[checkIsEditing(isEditing)]]" resources=[[resources]] assetlist=[[avatarAssetList]] on-avatar-set-slot=avatarSetSlot on-avatar-change-color-el=avatarSetColorEls></kwc-avatar-toolbox><div id=loading></div><div role=button class=close-button on-click=closeEditing hidden\$=[[!isEditing]]>Close<iron-icon class=icon icon=kwc-ui-icons:close></iron-icon></div><button class=edit-button on-click=toggleEditing hidden=[[!online]]><span>[[_computeEditButtonLabel(isEditing, failedToSave)]]</span><template is=dom-if if=[[unlockedCount]]><span class=counter>[[unlockedCount]]</span></template></button></div><template is=dom-if if=[[online]]><ka-creations-feed slot=creations shares=[[shares]] loading=[[sharesLoading]] page-count=[[sharesPageCount]] page=[[sharesPage]] on-page-changed=_feedPageChanged on-like-click=_likeClicked on-user-click=_userClicked on-comment-click=_commentClicked on-creation-click=_onCreationClick from-user="" user=[[user]] uploading-avatar=[[uploadingAvatar]] liked=[[liked]]></ka-creations-feed></template><template is=dom-if if=[[!online]] restamp=""><ka-offline slot=badges></ka-offline><ka-offline slot=creations></ka-offline><ka-offline slot=follows></ka-offline></template><ka-profile-about slot=about user=[[user]] root=[[config.root]] on-bio-changed=_bioChanged can-edit=[[online]]></ka-profile-about></ka-profile>`}static get is(){return"ka-view-profile"}static get properties(){return{subnav:{linkState:"routing.pathParams.subnav"},followsPage:{linkState:"routing.pathParams.follows"},user:{linkState:v.userProp(v.USER_TYPES.AUTHENTICATED,"profile")},liked:{linkState:"users.authenticated.likes"},loadingLevel:{linkState:v.userProp(v.USER_TYPES.AUTHENTICATED,"loadingLevel")},progress:{linkState:v.userProp(v.USER_TYPES.AUTHENTICATED,"progress")},badges:{linkState:v.userProp(v.USER_TYPES.AUTHENTICATED,"badges")},follows:{linkState:v.userProp(v.USER_TYPES.AUTHENTICATED,"follows")},avatarData:{linkState:v.userProp(v.USER_TYPES.AUTHENTICATED,"avatar")},avatarUnlocked:{linkState:v.userProp(v.USER_TYPES.AUTHENTICATED,"avatarUnlocked")},avatarNewlyUnlocked:{linkState:v.userProp(v.USER_TYPES.AUTHENTICATED,"avatarNewlyUnlocked")},uploadingAvatar:{linkState:"users.authenticated.uploadingAvatar"},unlockedCount:{type:Number,computed:"_computeNewlyUnlockedCount(avatarNewlyUnlocked.*)"},shares:{linkState:g.feedProp(g.FEED_TYPES.PROFILE,"shares")},sharesLoading:{linkState:g.feedProp(g.FEED_TYPES.PROFILE,"loading")},sharesPageSize:{linkState:g.feedProp(g.FEED_TYPES.PROFILE,"pageSize")},sharesPageCount:{linkState:g.feedProp(g.FEED_TYPES.PROFILE,"pageCount")},sharesPage:{linkState:g.feedProp(g.FEED_TYPES.PROFILE,"page"),observer:"_sharesPageChanged"},filter:{linkState:"routing.params.filter",value:"all"},creationsFilter:{type:Object,value:()=>({hardware:["wand"]})},config:{linkState:"config"},rootUrl:{linkState:"config.root"},avatarBundle:Object,headerBackground:String,loading:{type:Boolean,value:!1},online:{linkState:"online",observer:"_onlineChanged"}}}static get observers(){return["_load(avatarBundle, avatarUnlocked, avatarData)","_navbarStatus(isEditing)"]}constructor(){super(),this.isEditing=!1,this.failedToSave=!1,this.closeIcon=p.toSrc(p.close)}_getModel(t,e){if(!this[t]){const{config:a}=this.getState();this[t]=e(a.API_URL)}return this[t]}get userModel(){return this._getModel("_userModel",m.UserFactory)}get progressModel(){return this._getModel("_progressModel",k.ProgressFactory)}get avatarModel(){return this._getModel("_avatarModel",W)}get sharesModel(){if(!this._sharesModel){const{config:t}=this.getState();this._sharesModel=x.SharesFactory(t.API_URL)}return this._sharesModel}get onlineModel(){return this._getModel("_onlineModel",w.OnlineFactory)}connectedCallback(){super.connectedCallback(),this.setupLoader(),this.headerBackground="",this.avatarBundle={spritepng:`${this.config.root}assets/armature/avatar_tex.png`,spritedata:`${this.config.root}assets/armature/avatar_tex.json`,spritebin:`${this.config.root}assets/armature/avatar_ske.dbbin`,specData:`${this.config.root}assets/test_data/specdata.json`},this.fetchAll(),this.online&&this._updateShares(this.creationsFilter)}_load(){!this.loaded&&this.avatarBundle&&this.avatarUnlocked&&this.avatarNewlyUnlocked&&this.avatarData?(this.loaded=!0,this.avatarLoader||(this.loadAvatar(this.avatarBundle),this.fetchAvatarData().then(()=>{this.load()}))):this.destroyLoader()}load(){this.avatarLoader.init().then(t=>{const e=t;e.gamification={unlocked:this.avatarUnlocked,newlyUnlocked:this.avatarNewlyUnlocked},void 0===this.avatarData||Object.keys(this.avatarData).length<=0?(e.avatar=e.spec.data.avatar.default,this.avatarData=e.avatar):e.avatar=this.avatarData,e.user=this.user,this.resources=e,this.destroyLoader()})}_computeNewlyUnlockedCount(){return""===this.avatarNewlyUnlocked[0]?0:this.avatarNewlyUnlocked.length}_computeEditButtonLabel(t){return t?this.failedToSave?"Can't save right now. Retry?":"Done":"Edit"}closeEditing(){this.isEditing&&!this.online?(this.isEditing=!1,this.failedToSave=!1):this.toggleEditing()}_navbarStatus(t){f.RoutingActions.toggleNavbar(t)}toggleEditing(){if(this.isEditing&&this.avatarChanged){if(!this.online)return this.failedToSave=!0,void this.onlineModel.checkConnection();this.failedToSave=!1,this.stageEl.captureView().then(()=>{this._putAvatar(this.avatarData)}),this.avatarChanged=!1,this.newAssetLength=0}if(!this.isEditing){const t=`new-avatar-assets-${this.user.id}`;localStorage.setItem(t,[]),V.setAvatarNewlyUnlocked([""])}this.isEditing=!this.isEditing}checkIsEditing(t){return t?"is-editing":""}setupLoader(){this.animation=new h.LoadingAnimation(this.$.loading,{pipSize:3.2}),this.animation.loader.style.width="16px",this.animation.loader.style.height="16px",this.animation.loader.style.background="#FFF",this.animation.loader.style.padding="8px",this.animation.loader.style.borderRadius="4px",this.animation.loader.style.boxShadow="0px 4px 4px 0px rgba(0, 0, 0, 0.15);",this.animation.start()}destroyLoader(){if(!this.animation||!this.animation.started||!this.animation.loader)return;let t=Promise.resolve();"animate"in HTMLElement.prototype&&(t=new Promise(t=>{this.animation.loader.animate({opacity:[1,0]},{duration:500}).onfinish=t})),t.then(()=>{this.animation.stop(),this.animation.delete()})}_putAvatar(t){V.setUploadingAvatar(!0),this.userModel.putAvatar(this.user.id,t).then(()=>(V.setUploadingAvatar(!1),V.setLoading(!0),this.userModel.getAuthenticatedUser())).then(t=>{V.setUser(t),V.refreshAvatarImage(),V.setLoading(!1)}).catch(t=>{throw V.setUploadingAvatar(!1),V.setLoading(!1),t})}fetchAvatarData(){const t=`new-avatar-assets-${this.user.id}`,e=(localStorage.getItem(t)||"").split(","),a=this.userModel.getAvatar(this.user.id).then(t=>{V.setAvatar(t)}),s=this.avatarModel.getAvatar().then(t=>{V.setAvatarUnlocked(t.map),V.setAvatarNewlyUnlocked(e)});return Promise.all([a,s])}fetchAll(){V.setLoading(!0),Promise.all([this.fetchAvatarData(),this.getFollows(),this.getShares(),this.getLevel(),this.getBadges()]).then(()=>{V.setLoading(!1)})}_onlineChanged(t,e){!e&&t&&this.fetchAll()}_updateShares(t={}){let e;X.setLoading(!0),(e=t.features?this.sharesModel.getFeatures():t.app?this.sharesModel.getByApp(t.app):t.hardware?this.sharesModel.getByHardware(t.hardware):this.sharesModel.getShares()).then(t=>{this.feed=t,X.setPageCount(this.feed.getPagesCount(this.pageSize)),X.setPage(null),X.setPage(1)})}getShares(){X.setLoading(!0),this.sharesModel.getFromUser(this.user.id).then(t=>{this.feed=t,X.setPageCount(this.feed.getPagesCount(this.sharesPageSize)),X.setPage(null),X.setPage(1)})}_selectedChanged(){if(!this.selectedShareSlug)return void(this.share=null);const{sharesMap:t}=this.getState();t&&!t.get(this.selectedShareSlug)&&this.sharesModel.getBySlug(this.selectedShareSlug).then(t=>{X.add(t)})}_feedPageChanged(t){const e=t.detail.value;X.setPage(e)}_sharesPageChanged(){this.sharesPage&&this.feed&&(0===this.sharesPageCount?(X.set([]),X.setLoading(!1),this.scroll(0,0)):this.sharesPage<=this.sharesPageCount&&(X.setLoading(!0),this.feed.getPage(this.sharesPage,this.sharesPageSize).then(t=>{X.set(t),X.setLoading(!1),this.scroll(0,0)})))}_bioChanged(t){this.userModel.updateBio(t.detail).then(()=>{V.updateBio(t.detail)})}getBadges(){V.setLoadingBadges(!0),this.progressModel.getBadges(this.user.id).then(t=>{V.setBadges(t),V.setLoadingBadges(!1)}).catch(t=>{throw V.setLoadingBadges(!1),t})}getFollows(){return this.userModel.getFollows(this.user.id).then(t=>{V.setFollows(t)})}getLevel(){V.setLoadingLevel(!0),this.progressModel.getUserLevelAndXP(this.user.id).then(t=>{V.setLoadingLevel(!1),V.setUserProgress(t)})}getLikes(){return this.userModel.getLikes(this.user.id).then(t=>{V.setLikes(t)})}_likeClicked(t){const e=t.detail.id;t.detail.liked?this.sharesModel.deleteLike(e).then(()=>{this.getLikes(),X.updateLikeCount(e,-1)}):this.sharesModel.recordLike(e).then(()=>{this.getLikes(),X.updateLikeCount(e,1)})}_userClicked(t){const e=t.detail;e===this.user.username?y.navigateTo("/profile/creations"):y.navigateTo(`/creations/u/${e}`)}_onFollowClicked(t){const e=t.detail;this.userModel.follow(e.id).then(()=>{V.follow(e)})}_onUnfollowClicked(t){const e=t.detail;e.id!==this.user.id&&this.userModel.unfollow(e.id).then(()=>{V.unfollow(e)})}_onCreationClick(t){const e=t.detail;y.navigateTo(`/creations/${e}`)}}window.customElements.define(q.is,q)});