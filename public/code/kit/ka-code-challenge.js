define(["./chunk-fdc6718c.js","./chunk-b593cb26.js","./chunk-0552f067.js","./chunk-654f977c.js","./chunk-42d2b7ff.js","./chunk-8b3412b4.js","./chunk-dce7f082.js","./chunk-a4335312.js","./chunk-e8284588.js","./chunk-e1d3b61d.js","./chunk-f8a285e9.js","./chunk-be7f2d6a.js","./chunk-a86cbd6e.js","./chunk-e8d4628a.js","./chunk-9842783d.js","./chunk-3c505003.js","./chunk-93a2d04f.js","./chunk-dac62d81.js","./chunk-7f3f247c.js","./chunk-bbbf26f6.js","./chunk-1ebdd224.js","./chunk-9ed3bf9d.js","./chunk-7658960f.js","./chunk-92065960.js","./chunk-9c0e986a.js","./chunk-04ad14cf.js","./chunk-20f407ed.js","./chunk-39b53efd.js","./chunk-33d51465.js","./chunk-5472545b.js","./chunk-9968f662.js","./chunk-83c85edb.js","./chunk-73cb4c23.js","./chunk-75c10612.js","./chunk-19bce21e.js","./chunk-6da1ebd5.js","./chunk-86ecdd4d.js","./chunk-90a58e12.js","./chunk-ede86d1c.js","./chunk-d52b5dbe.js","./chunk-cf7144da.js","./chunk-4d3465f9.js","./chunk-87c098bb.js","./chunk-7e191bbc.js","./chunk-bf2c299c.js","./chunk-30c1c965.js"],function(t,e,i,o,a,s,n,d,r,l,c,u,h,p,g,f,b,m,y,k,_,v,w,x,S,E,T,B,C,A,I,N,P,O,$,L,D,j,R,M,F,z,V,U,H,W){"use strict";const G="validation";class Y{constructor(){this._behaviors={},this._shorthands={},this._validations={},this._matchFallbacks={},this._oppositeActions={},this._changeCounts={},this._stepProcessors={},this._stores={},this._emitter=document.createElement("div")}trigger(t,e){this._emitter.dispatchEvent(new CustomEvent(t,{detail:e}))}addEventListener(t,e){this._emitter.addEventListener(t,e)}removeEventListener(t,e){this._emitter.removeEventListener(t,e)}createStore(t){return this._stores[t]={},this._stores[t]}addToStore(t,e,i){let o=this._stores[t];o||(o=this.createStore(t)),o[e]=i}getFromStore(t,e){const i=this._stores[t];return i?i[e]:null}setSteps(t){this._steps=t}definePropertyProcessor(t,e){(Array.isArray(t)?t:[t]).forEach(t=>{this._stepProcessors[t]=e})}defineBehavior(t,e,i){this._behaviors[t]={enters:e,leaves:i}}defineShorthand(t,e){this._shorthands[t]=e}static ensureProperty(t,e){if(!(e in t&&void 0!==t[e]&&null!==t[e]))throw new Error(`Property '${e}' must be defined`)}triggerEvent(t,e){this.step&&this._checkEvent(this.step.validation,{type:t,data:e})}_checkEvent(t,e){t&&("string"!=typeof t||t!==e.type?Object.keys(t).forEach(i=>{i!==e.type?this._isOppositeAction(t[i],i,e):this._validateEvent(t[i],i,e)?t[i].skipSteps?this._goToStep(this.step+t[i].skipSteps+1):this.nextStep():this._validateMatchFallback(t[i],i,e)}):this.nextStep())}_validateMatchFallback(t,e,i){const o=this._matchFallbacks[e];return!!o&&o.call(this,t,i)}_validateEvent(t,e,i){return!!(!0===t||t.value&&!0===t.value)||(this._changeCounts[this.stepIndex]=this._changeCounts[this.stepIndex]+1||1,!(!this._validations[e]||!this._validations[e].call(this,t,i)))}_getOppositeAction(t,e){return!(!this._oppositeActions[t]||!this._oppositeActions[t][e])&&this._oppositeActions[t][e]}_isOppositeAction(t,e,i){const o=this._getOppositeAction(e,i.type);return!!o&&o.call(this,t,i)}addValidation(t,e){this._validations[t]=e}addMatchFallback(t,e){this._matchFallbacks[t]=e}addOppositeAction(t,e,i){this._oppositeActions[t]=this._oppositeActions[t]||{},this._oppositeActions[t][e]=i}_runBehavior(t,e,i){this._behaviors[t]&&this._behaviors[t][e]&&this._behaviors[t][e](i[t])}_expandSteps(){return this._steps.reduce((t,e)=>e.type&&this._shorthands[e.type]?t.concat(this._shorthands[e.type](e)):t.concat(e),[])}_processStep(t,e){const i=(e=e||[]).join(".");return this._stepProcessors[i]&&(t=this._stepProcessors[i](t)),Array.isArray(t)?t.map(t=>this._processStep(t,e.concat("*"))):null!==t&&"object"==typeof t?Object.keys(t).reduce((i,o)=>(i[o]=this._processStep(t[o],e.concat(o)),i),{}):t}_updateStep(){const t=this.step;this.step=this.steps[this._stepIndex]?this._processStep(JSON.parse(JSON.stringify(this.steps[this._stepIndex]))):null,t&&Object.keys(t).forEach(e=>{e!==G&&this._runBehavior(e,"leaves",t)}),this.step&&Object.keys(this.step).forEach(t=>{t!==G&&this._runBehavior(t,"enters",this.step)})}start(){this.steps=this._expandSteps(),this.stepIndex=0}set stepIndex(t){this._stepIndex=t,this._updateStep(),this.done&&this.trigger("done")}get stepIndex(){return this._stepIndex}nextStep(){this.stepIndex<this.steps.length&&(this.stepIndex+=1)}get done(){return this.stepIndex===this.steps.length}}class q extends Y{constructor(t){super(),this.workspace=t,this.eventsMap={move:"connect",change:"value","drop-block":"drop"},this.addValidation("blockly",this._validate),this.addValidation("create",this._matchCreate),this.addValidation("connect",this._matchConnect),this.addValidation("value",this._matchBlocklyValue),this.addValidation("delete",this._matchDelete),this.addValidation("open-flyout",this._matchCategory),this.addValidation("close-flyout",this._matchCategory),this.addValidation("drop",this._matchDrop),this.addOppositeAction("create","close-flyout",this._flyoutClosed.bind(this)),this.addOppositeAction("create","open-flyout",this._flyoutClosed.bind(this)),this.addOppositeAction("open-flyout","create",this._wrongCategory.bind(this)),this.addOppositeAction("open-flyout","close-flyout",this._wrongCategory.bind(this)),this.addOppositeAction("connect","delete",this._deleteNotExpected.bind(this)),this.addMatchFallback("open-flyout",this._wrongCategory.bind(this)),this.addMatchFallback("close-flyout",this._wrongCategory.bind(this)),this.addMatchFallback("create",this._flyoutClosed.bind(this)),this.defineShorthand("create-block",this._createBlockShorthand.bind(this)),this.defineShorthand("change-input",this._changeInputShorthand.bind(this)),this.defineBehavior("phantom_block",this._onPhantomBlockEnter.bind(this),this._onPhantomBlockLeave),this.createStore("blocks")}_updateStep(...t){super._updateStep.apply(this,...t),Blockly.WidgetDiv.hide()}_processBlock(t){return t.id?t.id=this.getFromStore("blocks",t.id):t.rawId&&(t.id=t.rawId),t}_wrongCategory(t){this._updateStep()}_deleteNotExpected(t,e){"shadow"!==e.oldXml.tagName.toLowerCase()&&(this.stepIndex-=2)}_flyoutClosed(t){this.stepIndex-=1}_onPhantomBlockEnter(t){let e,i,o;if(t&&t.location&&Blockly.selected){if(o=this.getTargetBlock(t.location.block),"@previous"===t.target)e=o.previousConnection;else if("@next"===t.target)e=o.nextConnection;else if(t.target){for(let i=0;i<o.inputList.length;i++)if(o.inputList[i].name===t.target){e=o.inputList[i].connection;break}}else e=o.nextConnection;i=Blockly.selected,e&&Blockly.setPhantomBlock(e,i)}}_onPhantomBlockLeave(t){Blockly.removePhantomBlock()}_getOpenFlyoutStep(t){return{validation:{blockly:{"open-flyout":t.category}}}}_getCloseFlyoutStep(t){return{validation:{blockly:{"close-flyout":t.category}}}}_getCreateBlockStep(t){return{validation:{blockly:{create:{type:t.blockType,id:t.alias}}}}}_getConnectBlockStep(t){return{validation:{blockly:{connect:{parent:t.connectTo,target:t.alias}}},phantom_block:{location:{block:t.connectTo},target:t.connectTo.inputName}}}_getDropBlockStep(t){return{validation:{blockly:{drop:{target:t.alias}}}}}_createBlockShorthand(t){const e=this._getOpenFlyoutStep(t),i=[this._getCreateBlockStep(t)];return this.workspace.toolbox_&&i.unshift(e),t.connectTo?i.push(this._getConnectBlockStep(t)):i.push(this._getDropBlockStep(t)),i}_changeInputShorthand(t){return{validation:{blockly:{value:{target:t.block,value:t.value}}}}}getBlockType(t){let e,i=t.type&&t.type.part?this.getFromStore("parts",t.type.part):t.rawTarget;return e=this.getTypeString(t),e=i?`${i}#${e}`:e}getTypeString(t){return"string"==typeof t?t:this.getTypeString(t.type)}getTargetBlock(t){let e;return"string"==typeof t?e=this.workspace.getBlockById(this.getFromStore("blocks",t)):t.id?e=this.workspace.getBlockById(this.getFromStore("blocks",t.id)):t.rawId&&(e=this.workspace.getBlockById(t.rawId)),t.shadow&&(e=this.getTargetBlockShadow(e,t.shadow)),e}getTargetBlockShadow(t,e){return"string"==typeof e?t.getInput(e).connection.targetBlock():"shadow"in e&&"name"in e?this.getTargetBlockShadow(t.getInput(e.name).connection.targetBlock(),e.shadow):null}_matchCategory(t,e){return t.value&&(t=t.value),e.categoryId===t}_matchBlockType(t,e){return e.xml.getAttribute("type")===t}_matchDelete(t,e){let i,o=t.target||t;if("string"==typeof o?i=this.getFromStore("blocks",o):o.id?i=this.getFromStore("blocks",o.id):o.rawId&&(i=o.rawId),i===e.blockId)return delete this._stores.blocks[o],!0}_matchCreate(t,e){const i=this.getBlockType(t);if(this._matchBlockType(i,e))return t.id&&this.addToStore("blocks",t.id,e.blockId),!0}_matchConnect(t,e){let i=this.getTargetBlock(t.target),o=this.getTargetBlock(t.parent);if(e.blockId===i.id&&e.newParentId===o.id){let e;if(t.parent.inputName&&"@next"!==t.parent.inputName){const i=o.getInput(t.parent.inputName);if(!i)return!1;e=i.connection}else e=o.nextConnection;return!!e&&(e=e.targetConnection).sourceBlock_.id===i.id}}_matchDrop(t,e){let i=this.getTargetBlock(t.target).id;return e.blockId===i}_matchBlocklyValue(t,e){const i=this.getTargetBlock(t.target).id,o=this.workspace.getBlockById(e.blockId);let a=!1;if(o.id!==i)return!1;const s=o.getFieldValue(e.name);if(t.minLength&&s.length&&s.length<t.minLength&&(a=!0),t.value){let{value:e}=t;e.event_from&&(e=`${this.stepIds[e.event_from]}.${e.event}`),s!=e&&(a=!0)}return!a}_validate(t,e){let i=e.data.event,o=this.workspace.getBlockById(i.blockId);i.type=this.eventsMap[i.type]||i.type,"connect"===i.type&&!i.newParentId||"value"!==i.type&&o&&o.isShadow()||this._checkEvent(t,i)}}const X="parts";class J extends q{constructor(...t){super(...t),this.addValidation("add-part",this.matchAddPart),this.addValidation("background",this.matchProperty),this.addValidation("select-part",this.matchPartTarget),this.addValidation("selected-part-change",this.matchPartChange),this.addValidation("trigger",this.matchTrigger),this.addValidation("running",this.matchValue),this.addValidation("select-new-part",this.matchPartType),this.addValidation("enable-refresh",this.matchPartTarget),this.addValidation("disable-refresh",this.matchPartTarget),this.addValidation("manual-refresh",this.matchPartTarget),this.addValidation("open-settings-tooltip",this.matchPartTarget),this.addValidation("open-part-settings",this.matchPartTarget),this.addValidation("settings-interaction",this.matchSettingsInteraction),this.addValidation("light-animation-tool-changed",this.matchValue),this.addValidation("light-animation-paint",this.matchTool),this.addValidation("light-animation-preview-changed",this.matchValue),this.addOppositeAction("add-part","close-parts",this._partsClosed),this.defineShorthand("create-part",this._createPartShorthand.bind(this))}_getOpenPartsDialogStep(t){return{validation:{"open-parts":!0},beacon:{target:"add-part-button"},banner:{text:t.openPartsCopy||"Open the parts dialog"}}}_getCreatePartStep(t){return{validation:{"add-part":{type:t.part,id:t.alias}},beacon:{target:`parts-panel-${t.part}`},tooltips:[{text:t.addPartCopy||`Click '${t.part}' to add it.`,position:"top",location:"parts-panel"}]}}_createPartShorthand(t){return[this._getOpenPartsDialogStep(t),this._getCreatePartStep(t)]}_updateStep(){super._updateStep(),this.trigger("step-changed")}_partsClosed(){this.stepIndex>0&&(this.stepIndex-=1)}matchTrigger(t,e){let{emitter:i}=t;return i.part&&(i=this.getFromStore(X,i.part)),i===e.trigger.emitter&&t.event===e.trigger.event}matchPartChange(t,e){return this.matchProperty(t,e)}matchPartTarget(t,e){const i=this.getFromStore(X,t.target);return!(!e.part&&t.target)&&i===e.part.id}matchProperty(t,e){let i=t.property.split("."),o=e.property.split("."),a=this.changeCounts[this.step];for(let s=0,n=i.length;s<n&&"*"!==i[s];s++)if(i[s]!==o[s])return!1;return!(t.count&&a<t.count)&&(void 0===t.value||this.matchValue(t,e))}_processPart(t){if(t.target&&t.type){const e=`${this.getFromStore(X,t.target)}#${t.type}`;return t.type=e,t}if(t.part&&t.type){return`${this.getFromStore(X,t.part)}#${t.type}`}return t.part?this.getFromStore(X,t.part)||t:t.rawPart?t.type?`${t.rawPart}#${t.type}`:t.rawPart:t}matchValue(t,e){return t.value===e.value}matchTool(t,e){return t.tool===e.tool}matchAddPart(t,e){return!!this.matchPartType(t,e)&&(t.id&&this.addToStore(X,t.id,e.data.part.id),!0)}matchPartType(t,e){return t.type===e.data.part.type}matchSettingsInteraction(t,e){return t.setting===e.setting}get done(){return this.stepIndex===this.steps.length-1}_getOpenFlyoutStep(t){const e=super._getOpenFlyoutStep(t);return Object.assign(e,{banner:{text:t.openFlyoutCopy||`Open the ${t.category} category`},beacon:{target:{category:t.category}}})}_getCreateBlockStep(t){const e=super._getCreateBlockStep(t);return Object.assign(e,{banner:{text:t.grabBlockCopy||"Grab this block"},beacon:{target:{flyout_block:t.blockType}}})}_getConnectBlockStep(t){const e=super._getConnectBlockStep(t);return Object.assign(e,{banner:{text:t.connectCopy||"Connect to this block"},beacon:{target:{block:t.connectTo}}})}_getDropBlockStep(t){const e=super._getDropBlockStep(t);return Object.assign(e,{banner:{text:t.dropCopy||"Drop this block anywhere in your code space"}})}_changeInputShorthand(t){const e=super._changeInputShorthand(t);return Object.assign(e,{banner:{text:t.bannerCopy||`Change this value to ${t.value}`},beacon:{target:{block:t.block}}}),e}}const K=e.Store.types(["LOAD_CHALLENGE","LOAD_VARIABLES","UPDATE_STEP_INDEX","UPDATE_STEPS","DISABLE_BANNER_BUTTON","ENABLE_BANNER_BUTTON","UPDATE_BANNER_STATE","ENABLE_LOCKDOWN","DISABLE_LOCKDOWN","ADD_HISTORY_RECORD","HISTORY_BACK","HISTORY_FORWARD","UPDATE_HISTORY_OPTIONS","COMPLETE_CHALLENGE","UPDATE_BEACON","UPDATE_TOOLTIPS","ENABLE_HINTS"]),Z={default:"/assets/avatar/judoka-face.svg"},Q=t=>{function e(){const e=t.getState();return e.steps?e.stepIndex/(e.steps.length-1):0}return t.addMutator(function(t){switch(t.type){case K.LOAD_CHALLENGE:{const e=this.get("state");this.set("state",Object.assign({},e,t.challenge));break}case K.LOAD_VARIABLES:this.set("state.variables",t.variables);break;case K.UPDATE_STEP_INDEX:this.set("state.stepIndex",t.index),this.set("state.userProgress",e());break;case K.UPDATE_STEPS:this.set("state.steps",t.steps),this.set("state.userProgress",e());break;case K.DISABLE_BANNER_BUTTON:this.set("state.bannerButtonInactive",!0);break;case K.ENABLE_BANNER_BUTTON:this.set("state.bannerButtonInactive",!1);break;case K.UPDATE_BANNER_STATE:{const e=t.state,i=this.get("state.bannerButtonInactive");e.head=e.head||null,e.buttonLabel=e.next_button?e.buttonLabel:null,e.buttonLabel&&!e.buttonState?e.buttonState=i?"inactive":"active":e.buttonState="hidden",e.animation?(e.imgPage=e.animation,e.icon=null):e.icon?(e.icon=Z[e.icon],e.imgPage=null):e.icon=null,e.imgPage=e.imgPage||"judoka",this.set("state.banner",e);break}case K.ENABLE_LOCKDOWN:this.set("state.lockdown",!0);break;case K.DISABLE_LOCKDOWN:this.set("state.lockdown",!1);break;case K.ADD_HISTORY_RECORD:this.push("state.history.backBuffer",{stepNumber:t.stepNumber,editorState:t.editorState}),this.set("state.history.forwardBuffer",[]);break;case K.HISTORY_BACK:{const t=this.pop("state.history.backBuffer"),e=this.get("state.history");e.backBuffer[e.backBuffer.length-1];this.push("state.history.forwardBuffer",t),this.set("state.history.ignoreNextStepChange",!0);break}case K.HISTORY_FORWARD:{const t=this.pop("state.challenge.history.forwardBuffer");this.push("state.history.backBuffer",t),this.set("state.history.ignoreNextStepChange",!0);break}case K.UPDATE_HISTORY_OPTIONS:this.set("state.history.canGoBack",t.canGoBack),this.set("state.history.canGoForward",t.canGoForward);break;case K.COMPLETE_CHALLENGE:{const t=this.get("state"),{show_remix_options:e,autoshare_disabled:i}=t.scene||t;e&&this.set("scene.completed",!0),i&&this.set("scene.autoshareDisabled",!0);break}case K.UPDATE_BEACON:this.get("state.hints.enabled")?this.set("state.beacon",t.beacon):this.set("state.beacon",null);break;case K.UPDATE_TOOLTIPS:this.get("state.hints.enabled")?this.set("state.tooltips",t.tooltips):this.set("state.tooltips",null);break;case K.ENABLE_HINTS:this.set("state.hints.enabled",!0)}}),{load(e){t.dispatch({type:K.LOAD_CHALLENGE,challenge:e})},loadVariables(e){t.dispatch({type:K.LOAD_VARIABLES,variables:e})},updateStepIndex(e){t.dispatch({type:K.UPDATE_STEP_INDEX,index:e})},updateSteps(e){t.dispatch({type:K.UPDATE_STEPS,steps:e})},disableBannerButton(){t.dispatch({type:K.DISABLE_BANNER_BUTTON})},enableBannerButton(){t.dispatch({type:K.ENABLE_BANNER_BUTTON})},updateBannerState(e={}){t.dispatch({type:K.UPDATE_BANNER_STATE,state:e})},enableLockdown(){t.dispatch({type:K.ENABLE_LOCKDOWN})},disableLockdown(){t.dispatch({type:K.DISABLE_LOCKDOWN})},updateHistoryOptions(e,i){t.dispatch({type:K.UPDATE_HISTORY_OPTIONS,canGoBack:e,canGoForward:i})},addHistoryRecord(e,i){t.dispatch({type:K.ADD_HISTORY_RECORD,stepIndex:e,editorState:i})},completeChallenge(){t.dispatch({type:K.COMPLETE_CHALLENGE})},updateBeacon(e){t.dispatch({type:K.UPDATE_BEACON,beacon:e})},updateTooltips(e){t.dispatch({type:K.UPDATE_TOOLTIPS,tooltips:e})},historyBack(){t.dispatch({type:K.HISTORY_BACK})},historyForward(){t.dispatch({type:K.HISTORY_FORWARD})},enableHints(){t.dispatch({type:K.ENABLE_HINTS})}}};function tt(t){return class extends t.FieldTextInput{constructor(t){super(t,t=>{try{JSON.parse(t)}catch(e){return null}})}showEditor_(){this.workspace_=this.sourceBlock_.workspace,t.WidgetDiv.show(this,this.sourceBlock_.RTL,this.widgetDispose_());const e=t.WidgetDiv.DIV,i=goog.dom.createDom(goog.dom.TagName.TEXTAREA,"blocklyHtmlInput");i.style.width="300px",i.style.height="200px",i.setAttribute("spellcheck",this.spellcheck_);const o=`${t.FieldTextInput.FONTSIZE*this.workspace_.scale}pt`;e.style.fontSize=o,i.style.fontSize=o,t.FieldTextInput.htmlInput_=i,e.appendChild(i),i.value=i.defaultValue=this.text_,i.oldValue_=null,this.validate_(),this.resizeEditor_(),i.focus(),i.select(),this.bindEvents_(i)}onHtmlInputKeyDown_(e){const i=t.FieldTextInput.htmlInput_;if(27==e.keyCode)i.value=i.defaultValue,t.WidgetDiv.hide();else if(9==e.keyCode){const t=i.selectionStart;i.value=[i.value.slice(0,t),"    ",i.value.slice(t)].join(""),e.stopPropagation(),e.preventDefault(),i.selectionStart=t+4,i.selectionEnd=t+4}}}}const et=t=>({type:"module",name:"generator",verbose:"Challenge",color:"#676767",symbols:[{type:"function",name:"id",verbose:"Challenge id",parameters:[{name:"id",verbose:"",default:"challenge-id",returnType:String,blockly:{field:!0}}],blockly:{javascript:(t,e)=>`// @challenge-id: ${e.getFieldValue("ID")}\n`,postProcess:t=>(delete t.previousStatement,delete t.nextStatement,t)}},{type:"function",name:"banner",parameters:[{name:"text",default:"Banner content",returnType:String,blockly:{field:!0}}],blockly:{javascript:(t,e)=>`// @banner: ${e.getFieldValue("TEXT")}\n`}},{type:"function",name:"start",blockly:{javascript:t=>"// @challenge-start\n"}},{type:"function",name:"step",parameters:[{name:"json",returnType:String,blockly:{customField:t=>new(tt(t))("{\n    \n}")}}],blockly:{javascript:t=>"// @step\n"}},{type:"function",name:"metadata",parameters:[{name:"json",returnType:String,blockly:{customField:t=>new(tt(t))("{\n    \n}")}}],blockly:{javascript:t=>"// @metadata\n",postProcess:t=>(delete t.previousStatement,delete t.nextStatement,t)}}]}),it=new Map,ot=t=>{const e=t.FieldDropdown;t.FieldDropdown=class extends e{constructor(t,...e){super(t,...e),"function"!=typeof t&&t.forEach(t=>{it.set(t[1],t[0])})}}},at=["generator_banner","generator_step"],st={openFlyout:(t="this")=>`Open ${t} tray`,grabBlock:"Drag the block onto your code space",connect:"Connect to this block",drop:"Drop this block anywhere in your code space"};class nt extends i.Plugin{constructor(){super(),this.reset(),this.middlewares=[],this.blockCount={},ot(window.Blockly)}addMiddleware(t){this.middlewares.push(t)}reset(){this.uidNss={},this.data={},this.data.steps=[],this.data.parts=[],this.data.modules=[],this.data.variables=[],this.data.filterBlocks={},this.appParts={},this.partsIds={}}onInstall(t){this.editor=t;const{toolbox:e}=this.editor,{renderer:i}=e;this.defaults=i.defaults}reloadState(){const t=localStorage.getItem("generator-state");if(t)try{const i=JSON.parse(t);this.creator=i.creator||!1}catch(e){}}saveState(){const t={creator:this.creator};localStorage.setItem("generator-state",JSON.stringify(t))}onInject(){this.reloadState();const{workspaceView:t,plugins:e}=this.editor;"function"==typeof t.challengeGeneratorMiddleware&&this.addMiddleware(t.challengeGeneratorMiddleware),e.forEach(t=>{"function"==typeof t.challengeGeneratorMiddleware&&this.addMiddleware(t.challengeGeneratorMiddleware)}),this.setupUI()}setupUI(){const{workspaceToolbar:t}=this.editor;let e;const i=et(this.editor);i.toolbox=this.creator,this.creatorEntry=this.editor.toolbox.addEntry(i,0);const o=()=>{this.creator=!this.creator,i.toolbox=this.creator,this.creatorEntry.update(i),e.updateTitle(`${this.creator?"Disable":"Enable"} creator mode`),e.updateIronIcon("kwc-ui-icons:new-creation"),this.creator?this.addGeneratorItem():this.generatorItem&&this.removeGeneratorItem(),this.saveState()};if(e=t.addSettingsEntry({title:`${this.creator?"Disable":"Enable"} creator mode`,ironIcon:"kwc-ui-icons:new-creation"}).on("activate",()=>o()),this.creator&&this.addGeneratorItem(),"blockly"===this.editor.sourceType){const{sourceEditor:t}=this.editor,{workspace:e}=t;e.addChangeListener(t=>{this.creator&&this.populateComment(t)})}}populateComment(t){const{sourceEditor:e}=this.editor,{workspace:i,Blockly:o}=e;if(t.type!==o.Events.UI)return;if("commentOpen"!==t.element)return;const a=i.getBlockById(t.blockId),{comment:s}=a;s&&""===s.getText()&&s.setText(JSON.stringify(nt.getDefaultCommentData(),null,"    "))}static getDefaultCommentData(){return{openFlyoutCopy:st.openFlyout(),grabBlockCopy:st.grabBlock,connectCopy:st.connect}}static cleanTree(t){return[...t.querySelectorAll("comment")].forEach(t=>{t.parentNode.removeChild(t)}),t}addGeneratorItem(){this.generatorItem=this.editor.workspaceToolbar.addSettingsEntry({title:"Generate Challenge",ironIcon:"kc-ui:export"}).on("activate",()=>this.download())}removeGeneratorItem(){this.generatorItem&&this.generatorItem.dispose()}download(){const t=this.generate(),e=document.createElement("a");e.href=`data:application/json,${encodeURIComponent(JSON.stringify(t,null,"    "))}`,e.download="challenge.json",e.click()}translate(t,e){let i=this._translate(t,e);return i===e&&"category"===t&&(i=this.appParts[e]&&this.appParts[e].name?this.appParts[e].name:i),i}uid(t){return void 0===this.uidNss[t]?(this.uidNss[t]=0,this.uidNss[t]):(this.uidNss[t]+=1,this.uidNss[t])}addSteps(t){this.data.steps=this.data.steps.concat(t)}runMiddlewares(t){return this.middlewares.reduce((t,e)=>e(t,this),t)}generate(){if(this.reset(),"blockly"!==this.editor.sourceType)return{};const{sourceEditor:t}=this.editor,{Blockly:e}=t,i=this.editor.save(),{source:o,parts:a,mode:s}=i,n=e.Xml.textToDom(o);this.data.mode=s,this.fieldDefaults={},Object.keys(this.defaults.values).forEach(t=>{this.fieldDefaults[t]={};const e=this.defaults.values[t];e&&Object.keys(e).forEach(i=>{e[i].default?this.fieldDefaults[t][i]=e[i].default:this.fieldDefaults[t][i]=e[i]})}),a&&a.forEach(t=>{this.partsIds[t.id]=`part_${this.uid("part")}`,this.appParts[t.id]=t}),this.data.id=nt.findId(n);const d=nt.findMetadata(n),r=nt.findStartNodes(n);r.forEach(t=>{t.start&&"variables"!==t.start.tagName&&this.addSteps(this.blockToSteps(t.start))});const l=r.reduce((t,e)=>(e.preloaded&&t.appendChild(nt.cleanTree(e.preloaded)),t),n.cloneNode(!1));return this.data.defaultApp=JSON.stringify({source:e.Xml.domToText(l),parts:a}),this.data=this.runMiddlewares(this.data),Object.assign(this.data,d),this.data}static findId(t){const e=t.querySelector('block[type="generator_id"]');if(!e)return"missingno";const i=e.querySelector('field[name="ID"]');return[...t.querySelectorAll('block[type="generator_id"]')].forEach(t=>t.parentNode.removeChild(t)),i.innerText}static findMetadata(t){const e=t.querySelector('block[type="generator_metadata"]');if(!e)return{};const i=e.querySelector('field[name="JSON"]');let o;[...t.querySelectorAll('block[type="generator_metadata"]')].forEach(t=>t.parentNode.removeChild(t));try{o=JSON.parse(i.innerText)||{}}catch(a){o={}}return o}static findStartNodes(t){return[...t.cloneNode(!0).children].map(t=>{const e=t.querySelector('block[type="generator_start"]');if(!e)return{preloaded:null,start:t,root:t};const i=e.querySelector("next>block");if(!i)return e.parentNode.removeChild(e),{preloaded:t,start:null,root:null};e.parentNode.insertBefore(i,e),e.parentNode.removeChild(e),i.setAttribute("challenge-start-node","");const o=t.cloneNode(!0),a=o.querySelector("[challenge-start-node]");return i.parentNode.removeChild(i),{preloaded:t,start:a,root:o}})}static generatorBlockToSteps(t){switch(t.getAttribute("type")){case"generator_banner":return nt.generatorBannerToSteps(t);case"generator_step":return nt.generatorStepToSteps(t);default:return[]}}static generatorBannerToSteps(t){return[{banner:{text:t.querySelector('field[name="TEXT"]').innerText,next_button:!0}}]}static generatorStepToSteps(t){const e=t.querySelector('field[name="JSON"]').innerText;return[JSON.parse(e)]}parseComment(t){let e={};const i=t.querySelector("comment");if(!i||i.parentNode!==t)return e;try{e=JSON.parse(i.innerText)}catch(o){this.editor.logger.warn(`Could not parse comment '${i.innerText}'`)}return e}getCategoryLabel(t){switch(t){case"normal":return"Draw";default:{const{entries:e}=this.editor.toolbox;for(let o=0;o<e.length;o+=1){if(("blockly"===e[o].type?e[o].id:e[o].name)===t){return"blockly"===e[o].type?e[o].category.name:e[o].verbose}}const{addedParts:i}=this.editor;if(void 0!==i)for(let o=0;o<i.length;o+=1)if(i[o].id===t)return i[o].label;return t}}}fieldToSteps(t){let e=t.parentNode,i=nt.parseBlockType(e.getAttribute("type"));const o=e.tagName,a=[];let s,n,d,r=o,l=e;for(;"block"!==r;)"value"===(r=(l=l.parentNode).tagName)&&(d=d?{name:l.getAttribute("name"),shadow:d.shadow||d}:l.getAttribute("name"));if("variables_set"===i.block&&-1===this.data.variables.indexOf(t.firstChild.nodeValue)&&this.data.variables.push(t.firstChild.nodeValue),t.firstChild&&null!==t.firstChild.nodeValue){let r,c;if(n=t.getAttribute("name"),"shadow"===o?(s=e.parentNode.getAttribute("name"),e=e.parentNode.parentNode,i=nt.parseBlockType(e.getAttribute("type"))):s=n,s)if(this.fieldDefaults[i.block]){for(r=this.fieldDefaults[i.block][s];"object"==typeof r&&"shadow"in r&&"default"in r;)r=r.default;"object"==typeof r&&"id"in r?(c=r.label||r.id,r=r.id):r[n]?c=(r=r[n])[n]:this.fieldDefaults[i.block].label&&(c=this.fieldDefaults[i.block].label)}else this.editor.logger.warn("[CHALLENGE] Missing default field: ",i.block,s);const u=this.parseComment(e),h=this.normaliseType(t.firstChild.nodeValue);if(h!=(r=this.normaliseType(r))){const e=l.getAttribute("challengeId"),i=l.getAttribute("id"),o={shadow:d};e?o.id=e:o.rawId=i;const s=it.get(h),p=nt.generateFieldPreview(t,this.translate("field",s||h)),g=nt.generateFieldPreview(t,c||r);let f=u.bannerCopy||'Change "$currentFieldPreview" to "$fieldPreview"';f=(f=f.replace(/\$fieldPreview/g,p)).replace(/\$currentFieldPreview/g,g);const b={type:"change-input",block:Object.assign({inputName:n},o),bannerCopy:f},m=void 0===u.ignoreInputs?[]:u.ignoreInputs;(Array.isArray(m)&&-1===m.indexOf(n)||!Array.isArray(m)&&!0!==m)&&(/^#(?:[0-9a-fA-F]{3}){1,2}$/.test(t.firstChild.nodeValue)||(b.value=t.firstChild.nodeValue)),a.push(b)}}return a}normaliseType(t){if(0===t.length)return"&#160;";switch(typeof(t=t.length>0&&!isNaN(t)?parseInt(t):t)){case"string":return t.toLowerCase();case"number":return parseInt(t);default:return t}}blockToSteps(t){const e=`block_${this.uid("block")}`,i=t.getAttribute("type"),o=nt.parseBlockType(i);let a,s,n,d,r=[],l=t.parentNode;if(-1!==at.indexOf(i)){r=r.concat(nt.generatorBlockToSteps(t));const e=t.querySelector("next>block");return e?(t.parentNode.insertBefore(e,t),t.parentNode.removeChild(t),r.concat(this.blockToSteps(e))):r}t.setAttribute("challengeId",e);const c=l.tagName;o.category?this.partsIds[o.category]?a={rawPart:(s={rawPart:o.category,type:o.block}).rawPart}:(s=i,a=o.category):(o.category=this.defaults.categoryMap.get(o.block),a=o.category,s=o.block,-1===this.data.modules.indexOf(o.category)&&this.data.modules.push(o.category)),this.data.filterBlocks[o.category]=this.data.filterBlocks[o.category]||[],-1===this.data.filterBlocks[o.category].indexOf(o.block)&&this.data.filterBlocks[o.category].push(o.block),n=(n=this.getCategoryLabel(o.category))!==o.category?`the ${n}`:"this";const u=this.parseComment(t),h={type:"create-block",openFlyoutCopy:u.openFlyoutCopy||st.openFlyout(n),grabBlockCopy:u.grabBlockCopy||st.grabBlock,category:a,blockType:s,alias:e};if("next"===c?l=l.parentNode:"statement"===c||"value"===c?(d=l.getAttribute("name"),l=l.parentNode):l=null,l){let t,e=l;if("shadow"===l.tagName){const i=l.parentNode;"value"===i.tagName&&(t=i.getAttribute("name"),e=i.parentNode)}h.connectCopy=u.connectCopy||st.connect;const i={shadow:t,inputName:d},o=e.getAttribute("challengeId");o?i.id=o:i.rawId=e.getAttribute("id"),h.connectTo=i}else h.dropCopy=u.dropCopy||st.drop;r.push(h);for(let p=0;p<t.children.length;p+=1)r=r.concat(this.nodeToSteps(t.children[p]));return r}valueToSteps(t){let e,i=[];for(let o=0;o<t.children.length;o+=1)if("block"===t.children[o].tagName){e=t.children[o];break}return e||(e=t.firstChild),i=i.concat(this.nodeToSteps(e))}nodeToSteps(t){let e,i,o=[];switch(t.tagName){case"field":o=o.concat(this.fieldToSteps(t));break;case"next":case"value":o=o.concat(this.valueToSteps(t));break;case"statement":o=o.concat(this.nodeToSteps(t.firstChild));break;case"shadow":for(i=0;i<t.children.length;i+=1)e=t.children[i],o=o.concat(this.nodeToSteps(e));break;case"block":o=o.concat(this.blockToSteps(t))}return o}static generateFieldPreview(t,e){return`<kano-value-preview><span>${e}</span></kano-value-preview>`}static parseBlockType(t){const e=t.split("#"),i={};return e.length>1?[i.category,i.block]=e:[i.block]=e,i}_translate(t,e){return this.defaults.labels[t]&&this.defaults.labels[t][e]?this.defaults.labels[t][e]:e}static createFromApp(t){const e=new nt;return e.loadFromApp(t),e}}window.twemoji=function(){var t={base:"https://twemoji.maxcdn.com/2/",ext:".png",size:"72x72",className:"emoji",convert:{fromCodePoint:function(t){var e="string"==typeof t?parseInt(t,16):t;if(e<65536)return d(e);return d(55296+((e-=65536)>>10),56320+(1023&e))},toCodePoint:g},onerror:function(){this.parentNode&&this.parentNode.replaceChild(r(this.alt),this)},parse:function(e,o){o&&"function"!=typeof o||(o={callback:o});return("string"==typeof e?function(t,e){return p(t,function(t){var i,o,a=t,n=c(t),d=e.callback(n,e);if(d){for(o in a="<img ".concat('class="',e.className,'" ','draggable="false" ','alt="',t,'"',' src="',d,'"'),i=e.attributes(t,n))i.hasOwnProperty(o)&&0!==o.indexOf("on")&&-1===a.indexOf(" "+o+"=")&&(a=a.concat(" ",o,'="',i[o].replace(s,u),'"'));a=a.concat(">")}return a})}:function(t,e){var o,a,s,d,l,u,h,p,g,f,b,m,y,k=function t(e,i){var o,a,s=e.childNodes,d=s.length;for(;d--;)o=s[d],3===(a=o.nodeType)?i.push(o):1!==a||n.test(o.nodeName)||t(o,i);return i}(t,[]),_=k.length;for(;_--;){for(s=!1,d=document.createDocumentFragment(),l=k[_],u=l.nodeValue,p=0;h=i.exec(u);){if((g=h.index)!==p&&d.appendChild(r(u.slice(p,g))),b=h[0],m=c(b),p=g+b.length,y=e.callback(m,e)){for(a in(f=new Image).onerror=e.onerror,f.setAttribute("draggable","false"),o=e.attributes(b,m))o.hasOwnProperty(a)&&0!==a.indexOf("on")&&!f.hasAttribute(a)&&f.setAttribute(a,o[a]);f.className=e.className,f.alt=b,f.src=y,s=!0,d.appendChild(f)}f||d.appendChild(r(b)),f=null}s&&(p<u.length&&d.appendChild(r(u.slice(p))),l.parentNode.replaceChild(d,l))}return t})(e,{callback:o.callback||l,attributes:"function"==typeof o.attributes?o.attributes:h,base:"string"==typeof o.base?o.base:t.base,ext:o.ext||t.ext,size:o.folder||(a=o.size||t.size,"number"==typeof a?a+"x"+a:a),className:o.className||t.className,onerror:o.onerror||t.onerror});var a},replace:p,test:function(t){i.lastIndex=0;var e=i.test(t);return i.lastIndex=0,e}},e={"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"},i=/\ud83d[\udc68-\udc69](?:\ud83c[\udffb-\udfff])?\u200d(?:\u2695\ufe0f|\u2696\ufe0f|\u2708\ufe0f|\ud83c[\udf3e\udf73\udf93\udfa4\udfa8\udfeb\udfed]|\ud83d[\udcbb\udcbc\udd27\udd2c\ude80\ude92])|(?:\ud83c[\udfcb\udfcc]|\ud83d\udd75|\u26f9)(?:\ufe0f|\ud83c[\udffb-\udfff])\u200d[\u2640\u2642]\ufe0f|(?:\ud83c[\udfc3\udfc4\udfca]|\ud83d[\udc6e\udc71\udc73\udc77\udc81\udc82\udc86\udc87\ude45-\ude47\ude4b\ude4d\ude4e\udea3\udeb4-\udeb6]|\ud83e[\udd26\udd37-\udd39\udd3d\udd3e\uddd6-\udddd])(?:\ud83c[\udffb-\udfff])?\u200d[\u2640\u2642]\ufe0f|\ud83d\udc68\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83d\udc68|\ud83d\udc68\u200d\ud83d\udc68\u200d\ud83d\udc66\u200d\ud83d\udc66|\ud83d\udc68\u200d\ud83d\udc68\u200d\ud83d\udc67\u200d\ud83d[\udc66\udc67]|\ud83d\udc68\u200d\ud83d\udc69\u200d\ud83d\udc66\u200d\ud83d\udc66|\ud83d\udc68\u200d\ud83d\udc69\u200d\ud83d\udc67\u200d\ud83d[\udc66\udc67]|\ud83d\udc69\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83d[\udc68\udc69]|\ud83d\udc69\u200d\ud83d\udc69\u200d\ud83d\udc66\u200d\ud83d\udc66|\ud83d\udc69\u200d\ud83d\udc69\u200d\ud83d\udc67\u200d\ud83d[\udc66\udc67]|\ud83d\udc68\u200d\u2764\ufe0f\u200d\ud83d\udc68|\ud83d\udc68\u200d\ud83d\udc66\u200d\ud83d\udc66|\ud83d\udc68\u200d\ud83d\udc67\u200d\ud83d[\udc66\udc67]|\ud83d\udc68\u200d\ud83d\udc68\u200d\ud83d[\udc66\udc67]|\ud83d\udc68\u200d\ud83d\udc69\u200d\ud83d[\udc66\udc67]|\ud83d\udc69\u200d\u2764\ufe0f\u200d\ud83d[\udc68\udc69]|\ud83d\udc69\u200d\ud83d\udc66\u200d\ud83d\udc66|\ud83d\udc69\u200d\ud83d\udc67\u200d\ud83d[\udc66\udc67]|\ud83d\udc69\u200d\ud83d\udc69\u200d\ud83d[\udc66\udc67]|\ud83c\udff3\ufe0f\u200d\ud83c\udf08|\ud83c\udff4\u200d\u2620\ufe0f|\ud83d\udc41\u200d\ud83d\udde8|\ud83d\udc68\u200d\ud83d[\udc66\udc67]|\ud83d\udc69\u200d\ud83d[\udc66\udc67]|\ud83d\udc6f\u200d\u2640\ufe0f|\ud83d\udc6f\u200d\u2642\ufe0f|\ud83e\udd3c\u200d\u2640\ufe0f|\ud83e\udd3c\u200d\u2642\ufe0f|\ud83e\uddde\u200d\u2640\ufe0f|\ud83e\uddde\u200d\u2642\ufe0f|\ud83e\udddf\u200d\u2640\ufe0f|\ud83e\udddf\u200d\u2642\ufe0f|(?:[\u0023\u002a\u0030-\u0039])\ufe0f?\u20e3|(?:(?:\ud83c[\udfcb\udfcc]|\ud83d[\udd74\udd75\udd90]|[\u261d\u26f7\u26f9\u270c\u270d])(?:\ufe0f|(?!\ufe0e))|\ud83c[\udf85\udfc2-\udfc4\udfc7\udfca]|\ud83d[\udc42\udc43\udc46-\udc50\udc66-\udc69\udc6e\udc70-\udc78\udc7c\udc81-\udc83\udc85-\udc87\udcaa\udd7a\udd95\udd96\ude45-\ude47\ude4b-\ude4f\udea3\udeb4-\udeb6\udec0\udecc]|\ud83e[\udd18-\udd1c\udd1e\udd1f\udd26\udd30-\udd39\udd3d\udd3e\uddd1-\udddd]|[\u270a\u270b])(?:\ud83c[\udffb-\udfff]|)|\ud83c\udff4\udb40\udc67\udb40\udc62\udb40\udc65\udb40\udc6e\udb40\udc67\udb40\udc7f|\ud83c\udff4\udb40\udc67\udb40\udc62\udb40\udc73\udb40\udc63\udb40\udc74\udb40\udc7f|\ud83c\udff4\udb40\udc67\udb40\udc62\udb40\udc77\udb40\udc6c\udb40\udc73\udb40\udc7f|\ud83c\udde6\ud83c[\udde8-\uddec\uddee\uddf1\uddf2\uddf4\uddf6-\uddfa\uddfc\uddfd\uddff]|\ud83c\udde7\ud83c[\udde6\udde7\udde9-\uddef\uddf1-\uddf4\uddf6-\uddf9\uddfb\uddfc\uddfe\uddff]|\ud83c\udde8\ud83c[\udde6\udde8\udde9\uddeb-\uddee\uddf0-\uddf5\uddf7\uddfa-\uddff]|\ud83c\udde9\ud83c[\uddea\uddec\uddef\uddf0\uddf2\uddf4\uddff]|\ud83c\uddea\ud83c[\udde6\udde8\uddea\uddec\udded\uddf7-\uddfa]|\ud83c\uddeb\ud83c[\uddee-\uddf0\uddf2\uddf4\uddf7]|\ud83c\uddec\ud83c[\udde6\udde7\udde9-\uddee\uddf1-\uddf3\uddf5-\uddfa\uddfc\uddfe]|\ud83c\udded\ud83c[\uddf0\uddf2\uddf3\uddf7\uddf9\uddfa]|\ud83c\uddee\ud83c[\udde8-\uddea\uddf1-\uddf4\uddf6-\uddf9]|\ud83c\uddef\ud83c[\uddea\uddf2\uddf4\uddf5]|\ud83c\uddf0\ud83c[\uddea\uddec-\uddee\uddf2\uddf3\uddf5\uddf7\uddfc\uddfe\uddff]|\ud83c\uddf1\ud83c[\udde6-\udde8\uddee\uddf0\uddf7-\uddfb\uddfe]|\ud83c\uddf2\ud83c[\udde6\udde8-\udded\uddf0-\uddff]|\ud83c\uddf3\ud83c[\udde6\udde8\uddea-\uddec\uddee\uddf1\uddf4\uddf5\uddf7\uddfa\uddff]|\ud83c\uddf4\ud83c\uddf2|\ud83c\uddf5\ud83c[\udde6\uddea-\udded\uddf0-\uddf3\uddf7-\uddf9\uddfc\uddfe]|\ud83c\uddf6\ud83c\udde6|\ud83c\uddf7\ud83c[\uddea\uddf4\uddf8\uddfa\uddfc]|\ud83c\uddf8\ud83c[\udde6-\uddea\uddec-\uddf4\uddf7-\uddf9\uddfb\uddfd-\uddff]|\ud83c\uddf9\ud83c[\udde6\udde8\udde9\uddeb-\udded\uddef-\uddf4\uddf7\uddf9\uddfb\uddfc\uddff]|\ud83c\uddfa\ud83c[\udde6\uddec\uddf2\uddf3\uddf8\uddfe\uddff]|\ud83c\uddfb\ud83c[\udde6\udde8\uddea\uddec\uddee\uddf3\uddfa]|\ud83c\uddfc\ud83c[\uddeb\uddf8]|\ud83c\uddfd\ud83c\uddf0|\ud83c\uddfe\ud83c[\uddea\uddf9]|\ud83c\uddff\ud83c[\udde6\uddf2\uddfc]|\ud800\udc00|\ud83c[\udccf\udd8e\udd91-\udd9a\udde6-\uddff\ude01\ude32-\ude36\ude38-\ude3a\ude50\ude51\udf00-\udf20\udf2d-\udf35\udf37-\udf7c\udf7e-\udf84\udf86-\udf93\udfa0-\udfc1\udfc5\udfc6\udfc8\udfc9\udfcf-\udfd3\udfe0-\udff0\udff4\udff8-\udfff]|\ud83d[\udc00-\udc3e\udc40\udc44\udc45\udc51-\udc65\udc6a-\udc6d\udc6f\udc79-\udc7b\udc7d-\udc80\udc84\udc88-\udca9\udcab-\udcfc\udcff-\udd3d\udd4b-\udd4e\udd50-\udd67\udda4\uddfb-\ude44\ude48-\ude4a\ude80-\udea2\udea4-\udeb3\udeb7-\udebf\udec1-\udec5\uded0-\uded2\udeeb\udeec\udef4-\udef8]|\ud83e[\udd10-\udd17\udd1d\udd20-\udd25\udd27-\udd2f\udd3a\udd3c\udd40-\udd45\udd47-\udd4c\udd50-\udd6b\udd80-\udd97\uddc0\uddd0\uddde-\udde6]|[\u23e9-\u23ec\u23f0\u23f3\u2640\u2642\u2695\u26ce\u2705\u2728\u274c\u274e\u2753-\u2755\u2795-\u2797\u27b0\u27bf\ue50a]|(?:\ud83c[\udc04\udd70\udd71\udd7e\udd7f\ude02\ude1a\ude2f\ude37\udf21\udf24-\udf2c\udf36\udf7d\udf96\udf97\udf99-\udf9b\udf9e\udf9f\udfcd\udfce\udfd4-\udfdf\udff3\udff5\udff7]|\ud83d[\udc3f\udc41\udcfd\udd49\udd4a\udd6f\udd70\udd73\udd76-\udd79\udd87\udd8a-\udd8d\udda5\udda8\uddb1\uddb2\uddbc\uddc2-\uddc4\uddd1-\uddd3\udddc-\uddde\udde1\udde3\udde8\uddef\uddf3\uddfa\udecb\udecd-\udecf\udee0-\udee5\udee9\udef0\udef3]|[\u00a9\u00ae\u203c\u2049\u2122\u2139\u2194-\u2199\u21a9\u21aa\u231a\u231b\u2328\u23cf\u23ed-\u23ef\u23f1\u23f2\u23f8-\u23fa\u24c2\u25aa\u25ab\u25b6\u25c0\u25fb-\u25fe\u2600-\u2604\u260e\u2611\u2614\u2615\u2618\u2620\u2622\u2623\u2626\u262a\u262e\u262f\u2638-\u263a\u2648-\u2653\u2660\u2663\u2665\u2666\u2668\u267b\u267f\u2692-\u2694\u2696\u2697\u2699\u269b\u269c\u26a0\u26a1\u26aa\u26ab\u26b0\u26b1\u26bd\u26be\u26c4\u26c5\u26c8\u26cf\u26d1\u26d3\u26d4\u26e9\u26ea\u26f0-\u26f5\u26f8\u26fa\u26fd\u2702\u2708\u2709\u270f\u2712\u2714\u2716\u271d\u2721\u2733\u2734\u2744\u2747\u2757\u2763\u2764\u27a1\u2934\u2935\u2b05-\u2b07\u2b1b\u2b1c\u2b50\u2b55\u3030\u303d\u3297\u3299])(?:\ufe0f|(?!\ufe0e))/g,o=/\uFE0F/g,a=String.fromCharCode(8205),s=/[&<>'"]/g,n=/IFRAME|NOFRAMES|NOSCRIPT|SCRIPT|SELECT|STYLE|TEXTAREA|[a-z]/,d=String.fromCharCode;return t;function r(t){return document.createTextNode(t)}function l(t,e){return"".concat(e.base,e.size,"/",t,e.ext)}function c(t){return g(t.indexOf(a)<0?t.replace(o,""):t)}function u(t){return e[t]}function h(){return null}function p(t,e){return String(t).replace(i,e)}function g(t,e){for(var i=[],o=0,a=0,s=0;s<t.length;)o=t.charCodeAt(s++),a?(i.push((65536+(a-55296<<10)+(o-56320)).toString(16)),a=0):55296<=o&&o<=56319?a=o:i.push(o.toString(16));return i.join(e||"-")}}();var dt=["","-ms-","-webkit-","-moz-","-o-"];window.DOMUtil=window.DOMUtil||{addVendorProperty:function(t,e,i){var o;for(o in dt)t.style[dt[o]+e]=i},removeVendorProperty:function(t,e){var i;for(i in dt)t.style[dt[i]+e]=null}},o.Polymer({_template:t.html`
        <style>
            :host {
                display: block;
                position: fixed;
                top: 0px;
                right: 0px;
                left: 0px;
                bottom: 0px;
                pointer-events: none;
                visibility: hidden;
            }

            :host .line {
                stroke: black;
                stroke-width: 3;
                fill: transparent;
            }
        </style>
        <slot id="content" name="arrow-image"></slot>
`,is:"kano-arrow",properties:{source:{type:Object},target:{type:Object},angle:{type:Number,value:0},offset:{type:Number,value:0},leftAlign:{type:Boolean},bounce:{type:Number,value:40}},observers:["updatePosition(target.*)","updatePosition(source.*)","updatePosition(angle)","updatePosition(bounce)"],attached(){this.animationSupported="animate"in HTMLElement.prototype},ready(){this.arrowImage=o.dom(this.$.content).getDistributedNodes()[0],window.addEventListener("resize",this.updatePosition.bind(this))},detached(){window.removeEventListener("resize",this.updatePosition.bind(this))},hide(){this.style.display="none",this.transform("",this.arrowImage)},updatePosition(){this.arrowImage&&this.debounce("updatePosition",()=>{if(!this.target)return this.hide();this.style.display="block",this.source?this._showWithSource():this._showWithoutSource()},10)},_showWithSource(){let t,e,i,o,a,s,n,d,r,l,c=this.target,u=this.source,h=this.arrowImage.style;a=u.left+u.width/2,n=u.top+u.height/2,r=a+((s=c.left+c.width/2)-a)/2,l=n+((d=c.top+c.height/2)-n)/2,r-=this.arrowImage.offsetWidth/2,l-=this.arrowImage.offsetHeight/2,t=Math.atan2(d-n,s-a)+Math.PI,e=Math.sqrt(Math.pow(s-a,2)+Math.pow(d-n,2))+this.offset,i=Math.cos(t)*(.2*e),o=Math.sin(t)*(.2*e),h.position="fixed",DOMUtil.addVendorProperty(this.arrowImage,"transform-origin","50% 50%"),this.style.visibility="visible",this.noAnimations||this.alreadyAnimated||!this.animationSupported||(this.arrowImage.animate([{transform:`translate(${r+i}px, ${l+o}px) rotate(${t}rad)`,opacity:0},{transform:`translate(${r}px, ${l}px) rotate(${t}rad)`,opacity:1}],{duration:700/e*(.2*e),easing:"cubic-bezier(0.2, 0, 0.13, 1.5)",fill:"forwards"}),this.alreadyAnimated=!0)},_showWithoutSource(){let t,e,i,o,a=this.target,s=this.arrowImage.style,n=this.arrowImage.getBoundingClientRect(),d=this.angle/180*Math.PI,r=a.height-2*this.offset,l=a.width-2*this.offset,c=a.top+this.offset,u=a.left+this.offset,h=Math.sqrt(Math.pow(r/2,2)+Math.pow(l/2,2)),p=Math.cos(d)*h,g=Math.sin(d)*h;this.leftAlign?(t=a.left-n.width/2,e=a.top-n.height/2):(t=Math.min(p*h,l/2),e=Math.min(g*h,r/2),t+=u,e+=c,t+=l/2,e+=r/2,e-=this.arrowImage.offsetHeight/2,e=Math.max(e,c-n.height/2),t=Math.max(t,u-n.width/2)),i=Math.cos(d)*this.bounce,o=Math.sin(d)*this.bounce,s.position="fixed",s.visibility="visible",DOMUtil.addVendorProperty(this.arrowImage,"transform-origin","0% 50%"),this.bounce?this.arrowImage.animate([{transform:`translate(${t+i}px, ${e+o}px) rotate(${d}rad)`},{transform:`translate(${t}px, ${e}px) rotate(${d}rad)`},{transform:`translate(${t+i}px, ${e+o}px) rotate(${d}rad)`}],{duration:25*this.bounce,easing:"ease-in-out",iterations:1/0}):this.transform(`translate(${t}px, ${e}px) rotate(${d}rad)`,this.arrowImage)},_tickBounce(){}}),o.Polymer({_template:t.html`
        <style include="kwc-blockly-style"></style>
        <style>
            :host {
                display: block;
                pointer-events: none;
            }
            svg path.blocklyPathDark, svg path.blocklyPathLight {
                display: none;
            }
            svg text.blocklyText {
                fill: white;
            }
            svg g.blocklyEditableText {
                fill: white;
                fill-opacity: 0.6;
            }
            svg .blocklyEditableText text.blocklyText {
                fill: black;
                font-size: 16px;
            }
        </style>
        <svg xmlns="http://www.w3.org/2000/svg" id="svg"></svg>
`,is:"kano-blockly-block",properties:{type:{type:String,observer:"_typeChanged"}},_createWorskspace(){this.ws=new Blockly.WorkspaceSvg({}),this.ws.isFlyout=!0,this.wsDom=this.ws.createDom(),this.transform("translate(10px, 0px)",this.wsDom),this.$.svg.appendChild(this.wsDom)},_typeChanged(t){this.ws||this._createWorskspace();let e;e=Blockly.Xml.textToDom(`<xml><block type="${t}" ></block></xml>`),this.ws.clear(),this.ws.scale=.9,this.async(()=>{try{Blockly.Xml.domToWorkspace(e,this.ws)}catch(t){}this._updateSvgSize()})},_updateSvgSize(){const t=this.wsDom.getBoundingClientRect();this.$.svg.style.width=`${t.width+10}px`,this.$.svg.style.height=`${t.height}px`},getBlock(){return this.ws.getAllBlocks()[0]},detached(){this.ws&&this.ws.dispose()}}),o.Polymer({_template:t.html`
        <style>
            :host {
                display: block;
                visibility: hidden;
                border: 2px solid #a6fbff;
                border-radius: 4px;
                @apply(--shadow-elevation-4dp);
                position: fixed;
                top: 0px;
                left: 0px;
                padding: 7px;
                box-sizing: border-box;
                pointer-events: none;
            }
        </style>
`,is:"kano-highlight",properties:{x:{type:Number,value:0},y:{type:Number,value:0},width:{type:Number,value:50},height:{type:Number,value:50}},observers:["_update(x, y, width, height)"],attached(){this.animationSupported="animate"in HTMLElement.prototype},ready(){this.hidden=!0},_update(){this.style.width=`${this.width+14}px`,this.style.height=`${this.height+14}px`},show(){this.style.visibility="visible",this._pause(),this.animationSupported?this.animation=this.animate([{transform:`translate(${this.x-7}px, ${this.y-7}px) scale(4)`,opacity:0},{transform:`translate(${this.x-7}px, ${this.y-7}px)`,opacity:1}],{duration:200,fill:"forwards",easing:"ease-in-out"}):(this.style.opacity=1,this.style.transform=`translate(${this.x-7}px, ${this.y-7}px)`),this.hidden=!1},hide(){this.hidden||(this.animationSupported?(this._pause(),this.animation=this.animate([{transform:`translate(${this.x-5||0}px, ${this.y-5||0}px)`,opacity:1},{transform:`translate(${this.x-5||0}px, ${this.y-5||0}px) scale(4)`,opacity:0}],{duration:200,fill:"forwards",easing:"ease-in-out"}),this.animation.finished.then(()=>{this.style.visibility="hidden"})):(this.style.opacity=0,this.style.transform=`translate(${this.x-5||0}px, ${this.y-5||0}px) scale(4)`,this.style.visibility="hidden"),this.hidden=!0)},_pause(){this.animation&&this.animation.pause()}});const rt=/#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})/;o.Polymer({_template:t.html`
        <style>
            :host {
                display: inline-block;
                vertical-align: middle;
            }
            :host .color-value {
                border-radius: 3px;
                border: 1px solid rgba(0, 0, 0, 0.55);
                width: 24px;
                height: 18px;
            }
            :host #input {
                border-radius: 3px;
                color: black;
                background: var(--kano-value-preview-input-background, rgba(255, 255, 255, 0.7));
                padding: 2px 6px;
                line-height: 1;
            }
            [hidden] {
                display: none !important;
            }
        </style>
        <div id="display" class\$="[[type]]">
            <div id="input" hidden\$="[[_isType(type, 'color-value')]]">
                <slot></slot>
            </div>
        </div>
`,is:"kano-value-preview",properties:{type:{type:String,value:null}},attached(){this._render()},_render(){let t=this.textContent;rt.exec(t)?(this.type="color-value",this.$.display.style.backgroundColor=t,this.$.input.innerHTML=""):this.type="simple-value"},_isType:(t,e)=>t===e});o.Polymer({_template:t.html`
        <style>
            @keyframes pop-in {
                0% {
                    transform: scale(0, 0);
                }
                80% {
                    transform: scale(1.3, 1.3);
                }
                100% {
                    transform: scale(1.0, 1.0);
                }
            }
            @keyframes ring {
                0% {
                    transform: scale(0, 0);
                    opacity: 0.8;
                }
                20% {
                    transform: scale(1.0, 1.0);
                    opacity: 0;
                }
                /* 2 */
                20.5% {
                    transform: scale(0, 0);
                    opacity: 0;
                }
                21% {
                    transform: scale(0, 0);
                    opacity: 0.8;
                }
                40% {
                    transform: scale(1.0, 1.0);
                    opacity: 0;
                }
                /* 3 */
                40.5% {
                    transform: scale(0, 0);
                    opacity: 0;
                }
                41% {
                    transform: scale(0, 0);
                    opacity: 0.8;
                }
                60% {
                    transform: scale(1.0, 1.0);
                    opacity: 0;
                }
                /* 4 */
                60.5% {
                    transform: scale(0, 0);
                    opacity: 0;
                }
                61% {
                    transform: scale(0, 0);
                    opacity: 0.8;
                }
                80% {
                    transform: scale(1.0, 1.0);
                    opacity: 0;
                }
                /* 5 */
                80.5% {
                    transform: scale(0, 0);
                    opacity: 0;
                }
                81% {
                    transform: scale(0, 0);
                    opacity: 1.0;
                }
                100% {
                    transform: scale(2.5, 2.5);
                    opacity: 0;
                }
            }
            @keyframes jump {
                0% {
                    transform: scale(1.0, 1.0);
                }
                80% {
                    transform: scale(1.0, 1.0);
                }
                82% {
                    transform: scale(1.3, 1.3);
                }
                83.5% {
                    transform: scale(0.9, 0.9);
                }
                85% {
                    transform: scale(1, 1);
                }
                100% {
                    transform: scale(1.0, 1.0);
                }
            }
            @keyframes ripple {
                0% {
                    transform: scale(0, 0);
                    opacity: 1;
                }
                80% {
                    transform: scale(0, 0);
                    opacity: 1;
                }
                89% {
                    opacity: 0.05;
                }
                100% {
                    transform: scale(1.0, 1.0);
                    opacity: 0;
                }
            }
            :host {
                @apply --layout-vertical;
                flex: 1;
                --tooltip-color: white;
            }
            :host .instruction-overlay {
                @apply --layout-horizontal;
                @apply --layout-center;
                @apply --layout-center-justified;
                padding: 5px;
            }
            :host button {
                @apply --kano-button;
                background-color: var(--color-grassland);
                color: #fff;
                text-shadow: none;
                font-size: 14px;
                font-weight: bold;
                line-height: 18px;
                border-radius: 3px;
                padding: 7px 24px;
                margin-left: 12px;
            }
            :host #modal {
                border-radius: 4px;
            }
            :host .modal-content {
                @apply --layout-vertical;
                @apply --layout-center;
                @apply --layout-center-justified;
                font-family: var(--font-body, Arial);
                font-size: 16px;
                color: black;
            }
            :host .modal-content button {
                @apply --kano-button;
                margin: 15px 0 0;
                color: #435055;
            }
            :host .tooltip-content {
                @apply --layout-vertical;
                @apply --layout-center;
            }
            :host .tooltip-content button {
                margin: 12px 0 0 0;
            }
            kano-tooltip {
                z-index: 201;
                --kano-tooltip-background-color: var(--tooltip-color);
                --kano-tooltip-border-color: white;
                --kano-tooltip-border-width: 1px;
                color: black;
                font-family: var(--font-body);
                --kano-tooltip: {
                    padding: 16px 26px 16px;
                };
            }
            kano-arrow {
                z-index: 201;
            }
            [slot="markdown-html"] p {
                line-height: 18px;
            }
            [slot="markdown-html"] img {
                max-height: 50px;
            }
            [slot="markdown-html"] img:not(:first-child) {
                margin-top: 12px;
            }
            .markdown-html kano-blockly-block {
                line-height: 0px;
                vertical-align: middle;
                display: inline-block;
            }
            .beacon-wrapper {
                position: relative;
                max-width: 30px;
                @apply --layout-vertical;
                @apply --layout-center;
                @apply --layout-center-justified;
            }
            .beacon {
                width: 30px;
                height: 30px;
                border-radius: 50%;
                @apply --layout-vertical;
                @apply --layout-center;
                @apply --layout-center-justified;
            }
            .beacon.animate {
                animation: 150ms ease-in pop-in;
                animation-delay: 0ms;
                animation-iteration-count: 1;
            }
            .beacon .core {
                width: 12px;
                height: 12px;
                background: #fec02d;
                border-radius: 50%;
                border: 2px solid white;
                box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.15);
            }
            .beacon .core.animate {
                animation: 5s ease-in-out jump;
                animation-delay: 400ms;
                animation-iteration-count: infinite;
            }
            .beacon-wrapper .ripple {
                position: absolute;
                top: -135px;
                left: -135px;
                width: 300px;
                height: 300px;
                border-radius: 50%;
                border: 1px solid rgba(254, 192, 45, 1.0);
                box-sizing: border-box;
                transform: scale(0, 0);
            }
            .beacon-wrapper .ripple.animate {
                animation: 5s ease-out ripple;
                animation-delay: 400ms;
                animation-iteration-count: infinite;
            }
            .beacon-wrapper .ring {
                position: absolute;
                top: -10px;
                left: -10px;
                width: 50px;
                height: 50px;
                border-radius: 50%;
                background: #fec02d;
                box-sizing: border-box;
                transform: scale(0, 0);
            }
            .beacon-wrapper .ring.animate {
                animation: 5s ease-out infinite ring;
                animation-delay: 400ms;
            }
            .markdown-html p {
                margin: 0px;
            }
            .tooltip-content .emoji, .modal-content .emoji {
                max-width: 18px;
                max-height: 18px;
                transform: translateY(4px);
            }
            [hidden] {
                visibility: hidden !important;
                opacity: 0 !important;
            }
        </style>
        <slot name="editor" id="content"></slot>
        <kano-highlight id="highlight" x="[[highlight.x]]" y="[[highlight.y]]" width="[[highlight.width]]" height="[[highlight.height]]" hidden\$="[[idle]]"></kano-highlight>
        <kano-arrow source="[[arrow.source]]" target="[[arrow.target]]" angle="[[arrow.angle]]" id="arrow" hidden\$="[[idle]]">
            <iron-image slot="arrow-image" src="/assets/icons/white_arrow.svg" width="[[arrow.size]]" height="[[arrow.size]]" sizing="contain"></iron-image>
        </kano-arrow>
        <kano-arrow target="[[_beacon.target]]" bounce="0" angle="[[_beacon.angle]]" offset="[[_beacon.offset]]" left-align="[[_beacon.leftAlign]]" hidden\$="[[idle]]">
            <div class="beacon-wrapper" slot="arrow-image">
                <div class="ripple" id="ripple" on-animationiteration="_ringAnimationIterated" on-animationstart="_ringAnimationIterated"></div>
                <div class="ring" id="ring"></div>
                <div class="beacon" id="beacon">
                    <div class="core" id="core"></div>
                </div>
            </div>
        </kano-arrow>
        <template is="dom-repeat" items="[[_tooltips]]" as="tooltip" on-dom-change="_tooltipDomChanged">
            <kano-tooltip id\$="tooltip-[[index]]" target="[[tooltip.target]]" position="[[tooltip.position]]" z-index="[[tooltip.zIndex]]" tracking="[[tooltip.tracking]]" bounce\$="[[tooltip.bounce]]" on-tap="_stopPropagation" hidden\$="[[idle]]">
                <div class="tooltip-content">
                    <div class="tooltip-text">
                        <marked-element markdown="[[tooltip.text]]">
                            <div class="markdown-html" slot="markdown-html"></div>
                        </marked-element>
                    </div>
                    <button type="button" on-tap="_nextStep" hidden\$="[[!tooltip.next_button]]">[[localize('NEXT', 'Next')]]</button>
                </div>
            </kano-tooltip>
        </template>
        <paper-dialog id="modal" modal="">
            <div class="modal-content">
                <div class="text">
                    <marked-element markdown="[[selectedStep.modal.text]]">
                        <div class="markdown-html" slot="markdown-html"></div>
                    </marked-element>
                </div>
                <button type="button" on-tap="_nextStep">[[localize('NEXT', 'Next')]]</button>
            </div>
        </paper-dialog>
`,is:"kano-challenge-ui",behaviors:[e.AppElementRegistryBehavior,e.SoundPlayerBehavior,e.I18nBehavior,r.IronResizableBehavior],properties:{tooltips:{type:Array},arrow:{type:Object},beacon:Object,state:{type:Object,value:()=>({hints:{enabled:!0}}),notify:!0},idle:{type:Boolean,observer:"_onIdleChanged"}},observers:["_setupWithDelay(step, state.*)","_updateBeacon(beacon.*)","_updateTooltips(tooltips.*)"],listeners:{change:"_editorChanged"},_stopPropagation(t){t.preventDefault(),t.stopPropagation()},_editorChanged(t){let e=t.detail;this.done||this.tooltips&&"blockly"===e.type&&"move"===e.event.type&&this.updateTooltips()},setMediaPath(t){this._mediaPath=t,this._dingSound=`${t}/assets/audio/sounds/ding.mp3`,this.loadSound(this._dingSound)},ready(){this.modal=this.$.modal,this.highlight={},this._onRefit=this._onRefit.bind(this),this.eventsCausingRefit={"toolbox-scroll":["flyout_block"],"workspace-scroll":["block"],"block-move":["block"],"iron-resize":"all"}},attached(){this.updateTooltips=this.updateTooltips.bind(this),this.addEventListener("mousewheel",this.updateTooltips,!0),window.addEventListener("resize",this.updateTooltips),Object.keys(this.eventsCausingRefit).forEach(t=>{this.addEventListener(t,this._onRefit)}),this.animationSupported="animate"in HTMLElement.prototype},detached(){this.removeEventListener("mousewheel",this.updateTooltips),window.removeEventListener("resize",this.updateTooltips),Object.keys(this.eventsCausingRefit).forEach(t=>{this.removeEventListener(t,this._onRefit)})},getToolbox(){return this.workspace.toolbox},_nextStep(){this.fire("next-step")},_onResize(){this.beacon&&this._fitBeacon(this.beacon),this._fitTooltips(this.tooltips)},_onRefit(t){const e=this.eventsCausingRefit[t.type];this._refitUiElements(e)},_refitUiElements(t){this.beacon&&this._targetIsConcerned(this.beacon.target,t)&&this._fitBeacon(this.beacon),this._fitTooltips(this.tooltips)},_targetIsConcerned:(t,e)=>"all"===e||"object"==typeof t&&Object.keys(t).some(t=>-1!==e.indexOf(t)),_updateTooltips(){this.computeTooltips()},computeTooltips(){const{tooltips:t}=this;this.set("_tooltips",[]),this.debounce("computeTooltips",()=>{this._fitTooltips(t,!0)},200)},_fitTooltips(t,e){if(!t)return;const i=t.map(t=>{const i=Object.assign({},t);if(i.target=this._getTargetElement(t.location),i.target)return"getBoundingClientRect"in i.target&&(i.target=i.target.getBoundingClientRect()),e&&this._scrollWorkspaceOnTargetIfNeeded(i.target,t.location),i.text=t.text,i.tracking=!!t.tracking,i});this.set("_tooltips",[]),this.async(()=>{this.set("_tooltips",i)})},_tooltipDomChanged(t){let e,i,a,s=o.dom(this.root).querySelectorAll("kano-tooltip[bounce]");for(let o=0;o<s.length;o++)e=70,i="top"===(a=s[o]).position||"bottom"===a.position?"translateY":"translateX","top"!==a.position&&"left"!==a.position||(e*=-1),s[o].animate([{transform:`${i}(${e}px)`},{transform:`${i}(0px)`},{transform:`${i}(${e}px)`}],{duration:1e3,easing:"ease-in-out",iterations:1/0})},_updateBeacon(){this.computeBeacon()},computeBeacon(){const{beacon:t}=this;this.animationSupported?this.$.beacon.animate({opacity:[1,0]},{duration:200,fill:"forwards"}):this.$.beacon.style.opacity=1,clearTimeout(this._ringSoundTimeout),this._ringAnimationCount=0,this.toggleClass("animate",!1,this.$.beacon),this.toggleClass("animate",!1,this.$.ring),this.toggleClass("animate",!1,this.$.ripple),this.toggleClass("animate",!1,this.$.core),t&&this.async(()=>{this._fitBeacon(t,!0)},300)},_scrollWorkspaceOnTargetIfNeeded(t,e){if(e&&e.block){let i,o=this.workspace,a=o.svgBackground_.getBoundingClientRect();Math.max(document.documentElement.clientWidth,window.innerWidth||0),Math.max(document.documentElement.clientHeight,window.innerHeight||0);(t&&t.top+t.height>a.top+a.height||t.left+t.width>a.left+a.width||t.top<0||t.left<0)&&(i=this.getTargetBlock(e.block),o.scrollBlockIntoView(i,!0))}},_fitBeacon(t,e){let i=this._getTargetElement(t.target),o=t.angle||0,a=t.offset||10,s=t.leftAlign||!1,n=(Math.max(document.documentElement.clientWidth,window.innerWidth||0),Math.max(document.documentElement.clientHeight,window.innerHeight||0));if(i&&"getBoundingClientRect"in i&&(i=i.getBoundingClientRect()),e&&this._scrollWorkspaceOnTargetIfNeeded(i,t.target),i&&i.top+i.height>n&&t.target.flyout_block){const t=this._getElement("blockly-toolbox");t.scrollTop=t.scrollTop+(i.top+i.height-n)+300}this.set("_beacon",{target:i,angle:o,offset:a,leftAlign:s}),this.animationSupported?this.$.beacon.animate({opacity:[0,1]},{duration:200,delay:10,fill:"forwards"}):this.$.beacon.style.opacity=1,this.toggleClass("animate",!0,this.$.beacon),this.toggleClass("animate",!0,this.$.ring),this.toggleClass("animate",!0,this.$.ripple),this.toggleClass("animate",!0,this.$.core)},_ringAnimationIterated(){this._ringAnimationCount>4||this.idle||(this._ringSoundTimeout=setTimeout(()=>{this._dingSound&&this.playSound(this._dingSound),this._ringAnimationCount+=1},3680))},_onIdleChanged(t){t&&(clearTimeout(this._ringSoundTimeout),this._ringAnimationCount=0)},focusOn(t){let e=this._getTargetElement(t);e=e.getBoundingClientRect(),this.set("highlight.x",e.left),this.set("highlight.y",e.top),this.set("highlight.width",e.width),this.set("highlight.height",e.height),this.$.highlight.show()},_getTargetElement(t){let e,i,o=this.editor;if("object"==typeof t){if(t.block){if(e=this.getTargetBlock(t.block),t.block.inputName){const e=this.getTargetBlockInput(t.block);return e||this._notifyError("Could not find input",t.block),e}return e&&e.svgPath_||this._notifyError("Could not find block",t.block),e&&e.svgPath_}if(t.category){let e=this._getElement("blockly-toolbox").getCategoryElement(t.category);return e||this._notifyError("Could not find category",t.category),e}if(t.flyout_block){const e=this._getElement("blockly-flyout").getBlockByType(t.flyout_block);return e||this._notifyError("Could not find block in flyout",t.flyout_block),e.getSvgRoot()}t.root&&(o=document.querySelector(t.root),t=t.path)}return(i=this._getElement(t))||this._notifyError("Could not find element",t),i},_notifyError(t,e){this.fire("challenge-ui-error",{message:t,detail:e})},updateTooltips(){this.debounce("updateTooltips",()=>{if(this.tooltips)for(let t=0;t<this.tooltips.length;t++)this.$$(`#tooltip-${t}`).tracking&&this.$$(`#tooltip-${t}`).updatePosition();this.$$("kano-arrow").updatePosition()},100)},getTargetBlock(t){let e=this.workspace.getBlockById(t.id);return t.shadow&&(e=this.getTargetBlockShadow(e,t.shadow)),e},getTargetBlockShadow(t,e){if("string"==typeof e)return t.getInput(e).connection.targetBlock();if("shadow"in e){let i=e;return"string"!=typeof i&&i.name&&(i=i.name),this.getTargetBlockShadow(t,i)}return null},getTargetBlockInput(t){let e,i,o,a,s,n=this.getTargetBlock(t);if(t.inputName){let i,o=n.getField(t.inputName);if(o)return o.fieldGroup_.getBoundingClientRect();if(!(i=n.getInput(t.inputName)))return n.getSvgRoot();if(!(e=i.connection))return n.getSvgRoot()}else e=n.nextConnection;return i=n.svgPath_.getBoundingClientRect(),o=n.getRelativeToSurfaceXY(),a={x:e.x_-o.x,y:e.y_-o.y},(s={}).left=i.left+a.x,s.top=i.top+a.y,s.right=i.right+i.width-a.x,s.bottom=i.bottom+i.height-a.y,s.width=1,s.height=1,s},_setupWithDelay(){this.idle=!0,this.async(()=>this._turnOnVisibility(),250)},_turnOnVisibility(){const t=this._getLongestDelay();t?(this.async(()=>this._refitUiElements("all"),t),this.async(()=>{this.idle=!1},t+50)):this.idle=!1},_getLongestDelay:()=>50}),o.Polymer({_template:t.html`
        <style>
            :host {
                display: block;
            }
            #circle-full {
                fill: transparent;
                stroke-linecap: round;
                @apply --kano-circle-progress-back;
            }
            #circle {
                fill: transparent;
                stroke: white;
                transition: stroke-dashoffset linear 200ms;
                stroke-linecap: round;
                @apply --kano-circle-progress;
                display: none;
            }
        </style>
        <svg xmlns="http://www.w3.org/2000/svg" id="svg">
            <circle id="circle-full"></circle>
            <circle id="circle"></circle>
        </svg>
`,is:"kano-circle-progress",properties:{radius:{type:Number},strokeWidth:{type:Number,value:4,observer:"_update"},value:{type:Number,value:0,observer:"_computeDashoffset"}},attached(){this.radius=this.radius||this.offsetWidth,this._update(),this._computeDashoffset(0)},_computeDashoffset(t){var e=this.$.circle,i=e.getAttribute("r"),o=Math.PI*(2*i),a=Math.max(0,Math.min(1,this.value));e.setAttributeNS(null,"stroke-dashoffset",(1-a)*o)},_update(){var t=this.$.svg,e=this.$.circle,i=this.$$("#circle-full"),o=this.radius,a=o/2-this.strokeWidth/2,s=Math.PI*(2*a);this.radius&&(t.setAttribute("width",o),t.setAttribute("height",o),t.setAttribute("viewBox",`0 0 ${o} ${o}`),e.setAttributeNS(null,"cx",o/2),e.setAttributeNS(null,"cy",o/2),e.setAttributeNS(null,"r",a),e.setAttributeNS(null,"stroke-width",`${this.strokeWidth}px`),e.setAttributeNS(null,"stroke-dasharray",s),e.setAttributeNS(null,"stroke-dashoffset",s),e.setAttributeNS(null,"transform",`rotate(270, ${o/2}, ${o/2})`),e.style.display="block",i.setAttributeNS(null,"cx",o/2),i.setAttributeNS(null,"cy",o/2),i.setAttributeNS(null,"r",a),i.setAttributeNS(null,"stroke-width",`${this.strokeWidth}px`),i.setAttributeNS(null,"stroke-dasharray",s))}}),o.Polymer({_template:t.html`
        <style>
            :host {
                position: relative;
                @apply --layout-horizontal;
                @apply --layout-start;
                padding: 16px;
                display: block;
            }
            .container {
                display: flex;
                flex-wrap: wrap;
            }
            .avatar {
                margin-bottom: 10px;
            }
            .content {
                @apply --layout-flex;
                @apply --layout-horizontal;
                height: 100%;
                box-sizing: border-box;
                font-family: var(--font-body);
                font-size: 16px;
                color: #414a51;
                margin-bottom: 10px;
                margin-right: 10px;
                min-width: 200px;
                display: inline-block;
            }
            .content .head {
                color: #888;
                margin-bottom: 5px;
            }
            .content .body {
                @apply --layout-flex;
            }
            :host([show-save-button]) .animations-pager {
                height: 50px;
                width: 50px;
                margin: 0 25px;
            }
            .text {
                @apply --layout-vertical;
                @apply --layout-flex;
            }
            .buttons {
                display: block;
                margin-left: 56px;
            }
            kano-glint-animation {
                margin: 0 20px 0 0;
            }
            .button {
                opacity: 0;
                animation-duration: 0.3s;
                animation-fill-mode: forwards;
                border: none;
                outline: none;
                cursor: pointer;
                font-family: var(--font-body);
                text-transform: uppercase;
                overflow: hidden;
                white-space: nowrap;
                background-color: var(--color-chateau);
                box-sizing: border-box;
                color: white;
                font-size: 14px;
                font-weight: bold;
                border-radius: 3px;
                box-sizing: border-box;
                padding: 7px 24px;
                margin: 0;
                transition: background 300ms;
            }
            .button:hover {
                background-color: #5B646B;
            }
            #banner-save-button {
                @apply --layout-horizontal;
                @apply --layout-center;
                margin: 0 10px 10px 0;
            }
            #banner-save-button iron-icon {
                --iron-icon-width: 24px;
                --iron-icon-height: 24px;
                opacity: 0.75;
                margin-right: 8px;
            }
            #banner-save-button:hover iron-icon {
                opacity: 0.85;
            }
            .markdown-html p {
                margin: 0px;
            }
            .markdown-html kano-blockly-block {
                line-height: 0px;
                vertical-align: middle;
                display: inline-block;
            }
            [hidden] {
                display: none !important;
            }
            .emoji {
                max-width: 18px;
                max-height: 18px;
                transform: translateY(4px);
            }
            .button paper-spinner-lite {
                --paper-spinner-color: white;
                --paper-spinner-stroke-width: 2px;

                width: 18px;
                height: 18px;
                display: block;
                margin: 0px 7px;
            }
            kwc-button.active paper-spinner-lite {
                display: none;
            }
            kwc-button.hidden {
                display: none;
            }
            .button.inactive {
                filter: grayscale(100%);
                cursor: wait;
            }
            kano-circle-progress {
                margin-right: 16px;
                height: 40px;
                width: 40px;
                --kano-circle-progress: {
                    stroke: #fec02d;
                };
                --kano-circle-progress-back: {
                    stroke: var(--color-porcelain);
                };
            }
            button, kano-glint-animation {
                @apply --layout-self-center;
            }
            .undo-redo button {
                border: none;
                outline: none;
                cursor: no-drop;
                padding: 3px 5px;
                transition: all 300ms;
                color: #d2d6d8;
            }
            .undo-redo iron-icon {
                --iron-icon-width: 30px;
                --iron-icon-height: 30px;
            }
            .undo-redo button.active {
                color: #9fa4a8;
                cursor: pointer;
            }
            .undo-redo button.active:hover {
                color: var(--color-orange, #ff2800);
            }
            .undo-redo {
                margin: auto;
            }
            #banner-button {
                height: 38px;
            }
            #banner-button-container {
                display: inline-block;
            }
        </style>
        <div class="container">
            <div class="avatar">
                <kano-circle-progress radius="40" stroke-width="7" value="[[progress]]"></kano-circle-progress>
            </div>
            <div class="content">
                <div class="text">
                    <div class="head" hidden\$="[[!head]]">
                        <marked-element markdown="[[head]]">
                            <div class="markdown-html" slot="markdown-html"></div>
                        </marked-element>
                    </div>
                    <div class="body">
                        <marked-element markdown="[[text]]">
                            <div class="markdown-html" slot="markdown-html"></div>
                        </marked-element>
                    </div>
                </div>
            </div>
        </div>
            <div class="buttons">
            <kwc-button id="banner-save-button" ghost variant="tertiary" icon-id="kwc-ui-icons:save" on-click="_saveTapped" hidden$="[[!showSaveButton]]">
                [[localize('SAVE', 'Save')]]
            </kwc-button>
            <div id="banner-button-container">
                <kwc-button id="banner-button" class\$="[[_computeButtonClass(buttonState)]]" on-tap="_buttonTapped" variant="primary">
                    [[buttonLabel]]
                </kwc-button>
            </div>
        </div>
