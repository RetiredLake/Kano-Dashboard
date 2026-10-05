define(["./chunk-fdc6718c.js","./chunk-654f977c.js","./chunk-f8a285e9.js","./chunk-8b3412b4.js","./chunk-86ecdd4d.js","./chunk-6da1ebd5.js","./chunk-e1d3b61d.js","./chunk-93a2d04f.js","./chunk-9d10fca3.js","./chunk-9ed3bf9d.js","./chunk-92065960.js","./chunk-7658960f.js","./chunk-bbbf26f6.js","./chunk-e8284588.js","./chunk-9968f662.js","./chunk-90a58e12.js","./chunk-30c1c965.js"],function(e,t,s,i,r,a,o,n,l,p,d,c,u,h,m,g,f){"use strict";window.Kano=window.Kano||{};const b={properties:{errors:{type:Object,value:{}}},validateUsername(e){return e?e.length<3?(this.set("errors.username","Must be at least 3 characters long."),!1):/^[a-zA-Z0-9_\-.]+$/.test(e)?(this.set("errors.username",void 0),!0):(this.set("errors.username","Only letters, numbers, dashes, underscores and dots are allowed."),!1):(this.set("errors.username","Username is required."),!1)},validatePassword(e){return e?e.length<6?(this.set("errors.password","Password must be at least 6 characters long."),!1):(this.set("errors.password",void 0),!0):(this.set("errors.password","Password cannot be empty."),!1)},validateEmail(e){return/^[_a-z0-9-\+]+(\.[_a-z0-9-\+]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]+)$/i.test(e)?(this.set("errors.email",void 0),!0):(this.set("errors.email","Please enter a valid email address."),!1)},validateTerms(e){return e?this.set("errors.terms",null):this.set("errors.terms","Please agree to the terms and conditions"),e}};t.Polymer({_template:e.html`
        <style>
            :host {
                font-family: var(--font-body);
                background: #FFF;
                padding: 12px;
                border-radius: 12px;
            }
            .form-error-wrapper {
                height: 21px;
            }
            .form-error {
                text-align: left;
                color: #ED5F5F;
                font-weight: bold;
                margin: auto 2px 5px 2px;
            }
            .bold {
                font-weight: bold;
            }
            input[type=submit]:hover {
                background-color: #FF6900;
            }
            input[type=submit]:disabled,
            input[type=submit]:disabled:hover {
                background-color: #ccc;
                cursor: default;
            }
            .fields input:focus {
                border-color: #1093F5;
            }
            h2 {
                color: #FF6900;
                font-size: 19px;
                text-align: center;
            }
            #pager .fields span{
                font-size: 14px;
                color: #9FA4A8;
                font-weight: bold;
                letter-spacing: 0.016em;
            }
            input {
                display: block;
                border: 1px solid #ccc;
                outline: none;
                font-size: 16px;
                font-family: 'Bariol', sans-serif;
                font-weight: bold;
            }
            input[type="text"],
            input[type="email"],
            input[type="password"] {
                font-size: 16px;
                border-radius: 5px;
                margin: 6px 0 16px;
                padding: 0 10px;
                height: 46px;
                color: #414A51;
            }
            input[type="submit"],
            input[type="button"] {
                border: none;
                border-radius: 24px;
                color: #fff;
                padding: 0 18px;
                letter-spacing: 0.037em;
                height: 40px;
                font-size: 16.5px;
                -webkit-appearance: none;
            }
            input[type="submit"] {
                background: #FE6A00;
            }
            input[type="button"] {
                background: #9FA4A8;
            }
            input[type="submit"]:hover,
            input[type="button"]:hover {
                cursor: pointer;
            }
            input[type="submit"]:hover,
            input[type="submit"]:focus,
            input[type="button"]:hover,
            input[type="button"]:focus {
                text-decoration: none;
            }
            .footer {
                color: #9FA4A8;
                font-weight: bold;
                margin-top: 19px;
                text-align: center;
                padding: 14px 0;
                line-height: 1.8;
                background: #F4F5F5;
                border-radius: 7px;
            }
            .footer a {
                color: #FF6900;
                text-decoration: underline;
            }
            .footer a:hover {
                cursor: pointer;
            }
            .submit-wrapper {
                margin-top: 3px;
                display: flex;
                flex-direction: row;
                align-items: end;
                justify-content: space-between;
            }
            .submit-wrapper > div {
                display: flex;
                align-items: center;
            }
            .submit-wrapper paper-spinner-lite {
                pointer-events: none;
                display: none;
                --paper-spinner-color: #ff842a;
            }
            .fields {
                margin: 0 38px;
                display: flex;
                align-items: stretch;
                justify-content:center;
                flex-direction: column;
            }
            .remember-me label {
                color: #9FA4A8;
                font-size: 13px;
            }
            #pager > * {
                width: 360px;
            }
            .big {
                width: 816px !important;
                min-height: 400px;
                padding: 28px;
                box-sizing: border-box;
            }
            .big h2 {
                text-align: left;
                margin: 0 0 14px;
            }
            .big .body {
                color: #414A51;
                font-weight: bold;
                font-size: 20px;
            }
            .big .left,
            .big .right {
                flex: 1;
            }
            .big .left {
                margin-right: 64px;
            }
            .big .right {
                border: 1px solid #E9EBEC;
                padding: 32px;
                border-radius: 11px;
            }
            .big .fields {
                display: flex;
                flex-direction: row;
                margin: 0;
            }
            .big .fields .right input {
                width: calc(100% - 22px);
            }
            .big .fields input {
                margin-bottom: 0;
            }
            .big .fields input:last-of-type {
                margin-bottom: 0;
            }
            .big .fields-content {
                flex: 1;
            }
            .big .submit-wrapper {
                margin-top: 0;
            }
            .big .footer {
                display: flex;
                align-items: center;
                justify-content: space-between;
                background: #FFF;
            }
            input[type="checkbox"] {
                display: none;
            }
            input[type="checkbox"] + label {
                position: relative;
                padding: 5px 0 0 50px;
                line-height: 2.0em;
                cursor: pointer;
                display: block;
            }
            input[type="checkbox"] + label:before {
                content: "";
                position: absolute;
                display: block;
                left: 0;
                width: 32px;
                height: 17px;
                border-radius: 16px;
                background: #9FA4A8;
                transition: all 0.3s;
            }
            input[type="checkbox"] + label:after {
                content: "";
                position: absolute;
                display: block;
                left: 0px;
                width: 13px;
                height: 13px;
                border-radius: 16px;
                background: #fff;
                margin-left: 3px;
                transition: all 0.3s;
            }
            input[type="checkbox"] + label:hover:after {
                box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
            }
            input[type="checkbox"]:checked + label:after {
                margin-left: 16px;
            }
            input[type="checkbox"]:checked + label:before {
                background: #FF6900;
            }
            .center {
                margin: 3px auto 0;
            }
            .small {
                text-align: center;
                padding: 12px;
            }
            .small h2 {
                margin-bottom: 10px;
            }
            .small .submit-wrapper {
                justify-content: center;
            }
            .small .body {
                color: #9FA4A8;
            }
            .small input {
                margin-top: 24px;
            }
            .big .left {
                display: flex;
                flex-direction: column;
                justify-content: space-between;
            }
            #signup .fields {
                height: 100%;
                min-height: 344px;
            }
            #signup .footer {
                padding: 0;
            }
            #signup .right {
                padding: 21px 32px 32px;
                align-self: flex-start;
            }
            #signup-parents .footer {
                flex: 1;
                align-items: flex-end;
                justify-content: flex-start;
                padding-bottom: 0;
            }
            #signup-parents label {
                color: #414A51;
                font-weight: bold;
                margin-top: 9px;
            }
            #signup-parents label[for="signup-news"] p {
                display: inline-block;
                line-height: 1.3;
                top: -17px;
                color: #9FA4A8;
                position: relative;
                margin-bottom: 0;
            }
            #signup-parents .fields-content {
                padding: 21px 24px 0;
            }
            #signup-parents input[type="submit"],
            #signup-parents input[type="button"] {
                margin: 8px 8px 1px;
            }
            .checkbox-container {
                margin-top: 8px;
                overflow: hidden;
            }
            .big .footer input:first-child {
                margin-left: 0 !important;
            }
            label[for="login-remember"]:before {
                top: 9px;
            }
            label[for="login-remember"]:after {
                top: 11px;
            }
            label[for="signup-terms"]:before {
                top: 12px;
            }
            label[for="signup-terms"]:after {
                top: 14px;
            }
            label[for="signup-news"]:before {
                top: 7px;
            }
            label[for="signup-news"]:after {
                top: 9px;
            }
            #done {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
            }
            #done h2,
            #done h3,
            #done .body {
                font-size: 24px;
            }
            #done h2 {
                margin-bottom: 5px;
            }
            #done h3 {
                color: #414A51;
                text-align: center;
                margin: 0;
            }
            #done .body {
                color: #9FA4A8;
                margin: 30px 0 28px;
            }
        </style>
        <iron-pages attr-for-selected="id" selected="[[view]]" id="pager">
            <div id="login">
                <h2>Login to your account</h2>
                <form class="fields" on-submit="_onSubmitLogin">
                    <span>Username</span>
                    <input type="text" value="{{username::input}}" placeholder="Your Kano username" tabindex="0" autocapitalize="none" on-keydown="_dialogKeydown">
                    <div class="form-error" hidden\$="[[!errors.username]]">[[errors.username]]</div>
                    <span>Password</span>
                    <input type="password" value="{{password::input}}" placeholder="Your secret password" tabindex="0" on-keydown="_dialogKeydown">
                    <div class="form-error" hidden\$="[[!errors.password]]">[[errors.password]]</div>
                    <div class="submit-wrapper">
                        <div class="remember-me">
                            <input type="checkbox" id="login-remember" checked="[[rememberMe]]">
                            <label for="login-remember">Remember me</label>
                        </div>
                        <div class="submit-container">
                            <input disabled\$="[[processing]]" type="submit" value="Login">
                            <paper-spinner-lite active="[[processing]]"></paper-spinner-lite>
                        </div>
                    </div>
                </form>
                <div class="footer">
                    Forgot your <a on-click="showUsernameReminder">username</a>
                    or <a on-click="showPasswordReset">password?</a><br>
                    No account? <a on-click="showSignup">Sign up!</a>
                </div>
            </div>
            <div id="signup" class="big">
                <form class="fields" on-submit="_onSubmitSignupInfo">
                    <div class="left">
                        <div class="header">
                            <h2>Create a Kano World account</h2>
                            <div class="body">
                                Make up a username that you don’t use on any other website. Don’t use your real name. Keep your password secret.
                            </div>
                        </div>
                        <div class="footer">
                            <div class="submit-wrapper">
                                <input disabled\$="[[processing]]" type="submit" value="NEXT">
                                <paper-spinner-lite active="[[processing]]"></paper-spinner-lite>
                            </div>
                            <div class="no-account">
                                Have an account already?
                                <a on-click="showLogin">Log in</a>
                            </div>
                        </div>
                    </div>
                    <div class="fields-content right">
                        <span>Username</span>
                        <input type="text" value="{{username::input}}" placeholder="Make up a Kano username" tabindex="0" autocapitalize="none" on-keydown="_dialogKeydown">
                        <div class="form-error-wrapper">
                            <div class="form-error" hidden\$="[[!errors.username]]">[[errors.username]]</div>
                        </div>
                        <span>Secret Password</span>
                        <input type="password" value="{{password::input}}" placeholder="Make up a secret password" tabindex="0" on-keydown="_dialogKeydown">
                        <div class="form-error-wrapper">
                            <div class="form-error" hidden\$="[[!errors.password]]">[[errors.password]]</div>
                        </div>
                    </div>
                </form>
            </div>
            <div id="signup-parents" class="big">
                <form class="fields" on-submit="_onSubmitSignupEmail">
                    <div class="left">
                        <div class="header">
                            <h2>You need an email address</h2>
                            <div class="body">
                                If you don’t have an email address, ask an adult who does, to help you finish setting up your Kano World account.
                            </div>
                        </div>
                        <div class="footer">
                            <div class="submit-wrapper">
                                <input type="button" value="Back" on-click="showSignup">
                                <input disabled\$="[[processing]]" type="submit" value="DONE">
                                <paper-spinner-lite active="[[processing]]"></paper-spinner-lite>
                            </div>
                        </div>
                    </div>
                    <div class="fields-content right">
                        <span>Adult's first name</span>
                        <input type="text" value="{{firstName::input}}" placeholder="Adult's first name" tabindex="0" autocapitalize="none" on-keydown="_dialogKeydown">
                        <div class="form-error-wrapper">
                            <div class="form-error" hidden\$="[[!errors.firstName]]">[[errors.firstName]]</div>
                        </div>

                        <span>Adult's email address</span>
                        <input type="email" value="{{email::input}}" placeholder="Your email address" tabindex="0" on-keydown="_dialogKeydown">
                        <div class="form-error-wrapper">
                            <div class="form-error" hidden\$="[[!errors.email]]">[[errors.email]]</div>
                        </div>

                        <div class="checkbox-container">
                            <input type="checkbox" id="signup-terms" checked="{{terms::change}}">
                            <label for="signup-terms">I accept the terms and conditions</label>
                            <div class="form-error" hidden\$="[[!errors.terms]]">[[errors.terms]]</div>

                            <input type="checkbox" id="signup-news" checked="{{newsletter::change}}">
                            <label for="signup-news">
                                <p>
                                    Tick to receive the latest news,<br>
                                    offers, promotions and competitions<br>
                                    from Kano.
                                </p>
                            </label>
                        </div>
                    </div>
                </form>
            </div>
            <div id="done" class="big">
                <h2>
                    Welcome to Kano World
                </h2>
                <div class="body">
                    Make, play, and share with people around the world
                </div>
                <form on-submit="_onSubmitDone">
                    <div class="submit-wrapper">
                        <input type="submit" value="LET’S GO!">
                    </div>
                </form>
            </div>
            <div id="username-reminder">
                <h2>Forgot your username?</h2>
                <form class="fields" on-submit="_onSubmitForgotUsername">
                    <span>Email</span>
                    <input type="text" value="{{email::input}}" placeholder="Your email address" tabindex="0" on-keydown="_dialogKeydown">
                    <div class="form-error" hidden\$="[[!errors.email]]">[[errors.email]]</div>
                    <div class="submit-wrapper center">
                        <input disabled\$="[[processing]]" type="submit" value="Send">
                        <paper-spinner-lite active="[[processing]]"></paper-spinner-lite>
                    </div>
                </form>
                <div class="footer">
                    Back to <a on-click="showLogin">Login</a><br>
                    No account? <a on-click="showSignup">Sign up!</a>
                </div>
            </div>
            <div id="password-reset">
                <h2>Forgot your password?</h2>
                <form class="fields" on-submit="_onSubmitForgotPassword">
                    <span>Username</span>
                    <input type="text" value="{{username::input}}" placeholder="Your username" tabindex="0" autocapitalize="none" on-keydown="_dialogKeydown">
                    <div class="form-error" hidden\$="[[!errors.username]]">[[errors.username]]</div>
                    <div class="submit-wrapper center">
                        <input disabled\$="[[processing]]" type="submit" value="Send">
                        <paper-spinner-lite active="[[processing]]"></paper-spinner-lite>
                    </div>
                </form>
                <div class="footer">
                    Back to <a on-click="showLogin">Login</a><br>
                    No account? <a on-click="showSignup">Sign up!</a>
                </div>
            </div>
            <div id="reset-confirmation" class="small">
                <h2>Sent!</h2>
                <div class="body">
                    We've sent a password reset link to your email
                </div>
                <form on-submit="_onResetDone">
                    <div class="submit-wrapper">
                        <input type="submit" value="OK">
                    </div>
                </form>
            </div>
        </iron-pages>
`,is:"kwc-auth",behaviors:[b],ready(){this.reset()},properties:{view:{type:String,value:"login",notify:!0},username:{type:String,observer:"_onChangeUsername"},password:{type:String,observer:"_onChangePassword"},firstName:{type:String,value:null,observer:"_onChangeFirstName"},email:{type:String,observer:"_onChangeEmail"},terms:{type:Boolean,value:!1,observer:"validateTerms"},newsletter:{type:Boolean,value:!1},worldUrl:{type:String},assetsPath:{type:String,value:null},_motifUrl:{type:String,computed:"_computeMotifUrl(assetsPath)"},_linkArrowIcon:{type:String,computed:"_computeLinkArrowIcon(assetsPath)"},processing:{type:Boolean,value:!1},errors:{type:Object,value:()=>({email:null,password:null,username:null,firstName:null,termos:null})}},_dialogKeydown(e){8===e.keyCode&&e.stopPropagation()},_computeMotifUrl:e=>e?`${e}/avatar/judoka-face.svg`:"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 181.99 177.35'%3E%3Cdefs%3E%3Cstyle%3E.cls-1%7Bisolation:isolate%3B%7D.cls-2%2C.cls-5%7Bfill:%23fff%3B%7D.cls-2%7Bstroke:%23fff%3Bstroke-linejoin:round%3Bstroke-width:24px%3B%7D.cls-2%2C.cls-4%7Bstroke-linecap:round%3B%7D.cls-3%7Bfill:%23ffb66f%3B%7D.cls-4%7Bfill:none%3Bstroke:%23000%3Bstroke-miterlimit:10%3Bstroke-width:4px%3Bopacity:0.4%3B%7D.cls-6%7Bfill:%2357473e%3B%7D.cls-7%7Bopacity:0.08%3Bmix-blend-mode:multiply%3B%7D.cls-8%7Bfill:%23515451%3B%7D.cls-9%7Bfill:%23626662%3B%7D.cls-10%7Bfill:%235d5c58%3B%7D.cls-11%7Bfill:%236b6a65%3B%7D.cls-12%7Bfill:%23ffce9e%3B%7D%3C/style%3E%3C/defs%3E%3Ctitle%3Esetup-judoka%3C/title%3E%3Cg class='cls-1'%3E%3Cg id='Layer_2' data-name='Layer 2'%3E%3Cg id='Layer_1-2' data-name='Layer 1'%3E%3Cpath class='cls-2' d='M165.7 116.8c.12-.36.25-.7.36-1.07.2-.6.4-1.23.57-1.84l.27-.9q.4-1.4.74-2.8A79 79 0 0 0 150 38.5a79.5 79.5 0 0 0-17.72-14.84 78.3 78.3 0 0 0-34.86-11.4c-2.15-.2-4.32-.28-6.5-.28a78.9 78.9 0 0 0-61 28.76l-.38.44a1.83 1.83 0 0 0 .37.5l1.5 1.5c-1 .52-2.1 1.1-3.2 1.72a2.35 2.35 0 0 0-.5.37c-2.1 2.06-18.1 19-15.4 43.15v.2s0 .24.1.36a53.33 53.33 0 0 0 3.7 13.8 2.4 2.4 0 0 0 .3.48l.1.1a2.3 2.3 0 0 0 .26.26l.13.1.26.2.14.08h.07a2.22 2.22 0 0 0 2.36-.34l.73-.62a70.5 70.5 0 0 0 137.87 11.1 48.58 48.58 0 0 1 3.8 6.18 2.2 2.2 0 0 0 1.84 1.23l.45-1.18v.05l.33-.94.43-1.1c.2-.56.4-1.1.57-1.66z'/%3E%3Ccircle class='cls-3' cx='90.39' cy='94.84' r='70.51'/%3E%3Cpath class='cls-4' d='M108.84 115.05a24.8 24.8 0 0 1-36.84-.9'/%3E%3Cpath class='cls-5' d='M64.64 101.83c0 4.76-3.2 4.92-7.57 4.83h-5.63c-4.37.1-7.56-.07-7.56-4.83a10.38 10.38 0 0 1 20.76 0z'/%3E%3Cpath class='cls-6' d='M59 102.83a4.72 4.72 0 0 1-1.94 3.83h-5.63a4.75 4.75 0 1 1 7.57-3.83z'/%3E%3Ccircle class='cls-5' cx='50.58' cy='99.83' r='1.78'/%3E%3Cpath class='cls-5' d='M136.9 101.83c0 4.76-3.2 4.92-7.56 4.83h-5.63c-4.3.1-7.5-.07-7.5-4.83a10.38 10.38 0 0 1 20.8 0z'/%3E%3Cpath class='cls-6' d='M131.28 102.83a4.72 4.72 0 0 1-1.94 3.83h-5.63a4.75 4.75 0 1 1 7.6-3.83z'/%3E%3Ccircle class='cls-5' cx='122.85' cy='99.83' r='1.78'/%3E%3Cpath class='cls-7' d='M160.8 94.65v.74a69.43 69.43 0 0 1-7 29.8v.1c-12.4-22.6-39-27.6-63.4-36C70 82.2 47.44 58.5 36.6 46c-.1-.1-.17-.2-.26-.3.12-.15.26-.3.37-.47a3.07 3.07 0 0 1 .5-.48l.6-.47c39.9-29.67 82.2-21.2 106.1 4.6a70.07 70.07 0 0 1 16.9 45.75z'/%3E%3Cpath class='cls-8' d='M27.73 45.28C25.25 47.75 3 71.18 16.1 102.8a2.28 2.28 0 0 0 3.57.92c5.86-5 20.84-18.65 22.15-28.35s6.67-27 8.82-33.8a2.25 2.25 0 0 0-2.18-2.95c-3.88.07-11.15 1.06-20.25 6.27a2.36 2.36 0 0 0-.4.3z'/%3E%3Cpath class='cls-9' d='M50.64 41.57c-.15.46-.3 1-.5 1.54a2.33 2.33 0 0 0-1.66-.3c-4.13.6-11.76 2.6-20.8 9.3a2.37 2.37 0 0 0-.47.5c-2 2.6-18.3 24.5-9.8 51.6a2.32 2.32 0 0 1-1.2-1.25C3 71.2 25.3 47.78 27.7 45.3a2.64 2.64 0 0 1 .5-.38c9.1-5.22 16.36-6.2 20.24-6.27a2.25 2.25 0 0 1 2.18 2.94z'/%3E%3Cpath class='cls-10' d='M150 38.53a79.06 79.06 0 0 0-120.43 2.65 1.83 1.83 0 0 0 .37.52c7.5 7.66 37.9 37.4 62.86 43.67 26.86 6.7 55.8 9.24 69.2 35a2.2 2.2 0 0 0 1.88 1.23 75.76 75.76 0 0 0 3.75-11.35A79.13 79.13 0 0 0 150 38.53z'/%3E%3Cpath class='cls-11' d='M170 91.07a78.5 78.5 0 0 1-2.35 19.16 75.6 75.6 0 0 1-3.3 10.25c.53-2.7 1-5.45 1.24-8.25A90.5 90.5 0 0 0 151.4 53a81.23 81.23 0 0 0-37.46-31 75.82 75.82 0 0 0-75.7 11.26 83.17 83.17 0 0 0-8.67 7.92A79.07 79.07 0 0 1 170 91.08z'/%3E%3Ccircle class='cls-12' cx='47.28' cy='115.08' r='2.41'/%3E%3Ccircle class='cls-12' cx='133.51' cy='115.08' r='2.41'/%3E%3C/g%3E%3C/g%3E%3C/g%3E%3C/svg%3E",_computeLinkArrowIcon:e=>e?`${e}/icons/link-arrow.svg`:"data:image/svg+xml,%3Csvg width='7' height='9' viewBox='0 0 7 9' xmlns='http://www.w3.org/2000/svg'%3E%3Ctitle%3EPath 4 Copy%3C/title%3E%3Cpath d='M1.8 1S1 1.8 1 4.4C1 7 1.8 8 1.8 8s1-.2 2.2-1.4c1.2-1 1.7-2.2 1.7-2.3 0 0-.4-1-1.8-2S1.4 1 1.4 1z' stroke='%23000' fill-rule='evenodd' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E",showLogin(){this.reset(),this.set("view","login")},showSignup(){this.reset(),this.set("view","signup")},showParents(){this.set("view","signup-parents")},showEmail(){this.set("view","email")},showDone(){this.set("view","done")},showPasswordReset(){this.set("view","password-reset")},showResetConfirmation(){this.set("view","reset-confirmation")},showUsernameReminder(){this.set("view","username-reminder")},setView(e){this.set("view",e)},_onSubmitLogin(e){if(e.preventDefault(),this.set("errors.username",null),this.set("errors.password",null),!this.username)return void this.set("errors.username","Username cannot be empty.");if(!this.password)return void this.set("errors.password","Password cannot be empty.");const t={username:this.username,password:this.password};this.fire("login",t)},_onSubmitSignupInfo(e){e.preventDefault(),this.set("errors.username",null),this.set("errors.password",null);const t=this.validateUsername(this.username),s=this.validatePassword(this.password);if(t&&s){const e={username:this.username,password:this.password};this.fire("submit-signup-info",e)}},_onSubmitGrownup(e){e.preventDefault(),this.showEmail()},_onSubmitSignupEmail(e){e.preventDefault();const t=this.validateFirstName(this.firstName),s=this.validateEmail(this.email),i=this.validateTerms(this.terms);if(t&&this.set("errors.firstName",null),s&&this.set("errors.email",null),i&&this.set("errors.terms",null),t&&s&&i){const e={firstName:this.firstName,username:this.username,password:this.password,email:this.email,newsletter:this.newsletter};this.fire("submit-signup-email",e)}},validateFirstName(e){return e?(this.set("errors.firstName",void 0),!0):(this.set("errors.firstName","First name is required."),!1)},_onSubmitDone(e){e.preventDefault(),this.fire("done")},_skip(){this.fire("skip")},_onSubmitForgotUsername(e){e.preventDefault(),this.validateEmail(this.email)&&this.fire("forgot-username",this.email)},_onSubmitForgotPassword(e){e.preventDefault(),this.validateUsername(this.username)&&this.fire("forgot-password",this.username)},_onChangeUsername(e){this.fire("change-username",e)},_onChangePassword(e){this.fire("change-password",e)},_onChangeFirstName(e){this.fire("change-firstname",e)},_onChangeEmail(e){this.fire("change-email",e)},reset(){this.set("errors",{}),this.firstName=null,this.username=null,this.password=null,this.email=null,this.terms=!1,this.newsletter=!1}});const v="We can't reach the Kano server. Check your internet connection and try again.",w=v,y=p.UserActionsFactory(p.USER_TYPES.AUTHENTICATED);class x extends(u.Store.StateReceiver(e.PolymerElement)){static get template(){return e.html`<style>:host{display:flex;flex-direction:row;align-items:center;justify-content:center;font-family:var(--font-body);background:#292f35}#auth{-webkit-box-shadow:0 4px 4px 0 rgba(0,0,0,.15);-moz-box-shadow:0 4px 4px 0 rgba(0,0,0,.15);box-shadow:0 4px 4px 0 rgba(0,0,0,.15)}</style><kwc-auth id=auth view=[[view]] on-login=onSubmitLogin on-submit-signup-info=onSubmitSignupInfo on-submit-signup-email=onSubmitSignupEmail on-forgot-username=onSubmitForgotUsername on-forgot-password=onSubmitForgotPassword on-done=onDone on-skip=onSkip on-view-changed=_authSelectedChanged></kwc-auth>`}static get is(){return"ka-view-auth"}static get properties(){return{view:{linkState:"routing.pathParams.authView"},config:{linkState:"config"}}}connectedCallback(){super.connectedCallback(),this._telemetry=new n.TelemetryClient({scope:"auth"}),this._telemetryMount=n.AppTelemetry.mount(this._telemetry),setTimeout(()=>{x.toggleNavbar(!0)},0),this.userModel=l.UserFactory(this.config.API_URL)}disconnectedCallback(){super.disconnectedCallback(),this._telemetry.dispose(),this._telemetryMount.dispose()}static toggleNavbar(e){d.RoutingActions.toggleNavbar(e)}onSubmitSignupInfo({detail:e}){this.$.auth.processing=!0,this.userModel.checkUsernameAvailability(e.username).then(e=>{this.$.auth.processing=!1,e?this.$.auth.showParents():this.$.auth.set("errors.username","Username already taken")}).catch(e=>{this.$.auth.processing=!1,this.$.auth.set("errors.password",w),this._telemetry.trackException({exception:e})})}register(e){let t,s;return y.setLoading(!0),this.userModel.register(e).then(e=>{s=e}).then(()=>fetch(`${this.config.root}assets/avatar/default_user/spec.json`)).then(e=>e.json()).then(e=>{t=e;const s=l.getBlobFromImage(`${this.config.root}assets/avatar/default_user/full.png`),i=l.getBlobFromImage(`${this.config.root}assets/avatar/default_user/head.png`);return Promise.all([s,i])}).then(e=>(t.images={body:e[0],head:e[1]},y.setUploadingAvatar(!0),this.userModel.putAvatar(s.id,t))).then(()=>{y.refreshAvatarImage(),y.setUser(s),y.setUploadingAvatar(!1),y.setLoading(!1)}).catch(e=>{throw y.setUploadingAvatar(!1),e})}login(e){return y.setLoading(!0),this.userModel.login(e.username,e.password).then(e=>{y.setUser(e),y.setLoading(!1),this._telemetry.trackEvent({name:"logged_in",properties:{id:e.id}}),this.leave(),this.userModel.getAvatar()})}forgotPassword(e){return this.userModel.forgotPassword({username:e})}forgotUsername(e){return this.userModel.forgotUsername({email:e})}leave(e){const t=e||"/";c.navigateTo(t),this.dispatchEvent(new CustomEvent("leaving"))}static syncAuthRoute(e){c.navigateTo(`/auth/${e}`)}onDone(){this.leave("/profile")}onSkip(){this.leave("/")}onSubmitSignupEmail({detail:e}){this.$.auth.processing=!0,this.register(e).then(()=>{this.$.auth.processing=!1,this.$.auth.showDone()}).catch(e=>{this.$.auth.processing=!1,this.$.auth.set("errors.password",w),this._telemetry.trackException({exception:e})})}onSubmitLogin({detail:e}){this.$.auth.processing=!0,this.login(e).then(()=>{this.$.auth.processing=!1,this.$.auth.reset()}).catch(e=>{let t;t=e.status&&401===e.status?"Username or password not recognised":v,this.$.auth.set("errors.password",t),this.$.auth.processing=!1,this._telemetry.trackException({exception:e})})}onSubmitForgotPassword({detail:e}){this.$.auth.processing=!0,this.forgotPassword(e).then(()=>{this.$.auth.processing=!1}).catch(e=>{let t;t=e.status&&401===e.status?"Username not recognised":v,this.$.auth.set("errors.forgotPassword",t),this.$.auth.processing=!1,this._telemetry.trackException({exception:e})})}onSubmitForgotUsername({detail:e}){this.$.auth.processing=!0,this.forgotUsername(e).then(()=>{this.$.auth.processing=!1}).catch(e=>{let t;t=e.status&&401===e.status?"Email not recognised":v,this.$.auth.set("errors.forgotUsername",t),this.$.auth.processing=!1,this._telemetry.trackException({exception:e})})}_authSelectedChanged(e){const{routing:t}=this.getState(),s=t.pathParams.authView||e.detail.value;this.constructor.syncAuthRoute(s)}}window.customElements.define(x.is,x)});