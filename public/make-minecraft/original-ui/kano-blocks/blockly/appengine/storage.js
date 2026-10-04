/**
 * Blockly Demo: Storage
 *
 * Copyright 2012 Google Inc.
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
 * @fileoverview Loading and saving blocks with localStorage and cloud storage.
 * @author q.neutron@gmail.com (Quynh Neutron)
 */
'use strict';

// Create a namespace.
var BlocklyStorage = {};

/**
 * Backup code blocks to localStorage.
 * @private
 */

BlocklyStorage.backupBlocks_ = function() {
  if ('localStorage' in window) {
    var xml = Blockly.Xml.workspaceToDom(Blockly.mainWorkspace);
    // Gets the current URL.
    var url = window.location.href;
    window.localStorage.setItem(url, Blockly.Xml.domToText(xml));
  }
};

/**
 * Restore code blocks from localStorage.
 */
BlocklyStorage.restoreBlocks = function() {
  var url = window.location.href;
  if ('localStorage' in window && window.localStorage[url]) {
    var xml = Blockly.Xml.textToDom(window.localStorage[url]);
    Blockly.Xml.domToWorkspace(Blockly.mainWorkspace, xml);
  }
};

/*
 * Migrates the cache to the new level.
 * To be called when a new level is unlocked.
 */
BlocklyStorage.migrateCache = function()
{
  if ('localStorage' in window && 'Code' in window) {
      var data = BlocklyStorage.getCurrentLevel(),
      progress = Number(data),
      url = window.location.href.split('#')[0];
      window.localStorage.setItem(url + '#project' + String(progress + 1), window.localStorage[url + '#project' + String(progress)]);
  }
};

/*
 * Migrates the cache from level migrateFrom to migrateTo.
 *
 */
BlocklyStorage.migrateCacheLevels = function(migrateFrom, migrateTo, max_number)
{
  if ('localStorage' in window && 'Code' in window) {
    var url = window.location.href.split('#')[0];
    migrateFrom = (migrateFrom < 1) ? 1 : migrateFrom;
    migrateTo = (migrateTo > max_number) ? max_number + 1 : migrateTo;
    window.localStorage.setItem(url + '#project' + String(migrateTo), window.localStorage[url + '#project' + String(migrateFrom)]);
  }
};

/*
 * Migrates the cache to the playground.
 * To be called on clicking the menu button and on passing a new level.
 */
 /*BlocklyStorage.migrateCacheToPlayground = function ()
{
  if ('localStorage' in window && 'Code' in window) {
    var urlProject = window.location.href;
    var url = window.location.href.split('#')[0];
    window.localStorage.setItem(url + '#playground', window.localStorage[urlProject]);
  }
};*/

/*
 * Gets current level from URL
 *
*/
BlocklyStorage.getCurrentLevel = function() {
  if ('localStorage' in window && 'Code' in window) {
    var projectString = window.location.href.split('#project')[1];
    return projectString;
  }
};

/*
 * Clears the storage for a project.
 * @param {int} project The project for which we want to clear.
 */
BlocklyStorage.clearProjectCache = function(project) {
  var url = window.location.href.split('#')[0];
  window.localStorage.removeItem(url + '#project' + project);
};