`,is:"kano-editor-banner",behaviors:[e.AppElementRegistryBehavior,e.I18nBehavior],properties:{head:{type:String,value:null},text:{type:String,value:null},imgSrc:{type:String,value:"/assets/avatar/judoka-face.svg"},imgPage:{type:String,value:"judoka"},buttonLabel:{type:String,observer:"_onButtonLabelChanged"},buttonState:{type:String,value:null,observer:"_buttonStateChanged"},showSaveButton:{type:Boolean,value:!1,reflectToAttribute:!0,observer:"_showSaveButtonChanged"},progress:{type:Number,value:0},canGoBack:{type:Boolean},canGoForward:{type:Boolean}},attached(){this.animationSupported="animate"in HTMLElement.prototype,this._registerElement("banner-button",this.$["banner-button"])},_fadeInButton(t,e){this.$["banner-button"].setAttribute("data-animate",e+150),this._registerElement(t,this.$[t]),this.animationSupported?this.$[t].animate([{transform:"scale(0)",opacity:"0"},{transform:"scale(1)",opacity:"1"}],{duration:e,fill:"forwards"}).onfinish=(()=>{this.$["banner-button"].removeAttribute("data-animate"),this._registerElement(t,this.$[t])}):(this.$[t].style.opacity=1,this.$[t].removeAttribute("data-animate"),this._registerElement(t,this.$[t]))},shakeButton(){this.$["banner-button-container"].animate([{offset:0,transform:"translate3d(0, 0, 0)"},{offset:.1,transform:"translate3d(-1px, 0, 0)"},{offset:.2,transform:"translate3d(2px, 0, 0)"},{offset:.3,transform:"translate3d(-3px, 0, 0)"},{offset:.4,transform:"translate3d(3px, 0, 0)"},{offset:.5,transform:"translate3d(-3px, 0, 0)"},{offset:.6,transform:"translate3d(3px, 0, 0)"},{offset:.7,transform:"translate3d(-3px, 0, 0)"},{offset:.8,transform:"translate3d(2px, 0, 0)"},{offset:.9,transform:"translate3d(-1px, 0, 0)"},{offset:1,transform:"translate3d(0, 0, 0)"}],{duration:1200,easing:"cubic-bezier(0.36, 0.07, 0.19, 0.97)",fill:"both",iterations:1})},_buttonTapped(){"inactive"!==this.buttonState&&this.fire("button-tapped")},_saveTapped(){this.fire("save-button-clicked")},_buttonStateChanged(t,e){!t||e||this.showSaveButton||this._fadeInButton("banner-button",200)},_buttonHidden:t=>!t||"hidden"===t,_buttonActive:t=>"active"===t,_buttonInactive:t=>"inactive"===t,_computeButtonClass:t=>t||"hidden",_showSaveButtonChanged(t){t&&(this._fadeInButton("banner-save-button",200),this._fadeInButton("banner-button",400))},_onButtonLabelChanged(t){this.toggleClass("green-cta","Next"===t||this.showSaveButton)},_computeGlint(t,e){return"inactive"!==e&&("Next"===t||this.showSaveButton||"Hints"===t)},_undoRedoHidden:(t,e)=>e||"hidden"!==t,_undoTapped(){this.fire("undo")},_redoTapped(){this.fire("redo")},_computeUndoRedoClass:t=>t?"active":""});const lt="/assets/audio/sounds/card_set.mp3";class ct extends(e.Store$1.StateReceiver(o.mixinBehaviors([e.SoundPlayerBehavior,e.I18nBehavior],t.PolymerElement))){static get template(){return t.html`
        <style>
            :host {
                display: flex;
                --kano-value-preview-input-background: rgba(0, 0, 0, 0.2);
            }
            #content {
                flex: 1;
            }
            .banner-container {
                @apply --layout-vertical;
                @apply --layout-stretch;
                @apply --layout-center-justified;
                position: absolute;
                top: 0px;
                left: 0px;
                width: 100%;
                max-height: 220px;
                pointer-events: none;
                padding: 24px;
                box-sizing: border-box;
                z-index: 1;
            }
            kano-editor-banner {
                @apply --shadow-elevation-2dp;
                border-radius: 6px;
                background: white;
                color: black;
                font-family: var(--font-body);
                pointer-events: all;
            }
            #overlay {
                position: absolute;
                top: 0;
                right: 0;
                width: calc(100% - 50px);
                height: 100%;
            }
            :host([lockdown]) #overlay {
                display: block;
            }
            [hidden] {
                display: none !important;
            }
        </style>
        <kano-challenge-ui id="ui" beacon="[[beacon]]" tooltips="[[tooltips]]" on-next-step="nextStep" idle="[[idle]]">
            <slot name="editor" slot="editor" id="content"></slot>
        </kano-challenge-ui>
        <div id="overlay" hidden\$="[[!lockedUi]]" on-tap="_onLockdownClick"></div>
        <div class="banner-container" id="banner-container">
            <kano-editor-banner id="banner" head="[[banner.head]]" text="[[banner.text]]" img-src="[[banner.icon]]" img-page="[[banner.imgPage]]" button-label="[[banner.buttonLabel]]" button-state="[[banner.buttonState]]" show-save-button="[[banner.showSaveButton]]" progress="[[progress]]" on-button-tapped="_bannerButtonTapped" on-save-button-clicked="_transmitRequestShare" hidden\$="[[_isBannerHidden(banner)]]" can-go-back="[[history.canGoBack]]" can-go-forward="[[history.canGoForward]]"></kano-editor-banner>
        </div>
