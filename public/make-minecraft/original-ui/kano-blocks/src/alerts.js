/**
* Copyright (C) 2014 Kano Computing Ltd
* License: GNU General Public License v2 http://www.gnu.org/licenses/gpl-2.0.txt
*
* Author: Tom Bettany <tom.bettany@kano.me>
* Description: Extension of the pointer class to handle pop-up messages
*/

Alerts = {};

(function() {
'use strict';

Alerts = function(selector, content, position, direction, progressSelector) {
    Pointer.call(this, selector, content, position, direction, progressSelector);
};

Alerts.prototype = Object.create(Pointer.prototype);

Alerts.prototype.contructor = Alerts;

Alerts.prototype.displayMsg = function(msg, timeout) {
    var msgDiv = this.selector.getElementsByClassName('msg')[0],
        self = this;

    msgDiv.innerHTML = msg;
    this.show();

    if (timeout) {
        setTimeout(function() {
            self.hide();
        }, timeout);
    }
};

})();
