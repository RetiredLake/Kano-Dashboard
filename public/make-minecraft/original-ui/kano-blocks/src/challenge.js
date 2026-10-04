/**
* Copyright (C) 2014 Kano Computing Ltd
* License: GNU General Public License v2 http://www.gnu.org/licenses/gpl-2.0.txt
*
* Author: Tom Bettany <tom.bettany@kano.me>
* Description: A class to handle challenges.
*/

var Challenge = {};

(function() {
'use strict';

Challenge = function(data, shared) {
    if (typeof(data) !== 'undefined') {
        this.import(data);
    } else {
        var emptyXML = '<xml>' +
                           '<filename> </filename>' +
                           '<description> </description>' +
                           '<blocks> </blocks>' +
                           '<tutorial> </tutorial>' +
                           '<shared>false</shared>' +
                           '<screenshot> </screenshot>' +
                       '</xml>';

        this.xmlData = new DOMParser().parseFromString(emptyXML, 'text/xml');
        this.setShared(shared);
        this.setDataFromForm();
    }
};

/**
 * Imports challenge data into the object.
 * @param {string/XML DOM} data  XML defining a challenge
 */
Challenge.prototype.import = function(data) {
    if (typeof data === 'xml') {
        this.xmlData = data;
    } else {
        try {
            this.xmlData = Blockly.Xml.textToDom(data);
        } catch (e) {
            alert('Error parsing XML:\n' + e);
        }
    }
};

/**
 * Exports challenge data from the object.
 * @return {string}  XML defining a challenge
 */
Challenge.prototype.export = function() {
    return Blockly.Xml.domToText(this.xmlData);
};

/**
 * Retrieves the XML stored in the object.
 * @return {XML DOM}  XML defining a challenge
 */
Challenge.prototype.getXML = function() {
    return this.xmlData;
};

/**
 * Retrieves the blocks stored in the object
 * @return {XML DOM}  XML defining some blocks
 */
Challenge.prototype.getBlocks = function() {
    var blocks = this.xmlData.getElementsByTagName('blocks')[0].childNodes[0].nodeValue;

    return Blockly.Xml.textToDom(blocks);
};

/**
 * Retrieves the filename stored in the object
 * @return {string}  The filename
 */
Challenge.prototype.getFilename = function() {
    var filename = this.xmlData.getElementsByTagName('filename')[0].childNodes[0].nodeValue;

    return filename.replace(/[^0-9 a-z]+/gi, ' ');
};

/**
 * Retrieves the description stored in the object.
 * @return {string}  The description
 */
Challenge.prototype.getDescription = function() {
    return this.xmlData.getElementsByTagName('description')[0].childNodes[0].nodeValue;
};

/**
 * Retrieves the screenshot stored in the object.
 * @return {string}  The screenshot encoded as ASCII
 */
Challenge.prototype.getScreenshot = function() {
    return this.xmlData.getElementsByTagName('screenshot')[0].childNodes[0].nodeValue;
};

/**
 * Retrieves the tutorial stored in the object.
 * @return {string}  The steps of the tutorial
 */
Challenge.prototype.getTutorial = function() {
    return this.xmlData.getElementsByTagName('tutorial')[0].childNodes[0].nodeValue;
};

/**
 * Retrieves whether the challenge has been shared.
 * @return {boolean}  Has the challenge been shared
 */
Challenge.prototype.getShared = function() {
    return JSON.parse(this.xmlData.getElementsByTagName('shared')[0].childNodes[0].nodeValue);
};

/**
 * Sets the blocks stored in the object
 * @param {XML DOM}  XML defining some blocks
 */
Challenge.prototype.setBlocks = function(blocks) {
    blocks = Blockly.Xml.domToText(blocks);
    this.xmlData.getElementsByTagName('blocks')[0].childNodes[0].nodeValue = blocks;
};

/**
 * Sets the filename stored in the object
 * @param {string}  The filename
 */
Challenge.prototype.setFilename = function(filename) {
    this.xmlData.getElementsByTagName('filename')[0].childNodes[0].nodeValue = Utilities.sanitise(filename);
};

/**
 * Sets the description stored in the object.
 * @param {string}  The description
 */
Challenge.prototype.setDescription = function(description) {
    this.xmlData.getElementsByTagName('description')[0].childNodes[0].nodeValue = description;
};

/**
 * Sets the screenshot stored in the object.
 * @param {string}  The screenshot encoded as ASCII
 */
Challenge.prototype.setScreenshot = function(screenshot) {
    //this.xmlData.getElementsByTagName('screenshot')[0].childNodes[0].nodeValue = screenshot;
    this.xmlData.getElementsByTagName('screenshot')[0].childNodes[0].nodeValue = '';
};

/**
 * Sets the tutorial stored in the object.
 * @param {string}  The steps of the tutorial
 */
Challenge.prototype.setTutorial = function(tutorial) {
    this.xmlData.getElementsByTagName('tutorial')[0].childNodes[0].nodeValue = tutorial;
};

/**
 * Sets whether the challenge has been shared.
 * @param {boolean}  Has the challenge been shared
 */
Challenge.prototype.setShared = function(shared) {
    if (shared) {
        this.xmlData.getElementsByTagName('shared')[0].childNodes[0].nodeValue = shared;
    }
};

/**
 * Sets the data in the object from the workspace and form inputs.
 */
Challenge.prototype.setDataFromForm = function() {
    var screenshot = document.getElementsByClassName('screenshot')[0].src.split('?')[0],
        xml = Blockly.Xml.workspaceToDom(Blockly.mainWorkspace),
        self = this,
        save_type = this.getShared() ? 'share' : 'save';

    this.setBlocks(xml);

    // Get a timestamped share filename prefix in the form: share20160918224589
    // keep in mind that special characters like underscores are stripped later on.
    var d = new Date();
    var timestamp_filename="share" + d.getFullYear() + d.getMonth() + d.getDay() +
        d.getHours() + d.getMinutes() + d.getSeconds();

    this.setFilename(document.getElementById('filename_' + save_type).value || timestamp_filename);
    this.setDescription(document.getElementsByClassName('description')[0].value);
    this.setTutorial(Steps.generateSteps());

    backend.call('read_image',
                 // Strip off the 'file://' prefix
                 screenshot.substring(7, screenshot.length),
                 function(data) {
                     self.setScreenshot(data);
                 });
};

})();
