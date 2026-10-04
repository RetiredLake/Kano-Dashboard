/**
 * Blockly Apps: Code
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
 * @fileoverview JavaScript for Blockly's Code application.
 * @author fraser@google.com (Neil Fraser)
 */

(function() {
  document.addEventListener(
    'keydown',
    function(evt) {
      if (evt.keyCode === 27) {
          Code.closeMenu();
      }
    },
    false
  );
})();

var SUPPORTED_LOCALES = [
  'en',
  'en-QQ',
  'es-AR',
];

function getLanguage() {
  var language = window.navigator.languages ? window.navigator.languages[0] :
    window.navigator.userLanguage || window.navigator.language || 'en',
    p = language.indexOf('-');

  language = language.toLowerCase();

  // check if full locale is supported
  if (SUPPORTED_LOCALES.indexOf(language) > -1) {
    return language;
  }

  // otherwise check that if just the language is supported
  language = (p > -1) ? language.substr(0, p) : language;
  if (SUPPORTED_LOCALES.indexOf(language) > -1) {
    return language;
  }
  // language is not supported so default to 'en'
  return 'en';
}

// Supported languages.
BlocklyApps.LANGUAGES = {
  // Format: ['Language name', 'direction', 'XX_compressed.js']
  'en': ['English', 'ltr', '../generated/en_compressed.js'],
  'en-QQ': ['English QA', 'ltr', '../generated/en-QQ_compressed.js'],
  'es-AR': ['Spanish', 'ltr', '../generated/es-AR_compressed.js']
};
BlocklyApps.LANG = getLanguage();

/**
 * Create a namespace for the application.
 */
var Code = {};

(function() {
'use strict';

Code.close_window = function() {
  IO.cache();
  Stats.update();
  backend.call('exit');
};

/**
* Enables buttons.  Pass string of button ID
*/
Code.enableButton = function(buttonName) {
  var button = document.getElementById(buttonName);
  button.classList.remove('locked');
  button.disabled = false;
};

/**
* Disables buttons.
*/
Code.disableButton = function(buttonName) {
  var button = document.getElementById(buttonName);
  button.classList.add('locked');
  button.disabled = true;
};

/**
 * Discard all blocks from the workspace.
 */
Code.discard = function() {
    Blockly.mainWorkspace.clear();
    if (Project.getLastVisited() < Project.NUMBER) {
        Project.tooltip.displayProject(Project.getLastVisited());
    }

    if ('CodePreview' in window) {
        CodePreview.advancedMode.reset();
    }
};

/**
 * Shows alert asking user if they want to delete all the blocks on the workspace
 */
Code.confirmDiscard = function () {
    var count = Blockly.mainWorkspace.getAllBlocks().length,
        message = BlocklyApps.getMsg('Code_discard').replace('%1', count),
        heading = document.querySelector('#discardDialog>div>div.discardElements>div.top>div.heading');

    // Custom message dictating number of blocks created
    if (count >= 2) {

        // Find HTML element that contains heading of the dialog box
        heading.innerHTML = message;
        window.location.href = '#discardDialog';

    } else {
        Code.discard();
    }
};

/*
 * Takes the user back to the Menu screen with the list of levels.
 * Used for Menu button.
 */
Code.goToMenu = function() {
    IO.cache();
    //BlocklyStorage.migrateCacheToPlayground();
    window.location.href = '#menu';
    $('#menu').click(function(e) {
        if($(e.target).parents('#menucontainer').length == 0) {
            Code.closeMenu();
        }
    });
    $('#loadSource').click(function(e) {
        if($(e.target).parents('#loadSourceContainer').length == 0) {
            window.location.href = '#menu';
        }
    });
    $('#shareDialog').click(function(e) {
        if($(e.target).parents('#share').length == 0) {
            window.location.href = '#menu';
        }
    });
    $('#saveDialog').click(function(e) {
        if($(e.target).parents('#save').length == 0) {
            window.location.href = '#menu';
        }
    });
};

/*
 * Fade out text or image.
 * @param {string} id The id of the element
 */
Code.fadeOut = function(id) {
  $('#' + id).fadeOut('slow');
};

/*
 * Make message appear, then wait 5 seconds and make it fade out again.
 * @param {string} id The id of the element
 * @param {string} message The message we want displayed to the screen
 */
Code.timeOut = function(id, message) {
  document.getElementById(id).innerHTML = message;
  $('#' + id).fadeIn('slow');
  var timer = setTimeout(
      function() {
          Code.fadeOut(id);
      }, 8000);
};

/*
 * When window is in focus, clickMe message will be displayed
 */
Code.onFocus = function() {
  $(window).focus(function() {
    $('#clickMeAlert').fadeOut(1000);
  });
};

/*
 * When window is in out of focus, clickMe message will be hidden
 */
Code.onBlur = function() {
  $(window).blur(function() {
    $('#clickMeAlert').fadeIn(1000);
  });
};

Code.tutorial = true;

Code.tutorial_toggle = function() {
  Code.tutorial = !Code.tutorial;
};

Code.closeMenu = function() {
    if (Utilities.isMenu()) {
        var level = Project.getLastVisited();

        Project.switch(level);
        try {
            Project.tooltip.setShown(Code.tutorial);
        } catch (e) {
        }
    }
};

/**
 * Common functionality for replay
 */
Code.replay = function() {
  var level = Project.getLastVisited();

  setTimeout(
      function() {
          Project.tooltip.displayProject(level);
          Project.tooltip.setShown(Code.tutorial);
          AlertsMessages.levelDone.displayMsg(Language.alert.finishedLevel);
      },
      0);
};

})();
