/**
* Copyright (C) 2014 Kano Computing Ltd
* License: GNU General Public License v2 http://www.gnu.org/licenses/gpl-2.0.txt
*
* Author: Tom Bettany <tom.bettany@kano.me>
* Description: A class to store fragments of code to be displayed.
*/

var CodeText = {};

(function() {
'use strict';

CodeText = function(code, language) {
    this.setCode(code);
    this.setLanguage(language);
};

CodeText.prototype.setCode = function(code) {
    this.code_ = code;
};

CodeText.prototype.getCode = function() {
    return this.code_;
};

CodeText.prototype.setLanguage = function(language) {
    this.language_ = language;
};

CodeText.prototype.getLanguage = function() {
    return this.language_;
};

CodeText.prototype.prettify = function() {
    // this.setCode(
    //     prettyPrintOne(this.getCode(),
    //                    this.getLanguage()));
};

CodeText.prototype.deprettify = function() {
    var code = this.getCode();

    // newlines for divs
    code = code.replace(/(<div>|<[^>]*>$)/g, '\n');
    // remove all tags
    code = code.replace(/<\/?[^>]*>/g, '');

    this.setCode(code);
};

})();
