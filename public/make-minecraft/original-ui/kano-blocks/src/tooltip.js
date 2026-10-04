/**
* Copyright (C) 2014 Kano Computing Ltd
* License: GNU General Public License v2 http://www.gnu.org/licenses/gpl-2.0.txt
*
* Author: Tom Bettany <tom.bettany@kano.me>
* Description: A class to create tutorial messages from an XML specification file.
*/

var Tooltip = {};

(function() {
'use strict';

/**
 * Loads a project tutorial from an XML file
 * @param {string} xmlFile  Path to the XML file to load or pure XML
 */
Tooltip = function(xmlFile, paddingBefore, paddingAfter) {
    var parser,
        data;

    this.paddingBefore = paddingBefore;
    this.paddingAfter = paddingAfter;

    if (xmlFile.indexOf('.xml') !== -1) {
        // This is a filepath.
        backend.call('readFile', xmlFile, function(xmlString) {
            data = xmlString;
        });
    } else {
        // This is pure XML.
        data = xmlFile;
    }

    if (window.DOMParser) {
        parser = new DOMParser();
        this.xmlDoc = parser.parseFromString(data, 'text/xml');
    }
};

Tooltip.prototype.getTipText = function(idx) {
    var currentStep = this.tutorialDialog.currentStep - 1;
    if (typeof(idx) === 'undefined') {
        idx = currentStep;
    } else {
        idx = currentStep + idx;
    }

    try {
        return this.tipText[idx].firstChild.nodeValue;
    } catch (e) {
        return '';
    }
};

/**
 * Sets up the tooltip messages for the specified project.
 * @param  {int} project  The project to display the tooltips for.
 */
Tooltip.prototype.displayProject = function(project) {
    var positions,
        tips,
        directions,
        progressors,
        xml;

    xml = this.xmlDoc.getElementsByTagName('project')[project - 1];

    positions = this.xmlToArray(xml.getElementsByTagName('position'));
    this.tipText = xml.getElementsByTagName('tip');
    tips = this.xmlToArray(this.tipText);
    directions = this.xmlToArray(xml.getElementsByTagName('direction'));
    progressors = this.xmlToArray(xml.getElementsByTagName('progressor'));

    this.tutorialDialog = new Pointer('tutorialDialog',
                                        this.padArray(tips,
                                                      this.paddingBefore,
                                                      this.paddingAfter),
                                        this._parsePositions(positions),
                                        directions,
                                        progressors);
};

/**
 * Takes an XML object and returns an array of its values.
 * Essentially puts the xml.childNodes[0].nodeValue into an array.
 * @param  {XML parsed object} xml  The XML object to be converted
 * @return {string[]}               An array of the values
 */
Tooltip.prototype.xmlToArray = function(xml) {
    var length = xml.length;
    var xmlArray = [];
    for (var i = 0; i < length; i++) {
        if (xml[i].childNodes[0]) {
            xmlArray.push(xml[i].childNodes[0].nodeValue);
        } else {
            xmlArray.push('');
        }
    }

    return xmlArray;
};

/**
 * Takes an array and adds strings to the beginning or end of each element.
 * Useful to add HTML tags around raw data.
 * @param  {string[]} array   The array to pad
 * @param  {string}   before  The string to place before each element
 * @param  {string}   after   The string to place after each element
 * @return {string[]}         The padded array
 */
Tooltip.prototype.padArray = function(array, before, after) {
  var length = array.length;

  if (typeof before === 'undefined')
    before = '';
  if (typeof after === 'undefined')
    after = '';

  for (var i = 0; i < length; i++) {
    array[i] = before + array[i] + after;
  }
  return array;
};

/**
 * Switches the tooltip to be displayed
 */
Tooltip.prototype.showNext = function() {
  this.tutorialDialog.showNext();
};

/**
 * Switches the tooltip to be displayed
 */
Tooltip.prototype.showPrevious = function() {
  this.tutorialDialog.showPrevious();
};

/**
 * Switches the tooltip to be displayed
 */
Tooltip.prototype.redo = function() {
  this.tutorialDialog.redo();
};

/**
 * Switches the tooltip to be displayed
 */
Tooltip.prototype.undo = function() {
  this.tutorialDialog.undo();
};

/**
 * Resets the step of the tooltip
 */
Tooltip.prototype.resetStep = function() {
  this.tutorialDialog.resetStep();
};

/**
 * Switches the tooltip to be displayed
 */
Tooltip.prototype.show = function() {
  this.tutorialDialog.show();
};

/**
 * Switches the tooltip to be displayed
 */
Tooltip.prototype.hide = function() {
  this.tutorialDialog.hide();
};

/**
 * Sets whether the tooltip should be displayed
 * @param {Boolean} value  Should the object be displayed?
 *                           true   Display
 *                           false  Don't display
 */
Tooltip.prototype.setShown = function(value) {
  this.tutorialDialog.setShown(value);
};

/**.
 * Parses out coordinates from a given positionstring
 * @param  {string[]} positions  An array of positions
 * @return {string[]}            An array of parsed positions
 */
Tooltip.prototype._parsePositions = function(positions) {
  for (var i = 0; i < positions.length; i++) {
    if (positions[i].indexOf(',') !== -1) {
      positions[i] = positions[i].split(',');
    }
  }

  return positions;
};

})();
