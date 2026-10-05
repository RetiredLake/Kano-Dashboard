define(["exports","./chunk-fdc6718c.js","./chunk-654f977c.js","./chunk-42d2b7ff.js","./chunk-5472545b.js","./chunk-19bce21e.js"],function(n,i,t,o,e,a){"use strict";const s=[{properties:{animationConfig:{type:Object},entryAnimation:{observer:"_entryAnimationChanged",type:String},exitAnimation:{observer:"_exitAnimationChanged",type:String}},_entryAnimationChanged:function(){this.animationConfig=this.animationConfig||{},this.animationConfig.entry=[{name:this.entryAnimation,node:this}]},_exitAnimationChanged:function(){this.animationConfig=this.animationConfig||{},this.animationConfig.exit=[{name:this.exitAnimation,node:this}]},_copyProperties:function(n,i){for(var t in i)n[t]=i[t]},_cloneConfig:function(n){var i={isClone:!0};return this._copyProperties(i,n),i},_getAnimationConfigRecursive:function(n,i,t){var o;if(this.animationConfig)if(this.animationConfig.value&&"function"==typeof this.animationConfig.value)this._warn(this._logf("playAnimation","Please put 'animationConfig' inside of your components 'properties' object instead of outside of it."));else if(o=n?this.animationConfig[n]:this.animationConfig,Array.isArray(o)||(o=[o]),o)for(var e,a=0;e=o[a];a++)if(e.animatable)e.animatable._getAnimationConfigRecursive(e.type||n,i,t);else if(e.id){var s=i[e.id];s?(s.isClone||(i[e.id]=this._cloneConfig(s),s=i[e.id]),this._copyProperties(s,e)):i[e.id]=e}else t.push(e)},getAnimationConfig:function(n){var i={},t=[];for(var o in this._getAnimationConfigRecursive(n,i,t),i)t.push(i[o]);return t}},{_configureAnimations:function(n){var i=[],t=[];if(n.length>0)for(let a,s=0;a=n[s];s++){let n=document.createElement(a.name);if(n.isNeonAnimation){let i=null;n.configure||(n.configure=function(n){return null}),i=n.configure(a),t.push({result:i,config:a,neonAnimation:n})}else console.warn(this.is+":",a.name,"not found!")}for(var o=0;o<t.length;o++){let n=t[o].result,a=t[o].config,s=t[o].neonAnimation;try{"function"!=typeof n.cancel&&(n=document.timeline.play(n))}catch(e){n=null,console.warn("Couldnt play","(",a.name,").",e)}n&&i.push({neonAnimation:s,config:a,animation:n})}return i},_shouldComplete:function(n){for(var i=!0,t=0;t<n.length;t++)if("finished"!=n[t].animation.playState){i=!1;break}return i},_complete:function(n){for(var i=0;i<n.length;i++)n[i].neonAnimation.complete(n[i].config);for(i=0;i<n.length;i++)n[i].animation.cancel()},playAnimation:function(n,i){var t=this.getAnimationConfig(n);if(t){this._active=this._active||{},this._active[n]&&(this._complete(this._active[n]),delete this._active[n]);var o=this._configureAnimations(t);if(0!=o.length){this._active[n]=o;for(var e=0;e<o.length;e++)o[e].animation.onfinish=function(){this._shouldComplete(o)&&(this._complete(o),delete this._active[n],this.fire("neon-animation-finish",i,{bubbles:!1}))}.bind(this)}else this.fire("neon-animation-finish",i,{bubbles:!1})}},cancelAnimation:function(){for(var n in this._active){var i=this._active[n];for(var t in i)i[t].animation.cancel()}this._active={}}}],p=i.html`
<custom-style>
  <style is="custom-style">
    html {

      --shadow-transition: {
        transition: box-shadow 0.28s cubic-bezier(0.4, 0, 0.2, 1);
      };

      --shadow-none: {
        box-shadow: none;
      };

      /* from http://codepen.io/shyndman/pen/c5394ddf2e8b2a5c9185904b57421cdb */

      --shadow-elevation-2dp: {
        box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14),
                    0 1px 5px 0 rgba(0, 0, 0, 0.12),
                    0 3px 1px -2px rgba(0, 0, 0, 0.2);
      };

      --shadow-elevation-3dp: {
        box-shadow: 0 3px 4px 0 rgba(0, 0, 0, 0.14),
                    0 1px 8px 0 rgba(0, 0, 0, 0.12),
                    0 3px 3px -2px rgba(0, 0, 0, 0.4);
      };

      --shadow-elevation-4dp: {
        box-shadow: 0 4px 5px 0 rgba(0, 0, 0, 0.14),
                    0 1px 10px 0 rgba(0, 0, 0, 0.12),
                    0 2px 4px -1px rgba(0, 0, 0, 0.4);
      };

      --shadow-elevation-6dp: {
        box-shadow: 0 6px 10px 0 rgba(0, 0, 0, 0.14),
                    0 1px 18px 0 rgba(0, 0, 0, 0.12),
                    0 3px 5px -1px rgba(0, 0, 0, 0.4);
      };

      --shadow-elevation-8dp: {
        box-shadow: 0 8px 10px 1px rgba(0, 0, 0, 0.14),
                    0 3px 14px 2px rgba(0, 0, 0, 0.12),
                    0 5px 5px -3px rgba(0, 0, 0, 0.4);
      };

      --shadow-elevation-12dp: {
        box-shadow: 0 12px 16px 1px rgba(0, 0, 0, 0.14),
                    0 4px 22px 3px rgba(0, 0, 0, 0.12),
                    0 6px 7px -4px rgba(0, 0, 0, 0.4);
      };

      --shadow-elevation-16dp: {
        box-shadow: 0 16px 24px 2px rgba(0, 0, 0, 0.14),
                    0  6px 30px 5px rgba(0, 0, 0, 0.12),
                    0  8px 10px -5px rgba(0, 0, 0, 0.4);
      };

      --shadow-elevation-24dp: {
        box-shadow: 0 24px 38px 3px rgba(0, 0, 0, 0.14),
                    0 9px 46px 8px rgba(0, 0, 0, 0.12),
                    0 11px 15px -7px rgba(0, 0, 0, 0.4);
      };
    }
  </style>
</custom-style>`;p.setAttribute("style","display: none;"),document.head.appendChild(p.content);const r=document.createElement("template");r.setAttribute("style","display: none;"),r.innerHTML='<dom-module id="paper-dialog-shared-styles">\n  <template>\n    <style>\n      :host {\n        display: block;\n        margin: 24px 40px;\n\n        background: var(--paper-dialog-background-color, var(--primary-background-color));\n        color: var(--paper-dialog-color, var(--primary-text-color));\n\n        @apply --paper-font-body1;\n        @apply --shadow-elevation-16dp;\n        @apply --paper-dialog;\n      }\n\n      :host > ::slotted(*) {\n        margin-top: 20px;\n        padding: 0 24px;\n      }\n\n      :host > ::slotted(.no-padding) {\n        padding: 0;\n      }\n\n      \n      :host > ::slotted(*:first-child) {\n        margin-top: 24px;\n      }\n\n      :host > ::slotted(*:last-child) {\n        margin-bottom: 24px;\n      }\n\n      /* In 1.x, this selector was `:host > ::content h2`. In 2.x <slot> allows\n      to select direct children only, which increases the weight of this\n      selector, so we have to re-define first-child/last-child margins below. */\n      :host > ::slotted(h2) {\n        position: relative;\n        margin: 0;\n\n        @apply --paper-font-title;\n        @apply --paper-dialog-title;\n      }\n\n      /* Apply mixin again, in case it sets margin-top. */\n      :host > ::slotted(h2:first-child) {\n        margin-top: 24px;\n        @apply --paper-dialog-title;\n      }\n\n      /* Apply mixin again, in case it sets margin-bottom. */\n      :host > ::slotted(h2:last-child) {\n        margin-bottom: 24px;\n        @apply --paper-dialog-title;\n      }\n\n      :host > ::slotted(.paper-dialog-buttons),\n      :host > ::slotted(.buttons) {\n        position: relative;\n        padding: 8px 8px 8px 24px;\n        margin: 0;\n\n        color: var(--paper-dialog-button-color, var(--primary-color));\n\n        @apply --layout-horizontal;\n        @apply --layout-end-justified;\n      }\n    </style>\n  </template>\n</dom-module>',document.head.appendChild(r.content),t.Polymer({_template:i.html`<style include=paper-dialog-shared-styles></style><slot></slot>`,is:"paper-dialog",behaviors:[a.PaperDialogBehavior,s],listeners:{"neon-animation-finish":"_onNeonAnimationFinish"},_renderOpened:function(){this.cancelAnimation(),this.playAnimation("entry")},_renderClosed:function(){this.cancelAnimation(),this.playAnimation("exit")},_onNeonAnimationFinish:function(){this.opened?this._finishRenderOpened():this._finishRenderClosed()}}),n.NeonAnimationRunnerBehavior=s});