`}static get is(){return"kano-app-challenge"}static get properties(){return{progress:{type:Number,linkState:"userProgress",observer:"_challengeCompleted"},banner:{type:Object,linkState:"banner",observer:"_fitBanner"},beacon:{type:Object,linkState:"beacon"},idle:{type:Boolean,linkState:"idle"},lockdown:{type:Boolean,reflectToAttribute:!0,linkState:"lockdown"},history:{type:Object,linkState:"history"},challengeId:{linkState:"id",observer:"_challengeChanged"},tooltips:{linkState:"tooltips"}}}constructor(){super(),this.changeCounts={},this._onLockdownClick=this._onLockdownClick.bind(this),this._onResize=this._onResize.bind(this)}connectedCallback(){super.connectedCallback(),this._processMarkdown=this._processMarkdown.bind(this),this._observer=new o.FlattenedNodesObserver(this.$.content,t=>{this._processNewNodes(t.addedNodes)}),window.addEventListener("resize",this._onResize)}disconnectedCallback(){super.disconnectedCallback(),this._observer.disconnect(),window.removeEventListener("resize",this._onResize)}_onResize(){this._resizeDebouncer=o.Debouncer.debounce(this._resizeDebouncer,t.timeOut.after(300),()=>{this._fitBanner()})}_challengeCompleted(){1===this.progress&&this.dispatchEvent(new CustomEvent("challenge-completed",{detail:this.challengeId}))}_challengeChanged(){this.initializeChallenge()}_processNewNodes(t){let e;for(let i=0;i<t.length;i+=1)t[i].assignedSlot===this.$.content&&(e=t[i]);e&&(this.editor=e.editor,this.$.ui.workspace=e.getBlocklyWorkspace(),this.$.ui.setMediaPath(this.editor.asAbsoluteMediaPath()),this._bannerSoundUrl=this.editor.asAbsoluteMediaPath(lt),this.loadSound(this._bannerSoundUrl),this._fitBanner())}animateBannerIn(){this.playSound(this._bannerSoundUrl),"animate"in HTMLElement.prototype&&this.$.banner.animate({opacity:[0,1],transform:["scale(0.5, 0.5)","scale(1, 1)"]},{duration:150,easing:"cubic-bezier(0.2, 0, 0.13, 1.5)"})}_isBannerHidden(t){return!t}_processMarkdown(t){const{variables:e}=this.getState();let i=t;return i=i.replace(/<kano-blockly-block(.*)type="(.+)"(.*)><\/kano-blockly-block>/g,(t,e,i,o)=>{const a=i.split("#");return a.length>1&&(a[0]=this.challengeClass.engine._processPart(a[0])),`<kano-blockly-block${e}type="${i=a.join("#")}"${o}></kano-blockly-block>`}),i=Object.keys(e).reduce((t,i)=>t.replace(new RegExp(`\\$\\{${i}\\}`,"g"),e[i]||""),i),twemoji.parse(i)}_bannerButtonTapped(){this.nextStep()}_onLockdownClick(){this.$.banner.shakeButton()}initializeChallenge(){this.challengeClass.initializeChallenge()}historyBack(){this.dispatchEvent(new CustomEvent("history-back"))}historyForward(){this.dispatchEvent(new CustomEvent("history-forward"))}_onFlyoutStateChanged(t){-1!==[Blockly.Events.OPEN_FLYOUT,Blockly.Events.CLOSE_FLYOUT].indexOf(t.type)&&this.async(()=>{this._fitBanner()})}_fitBanner(){if(!this.editor)return;const t=this.editor.getBlocklyWorkspace();if(!t)return;this.lockedUi=this.banner&&this.banner.buttonLabel&&this.banner.buttonLabel.length>0&&this.banner.lockUi||!1;const e=t.getMetrics(),i=t.getFlyout_(),o=t.toolbox_&&!t.toolbox_.opened?e.toolboxWidth:i.getWidth(),a=e.viewWidth+e.toolboxWidth+12-o;this.$["banner-container"].style.left=`${o+44}px`,this.$["banner-container"].style.top="0px",this.$["banner-container"].style.width=`${a}px`}nextStep(){this.dispatchEvent(new CustomEvent("next-step"))}_transmitRequestShare(){this.editor&&this.editor.creation&&this.editor.creation.init()}}customElements.define(ct.is,ct);const ut=["open-parts","add-part"],ht={};class pt extends i.Plugin{constructor(t={}){super(),this.options=Object.assign({},ht,t),this.rootEl=document.createElement("kano-app-challenge"),this.rootEl.addEventListener("next-step",this._nextStep.bind(this)),this.rootEl.addEventListener("save",this._save.bind(this)),this.rootEl.challengeClass=this,this.store=e.Store.create({banner:null,history:{backBuffer:[],forwardBuffer:[],ignoreNextStepChange:!1},hints:{enabled:!0},idle:!1}),this.subscriptions=new f.Subscriptions,this.challengeActions=Q(this.store),this._onDone=this._onDone.bind(this),this._onStepChanged=this._onStepChanged.bind(this),this._historyBack=this._historyBack.bind(this),this._historyForward=this._historyForward.bind(this),this._displayBanner=this._displayBanner.bind(this),this._hideBanner=this._hideBanner.bind(this),this._displayBeacon=this._displayBeacon.bind(this),this._hideBeacon=this._hideBeacon.bind(this),this._displayTooltips=this._displayTooltips.bind(this),this._hideTooltips=this._hideTooltips.bind(this),this._pushState=this._pushState.bind(this),this._onFlyoutStateChanged=this.rootEl._onFlyoutStateChanged.bind(this.rootEl),this.rootEl.storeId=this.store.id,this._state={}}setParts(t){this.partsList=t}onInstall(t){this.setEditor(t)}onInject(){const t=this.editor.getBlocklyWorkspace();this.engine=new J(t),this.engine.addEventListener("done",this._onDone),this.engine.addEventListener("step-changed",this._onStepChanged),this.engine.addEventListener("history-back",this._historyBack),this.engine.addEventListener("history-forward",this._historyForward),this.subscriptions.push(f.subscribe(this.editor,"change",this._editorChanged.bind(this))),this.editor.getEvents().forEach(t=>{this.subscriptions.push(f.subscribe(this.editor,t,e=>{const i=e||{};i.type=t,this._editorChanged(i)}))}),this.editorListeners=[],ut.forEach(t=>{const e=e=>{this.editor.logger.debug("[CHALLENGE]",`Editor fired: ${t}`,e),this.engine.triggerEvent(t,e)};this.editor.on(t,e),this.editorListeners.push(e),this.editor.logger.debug("[CHALLENGE]",`Listening to ${t} for challenge`)}),t.addChangeListener(this._onFlyoutStateChanged),this.rootEl._fitBanner(),this.engine.defineBehavior("set-state",this._pushState,this._popState),this.engine.defineBehavior("banner",this._displayBanner,this._hideBanner),this.engine.defineBehavior("beacon",this._displayBeacon,this._hideBeacon),this.engine.defineBehavior("tooltips",this._displayTooltips,this._hideTooltips),this.engine.definePropertyProcessor(["beacon.target.flyout_block","beacon.target.block","tooltips.*.location.block","tooltips.*.location.flyout_block"],this.engine._processBlock.bind(this.engine)),this.engine.definePropertyProcessor(["beacon.target.category","beacon.target.flyout_block","tooltips.*.location.category","validation.blockly.open-flyout","validation.blockly.close-flyout","validation.blockly.create.type"],this.engine._processPart.bind(this.engine)),this.engine.definePropertyProcessor(["banner.head","banner.text"],this.rootEl._processMarkdown.bind(this))}localize(...t){return this.rootEl.localize(...t)}setEditor(t){this.editor=t}initializeChallenge(){const{config:t}=this.editor,e=this.store.getState(),{steps:i}=e.scene||e;i&&setTimeout(()=>{this.engine.setSteps(i),this.engine.start(),this.challengeActions.updateSteps(this.engine.steps),this.emit("started")},t.CHALLENGE_START_DELAY||500)}_pushState(t){this._state=Object.assign(this._state,t),this._nextStep()}_popState(){}_nextStep(){if(!this.engine)return;const t=this.isLastStep(),{hints:e}=this.store.getState();t?this.emit("next-challenge"):e.enabled?this.engine.nextStep():this.challengeActions.enableHints()}_save(){this.editor.share()}_editorChanged(t){this.engine&&(this.editor.logger.debug("[CHALLENGE]",`Editor fired: ${t.type}`,t),this.engine.triggerEvent(t.type,t))}_onStepChanged(){this.challengeActions.updateStepIndex(this.engine.stepIndex);const{history:t}=this.store.getState();if(t.ignoreNextStepChange);else if(this._shouldSaveStep()){const{stepIndex:t}=this.engine;this.challengeActions.addHistoryRecord(t,Object.assign(this.editor.save()))}this.challengeActions.updateHistoryOptions(this.canGoBack(),this.canGoForward()),this.emit("step-changed")}_onDone(){this.challengeActions.completeChallenge(),this.trigger("completed")}_shouldSaveStep(){const{step:t}=this.engine;if(t&&t.validation){if(t.validation.blockly){const{blockly:e}=t.validation;if(e["open-flyout"]||e.value)return!0}if(t.validation["open-parts"])return!0}return!!(t&&t.banner&&t.banner["open-parts"])||this.engine.stepIndex===this.engine.steps.length-1}_historyBack(){this.canGoBack()&&this.challengeActions.historyBack()}_historyForward(){this.canGoForward()&&this.challengeActions.historyForward()}canGoBack(){const{history:t}=this.store.getState();return t.backBuffer&&t.backBuffer.length>1}canGoForward(){const{history:t}=this.store.getState();return t.forwardBuffer&&t.forwardBuffer.length>0}_displayBanner(t){let e;clearTimeout(this.showButtonTimeout);const{hints:i}=this._state;if(!i||i.enabled)(e=Object.assign({},t)).buttonLabel=t.buttonLabel||this.localize("NEXT","Next");else{e={};const t=i["disabled-banner"];t&&(e.head=t.head,e.text=this.localize("HINTS",t.text),e.buttonLabel="Help",e.buttonState="hidden",this.showButtonTimeout=setTimeout(()=>{e.buttonState="active",this.challengeActions.updateBannerState(e)},6e3))}const o=this.isLastStep();if(e.showSaveButton=o,o){e.icon=null,e.imgPage="star";const t=this.store.getState();e.buttonLabel=t.next?this.localize("NEXT_CHALLENGE","Next Challenge"):this.localize("BACK_TO_CHALLENGES","Back to Challenges")}0===this.engine.stepIndex&&(e.lockUi=!0),this.challengeActions.updateBannerState(Object.assign({},e)),t.lockdown?this.challengeActions.enableLockdown():this.challengeActions.disableLockdown(),o||this.rootEl.animateBannerIn()}_hideBanner(){this.challengeActions.updateBannerState({}),this.challengeActions.disableLockdown()}_displayBeacon(t){this.flyoutMode&&t.target&&t.target.flyout_block&&(t.leftAlign=!0),this.challengeActions.updateBeacon(t)}_hideBeacon(){this.challengeActions.updateBeacon(null)}_displayTooltips(t){this.challengeActions.updateTooltips(t)}_hideTooltips(){this.challengeActions.updateTooltips(null)}isLastStep(){return this.engine.stepIndex===this.engine.steps.length-1}setDefaultApp(t){this.defaultApp=t}registerProfile(t){this.profile=t}setWhitelist(t){this.editor.toolbox.setWhitelist(t)}load(t){const{flyoutMode:e,variables:i,defaultApp:o}=t.scene||t;if(this.profile){this.editor.registerProfile(this.profile);const{toolbox:e}=this.profile,i=pt.getToolboxWhitelist(t,e);this.setWhitelist(i),this.setSceneVariables(pt.getSceneVariables(e))}this.flyoutMode=e,this.editor.editorActions.setFlyoutMode(e),this.editor.loadVariables(i),o?this.editor.load(JSON.parse(o)):this.editor.load({}),this.challengeActions.load(t)}static getSceneVariables(t){const e={};return Object.keys(t).forEach(i=>{e[`${i}_color`]=t[i].colour}),e}static filterToToolbox(t){return Object.keys(t).reduce((e,i)=>e.concat(t[i].map(t=>`${i}.${t}`)),[])}static getToolboxWhitelist(t){const{blocks:e,modules:i,filterBlocks:o,filterToolbox:a,toolbox:s}=t.scene||t;if(e)return null;if(!i)return null;const n=o||a;let d;const r=(d=n?pt.filterToToolbox(n):s).reduce((t,e)=>{const i=e.split("."),o=i.shift();return t[o]||(t[o]=[]),t[o].push(i.join(".")),t},{});return Object.keys(r).reduce((t,e)=>(t=t.concat(r[e].map(t=>t.startsWith(e)?t:`${e}_${t}`))).concat(r[e]),[])}setSceneVariables(t){this.challengeActions.loadVariables(t)}inject(t=document.body,e=null){this.injected||(this.injected=!0,t.appendChild(this.store.providerElement),e?t.insertBefore(this.rootEl,e):t.appendChild(this.rootEl),this.editor.rootEl.setAttribute("slot","editor"),this.editor.inject(this.rootEl))}dispose(){this.subscriptions.dispose(),this.injected&&(this.store.providerElement.parentNode.removeChild(this.store.providerElement),this.rootEl.parentNode.removeChild(this.rootEl)),this.editor.dispose()}}class gt extends i.Plugin$1{constructor(t,e=3e3){super(),this.enabled=!0,this.debounceDelay=e,this.key=t,this._debouncedSave=function(t,e){let i;return(...o)=>{clearTimeout(i),i=setTimeout(()=>{i=null,t(...o)},e)}}(()=>{this.save()},e)}disable(){this.enabled=!1}enable(){this.enabled=!1}onInstall(t){this.editor=t,this.editor.on("change",this._debouncedSave),this.editor.on("reset",this.save.bind(this))}load(){this.read(this.getKey()).then(t=>{this.editor.load(t)})}save(){if(!this.enabled)return;const t=this.editor.export();this.write(this.getKey(),t)}write(t,e){return Promise.resolve()}read(t){return Promise.resolve({})}getKey(){let t="storage";return t="function"==typeof this.key?this.key():this.key}}class ft extends gt{read(t){const e=JSON.parse(localStorage.getItem(t));return Promise.resolve(e)}write(t,e){return localStorage.setItem(t,JSON.stringify(e)),Promise.resolve()}}const bt=v.UserActionsFactory(v.USER_TYPES.AUTHENTICATED),mt=v.UserActionsFactory(v.USER_TYPES.AUTHENTICATED);class yt extends(k.Store.StateReceiver(t.PolymerElement)){static get template(){return t.html`<style>:host{display:flex;position:relative;background-color:var(--kwc-blockly-background,#414a51)}kano-app-challenge,kano-app-editor{width:100%;min-height:100%}kano-app-editor{height:100vh}.loading{position:absolute;top:0;left:0;z-index:1;width:100%;height:100%;background:#292f35;display:flex;align-items:center;justify-content:center}kwc-loading-animation{padding:16px;background:#fff;border-radius:6px;box-shadow:0 4px 4px 0 rgba(0,0,0,.15)}.low-battery{position:absolute;top:0;left:50%;transform:translateX(-50%);max-width:100%;background-color:rgba(255,255,255,.75);color:#ff343f;border-radius:8px;font-size:20px;padding:16px;z-index:2}[hidden]{display:none!important}</style><div class=loading hidden\$=[[!loading]]></div><div id=loader class=loading hidden\$=[[!loading]]><kwc-loading-animation pip-size=6.4></kwc-loading-animation></div>`}static get is(){return"ka-code-challenge"}static get properties(){return{demosRoot:{linkState:"demos.root"},loading:{type:Boolean,value:!0},challengeId:{type:String,linkState:"routing.pathParams.id",observer:"_challengeIdChanged"},isRemix:{type:String,linkState:"routing.pathParams.remix"},devices:{linkState:"devices"},selectedDeviceIndex:{linkState:"selectedDeviceIndex"},config:{linkState:"config"},currentMap:{linkState:"currentMap"},online:{type:Boolean,linkState:"online",observer:"_onlineChanged"},userProfile:{linkState:"users.authenticated.profile"}}}constructor(){super(),this.lowBattery=!1,this._loadingPromise=null}get sharesModel(){if(!this._sharesModel){const{config:t}=this.getState();this._sharesModel=T.SharesFactory(t.API_URL)}return this._sharesModel}get progressModel(){if(!this._progressModel){const{config:t}=this.getState();this._progressModel=B.ProgressFactory(t.API_URL)}return this._progressModel}loadUserLevel(){bt.setLoadingLevel(!0),this.userProfile&&this.userProfile.id&&this.progressModel.getUserLevelAndXP(this.userProfile.id).then(t=>{bt.setLoadingLevel(!1),bt.setUserProgress(t)})}_challengeIdChanged(){if(!this.challengeId||this._loadingPromise)return;const{routing:t}=this.getState(),e=t.pathParams.demo,i=t.pathParams.remix;let o;this.loading=!0,this.editor&&this.cleanup(),o=e?this.loadDemo(this.challengeId):i?this.loadRemix(this.challengeId):this.loadChallenge(this.challengeId),this._loadingPromise=o;const a=b.subscribeTimeout(()=>{this._displayLoadError(),w.historyBack()},1e4);o.then(()=>{this._loadingPromise=null,a.dispose()}).catch(t=>{throw b.AppTelemetry.trackException({exception:t}),this._loadingPromise=null,this.loading=!1,a.dispose(),w.historyBack(),this._displayLoadError(),t})}_displayLoadError(){this.dispatchEvent(new CustomEvent("display-toast",{bubbles:!0,composed:!0,detail:{type:"alert",heading:"We couldn't load the editor.",text:"Sorry about that, please try again",actionLabel:"Ok"}}))}loadChallenge(t){const e=m.I18n.getLang();return fetch(`${this.challengesRoot}/${e}/${t}/index.json`).then(t=>t.json()).then(t=>this.boot(t))}loadDemo(t){return fetch(`${this.demosRoot}/${t}.kcode`).then(t=>t.json()).then(t=>this.boot(t,!0))}loadRemix(t){return this.sharesModel.getBySlug(t).then(t=>{const{attachments:e}=t;if(!e.attachment)throw new Error("Cannot load remix: share missing attachment");return fetch(e.attachment).then(t=>t.json())}).then(t=>this.boot(t,!0))}_onlineChanged(t){this.configureCreations(t)}boot(t,o=!1){this.loadUserLevel();let a=null,s=null;return new Promise(t=>{setTimeout(t,500)}).then(y.Code.load).then(()=>this.codeManager._codeContext._callDeferedActivation()).then(()=>{const{config:n}=this.getState();a=new e.Editor({mediaPath:`${n.root}node_modules/@kano/code/app`,BLOCKLY_MEDIA:`${n.root}node_modules/@kano/kwc-blockly/blockly_built/media/`}),this.editor=a,n.ENABLE_CHALLENGE_GENERATOR&&(this.challengeGeneratorPlugin=new nt,a.addPlugin(this.challengeGeneratorPlugin));const d=this.codeManager.getEditorProfile(),r=this.codeManager.getOutputProfile();i.Player.registerProfile(r);let l=Promise.resolve();if(o){a.registerProfile(d),a.inject(this.shadowRoot,this.$.loader);const{workspaceView:e}=a,{outputView:i}=a.output;i.sceneId=t.scene,e.isChallenge=!0,this._waitForOutput(i).then(()=>{if(this.addEventListener("blockly-ready",t=>{this.loading=!1}),a.load(t),"sandbox"===t.id){e.isChallenge=!1;const t=new ft("sandbox-app");a.addPlugin(t),t.load()}return l}).catch(t=>{throw console.log("error when load demo challenge",t),this.loading=!1,t})}else s=new pt,this.challenge=s,a.addPlugin(s),s.registerProfile(d),s.on("completed",()=>{b.AppTelemetry.trackEvent({name:"challenge_completed",properties:{id:t.id}}),this._onChallengeCompleted(t.id)}),s.on("next-challenge",()=>{w.navigateTo(`/map/${this.currentMap}`)}),s.load(t),s.inject(this.shadowRoot,this.$.loader),this.addEventListener("blockly-ready",e=>{const{workspaceView:i}=a,{outputView:o}=a.output;return i.isChallenge=!0,b.AppTelemetry.trackEvent({name:"challenge_attempted",properties:{id:t.id}}),this.loading=!1,l=this._waitForOutput(o)})}).then(()=>{this._telemetryMount=b.AppTelemetry.mount(a.telemetry),a.output.setRunningState(!0),this.creationsEnabled=this.editor.creation.enabled,this.configureCreations(this.online)}).catch(t=>{throw this.cleanup(),t})}_waitForOutput(t){return new Promise((e,i)=>{const o=new b.Disposables;b.subscribeDOM(t,"loaded",()=>{o.dispose(),e()},this,o),b.subscribeDOM(t,"failed",t=>{o.dispose(),i(t.detail)},this,o)})}_onChallengeCompleted(t){const{users:e}=this.getState();return e&&e.authenticated&&e.authenticated.profile&&e.authenticated.profile.id?this.challengesModel.completeChallenge(t).then(t=>{if(t["hp-challenges"]&&t["hp-challenges"].progress&&_.ChallengeActions.load(t["hp-challenges"].progress),t["hp-avatar-assets"]&&t["hp-avatar-assets"].changes.newlyUnlocked.length>0){const i=`new-avatar-assets-${e.authenticated.profile.id}`;let o=localStorage.getItem(i);const a=(o=o?o.split(","):[]).concat(t["hp-avatar-assets"].changes.newlyUnlocked);localStorage.setItem(i,a)}t["hp-avatar-assets"]&&t["hp-avatar-assets"].progress.unlocked&&mt.updateUnlocked(t["hp-avatar-assets"].progress.unlocked),this.dispatchEvent(new CustomEvent("challenge-completed",{detail:t})),this.enableAllBlocks()}).catch(t=>{throw b.AppTelemetry.trackEvent({exception:t}),t}):b.AppTelemetry.trackEvent({exception:"authenticated user does not exist"})}configureCreations(t){this.editor&&this.creationsEnabled&&(t?this.editor.creation.enable():this.editor.creation.disableWithReason("Not available offline","Sharing creations requires internet connection.<br>\n                    Please connect your device to the internet and try again."))}connectedCallback(){super.connectedCallback(),this.challengesModel=E.ChallengesFactory(this.config.API_URL),this.challengeId&&setTimeout(()=>{this.toggleNavbar(!0)},0)}cleanup(){this.editor&&this.editor.output.setRunningState(!1),this.challenge?(this.challenge.dispose(),this.challenge=null,this.editor=null):this.editor&&(this.editor.dispose(),this.editor=null),this._telemetryMount&&(this._telemetryMount.dispose(),this._telemetryMount=null)}disconnectedCallback(){super.disconnectedCallback(),this.cleanup()}toggleNavbar(t){x.RoutingActions.toggleNavbar(t)}enableAllBlocks(){this.editor.editorActions.setFlyoutMode(!1),this.editor.toolbox.setWhitelist(),this.editor.toolbox.update(),setTimeout(()=>{this.challenge.rootEl._fitBanner(),this.challenge.rootEl.$.ui._onResize()},0)}}window.customElements.define(yt.is,yt)});