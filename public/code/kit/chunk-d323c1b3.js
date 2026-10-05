define(["exports","./chunk-fdc6718c.js","./chunk-654f977c.js","./chunk-33d51465.js","./chunk-42d2b7ff.js","./chunk-8b3412b4.js","./chunk-86ecdd4d.js","./chunk-e86f6c80.js","./chunk-f8a285e9.js","./chunk-e1d3b61d.js","./chunk-be7f2d6a.js","./chunk-e8d4628a.js","./chunk-4d3465f9.js","./chunk-ede86d1c.js","./chunk-dce7f082.js"],function(e,t,a,o,i,n,r,l,s,p,d,c,u,m,g){"use strict";a.Polymer({_template:t.html`
    <style>
      :host {
        display: block;
        position: absolute;
        outline: none;
        z-index: 1002;
        -moz-user-select: none;
        -ms-user-select: none;
        -webkit-user-select: none;
        user-select: none;
        cursor: default;
      }

      #tooltip {
        display: block;
        outline: none;
        @apply --paper-font-common-base;
        font-size: 10px;
        line-height: 1;
        background-color: var(--paper-tooltip-background, #616161);
        color: var(--paper-tooltip-text-color, white);
        padding: 8px;
        border-radius: 2px;
        @apply --paper-tooltip;
      }

      #tooltip[above] ::slotted(.triangle){
          transform: rotate(180deg);
          top: auto !important;
          bottom: -8px;
      }

      @keyframes keyFrameScaleUp {
        0% {
          transform: scale(0.0);
        }
        100% {
          transform: scale(1.0);
        }
      }

      @keyframes keyFrameScaleDown {
        0% {
          transform: scale(1.0);
        }
        100% {
          transform: scale(0.0);
        }
      }

      @keyframes keyFrameFadeInOpacity {
        0% {
          opacity: 0;
        }
        100% {
          opacity: var(--paper-tooltip-opacity, 0.9);
        }
      }

      @keyframes keyFrameFadeOutOpacity {
        0% {
          opacity: var(--paper-tooltip-opacity, 0.9);
        }
        100% {
          opacity: 0;
        }
      }

      @keyframes keyFrameSlideDownIn {
        0% {
          transform: translateY(-2000px);
          opacity: 0;
        }
        10% {
          opacity: 0.2;
        }
        100% {
          transform: translateY(0);
          opacity: var(--paper-tooltip-opacity, 0.9);
        }
      }

      @keyframes keyFrameSlideDownOut {
        0% {
          transform: translateY(0);
          opacity: var(--paper-tooltip-opacity, 0.9);
        }
        10% {
          opacity: 0.2;
        }
        100% {
          transform: translateY(-2000px);
          opacity: 0;
        }
      }

      .fade-in-animation {
        opacity: 0;
        animation-delay: var(--paper-tooltip-delay-in, 500ms);
        animation-name: keyFrameFadeInOpacity;
        animation-iteration-count: 1;
        animation-timing-function: ease-in;
        animation-duration: var(--paper-tooltip-duration-in, 500ms);
        animation-fill-mode: forwards;
        @apply --paper-tooltip-animation;
      }

      .fade-out-animation {
        opacity: var(--paper-tooltip-opacity, 0.9);
        animation-delay: var(--paper-tooltip-delay-out, 0ms);
        animation-name: keyFrameFadeOutOpacity;
        animation-iteration-count: 1;
        animation-timing-function: ease-in;
        animation-duration: var(--paper-tooltip-duration-out, 500ms);
        animation-fill-mode: forwards;
        @apply --paper-tooltip-animation;
      }

      .scale-up-animation {
        transform: scale(0);
        opacity: var(--paper-tooltip-opacity, 0.9);
        animation-delay: var(--paper-tooltip-delay-in, 500ms);
        animation-name: keyFrameScaleUp;
        animation-iteration-count: 1;
        animation-timing-function: ease-in;
        animation-duration: var(--paper-tooltip-duration-in, 500ms);
        animation-fill-mode: forwards;
        @apply --paper-tooltip-animation;
      }

      .scale-down-animation {
        transform: scale(1);
        opacity: var(--paper-tooltip-opacity, 0.9);
        animation-delay: var(--paper-tooltip-delay-out, 500ms);
        animation-name: keyFrameScaleDown;
        animation-iteration-count: 1;
        animation-timing-function: ease-in;
        animation-duration: var(--paper-tooltip-duration-out, 500ms);
        animation-fill-mode: forwards;
        @apply --paper-tooltip-animation;
      }

      .slide-down-animation {
        transform: translateY(-2000px);
        opacity: 0;
        animation-delay: var(--paper-tooltip-delay-out, 500ms);
        animation-name: keyFrameSlideDownIn;
        animation-iteration-count: 1;
        animation-timing-function: cubic-bezier(0.0, 0.0, 0.2, 1);
        animation-duration: var(--paper-tooltip-duration-out, 500ms);
        animation-fill-mode: forwards;
        @apply --paper-tooltip-animation;
      }

      .slide-down-animation-out {
        transform: translateY(0);
        opacity: var(--paper-tooltip-opacity, 0.9);
        animation-delay: var(--paper-tooltip-delay-out, 500ms);
        animation-name: keyFrameSlideDownOut;
        animation-iteration-count: 1;
        animation-timing-function: cubic-bezier(0.4, 0.0, 1, 1);
        animation-duration: var(--paper-tooltip-duration-out, 500ms);
        animation-fill-mode: forwards;
        @apply --paper-tooltip-animation;
      }

      .cancel-animation {
        animation-delay: -30s !important;
      }

      /* Thanks IE 10. */

      .hidden {
        display: none !important;
      }
    </style>

    <div id="tooltip" class="hidden" above\$="{{above}}">
      <slot></slot>
    </div>
`,is:"kwc-paper-tooltip",hostAttributes:{role:"tooltip",tabindex:-1},properties:{for:{type:String,observer:"_findTarget"},manualMode:{type:Boolean,value:!1,observer:"_manualModeChanged"},position:{type:String,value:"bottom"},fitToVisibleBounds:{type:Boolean,value:!1},offset:{type:Number,value:14},marginTop:{type:Number,value:14},animationDelay:{type:Number,value:500,observer:"_delayChange"},animationEntry:{type:String,value:""},animationExit:{type:String,value:""},above:{type:Boolean,value:!1},animationConfig:{type:Object,value:function(){return{entry:[{name:"fade-in-animation",node:this,timing:{delay:0}}],exit:[{name:"fade-out-animation",node:this}]}}},_showing:{type:Boolean,value:!1}},listeners:{webkitAnimationEnd:"_onAnimationEnd"},get target(){var e=a.dom(this).parentNode,t=a.dom(this).getOwnerRoot();return this.for?a.dom(t).querySelector("#"+this.for):e.nodeType==Node.DOCUMENT_FRAGMENT_NODE?t.host:e},attached:function(){this._findTarget()},detached:function(){this.manualMode||this._removeListeners()},playAnimation:function(e){"entry"===e?this.show():"exit"===e&&this.hide()},cancelAnimation:function(){this.$.tooltip.classList.add("cancel-animation")},show:function(){if(!this._showing){if(""===a.dom(this).textContent.trim()){for(var e=!0,t=a.dom(this).getEffectiveChildNodes(),o=0;o<t.length;o++)if(""!==t[o].textContent.trim()){e=!1;break}if(e)return}this._showing=!0,this.$.tooltip.classList.remove("hidden"),this.$.tooltip.classList.remove("cancel-animation"),this.$.tooltip.classList.remove(this._getAnimationType("exit")),this.updatePosition(),this._animationPlaying=!0,this.$.tooltip.classList.add(this._getAnimationType("entry"))}},hide:function(){if(this._showing){if(this._animationPlaying)return this._showing=!1,void this._cancelAnimation();this._onAnimationFinish(),this._showing=!1,this._animationPlaying=!0}},updatePosition:function(){if(this._target&&this.offsetParent){var e=this.offset;14!=this.marginTop&&14==this.offset&&(e=this.marginTop);var t,a,o=this.offsetParent.getBoundingClientRect(),i=this._target.getBoundingClientRect(),n=this.getBoundingClientRect(),r=(i.width-n.width)/2,l=(i.height-n.height)/2,s=i.left-o.left,p=i.top-o.top;switch(this.position){case"top":t=s+r,a=p-n.height-e;break;case"bottom":t=s+r,a=p+i.height+e;break;case"left":t=s-n.width-e,a=p+l;break;case"right":t=s+i.width+e,a=p+l}this.fitToVisibleBounds?(o.left+t+n.width>window.innerWidth?(this.style.right="0px",this.style.left="auto"):(this.style.left=Math.max(0,t)+"px",this.style.right="auto"),o.top+a+n.height>window.innerHeight?(this.above=!0,this.style.top=Math.max(-o.top,a)-(142+n.height)+"px",this.style.bottom="auto"):(this.above=!1,this.style.top=Math.max(-o.top,a)+"px",this.style.bottom="auto")):(this.style.left=t+"px",this.style.top=a+"px")}},_addListeners:function(){this._target&&(this.listen(this._target,"mouseenter","show"),this.listen(this._target,"focus","show"),this.listen(this._target,"mouseleave","hide"),this.listen(this._target,"blur","hide"),this.listen(this._target,"tap","hide")),this.listen(this.$.tooltip,"animationend","_onAnimationEnd"),this.listen(this,"mouseenter","hide")},_findTarget:function(){this.manualMode||this._removeListeners(),this._target=this.target,this.manualMode||this._addListeners()},_delayChange:function(e){500!==e&&this.updateStyles({"--paper-tooltip-delay-in":e+"ms"})},_manualModeChanged:function(){this.manualMode?this._removeListeners():this._addListeners()},_cancelAnimation:function(){this.$.tooltip.classList.remove(this._getAnimationType("entry")),this.$.tooltip.classList.remove(this._getAnimationType("exit")),this.$.tooltip.classList.remove("cancel-animation"),this.$.tooltip.classList.add("hidden")},_onAnimationFinish:function(){this._showing&&(this.$.tooltip.classList.remove(this._getAnimationType("entry")),this.$.tooltip.classList.remove("cancel-animation"),this.$.tooltip.classList.add(this._getAnimationType("exit")))},_onAnimationEnd:function(){this._animationPlaying=!1,this._showing||(this.$.tooltip.classList.remove(this._getAnimationType("exit")),this.$.tooltip.classList.add("hidden"))},_getAnimationType:function(e){if("entry"===e&&""!==this.animationEntry)return this.animationEntry;if("exit"===e&&""!==this.animationExit)return this.animationExit;if(this.animationConfig[e]&&"string"==typeof this.animationConfig[e][0].name){if(this.animationConfig[e][0].timing&&this.animationConfig[e][0].timing.delay&&0!==this.animationConfig[e][0].timing.delay){var t=this.animationConfig[e][0].timing.delay;"entry"===e?this.updateStyles({"--paper-tooltip-delay-in":t+"ms"}):"exit"===e&&this.updateStyles({"--paper-tooltip-delay-out":t+"ms"})}return this.animationConfig[e][0].name}},_removeListeners:function(){this._target&&(this.unlisten(this._target,"mouseenter","show"),this.unlisten(this._target,"focus","show"),this.unlisten(this._target,"mouseleave","hide"),this.unlisten(this._target,"blur","hide"),this.unlisten(this._target,"tap","hide")),this.unlisten(this.$.tooltip,"animationend","_onAnimationEnd"),this.unlisten(this,"mouseenter","hide")}});const h=document.createElement("template");h.setAttribute("style","display: none;"),h.innerHTML='<custom-style>\n    <style is="custom-style">\n        html {\n            /*\n            UNIFIED KANO LOOK - start\n            Colors put forward by Kano designers for standardisation. Please try to pick one of these colors or discuss with pms/designers the need to expand the list.\n            */\n\n            --color-black: #292f35;\n            --color-abbey: #394148;\n            --color-chateau: #414a51;\n            --color-grey: #9fa4a8;\n            --color-stone: #d3d6d9;\n            --color-porcelain: #e9ebec;\n            --color-flame: #d95000;\n            --color-kano-orange: #ff6900;\n            --color-pumpkin: #ff860d;\n            --color-cinnabar: #cf2828;\n            --color-flamingo: #f63636;\n            --color-carnation: #ff5845;\n            --color-topaz: #d99700;\n            --color-amber: #ffc100;\n            --color-candlelight: #ffda38;\n            --color-sushi: #629e33;\n            --color-grassland: #88c440;\n            --color-apple: #9ee049;\n            --color-azure: #0e71d4;\n            --color-dodger-blue: #1093f5;\n            --color-sky: #11b0ff;\n\n            --color-facebook: #3b549a;\n            --color-twitter: #04b9e3;\n\n            /*UNIFIED KANO LOOK - end*/\n\n            --color-orange: #ff842a;\n            --color-lighter-orange: #FF9C54;\n            --color-dark-orange: #df6d24;\n            --color-darker-orange: #b1561c;\n            --color-green: #5AC869;\n            --color-darker-green: #41AF50;\n            --color-light-green: #9fd465;\n            --color-lighter-green: #74E283;\n            --color-lightblue: #96d7ec;\n            --color-blue: #59b3d0;\n            --color-kw-blue: #54A2E3;\n            --color-red: #e95c5a;\n            --color-lighter-red: #eb6c6a;\n            --color-yellow: #fed646;\n            --color-white: #f5f5f5;\n            --color-grey-lightest: #f5f5f5;\n            --color-grey-lighter: #ddd;\n            --color-grey-light: #aaa;\n            --color-grey-mid: #ececec;\n            --color-grey-dark: #999;\n            --color-grey-darker: #666;\n            --color-oslo-grey: #83898e;\n            --color-iron-grey: #e0e1e3;\n\n            --color-rhubarb: #ea5455;\n            --color-raspberry: #d74d4d;\n            --color-mango: #fc823f;\n            --color-charcoal: #141414;\n            --color-slate: #586871;\n            --color-concrete: #a7a7a7;\n            --color-ash: #e6e6e6;\n            --color-daffodil: #f9ca00;\n            --color-battleship-grey: #5c656a;\n            --color-flame: #f63636;\n            --color-night: #333940;\n            --color-magenta: #ea0084;\n\n            --color-dark: #263238;\n            --color-midnight: #2a2f35;\n\n            --primary-color: var(--color-dark);\n            --color-header: #444444;\n\n            --green-gradient: linear-gradient(#7DC243,#63B72C);\n            --blue-gradient: linear-gradient(#96d7ec,#5FAEC7);\n            --orange-gradient: linear-gradient(#ff842a,#DA6713);\n            --red-gradient: linear-gradient(#e95c5a,#E44B48);\n        }\n    </style>\n</custom-style>',document.head.appendChild(h.content);const f=document.createElement("template");f.setAttribute("style","display: none;"),f.innerHTML='<custom-style>\n  <style is="custom-style">\n      html {\n          --kano-input: {\n              font-family: bariol;\n              font-size: 1.1em;\n              border-radius: 3px;\n          };\n\n          --kano-light-input: {\n              font-family: var(--font-body, Arial);\n              background-color: transparent;\n              border: 0px;\n              border-bottom: 2px solid var(--color-black, black);\n              font-size: 1em;\n          };\n\n          --kano-light-select: {\n              background-color: transparent;\n              border: 1px solid var(--color-black, black);\n              font-size: 1em;\n          };\n\n          --kano-settings-container: {\n              display: inline-block;\n              width: 74%;\n              padding: 10px 0px;\n          };\n\n          --kano-settings-label: {\n              position: relative;\n              display: inline-block;\n              width: 71px;\n              text-align: right;\n          };\n      }\n  </style>\n</custom-style><dom-module id="input-range">\n    <template>\n        <style>\n          input[type=range] {\n            -webkit-appearance: none;\n            background-color: transparent; }\n\n          input[type=range]::-webkit-slider-thumb {\n            -webkit-appearance: none; }\n\n          input[type=range]::-ms-track {\n            cursor: pointer;\n            background-color: transparent;\n            border-color: transparent;\n            color: transparent; }\n\n          /* Special styling for WebKit/Blink */\n          input[type=range]::-webkit-slider-thumb {\n            -webkit-appearance: none;\n            height: 9px;\n            width: 20px;\n            border-radius: 3px;\n            background-color: #B2B2B2;\n            cursor: pointer;\n            margin-top: -3px; }\n\n          /* All the same stuff for Firefox */\n          input[type=range]::-moz-range-thumb {\n            height: 9px;\n            width: 20px;\n            border-radius: 3px;\n            background-color: #B2B2B2;\n            cursor: pointer; }\n\n          /* All the same stuff for IE */\n          input[type=range]::-ms-thumb {\n            height: 9px;\n            width: 20px;\n            border-radius: 3px;\n            background-color: #B2B2B2;\n            cursor: pointer; }\n\n          input[type=range]::-webkit-slider-runnable-track {\n            width: 100%;\n            height: 3px;\n            cursor: pointer;\n            background: #CBCBCB; }\n\n          input[type=range]:focus::-webkit-slider-runnable-track {\n            background: #CBCBCB; }\n\n          input[type=range]::-moz-range-track {\n            width: 100%;\n            height: 3px;\n            cursor: pointer;\n            background: #CBCBCB; }\n\n          input[type=range]::-ms-track {\n            width: 100%;\n            height: 3px;\n            cursor: pointer;\n            background: #CBCBCB; }\n\n          input[type=range]::-ms-fill-lower {\n            width: 100%;\n            height: 3px;\n            cursor: pointer;\n            background: #CBCBCB; }\n\n          input[type=range]:focus::-ms-fill-lower {\n            background: #CBCBCB; }\n\n          input[type=range]::-ms-fill-upper {\n            width: 100%;\n            height: 3px;\n            cursor: pointer;\n            background: #CBCBCB; }\n\n          input[type=range]:focus::-ms-fill-upper {\n            background: #CBCBCB; }\n        </style>\n    </template>\n</dom-module><dom-module id="input-text">\n    <template>\n        <style>\n            input[type="text"],\n            input[type="email"],\n            input[type="password"],\n            textarea {\n                background: white;\n                border-radius: 4px;\n                box-sizing: border-box;\n                border: 1px solid #d3d6d8;\n                display: block;\n                font-size: 14px;\n                padding: 8px 16px;\n                width: 100%;\n            }\n            input[type="text"]:focus,\n            input[type="email"]:focus,\n            input[type="password"]:focus,\n            textarea:focus {\n                outline: none;\n                border-color: var(--color-kano-orange);\n            }\n            /**\n             * Style the placeholders with all the browser-prefixes.\n             * See here: https://css-tricks.com/almanac/selectors/p/placeholder/\n             */\n            input[type="text"]::-webkit-input-placeholder,\n            input[type="email"]::-webkit-input-placeholder,\n            input[type="password"]::-webkit-input-placeholder,\n            textarea:focus {\n                text-transform: uppercase;\n            }\n            input[type="text"]::-moz-placeholder,\n            input[type="email"]::-moz-placeholder,\n            input[type="password"]::-moz-placeholder,\n            textarea:focus {\n                text-transform: uppercase;\n            }\n            input[type="text"]:-moz-placeholder,\n            input[type="email"]:-moz-placeholder,\n            input[type="password"]:-moz-placeholder,\n            textarea:focus {\n                text-transform: uppercase;\n            }\n            input[type="text"]:-ms-input-placeholder,\n            input[type="email"]:-ms-input-placeholder,\n            input[type="password"]:-ms-input-placeholder,\n            textarea:focus {\n                text-transform: uppercase;\n            }\n        </style>\n    </template>\n</dom-module>',document.head.appendChild(f.content);const b=document.createElement("template");b.setAttribute("style","display: none;"),b.innerHTML='<custom-style>\n    <style is="custom-style">\n        html {\n            --kano-empty-box: {\n                background: repeating-linear-gradient(135deg, transparent, transparent 5px, rgba(255,255,255,.5) 5px, rgba(255,255,255,.5) 10px), #b3b3b3;\n            };\n            --kano-dotted-background: {\n                background-image: -webkit-repeating-radial-gradient(center center, rgba(0,0,0,.04), rgba(0,0,0,.04) 4px, transparent 1px, transparent 100%);\n                background-image: -moz-repeating-radial-gradient(center center, rgba(0,0,0,.04), rgba(0,0,0,.04) 4px, transparent 1px, transparent 100%);\n                background-image: -ms-repeating-radial-gradient(center center, rgba(0,0,0,.04), rgba(0,0,0,.04) 4px, transparent 1px, transparent 100%);\n                background-image: repeating-radial-gradient(center center, rgba(0,0,0,.04), rgba(0,0,0,.04) 4px, transparent 1px, transparent 100%);\n                -webkit-background-size: 20px 20px;\n                -moz-background-size: 20px 20px;\n                background-size: 20px 20px;\n            };\n        }\n    </style>\n</custom-style>',document.head.appendChild(b.content);const y=document.createElement("template");y.setAttribute("style","display: none;"),y.innerHTML='<custom-style>\n    <style is="custom-style">\n        :root {\n            --content-width: 880px;\n            --content-padding: 0 8px;\n        }\n    </style>\n</custom-style>',document.head.appendChild(y.content);const w=document.createElement("template");w.setAttribute("style","display: none;"),w.innerHTML='<custom-style>\n    <style is="custom-style">\n        html {\n            --kano-shadow: {\n                box-shadow: 0px 3px 0px 0px rgba(0,0,0,0.11);\n            };\n\n            --kano-overlay: {\n                position: absolute;\n                top: 0px;\n                bottom: 0px;\n                right: 0px;\n                left: 0px;\n                z-index: 999;\n            };\n\n            --kano-box-shadow: {\n            -webkit-box-shadow: 0 4px 5px 0 rgba(0, 0, 0, 0.14), 0 1px 10px 0 rgba(0, 0, 0, 0.12), 0 2px 4px -1px rgba(0, 0, 0, 0.4);\n            -moz-box-shadow: 0 4px 5px 0 rgba(0, 0, 0, 0.14), 0 1px 10px 0 rgba(0, 0, 0, 0.12), 0 2px 4px -1px rgba(0, 0, 0, 0.4);\n            -o-box-shadow: 0 4px 5px 0 rgba(0, 0, 0, 0.14), 0 1px 10px 0 rgba(0, 0, 0, 0.12), 0 2px 4px -1px rgba(0, 0, 0, 0.4);\n            box-shadow: 0 4px 5px 0 rgba(0, 0, 0, 0.14), 0 1px 10px 0 rgba(0, 0, 0, 0.12), 0 2px 4px -1px rgba(0, 0, 0, 0.4);\n            }\n\n            --kano-inset-box-shadow: {\n                -webkit-box-shadow: inset 4px 0 5px 0 rgba(0, 0, 0, 0.14);\n                -moz-box-shadow: inset 4px 0 5px 0 rgba(0, 0, 0, 0.14);\n                -o-box-shadow: inset 4px 0 5px 0 rgba(0, 0, 0, 0.14);\n                box-shadow: inset 4px 0 5px 0 rgba(0, 0, 0, 0.14);\n            }\n        }\n\n        iron-overlay-backdrop.reward {\n            --iron-overlay-backdrop-opacity: 1;\n            --iron-overlay-backdrop-background-color: #5c6870;\n        }\n    </style>\n</custom-style>',document.head.appendChild(w.content),a.Polymer({_template:t.html`
        <style>
            :host {
                --paper-tooltip-background: var(--color-abbey);
                --paper-tooltip-opacity: 1;
                --paper-tooltip-text-color: var(--color-white);
                --paper-tooltip: {
                    border-radius: 3px;
                    font-family: var(--font-body);
                    line-height: 24px;
                    padding: 16px 24px;
                    width: 200px;
                };
                @apply --layout-vertical;
                @apply --layout-wrap;
                @apply --layout-center-justified;
            }
            :host iron-image {
                height: var(--kwc-badge-size, 100px);
                width: var(--kwc-badge-size, 100px);
                -webkit-filter: grayscale(100%);
                filter: grayscale(100%);
            }
            :host([unlocked]) iron-image {
                -webkit-filter: grayscale(0%);
                filter: grayscale(0%);
            }
            :host .triangle {
                border-left: 16px solid transparent;
                border-right: 16px solid transparent;
                border-bottom: 16px solid var(--color-abbey);
                height: 0;
                left: 0;
                margin: auto;
                position: absolute;
                right: 0;
                top: -8px;
                width: 0;
            }
            :host kwc-paper-tooltip h3 {
                font-size: 18px;
                margin: 0px 0px 10px 0px;
            }
            :host kwc-paper-tooltip p {
                font-size: 16px;
                margin: 0px 0px 5px 0px;
            }
            :host *[hidden] {
                display: none;
            }

            /*
            XXX: Hide fullscreen button on mobile screens while the
            functionality until a full responsive solution is in place.
            \`768px\` is the current media query value for \`kwc-masthead\`.
            */
            @media (max-width: 768px) {
                kwc-paper-tooltip {
                    display: none;
                }
            }
        </style>
        <iron-image id="badge" alt="[[title]]" sizing="contain" src="[[imageUrl]]">
                    </iron-image>
        <template is="dom-if" if="[[tooltip]]">
            <kwc-paper-tooltip for="badge" animation-delay="0" margin-top="20" position="bottom" fit-to-visible-bounds="">
                <div class="triangle"></div>
                <h3>[[title]]</h3>
                <p hidden\$="[[_displayDescription]]">[[criteria]]</p>
                <p hidden\$="[[!_displayDescription]]">[[description]]</p>
            </kwc-paper-tooltip>
        </template>
`,is:"kwc-badge",properties:{criteria:{type:String},currentUser:{type:Boolean,value:!1},description:{type:String},_displayDescription:{type:Boolean,computed:"_unlockedByUser(currentUser, unlocked)"},imageUrl:{type:String},title:{type:String},tooltip:{type:Boolean,value:!0},unlocked:{type:Boolean,value:!1,reflectToAttribute:!0}},_unlockedByUser:(e,t)=>e&&t}),a.Polymer({_template:t.html`
        <style>
            :host {
                --paper-spinner-color: var(--color-kano-orange);
                --kwc-badge-margin: 30px;
                @apply --layout-horizontal;
                @apply --layout-wrap;
                @apply --layout-center-justified;
                font-family: var(--font-body);
                min-height: 100px;
                position: relative;
            }
            :host .loader {
                @apply --layout-fit;
                margin: auto;
            }
            :host .loader-label {
                color: var(--color-abbey);
                font-size: 24px;
                font-weight: bold;
                padding-bottom: 24px;
                text-align: center;
            }
            :host paper-spinner-lite {
                display: block;
                margin: auto;
            }
            :host kwc-badge {
                margin: var(--kwc-badge-listing-gutter, 25px);
            }
        </style>
        <template is="dom-if" if="[[!badges.length]]">
            <div class="loader">
                <div class="loader-label">
                    Loading...
                </div>
                <paper-spinner-lite active="[[!badges.length]]">
                </paper-spinner-lite>
            </div>
        </template>
        <template is="dom-repeat" items="[[badges]]" as="badge">
            <kwc-badge title="[[badge.title]]" criteria="[[badge.criteria]]" current-user="[[currentUser]]" description="[[badge.description]]" image-url="[[badge.imageUrl]]" unlocked="[[badge.unlocked]]">
                       </kwc-badge>
        </template>
`,is:"kwc-badge-listing",properties:{badges:{type:Array,value:function(){return[]}},currentUser:{type:Boolean,value:!1}}});window.customElements.define("ka-profile-badges",class extends t.PolymerElement{static get template(){return t.html`
            <style>
                :host {
                    width: 900px;
                    margin: 24px auto;
                    display: flex;
                    flex-direction: row;
                    flex-wrap: wrap;
                }
                .badge {
                    background: #FFF;
                    padding: 53px;
                    margin: 9px;
                    border-radius: 8px;
                    position: relative;
                    cursor: pointer;
                }
                .badge:not([unlocked]) iron-image {
                    filter: grayscale(100%);
                    -webkit-filter: grayscale(100%);
                }
                .badge:hover .content {
                    opacity: 0.83;
                }
                iron-image {
                    width: 100px;
                    height: 100px;
                }
                .content {
                    color: #FFF;
                    width: calc(100% - 48px);
                    height: calc(100% - 48px);
                    background: rgba(65, 74, 81, 0.5);
                    border-radius: 8px;
                    opacity: 0;
                    padding: 24px;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    transition: all 0.15s ease;
                    position: absolute;
                    top: 0;
                    left: 0;
                }
                .content p {
                    font-weight: bold;
                    letter-spacing: 0.2px;
                    font-size: 16.5px;
                    margin: 0 0 12px;
                }
                .content span {
                    font-size: 14px;
                    flex: 1;
                }
                @media only screen and (max-width : 1023px) {
                    :host {
                        width: 100%;
                        justify-content: center;
                    }
                }
            </style>
            <template is="dom-repeat" items="[[badges]]" as="badge">
                <div class="badge" unlocked$="[[badge.unlocked]]">
                    <iron-image src="[[badge.imageUrl]]" sizing="contain"></iron-image>
                    <div class="content">
                        <p>[[badge.title]]</p>
                        <span>[[badge.criteria]]</span>
                    </div>
                </div>
            </template>
        `}static get properties(){return{badges:Array}}});class x extends t.PolymerElement{static get template(){return t.html`
        <style>
            :host {
                display: inline-flex;
                background-color: #ffffff;
                padding: 1px 17px;
                border-radius: 8px;
                width: calc(100% - 34px);
                margin: 8.5px 0;
            }
            .user {
                @apply --layout-horizontal;
                @apply --layout-center;
                @apply --layout-around-justified;
                width: 100%;
                margin: 16px 0;
            }
            .avatar-wrapper {
                @apply --layout-self-start;
                width: 40px;
                height: 40px;
                cursor: pointer;
            }
            .avatar {
                width: 100%;
                height: 100%;
            }
            .user-info {
                flex-grow: 3;
                font-weight: bold;
                padding-left: 16px;
                cursor: pointer;
            }
            .user-info .username {
                color: var(--color-black);
                font-size: 18px;
                line-height: 20px;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            .user-info .level {
                color: var(--color-grey);
                font-size: 16px;
                line-height: 18px;
            }
            .follow-button {
                cursor: pointer;
            }
            .follow-button .follow-icon-wrapper {
                width: 32px;
                height: 25px;
            }
            .follow-button .follow-icon-wrapper .followed-icon,
            .follow-button .follow-icon-wrapper .follow-icon {
                width: 100%;
                height: 100%;
            }
            .follow-button .follow-icon-wrapper .follow-icon {
                fill: var(--color-grey);
            }
            .follow-button .follow-icon-wrapper .follow-icon:hover {
                fill: var(--color-grassland);
            }
            .follow-button .follow-icon-wrapper .followed-icon:hover {
                opacity: 0.8;
            }
        </style>

        <div class="user">
            <div class="avatar-wrapper" on-tap="_onTapUser">
                <iron-image sizing="contain" class="avatar" src="[[avatar]]">
                </iron-image>
            </div>
            <div class="user-info" on-tap="_onTapUser">
                <div class="username">
                    [[username]]
                </div>
                <div class="level">
                    Level [[level]]
                </div>
            </div>
            <div class="follow-button">
                <div class="follow-icon-wrapper">
                    <template is="dom-if" if="[[followed]]">
                        <template is="dom-if" if="[[!followedIcon]]">
                            <iron-image sizing="contain" class="followed-icon" src="/assets/icons/followed.svg" on-tap="_onTapFollow">
                            </iron-image>
                        </template>
                        <template is="dom-if" if="[[followedIcon]]">
                            <iron-image sizing="contain" class="followed-icon" src="[[followedIcon]]" on-tap="_onTapFollow">
                            </iron-image>
                        </template>
                    </template>
                    <template is="dom-if" if="[[!followed]]">
                        <div class="follow-icon" on-tap="_onTapFollow">
                            <svg class="follow-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 33.97 25.01"><title>Asset 47</title><g id="Layer_2" data-name="Layer 2"><g id="Layer_4" data-name="Layer 4"><path class="cls-1" d="M17,25a78.41,78.41,0,0,1-11-.77A5.74,5.74,0,0,1,.88,19.64,29.2,29.2,0,0,1,0,12.5,28.72,28.72,0,0,1,.91,5.36,5.69,5.69,0,0,1,6,.77a79.26,79.26,0,0,1,22,0,5.74,5.74,0,0,1,5.07,4.59h0A29.25,29.25,0,0,1,34,12.51a28.73,28.73,0,0,1-.91,7.14A5.69,5.69,0,0,1,28,24.24,79.85,79.85,0,0,1,17,25ZM17,2a78,78,0,0,0-10.76.75,3.71,3.71,0,0,0-3.4,3.11A26.7,26.7,0,0,0,2,12.5a27.17,27.17,0,0,0,.82,6.66,3.74,3.74,0,0,0,3.41,3.1,77.21,77.21,0,0,0,21.49,0,3.71,3.71,0,0,0,3.4-3.11A26.73,26.73,0,0,0,32,12.5a27.21,27.21,0,0,0-.82-6.65,3.74,3.74,0,0,0-3.41-3.1A76.51,76.51,0,0,0,17,2Z"></path><path class="cls-1" d="M9.33,11V9a.52.52,0,0,1,.16-.38.55.55,0,0,1,.39-.16h.89a.55.55,0,0,1,.39.16.52.52,0,0,1,.16.38v2a.56.56,0,0,0,.55.55h2a.52.52,0,0,1,.38.16.55.55,0,0,1,.16.39V13a.55.55,0,0,1-.16.39.52.52,0,0,1-.38.16h-2a.56.56,0,0,0-.55.55v2a.52.52,0,0,1-.16.38.55.55,0,0,1-.39.16H9.88a.55.55,0,0,1-.39-.16.52.52,0,0,1-.16-.38v-2a.56.56,0,0,0-.55-.55h-2a.51.51,0,0,1-.47-.27A.53.53,0,0,1,6.23,13v-.89a.55.55,0,0,1,.16-.39.52.52,0,0,1,.38-.16h2A.56.56,0,0,0,9.33,11Z"></path><path class="cls-1" d="M26.67,16.91a.94.94,0,0,1-.62.86,11.24,11.24,0,0,1-7.82.06,1,1,0,0,1-.64-.86V16.9a4.15,4.15,0,0,1,4.07-3.82,3,3,0,0,1-2.33-3A3,3,0,0,1,22.13,7a3,3,0,0,1,2.8,3.07,3,3,0,0,1-2.33,3,4.15,4.15,0,0,1,4.07,3.82Z"></path></g></g></svg>
                        </div>
                    </template>
                </div>
            </div>
        </div>  
`}static get is(){return"kwc-follow-item"}static get properties(){return{username:String,level:Number,avatar:String,followed:{type:Boolean,value:!1},followedIcon:{type:String,value:""}}}_onTapFollow(e){let t="follow",a={bubbles:!1,detail:this.username};this.followed&&(t="unfollow"),this.dispatchEvent(new CustomEvent(t,a))}_onTapUser(e){this.dispatchEvent(new CustomEvent("tap-user",{bubbles:!1,detail:this.username}))}}window.customElements.define(x.is,x);const v='\n    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 33.97 25.01"><defs><style>.cls-1{fill:#88c440}.cls-2{fill:#fff}</style></defs><title>Asset 46</title><g id="Layer_2" data-name="Layer 2"><g id="Layer_4" data-name="Layer 4"><path class="cls-1" d="M33.09 5.36A5.74 5.74 0 0 0 28 .77a79.26 79.26 0 0 0-22 0A5.69 5.69 0 0 0 .91 5.36 28.69 28.69 0 0 0 0 12.5a29.25 29.25 0 0 0 .88 7.14 5.74 5.74 0 0 0 5.07 4.59A78.41 78.41 0 0 0 17 25a79.85 79.85 0 0 0 11-.77 5.69 5.69 0 0 0 5.06-4.59 28.73 28.73 0 0 0 .94-7.13 29.25 29.25 0 0 0-.91-7.15z"/><path class="cls-2" d="M24.15 8.16l-.75-.75a.74.74 0 0 0-.35-.2.71.71 0 0 0-.74.2L15 14.75l-3.12-3.12a.71.71 0 0 0-.54-.23.75.75 0 0 0-.55.23l-.75.75a.79.79 0 0 0 0 1.09l3.46 3.46a.73.73 0 0 0 .17.25l.75.75a.75.75 0 0 0 .55.23.71.71 0 0 0 .54-.23l8.66-8.66a.68.68 0 0 0 .21-.34.72.72 0 0 0-.23-.77z"/></g></g></svg>\n',k='\n    <svg xmlns="http://www.w3.org/2000/svg" width="19.34" height="14.14" viewBox="0 0 19.34 14.14"><defs><style>.cls-1{fill:#CDD0D5;}</style></defs><title>follow</title><g id="Layer_2" data-name="Layer 2"><g id="Layer_1-2" data-name="Layer 1"><path class="cls-1" d="M8.28,6.78a.45.45,0,0,0,.14-.33V5.8A.48.48,0,0,0,8,5.33H5V2.41A.48.48,0,0,0,5,2.17a.44.44,0,0,0-.41-.24H3.91A.48.48,0,0,0,3.68,2a.43.43,0,0,0-.24.41V5.33h-3a.42.42,0,0,0-.33.14A.45.45,0,0,0,0,5.8v.65a.49.49,0,0,0,.14.33.45.45,0,0,0,.33.14h3v3a.48.48,0,0,0,.47.47h.65a.45.45,0,0,0,.33-.14A.45.45,0,0,0,5,9.89v-3H8A.45.45,0,0,0,8.28,6.78Z"/><path class="cls-1" d="M14.33,7.48A3.68,3.68,0,0,0,17.2,3.77,3.62,3.62,0,0,0,13.75,0a3.62,3.62,0,0,0-3.44,3.77,3.68,3.68,0,0,0,2.86,3.71c-2.81.25-5,2.26-5,4.7v.08A1.15,1.15,0,0,0,9,13.31a13.77,13.77,0,0,0,4.71.83,13.89,13.89,0,0,0,4.91-.9,1.16,1.16,0,0,0,.77-1.05h0C19.34,9.74,17.14,7.73,14.33,7.48Z"/></g></g></svg>\n',_='\n    <svg xmlns="http://www.w3.org/2000/svg" width="16.21" height="12.15" viewBox="0 0 16.21 12.15"><defs><style>.cls-1{fill:#CDD0D5;}</style></defs><title>following</title><g id="Layer_2" data-name="Layer 2"><g id="Layer_1-2" data-name="Layer 1"><path class="cls-1" d="M16.17,1.91a.71.71,0,0,1-.23.38L7.15,11.08l-.81.81v0l0,0L6.2,12l0,0-.11.05a.74.74,0,0,1-.34.07.81.81,0,0,1-.6-.24L.24,7A.81.81,0,0,1,0,6.43a.84.84,0,0,1,.24-.61L1.07,5a.82.82,0,0,1,.61-.25.79.79,0,0,1,.6.25L5.72,8.44,13.91.26A.77.77,0,0,1,14.73,0a.76.76,0,0,1,.39.22l.82.82A.8.8,0,0,1,16.17,1.91Z"/></g></g></svg>\n';function B(e){return`data:image/svg+xml;base64,${btoa(e)}`}const C=e=>(class extends e{static templateWrapper(e,a){return t.html`
            <style>
                :host {
                    display: flex;
                    flex-direction: row;
                    flex-wrap: wrap;
                }
                kwc-follow-item {
                    width: calc(33% - 16px);
                    box-sizing: border-box;
                    margin: 8px;
                }
                .no-follows {
                    width: 976px;
                    background: #fff;
                    border-radius: 9px;
                    padding: 73px 100px;
                    text-align: center;
                    margin-top: 5px;
                }
                .no-follows .title {
                    color: #414A50;
                    font-weight: bold;
                    font-size: 23px;
                    margin: 0;
                }
            </style>

            <template is="dom-repeat" items="[[users]]">
                <kwc-follow-item
                    username="[[item.username]]"
                    followed="[[_isFollowed(item.id, cantFollow)]]"
                    avatar="[[item.avatar]]"
                    on-tap-user="_goToUser"
                    on-follow="_followUser"
                    on-unfollow="_unfollowUser"
                    followed-icon="[[followedIcon]]">
                </kwc-follow-item>
            </template>
            <template is="dom-if" if="[[!users.length]]">
                <div class="no-follows">
                    <template is="dom-if" if="[[!fromUser]]">
                        ${a}
                    </template>
                    <template is="dom-if" if="[[fromUser]]">
                        ${e}
                    </template>
                </div>
            </template>
        `}static get properties(){return{users:Array,fromUser:{type:Boolean,value:!1},username:String,cantFollow:Array}}constructor(){super(),this.followedIcon=B(v)}_isFollowed(e,t){return-1!==t.indexOf(e)}_goToUser(e){const{username:t}=e.model.get("item");this.dispatchEvent(new CustomEvent("user-click",{detail:t,bubbles:!0,composed:!0}))}_followUser(e){const t=e.model.get("item");this.dispatchEvent(new CustomEvent("follow-click",{detail:t,bubbles:!0,composed:!0}))}_unfollowUser(e){const t=e.model.get("item");this.dispatchEvent(new CustomEvent("unfollow-click",{detail:t,bubbles:!0,composed:!0}))}});window.customElements.define("ka-profile-followers",class extends(C(t.PolymerElement)){static get template(){const e=t.html`<p class="title">No one's following you yet.</p>`,a=t.html`<p class="title">No one here yet. You can be [[username]]'s first follower!</p>`;return this.templateWrapper(e,a)}});window.customElements.define("ka-profile-following",class extends(C(t.PolymerElement)){static get template(){const e=t.html`<p class="title">You haven't followed anyone yet.</p>`,a=t.html`<p class="title">[[username]] isn't following anyone yet.</p>`;return this.templateWrapper(e,a)}});class A extends t.PolymerElement{static get template(){return t.html`
            <style>
                :host {
                    display: flex;
                    --profile-theme: {
                        display: flex;
                        flex-direction: column;
                        align-items: stretch;
                        font-family: var(--font-body);
                        background: var(--avatar-creator-background-medium);
                    };
                    @apply --profile-theme;

                    --profile-tabs: {
                        display: flex;
                        flex-direction: row;
                        justify-content: center;
                    };

                    --profile-tabs-link: {
                        display: flex;
                        flex-direction: row;
                        justify-content: center;
                        align-items: center;
                        margin: 0px 4px;
                        border-top-left-radius: 6px;
                        border-top-right-radius: 6px;
                        background: var(--color-abbey);
                        color: var(--color-porcelain);
                        text-decoration: none;
                        font-size: 16px;
                        transition: all linear 120ms;
                        font-weight: bold;
                        opacity: 0.8;
                        min-width: 110px;
                    };
                    --profile-tabs-link-selected: {
                        opacity: 1;
                        color: black;
                        background: var(--color-porcelain);
                    }
                    /* --kwc-avatar-toolbox-tabs: {
                        @apply --profile-tabs-link;
                    }; */
                    --kwc-avatar-toolbox-tab: {
                        @apply --profile-tabs-link;
                    };
                    --kwc-avatar-toolbox-tab-selected: {
                        @apply --profile-tabs-link-selected;
                    };
                    --paper-tabs-container: {
                        @apply --profile-tabs;
                    };
                    --paper-tabs-content: {
                        @apply --profile-tabs;
                    };

                    --avatar-creator-background-light: var(--color-porcelain);
                    --avatar-creator-background-medium: #535e6b;
                    --avatar-creator-background-dark: var(--color-abbey);
                    --avatar-creator-background-grey: var(--color-porcelain);
                    --profile-tabs: {
                        display: flex;
                        flex-direction: row;
                        justify-content: center;
                    };
                }
                .transition-element {
                    transition: 0.5s all ease-in-out;
                }
                .head {
                    background-color: var(--color-chateau, grey);
                    background-position: top center;
                    background-size: contain;
                    background-color: #5a6675;
                    background-repeat: no-repeat;
                    min-height: 200px;
                    height: 30vh;
                    position: relative;
                }
                .head.is-editing {
                    height: 50vh;
                }
                div[slot="avatar"] {
                    display: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                }
                .subnav {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    height: 42px;
                    @apply --profile-tabs;
                    /* Ensure anything positioned around this subnav can be clicked on */
                    pointer-events: none;
                }
                .subnav a {
                    pointer-events: all;
                    @apply --profile-tabs-link;
                }
                .subnav a.iron-selected {
                    @apply --profile-tabs-link-selected;
                }
                .subnav a:hover {
                    opacity: 1;
                }
                .subnav a:focus {
                    outline: none;
                }
                div[name="follows"] iron-pages {
                    max-width: 976px;
                    width: 976px;
                    margin: 24px auto 0;
                }
                .top {
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    justify-content: space-between;
                    margin: 32px auto 30px;
                    width: 976px;
                }
                .top .follows {
                    margin-left: 8px;
                }
                .top button {
                    margin-right: 16px;
                    height: 40px;
                    border: none;
                    border-radius: 25px;
                    padding: 0 20px;
                    color: #fff;
                    font-weight: bold;
                    font-size: 14px;
                    background: #9FA4A8;
                }
                .follows a {
                    font-size: 16px;
                    text-decoration: none;
                    color: var(--color-grey);
                    padding: 5px 22px;
                    height: 40px;
                    border-radius: 15px;
                    letter-spacing: 0.4px;
                    font-weight: 600;
                    transition: all 0.1s ease;
                }
                .follows a:hover {
                    color: #414A51;
                }
                .follows a.iron-selected {
                    background-color: var(--color-grey);
                    color: #ffffff;
                }
                iron-pages.pages {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }
                iron-pages.pages > * {
                    flex: 1;
                    width: 100%;
                    background: var(--color-porcelain);
                }
                iron-pages > ka-view-followers,
                iron-pages > ka-view-following {
                    margin-top: 20px;
                }
                [hidden] {
                    display: none !important;
                }
                iron-selector.subnav,
                iron-pages.pages {
                    animation-name: loadIn;
                    animation-duration: 0.5s;
                    animation-timing-function: ease-out;
                    animation-iteration-count: 1;
                }
                iron-selector.subnav.is-editing,
                iron-pages.pages.is-editing {
                    transform: translateY(500px);
                }
                .user-info {
                    width: 960px;
                    position: absolute;
                    left: 50%;
                    top: 38px;
                    transform: translateX(-50%);
                }
                .user-info .username {
                    font-size: 32px;
                    font-weight: bold;
                    color: #FFF;
                    margin: 0;
                    /* Make sure the space is kept for the incoming data */
                    min-height: 36px;
                    height: 36px;
                    transition: opacity ease-out 400ms;
                    opacity: 1;
                }
                .user-info .username.loading {
                    opacity: 0;
                }
                .user-info .level {
                    font-size: 18px;
                    font-weight: bold;
                    color: #FFF;
                    text-transform: uppercase;
                    margin: 12px 0 0;
                    /* Make sure the space is kept for the incoming data */
                    min-height: 24px;
                    height: 24px;
                    transition: all ease-out 400ms;
                    transition-delay: 400ms;
                    transform: none;
                    opacity: 0.5;
                }
                .user-info .level.loading {
                    transform: translateY(-50%);
                    opacity: 0;
                }
                .user-info .follow {
                    border: 1.5px solid #828B97;
                    border-radius: 16px;
                    padding: 5px 15px 5px 11px;
                    display: inline-flex;
                    align-items: center;
                    margin-top: 16px;
                    transition: all 0.2s ease-in-out;
                    font-family: inherit;
                    font-size: inherit;
                    background: transparent;
                    outline: none;
                    transition: opacity ease-out 400ms;
                }
                .user-info .follow:disabled {
                    opacity: 0.5;
                }
                .user-info .follow.loading {
                    opacity: 0;
                }
                .user-info .follow:hover {
                    background: #828B97;
                    cursor: pointer;
                }
                .user-info .follow-icon {
                    margin-right: 8px;
                    display: flex;
                }
                .user-info .follow-text {
                    font-weight: bold;
                    color: #FFF;
                }
                .animation {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    transition: all 0.5s ease-in-out;
                }
                @media only screen and (max-width : 992px) {
                    .user-info {
                        width: 87%;
                    }
                }
            </style>
            <div id="avatarHead" class$="head transition-element [[checkIsEditing(isEditing)]]" style$="background-image: url('[[headerBackground]]')">
                <div class="user-info">
                    <p class$="username [[_computeLoadingClass(loading)]]">[[user.username]]</p>
                    <p class$="level [[_computeLoadingClass(loadingLevel)]]">Level [[progress.level]]</p>
                    <button class$="follow [[_computeLoadingClass(loading)]]" role="button" hidden$="[[fromUser]]" disabled$="[[followDisabled]]" on-click="_toggleFollow">
                        <div class="follow-icon">
                            <iron-image src="[[followIcon]]"></iron-image>
                        </div>
                        <div class="follow-text">[[followLabel]]</div>
                    </button>
                </div>
                <slot name="avatar"></slot>
                <iron-selector hidden\$="[[isEditing]]" class$="subnav transition-element [[checkIsEditing(isEditing)]]" selectable="a" selected="[[subnav]]" attr-for-selected="name" fallback-selection="creations">
                    <!-- TODO - Add about and medals back in when they're hooked up -->
                    <a name="creations" href="[[linkPrefix]]/creations"><span>Creations</span></a>
                    <a name="follows" href="[[linkPrefix]]/followers"><span>Follows</span></a>
                </iron-selector>
            </div>
            <iron-pages hidden\$="[[isEditing]]" class$="pages transition-element [[checkIsEditing(isEditing)]]" selected="[[subnav]]" attr-for-selected="name" fallback-selection="creations">
                <!-- <div name="about">
                    <slot name="about"></slot>
                </div> -->
                <div name="creations">
                    <slot name="creations"></slot>
                </div>
                <div name="medals">
                    <slot name="badges">
                        <ka-profile-badges badges="[[badges]]"></ka-profile-badges>
                    </slot>
                </div>
                <div name="follows">
                    <slot name="follows">
                        <div class="top">
                            <iron-selector class="follows" selected="[[followsPage]]" attr-for-selected="name">
                                <a name="followers" href="[[linkPrefix]]/followers"><span>[[_followsSum(follows.followers.*)]] [[_plural('Follower', follows.followers.length)]]</span></a>
                                <a name="following" href="[[linkPrefix]]/following"><span>[[_followsSum(follows.following.*)]] Following</span></a>
                            </iron-selector>
                            <button hidden>Invite</button>
                        </div>
                        <iron-pages selected="[[followsPage]]" attr-for-selected="name">
                                <ka-profile-followers name="followers"
                                                users="[[follows.followers]]"
                                                cant-follow="[[cantFollow]]"
                                                username="[[user.username]]"
                                                from-user="[[fromUser]]"></ka-profile-followers>
                                <ka-profile-following name="following"
                                                users="[[follows.following]]"
                                                cant-follow="[[cantFollow]]"
                                                username="[[user.username]]"
                                                from-user="[[fromUser]]"></ka-profile-following>
                        </iron-pages>
                    </slot>
                </div>
            </iron-pages>
        `}static get is(){return"ka-profile"}static get properties(){return{follows:Object,progress:Object,badges:Array,authUser:Object,authUserFollowing:Array,user:Object,fromUser:{type:Boolean,computed:"_computeFromUser(user, authUser)"},subnav:{type:String,value:"creations"},followsPage:{type:String,value:"followers"},headerBackground:{type:String},cantFollow:{type:Array,computed:"_computeCantFollow(authUserFollowing.splices, authUser)"},linkPrefix:String,loadingLevel:{type:Boolean,value:!0},followDisabled:{type:Boolean,value:!1},loading:{type:Boolean,value:!0}}}static get observers(){return["_computeFollow(cantFollow, user.id)"]}_computeLoadingClass(e){return e?"loading":""}_computeFromUser(e,t){return e&&t&&e.id===t.id}_followsSum(e){const{base:t}=e;return t&&t.length||""}_computeCantFollow(){if(!this.authUserFollowing||!this.authUser)return[];const e=this.authUserFollowing.map(e=>e.id);return e.push(this.authUser.id),e}_plural(e,t){return t&&t>1?`${e}s`:e}checkIsEditing(e){return e?"is-editing":""}_computeFollow(e,t){!this.fromUser&&e&&(-1===e.indexOf(t)?(this.followIcon=B(k),this.followLabel="Follow",this.authUserFollowUser=!1):(this.followIcon=B(_),this.followLabel="Following",this.authUserFollowUser=!0))}_toggleFollow(){const e=this.authUserFollowUser?"unfollow-click":"follow-click";this.dispatchEvent(new CustomEvent(e,{detail:this.user,bubbles:!0,composed:!0}))}}window.customElements.define(A.is,A),a.Polymer({_template:t.html`
    <style>
      :host {
        display: inline-block;
        position: relative;
        width: 400px;
        border: 1px solid;
        padding: 2px;
        -moz-appearance: textarea;
        -webkit-appearance: textarea;
        overflow: hidden;
      }

      .mirror-text {
        visibility: hidden;
        word-wrap: break-word;
        @apply --iron-autogrow-textarea;
      }

      .fit {
        @apply --layout-fit;
      }

      textarea {
        position: relative;
        outline: none;
        border: none;
        resize: none;
        background: inherit;
        color: inherit;
        /* see comments in template */
        width: 100%;
        height: 100%;
        font-size: inherit;
        font-family: inherit;
        line-height: inherit;
        text-align: inherit;
        @apply --iron-autogrow-textarea;
      }

      textarea::-webkit-input-placeholder {
        @apply --iron-autogrow-textarea-placeholder;
      }

      textarea:-moz-placeholder {
        @apply --iron-autogrow-textarea-placeholder;
      }

      textarea::-moz-placeholder {
        @apply --iron-autogrow-textarea-placeholder;
      }

      textarea:-ms-input-placeholder {
        @apply --iron-autogrow-textarea-placeholder;
      }
    </style>

    <!-- the mirror sizes the input/textarea so it grows with typing -->
    <!-- use &#160; instead &nbsp; of to allow this element to be used in XHTML -->
    <div id="mirror" class="mirror-text" aria-hidden="true">&nbsp;</div>

    <!-- size the input/textarea with a div, because the textarea has intrinsic size in ff -->
    <div class="textarea-container fit">
      <textarea id="textarea" name\$="[[name]]" aria-label\$="[[label]]" autocomplete\$="[[autocomplete]]" autofocus\$="[[autofocus]]" inputmode\$="[[inputmode]]" placeholder\$="[[placeholder]]" readonly\$="[[readonly]]" required\$="[[required]]" disabled\$="[[disabled]]" rows\$="[[rows]]" minlength\$="[[minlength]]" maxlength\$="[[maxlength]]"></textarea>
    </div>
`,is:"iron-autogrow-textarea",behaviors:[o.IronValidatableBehavior,o.IronControlState],properties:{value:{observer:"_valueChanged",type:String,notify:!0},bindValue:{observer:"_bindValueChanged",type:String,notify:!0},rows:{type:Number,value:1,observer:"_updateCached"},maxRows:{type:Number,value:0,observer:"_updateCached"},autocomplete:{type:String,value:"off"},autofocus:{type:Boolean,value:!1},inputmode:{type:String},placeholder:{type:String},readonly:{type:String},required:{type:Boolean},minlength:{type:Number},maxlength:{type:Number},label:{type:String}},listeners:{input:"_onInput"},get textarea(){return this.$.textarea},get selectionStart(){return this.$.textarea.selectionStart},get selectionEnd(){return this.$.textarea.selectionEnd},set selectionStart(e){this.$.textarea.selectionStart=e},set selectionEnd(e){this.$.textarea.selectionEnd=e},attached:function(){navigator.userAgent.match(/iP(?:[oa]d|hone)/)&&(this.$.textarea.style.marginLeft="-3px")},validate:function(){var e=this.$.textarea.validity.valid;return e&&(this.required&&""===this.value?e=!1:this.hasValidator()&&(e=o.IronValidatableBehavior.validate.call(this,this.value))),this.invalid=!e,this.fire("iron-input-validate"),e},_bindValueChanged:function(e){this.value=e},_valueChanged:function(e){var t=this.textarea;t&&(t.value!==e&&(t.value=e||0===e?e:""),this.bindValue=e,this.$.mirror.innerHTML=this._valueForMirror(),this.fire("bind-value-changed",{value:this.bindValue}))},_onInput:function(e){var t=a.dom(e).path;this.value=t?t[0].value:e.target.value},_constrain:function(e){var t;for(e=e||[""],t=this.maxRows>0&&e.length>this.maxRows?e.slice(0,this.maxRows):e.slice(0);this.rows>0&&t.length<this.rows;)t.push("");return t.join("<br/>")+"&#160;"},_valueForMirror:function(){var e=this.textarea;if(e)return this.tokens=e&&e.value?e.value.replace(/&/gm,"&amp;").replace(/"/gm,"&quot;").replace(/'/gm,"&#39;").replace(/</gm,"&lt;").replace(/>/gm,"&gt;").split("\n"):[""],this._constrain(this.tokens)},_updateCached:function(){this.$.mirror.innerHTML=this._constrain(this.tokens)}}),a.Polymer({_template:t.html`
    <style>
      :host {
        display: block;
      }

      :host([hidden]) {
        display: none !important;
      }

      label {
        pointer-events: none;
      }
    </style>

    <paper-input-container no-label-float\$="[[noLabelFloat]]" always-float-label="[[_computeAlwaysFloatLabel(alwaysFloatLabel,placeholder)]]" auto-validate\$="[[autoValidate]]" disabled\$="[[disabled]]" invalid="[[invalid]]">

      <label hidden\$="[[!label]]" aria-hidden="true" for\$="[[_inputId]]" slot="label">[[label]]</label>

      <iron-autogrow-textarea class="paper-input-input" slot="input" id\$="[[_inputId]]" aria-labelledby\$="[[_ariaLabelledBy]]" aria-describedby\$="[[_ariaDescribedBy]]" bind-value="{{value}}" invalid="{{invalid}}" validator\$="[[validator]]" disabled\$="[[disabled]]" autocomplete\$="[[autocomplete]]" autofocus\$="[[autofocus]]" inputmode\$="[[inputmode]]" name\$="[[name]]" placeholder\$="[[placeholder]]" readonly\$="[[readonly]]" required\$="[[required]]" minlength\$="[[minlength]]" maxlength\$="[[maxlength]]" autocapitalize\$="[[autocapitalize]]" rows\$="[[rows]]" max-rows\$="[[maxRows]]" on-change="_onChange"></iron-autogrow-textarea>

      <template is="dom-if" if="[[errorMessage]]">
        <paper-input-error aria-live="assertive" slot="add-on">[[errorMessage]]</paper-input-error>
      </template>

      <template is="dom-if" if="[[charCounter]]">
        <paper-input-char-counter slot="add-on"></paper-input-char-counter>
      </template>

    </paper-input-container>
`,is:"paper-textarea",behaviors:[o.PaperInputBehavior,o.IronFormElementBehavior],properties:{_ariaLabelledBy:{observer:"_ariaLabelledByChanged",type:String},_ariaDescribedBy:{observer:"_ariaDescribedByChanged",type:String},value:{type:String},rows:{type:Number,value:1},maxRows:{type:Number,value:0}},get selectionStart(){return this.$.input.textarea.selectionStart},set selectionStart(e){this.$.input.textarea.selectionStart=e},get selectionEnd(){return this.$.input.textarea.selectionEnd},set selectionEnd(e){this.$.input.textarea.selectionEnd=e},_ariaLabelledByChanged:function(e){this._focusableElement.setAttribute("aria-labelledby",e)},_ariaDescribedByChanged:function(e){this._focusableElement.setAttribute("aria-describedby",e)},get _focusableElement(){return this.inputElement.textarea}});class E extends t.PolymerElement{static get template(){return t.html`
        <style>
            :host {
                display: block;
                margin: 0 auto;
                max-width: var(--content-width);
            }
            :host * {
                box-sizing: border-box;
            }
            .content {
                @apply --layout-horizontal;
                @apply --layout-wrap;
                @apply --layout-center;
                @apply --layout-justified;
            }

            /*TODO: Use breakpoint variable*/
            @media all and (max-width: 680px) {
                .content {
                    @apply --layout-around-justified;
                }
            }
            .loading {
                width: 100%;
                min-height: 30vh;
                text-align: center;
            }
            .spinner {
                margin-top: 150px;
            }
            .about-page {
                @apply --layout-vertical;
                width: 100%;
                font-family: 'bariol', sans-serif;
                color: var(--color-chateau, #414a51);
            }
            .about-page .section {
                width: 100%;

                @apply --layout-vertical;
                @apply --layout-center;

                margin-bottom: 20px;
            }
            .about-page .bio-text {
                font-size: 18px;
                text-align: center;
                width: 100%;
            }
            .about-page .bio-text pre {
                text-align: left;
            }
            .edit-button,
            .save-button {
                @apply --kano-round-button;
            }
            .edit-button {
                margin-bottom: 32px;
                background-color: #9FA4A8;
            }
            .save-button {
                margin-top: 20px;
                background-color: var(--color-kano-orange, #ff6900);
            }
            .save-button:hover {
                background-color: #c95924;
            }
            .about-page h2 {
                margin-top: 0;
                margin-left: auto;
                margin-right: auto;
            }
            .about-page .backdrop {
                @apply --layout-self-stretch;
            }
            .stats {
                padding: 0 25px;
                justify-content: space-around;
            }
            .stats-tile {
                background: #fff;
                border-radius: 6px;
                @apply --layout-self-stretch;
                @apply --layout-vertical;
                padding: 25px 0 15px 0;
            }
            .stats-content {
                @apply --layout-horizontal;
                @apply --layout-center-justified;
                @apply --layout-center;
                margin-bottom: 10px;
            }
            .stats-content iron-icon {
                margin-right: 5px;
                width: 24px;
                height: 24px;
            }
            .stats-content .value {
                line-height: 30px;
                font-size: 30px;
                font-weight: bold;
            }
            .stats-label {
                text-align: center;
                font-weight: bold;
                color: var(--color-grey, #9fa4a8);
                text-transform: uppercase;
                font-size: 14px;
            }
            .progress {
                padding: 0 25px;
                margin-bottom: 50px;
                display: flex;
                flex-wrap: wrap;
            }
            .progress-tile {
                background: #fff;
                border-radius: 9px;
                display: inline-flex;
                align-items: center;
                flex: 0 calc(50% - 26px);
                padding: 10px 15px 10px 10px;
                margin: 11px 13px;
            }
            .progress-tile iron-icon {
                width: 44px;
                height: 44px;
            }
            .progress-content {
                flex: 1;
                margin-left: 14px;
            }
            .progress-title {
                font-weight: bold;
                font-size: 18px;
            }
            .progress-bar {
                @apply --layout-self-stretch;
                background: var(--color-porcelain, #e9ebec);
                height: 8px;
                border-radius: 9px;
                margin-top: 5px;
                overflow: hidden;
            }
            .progress-bar-gauge {
                background-color: red;
                width: 50%;
                height: 100%;
            }
            paper-textarea {
                width: calc(100% - 80px);
                border: 1px solid #a2a6aa;
                padding: 10px 20px;
                min-height: 100px;
                background: #FFF;
                border-radius: 6px;

                --paper-input-container-input: {
                    font-family: 'bariol', sans-serif;
                    color: var(--color-chateau, #414a51);
                    font-size: 18px;
                    line-height: 1.5;
                }

                outline: none;

                --paper-input-container-underline: {
                    display: none;
                };
                --paper-input-container-underline-focus: {
                    display: none;
                };
                --paper-input-container-underline-disabled: {
                    display: none;
                };
            }
            paper-textarea.focused {
                border: 1px solid var(--color-orange, #ff6a00);
            }
            h2.margin {
                margin-bottom: 9px;
            }
            .edit-bio-container {
                width: calc(100% - 80px);
                text-align: center;
                background: #FFF;
                border-radius: 6px;
            }
            [hidden] {
                display: none !important;
            }
            @media all and (max-width: 680px) {
                .stats {
                    @apply --layout-vertical;
                }
                .stats-tile {
                    @apply --layout-self-stretch;
                    margin: 10px 15px;
                }
                .progress-tile {
                    width: 100%;
                }
            }
            @media all and (min-width: 681px) {
                .stats {
                    @apply --layout-horizontal;
                }
                .stats-tile {
                    width: 172px;
                }
            }
        </style>

        <div class="content">
            <template is="dom-if" if="[[loading]]">
                <div class="loading">
                    <paper-spinner-lite class="spinner" active=""></paper-spinner-lite>
                </div>
            </template>
            <template is="dom-if" if="[[!loading]]">
                <div class="about-page">
                    <div class="section" hidden$="[[_computeBioVisibility(allowEditBio, bio)]]">
                        <h2 class="margin">Bio</h2>
                        <template is="dom-if" if="[[!editing]]">
                            <div class="edit-bio-container">
                                <marked-element class="bio-text" markdown="[[_getBioText(bio)]]">
                                    <div slot="markdown-html"></div>
                                </marked-element>
                                <button class="edit-button" on-click="_editTapped" hidden\$="[[!allowEditBio]]">Edit</button>
                            </div>
                        </template>
                        <template is="dom-if" if="[[editing]]">
                            <paper-textarea id="bio-input" value="[[bio]]" placeholder="Write up your bio..." no-label-float="" focused="{{inputFocused}}" class\$="[[_getInputClass(inputFocused)]]"></paper-textarea>
                            <button class="save-button" on-click="_saveTapped">Save</button>
                        </template>
                    </div>

                    <div class="section">
                        <h2>Stats</h2>
                        <div class="backdrop stats">
                            <template is="dom-repeat" items="[[_stats]]">
                                <div class="stats-tile">
                                    <div class="stats-content">
                                        <iron-icon icon="[[item.icon]]" style\$="color: [[item.color]];"></iron-icon>
                                        <div class="value">[[_getStatValue(item.id, stats.*)]]</div>
                                    </div>
                                    <div class="stats-label">[[item.label]]</div>
                                </div>
                            </template>
                        </div>
                    </div>

                    <div class="section">
                        <h2 class="margin">Progress</h2>
                        <div class="backdrop progress">
                            <template is="dom-repeat" items="[[_progress]]">
                                <div class="progress-tile">
                                    <iron-icon src="[[item.icon]]"></iron-icon>
                                    <div class="progress-content">
                                        <div class="progress-title">[[item.label]]</div>
                                        <div class="progress-bar">
                                            <div class="progress-bar-gauge" style\$="background-color: [[item.color]]; width: [[_getProgressValue(item.id, progress)]]%;"></div>
                                        </div>
                                    </div>
                                </div>
                            </template>
                        </div>
                    </div>
                </div>
            </template>
        </div>
`}static get is(){return"kwc-user-about"}static get properties(){return{loading:{type:Boolean,observer:"observeFetching",value:!1},bio:{type:String,value:null},_stats:{type:Array,value:E._computeStats()},stats:{type:Object,value:()=>({})},_progress:{type:Array,computed:"_computeProgressItems(assetsPath)"},progress:{type:Object,value:()=>({})},allowEditBio:{type:Boolean,value:!1},editing:{type:Boolean,value:!1},assetsPath:{type:String}}}static get observers(){return["_autoEditBio(bio, allowEditBio)"]}connectedCallback(){super.connectedCallback(),this.resizeLoading=this.resizeLoading.bind(this),window.addEventListener("resize",this.resizeLoading)}disconnectedCallback(){window.removeEventListener("resize",this.resizeLoading)}observeFetching(e,t){this.resizeLoading()}resizeLoading(){let e=a.dom(this.root).querySelector(".content"),t=a.dom(this.root).querySelector(".loading"),o=a.dom(this.root).querySelector(".spinner");if(e&&t){let a=e.offsetHeight;t.style.height=`${a}px`;let i=Math.max(window.pageYOffset,150);i=Math.min(i,a-150),o.style.marginTop=`${i}px`}}_getAsset(e){return`${this.assetsPath}${e}`}static _computeStats(){return[{id:"medals",icon:"kwc-ui-icons:medal",color:"#ff6a00",label:"medals"},{id:"followers",icon:"kwc-ui-icons:followers",color:"#87c53f",label:"followers"},{id:"picks",icon:"kwc-ui-icons:staff-pick",color:"#ffc100",label:"staff picks"},{id:"shares",icon:"kwc-icons:world",color:"#1093f5",label:"shares"}]}_getStatValue(e){return this.stats[e]||"-"}_editTapped(){this.editing=!0}_saveTapped(){this.editing=!1;const e=this.shadowRoot.querySelector("#bio-input").value;this.bio=e,this.dispatchEvent(new CustomEvent("bio-changed",{detail:{value:e},bubbles:!0}))}_computeProgressItems(){return[{id:"kanoCode",icon:this._getAsset("kano-code.svg"),color:"#ffc100",label:"Kano Code"},{id:"pixelKit",icon:this._getAsset("pixel-kit.svg"),color:"#fe8412",label:"Pixel Kit"},{id:"motionSensor",icon:this._getAsset("motion-sensor.svg"),color:"#eb4734",label:"Motion Sensor"},{id:"makeArt",icon:this._getAsset("make-art.svg"),color:"#fe8412",label:"Make Art"},{id:"makeSnake",icon:this._getAsset("make-snake.svg"),color:"#e85c5a",label:"Make Snake"},{id:"makeMinecraft",icon:this._getAsset("hack-minecraft.svg"),color:"#89cb41",label:"Hack Minecraft"},{id:"terminalQuest",icon:this._getAsset("terminal-quest.svg"),color:"#bc1450",label:"Terminal Quest"},{id:"makePong",icon:this._getAsset("make-pong.svg"),color:"#878787",label:"Make Pong"}]}_getProgressValue(e){return this.progress[e]||0}_getInputClass(e){return e?"focused":""}_getBioText(e){return e&&""!==e?e:"User has no bio."}_autoEditBio(e,t){""===e&&t&&(this.editing=!0)}_computeBioVisibility(e,t){return!e&&!t}}window.customElements.define(E.is,E);customElements.define("ka-profile-about",class extends t.PolymerElement{static get template(){return t.html`<style>:host{display:block}kwc-user-about{margin-top:12px}</style><kwc-user-about bio=[[user.bio]] allow-edit-bio=[[canEdit]] on-bio-changed=_bioChanged assets-path=[[root]]assets/kw-icons/ ></kwc-user-about>`}static get properties(){return{user:Object,canEdit:Boolean,root:String}}_bioChanged(e){const t=e.detail.value;this.dispatchEvent(new CustomEvent("bio-changed",{detail:t}))}}),e.followed=v,e.follow=k,e.following=_,e.close='\n<svg xmlns="http://www.w3.org/2000/svg" width="26.21" height="26.4" viewBox="0 0 26.21 26.4"><defs><style>.cls-1{opacity:0.24;}.cls-2,.cls-3{fill:#fff;}.cls-3{opacity:0.75;}</style></defs><title>close button</title><g id="Layer_2" data-name="Layer 2"><g id="Layer_8" data-name="Layer 8"><g class="cls-1"><rect class="cls-2" width="26.21" height="26.4" rx="3.06" ry="3.06"/></g><path class="cls-3" d="M10,12.58l-2.5-2.49a.93.93,0,0,1-.28-.68,1,1,0,0,1,.28-.69l1.11-1.1a.93.93,0,0,1,.68-.28.91.91,0,0,1,.68.28l2.5,2.49a.9.9,0,0,0,.68.28.94.94,0,0,0,.69-.28l2.5-2.49A.89.89,0,0,1,17,7.34a1,1,0,0,1,.69.28l1.11,1.1a1,1,0,0,1,.28.69,1,1,0,0,1-.28.68l-2.5,2.49a1,1,0,0,0,0,1.38l2.5,2.5a.93.93,0,0,1,.28.67,1,1,0,0,1-.28.69l-1.11,1.11a1,1,0,0,1-.69.28.93.93,0,0,1-.67-.28l-2.5-2.5a.94.94,0,0,0-.69-.28.9.9,0,0,0-.68.28l-2.5,2.5a.92.92,0,0,1-.93.25.94.94,0,0,1-.43-.25L7.45,17.82a1,1,0,0,1-.28-.69.89.89,0,0,1,.28-.67L10,14a1,1,0,0,0,0-1.38Z"/></g></g></svg>\n',e.toSrc=B});