define(["./chunk-fdc6718c.js","./chunk-654f977c.js","./chunk-ede86d1c.js","./chunk-4d3465f9.js","./chunk-87c098bb.js"],function(o,t,r,a,n){"use strict";t.Polymer({_template:o.html`
    <style>
        /** Button default */
        :host button {
            border: none;
            border-radius: 40px;
            color: var(--kwc-button-color, white);
            cursor: pointer;
            display: inline-block;
            font-family: var(--kwc-button-font, var(--font-body));
            font-weight: bold;
            min-width: 100px;
            outline: none;
            overflow: hidden;
            padding: 0 22px;
            text-align: center;
            text-transform: uppercase;
            transition-property: background-color, border-color, color;
            transition-duration: 0.3s;
            transition-timing-function: ease;
            white-space: nowrap;
        }
        /** Sizes */
        :host([size="small"]) button {
            font-size: 12px;
            height: 32px;
            line-height: 32px;
        }
        :host([size="medium"]) button {
            font-size: 14px;
            height: 40px;
            line-height: 40px;
        }
        /** Square button */
        :host([square]) button {
            border-radius: 3px;
        }
        /** Default/filled button */
        :host([variant="primary"]) button {
            color: var(--kwc-button-color, white);
            background: var(--kwc-button-background, var(--color-kano-orange));
        }
        :host([variant="primary"]:hover) button,
        :host([variant="primary"]:focus) button {
            color: var(--kwc-button-color-hover, white);
            background-color: var(--kwc-button-background-hover, var(--color-flame));
        }
        :host([variant="secondary"]) button {
            background-color: var(--color-grassland);
        }
        :host([variant="secondary"]:hover) button,
        :host([variant="secondary"]:focus) button {
            background-color: var(--color-apple);
        }
        :host([variant="tertiary"]) button {
            background-color: var(--color-grey);
        }
        :host([variant="tertiary"]:hover) button,
        :host([variant="tertiary"]:focus) button {
            background-color: var(--color-chateau);
        }
        :host([variant="warning"]) button {
            background-color: var(--color-cinnabar);
        }
        :host([variant="warning"]:hover) button,
        :host([variant="warning"]:focus) button {
            background-color: var(--color-flamingo);
        }
        :host([variant="white"]) button {
            background-color: rgba(255, 255, 255, 1);
            color: var(--color-abbey);
        }
        :host([variant="white"]:hover) button,
        :host([variant="white"]:focus) button {
            background-color: rgba(255, 255, 255, 0.8);
            color: var(--color-abbey);
        }
        :host([variant="black"]) button {
            background-color: var(--color-black);
        }
        :host([variant="black"]:hover) button,
        :host([variant="black"]:focus) button {
            background-color: var(--color-abbey);
        }
        /** Outline button */
        :host([outline]) button,
        :host([outline]:hover) button,
        :host([outline]:focus) button {
            background-color: transparent;
            border-style: solid;
            border-width: 1px;
        }
        :host([outline][variant="primary"]) button {
            border-color: var(--kwc-button-border, var(--color-kano-orange));
            color: var(--kwc-button-color, var(--color-kano-orange));
        }
        :host([outline][variant="primary"]:hover) button,
        :host([outline][variant="primary"]:focus) button {
            border-color: var(--kwc-button-border-hover, var(--color-flame));
            color: var(--kwc-button-color-hover, var(--color-flame));
        }
        :host([outline][variant="secondary"]) button {
            border-color: var(--color-grassland);
            color: var(--color-grassland);
        }
        :host([outline][variant="secondary"]:hover) button,
        :host([outline][variant="secondary"]:focus) button {
            border-color: var(--color-apple);
            color: var(--color-apple);
        }
        :host([outline][variant="tertiary"]) button {
            border-color: var(--color-grey);
            color: var(--color-grey);
        }
        :host([outline][variant="tertiary"]:hover) button,
        :host([outline][variant="tertiary"]:focus) button {
            border-color: var(--color-chateau);
            color: var(--color-chateau);
        }
        :host([outline][variant="warning"]) button {
            border-color: var(--color-cinnabar);
            color: var(--color-cinnabar);
        }
        :host([outline][variant="warning"]:hover) button,
        :host([outline][variant="warning"]:focus) button {
            border-color: var(--color-flamingo);
            color: var(--color-flamingo);
        }
        :host([outline][variant="white"]) button {
            border-color: rgba(255, 255, 255, 1);
            color: rgba(255, 255, 255, 1);
        }
        :host([outline][variant="white"]:hover) button,
        :host([outline][variant="white"]:focus) button {
            border-color: rgba(255, 255, 255, 0.8);
            color: rgba(255, 255, 255, 0.8);
        }
        :host([outline][variant="black"]) button {
            border-color: var(--color-black);
            color: var(--color-black);
        }
        :host([outline][variant="black"]:hover) button,
        :host([outline][variant="black"]:focus) button {
            border-color: var(--color-abbey);
            color: var(--color-abbey);
        }
        /** Ghost button */
        :host([ghost][variant="primary"]):not([outline]) button {
            background-color: rgba(255, 105, 0, 0.4);
        }
        :host([ghost][variant="primary"]):not([outline]:hover) button,
        :host([ghost][variant="primary"]):not([outline]:focus) button {
            background-color: rgba(255, 105, 0, 0.8);
        }
        :host([ghost][variant="primary"][outline]) button {
            border-color: rgba(255, 105, 0, 0.4);
            color: rgba(255, 105, 0, 0.4);
        }
        :host([ghost][variant="primary"][outline]:hover) button,
        :host([ghost][variant="primary"][outline]:focus) button {
            border-color: rgba(255, 105, 0, 0.8);
            color: rgba(255, 105, 0, 0.8);
        }
        :host([ghost][variant="secondary"]):not([outline]) button {
            background-color: rgba(136, 196, 64, 0.4);
        }
        :host([ghost][variant="secondary"]):not([outline]:hover) button,
        :host([ghost][variant="secondary"]):not([outline]:focus) button {
            background-color: rgba(136, 196, 64, 0.8);
        }
        :host([ghost][variant="secondary"][outline]) button {
            border-color: rgba(136, 196, 64, 0.4);
            color: rgba(136, 196, 64, 0.4);
        }
        :host([ghost][variant="secondary"][outline]:hover) button,
        :host([ghost][variant="secondary"][outline]:focus) button {
            border-color: rgba(136, 196, 64, 0.8);
            color: rgba(136, 196, 64, 0.8);
        }
        :host([ghost][variant="tertiary"]):not([outline]) button {
            background-color: rgba(159, 164, 168, 0.4);
        }
        :host([ghost][variant="tertiary"]):not([outline]:hover) button,
        :host([ghost][variant="tertiary"]):not([outline]:focus) button {
            background-color: rgba(159, 164, 168, 0.8);
        }
        :host([ghost][variant="tertiary"][outline]) button {
            border-color: rgba(159, 164, 168, 0.4);
            color: rgba(159, 164, 168, 0.4);
        }
        :host([ghost][variant="tertiary"][outline]:hover) button,
        :host([ghost][variant="tertiary"][outline]:focus) button {
            border-color: rgba(159, 164, 168, 0.8);
            color: rgba(159, 164, 168, 0.8);
        }
        :host([ghost][variant="warning"]):not([outline]) button {
            background-color: rgba(246, 54, 54, 0.4);
        }
        :host([ghost][variant="warning"]):not([outline]:hover) button,
        :host([ghost][variant="warning"]):not([outline]:focus) button {
            background-color: rgba(246, 54, 54, 0.8);
        }
        :host([ghost][variant="warning"][outline]) button {
            border-color: rgba(246, 54, 54, 0.4);
            color: rgba(246, 54, 54, 0.4);
        }
        :host([ghost][variant="warning"][outline]:hover) button,
        :host([ghost][variant="warning"][outline]:focus) button {
            border-color: rgba(246, 54, 54, 0.8);
            color: rgba(246, 54, 54, 0.8);
        }
        :host([ghost][variant="white"]):not([outline]) button {
            background-color: rgba(255, 255, 255, 0.4);
            color: var(--color-abbey);
        }
        :host([ghost][variant="white"]):not([outline]:hover) button,
        :host([ghost][variant="white"]):not([outline]:focus) button {
            background-color: rgba(255, 255, 255, 0.8);
            color: var(--color-grey);
        }
        :host([ghost][variant="white"][outline]) button {
            border-color: rgba(255, 255, 255, 0.4);
            color: rgba(255, 255, 255, 0.4);
        }
        :host([ghost][variant="white"][outline]:hover) button,
        :host([ghost][variant="white"][outline]:focus) button {
            border-color: rgba(255, 255, 255, 0.8);
            color: rgba(255, 255, 255, 0.8);
        }
        :host([ghost][variant="black"]):not([outline]) button {
            background-color: rgba(41, 47, 53, 0.4);
        }
        :host([ghost][variant="black"]):not([outline]:hover) button,
        :host([ghost][variant="black"]):not([outline]:focus) button {
            background-color: rgba(41, 47, 53, 0.8);
        }
        :host([ghost][variant="black"][outline]) button {
            border-color: rgba(41, 47, 53, 0.4);
            color: rgba(41, 47, 53, 0.4);
        }
        :host([ghost][variant="black"][outline]:hover) button,
        :host([ghost][variant="black"][outline]:focus) button {
            border-color: rgba(41, 47, 53, 0.8);
            color: rgba(41, 47, 53, 0.8);
        }
        /** Transparent button */
        :host([transparent]) button,
        :host([transparent]:hover) button {
            background: transparent;
        }
        :host([transparent][outline]) button,
        :host([transparent][outline]:hover) button {
            border-color: transparent;
        }
        :host([transparent][variant="primary"]) button {
            color: var(--color-kano-orange);
        }
        :host([transparent][variant="primary"]:hover) button,
        :host([transparent][variant="primary"]:focus) button {
            color: var(--color-flame);
        }
        :host([transparent][variant="secondary"]) button {
            color: var(--color-grassland);
        }
        :host([transparent][variant="secondary"]:hover) button,
        :host([transparent][variant="secondary"]:focus) button {
            color: var(--color-apple);
        }
        :host([transparent][variant="tertiary"]) button {
            color: var(--color-grey);
        }
        :host([transparent][variant="tertiary"]:hover) button,
        :host([transparent][variant="tertiary"]:focus) button {
            color: var(--color-chateau);
        }
        :host([transparent][variant="warning"]) button {
            color: var(--color-cinnabar);
        }
        :host([transparent][variant="warning"]:hover) button,
        :host([transparent][variant="warning"]:focus) button {
            color: var(--color-flamingo);
        }
        :host([transparent][variant="white"]) button {
            color: rgba(255, 255, 255, 1);
        }
        :host([transparent][variant="white"]:hover) button,
        :host([transparent][variant="white"]:focus) button {
            color: rgba(255, 255, 255, 0.8);
        }
        :host([transparent][variant="black"]) button {
            color: var(--color-black)
        }
        :host([transparent][variant="black"]:hover) button,
        :host([transparent][variant="black"]:focus) button {
            color: var(--color-abbey);
        }
        /** Disabled button */
        :host([disabled]) button,
        :host([disabled]:hover) button,
        :host([disabled]:focus) button {
            background-color: var(--color-grey) !important;
            cursor: default;
        }
        :host iron-icon {
            display: inline-block;
            vertical-align: -5%;
        }
        :host([size="small"]) iron-icon {
            height: 12px;
            width: 12px;
        }
        :host([size="medium"]) iron-icon {
            height: 14px;
            width: 14px;
        }
    </style>
    <button disabled\$="[[disabled]]" type="[[type]]">
        <template is="dom-if" if="[[_displayIcon]]">
            <iron-icon icon="[[iconId]]"></iron-icon>
        </template>
        <slot id="content"></slot>
    </button>
`,is:"kwc-button",properties:{disabled:{type:Boolean,value:!1,reflectToAttribute:!0},_displayIcon:{type:Boolean,computed:"_iconProvided(iconId)"},ghost:{type:Boolean,value:!1,reflectToAttribute:!0},iconId:{type:String},outline:{type:Boolean,value:!1,reflectToAttribute:!0},size:{type:String,value:"medium",reflectToAttribute:!0},square:{type:Boolean,value:!1,reflectToAttribute:!0},transparent:{type:Boolean,value:!1,reflectToAttribute:!0},type:{type:String,value:"button"},variant:{type:String,value:"primary",reflectToAttribute:!0}},_iconProvided:o=>null!=o});class e extends o.PolymerElement{static get is(){return"kwc-loading-animation"}static get template(){return o.html`<style>:host{display:block}</style>`}static get properties(){return{pipSize:{type:Number,value:9,observer:"_inject"},noAutoStart:{type:Boolean,value:!1}}}connectedCallback(){super.connectedCallback(),this._loader||this._inject()}_inject(){this._loader&&(this._loader.stop(),this._loader.delete()),this._loader=new n.LoadingAnimation(this.shadowRoot,{pipSize:this.pipSize}),this.noAutoStart||this._loader.start()}start(){this._loader&&this._loader.start()}stop(){this._loader&&this._loader.stop()}disconnectedCallback(){super.disconnectedCallback(),this._loader&&(this._loader.stop(),this._loader.delete(),this._loader=null)}}customElements.define(e.is,e)});