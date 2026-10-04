/**
 * Blockly Apps: Common code
 *
 * Copyright 2013 Google Inc.
 * http://blockly.googlecode.com/
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Common support code for Blockly apps.
 * @author fraser@google.com (Neil Fraser)
 */
'use strict';

var BlocklyApps = {};

/**
 * Gets the message with the given key from the document.
 * @param {string} key The key of the document element.
 * @return {string} The innerHTML of the specified element,
 *     or an error message if the element was not found.
 */

BlocklyApps.getMsg = function(key) {
  var msg = BlocklyApps.getMsgOrNull(key);
  return msg === null ? '[Unknown message: ' + key + ']' : msg;
};
/**
 * Gets the message with the given key from the document.
 * @param {string} key The key of the document element.
 * @return {string} The innerHTML of the specified element,
 *     or null if the element was not found.
 */
BlocklyApps.getMsgOrNull = function(key) {
  var element = document.getElementById(key);
  if (element) {
    var text = element.innerHTML;
    // Convert newline sequences.
    text = text.replace(/\\n/g, '\n');
    return text;
  } else {
    return null;
  }
};
