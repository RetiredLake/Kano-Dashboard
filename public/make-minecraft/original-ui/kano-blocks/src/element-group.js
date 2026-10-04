/**
* Copyright (C) 2014 Kano Computing Ltd
* License: GNU General Public License v2 http://www.gnu.org/licenses/gpl-2.0.txt
*
* Author: Tom Bettany <tom.bettany@kano.me>
* Description: A class to group elements from selectors to apply attributes and use methods to them all.
*/

var ElementGroup = {};

(function() {
'use strict';

ElementGroup = function(selector) {
    var selectors = selector.split('|');

    this.elements = [];

    for (var x = 0, len = selectors.length; x < len; x++) {
        this.elements.push.apply(this.elements, document.querySelectorAll(selectors[x]));
    }
};

ElementGroup.prototype.setAttr = function(attr, value) {
    for (var x = 0, len = this.elements.length; x < len; x++) {
        try {
            this.elements[x][attr] = value;
        } catch (e) {
            console.log('ERROR while attempting to set ', this.elements[x], '.' + attr + ' = ' + value, 'Resulting error ', e);
        }
    }
};

ElementGroup.prototype.addEventListener = function(type, listener, useCapture) {
    for (var x = 0, len = this.elements.length; x < len; x++) {
        try {
            this.elements[x].addEventListener(type, listener, useCapture);
        } catch (e) {
            console.log('ERROR while attempting to add event listener to ' + this.elements[x], 'Resulting error ', e);
        }
    }
};

ElementGroup.prototype.removeEventListener = function(type, listener, useCapture) {
    for (var x = 0, len = this.elements.length; x < len; x++) {
        try {
            this.elements[x].removeEventListener(type, listener, useCapture);
        } catch (e) {
            console.log('ERROR while attempting to remove event listener from ' + this.elements[x], 'Resulting error ', e);
        }
    }
};

ElementGroup.prototype.classList_add = function(className) {
    for (var x = 0, len = this.elements.length; x < len; x++) {
        try {
            this.elements[x].classList.add(className);
        } catch (e) {
            console.log('ERROR while attempting to add class ' + className + ' to ' + this.elements[x], 'Resulting error ', e);
        }
    }
};

ElementGroup.prototype.classList_remove = function(className) {
    for (var x = 0, len = this.elements.length; x < len; x++) {
        try {
            this.elements[x].classList.remove(className);
        } catch (e) {
            console.log('ERROR while attempting to remove class ' + className + ' from ' + this.elements[x], 'Resulting error ', e);
        }
    }
};

})();
