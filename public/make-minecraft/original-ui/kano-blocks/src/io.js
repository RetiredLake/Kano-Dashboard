/**
* Copyright (C) 2014 Kano Computing Ltd
* License: GNU General Public License v2 http://www.gnu.org/licenses/gpl-2.0.txt
*
* Author: Team Kano <team-software@kano.me>
* Description: IO operations
*/

var IO = {};

(function() {
'use strict';

/**
* Save blocks to cache.
*
* The following added to Code.init is ideal but is slow on the Pi. Instead
* we will cache when the Make, Save and Ship buttons are pressed.
*   document.getElementById('content_blocks').addEventListener('mouseup', Code.cache, false);
*/
IO.cache = function() {
    if ('BlocklyStorage' in window) {
        BlocklyStorage.backupBlocks_();
    }
};

IO.form = {
    /*
     * Migrates the share form contents to the save form.
     */
    migrate : function() {
        var screenshot = document.getElementsByClassName('screenshot'),
            filename = document.getElementsByClassName('filename'),
            description = document.getElementsByClassName('description');

        screenshot[0].src = screenshot[1].src;
        filename[0].value = filename[1].value;
        description[0].value = description[1].value;
    },
    addListeners : function() {
        new ElementGroup('.filename').addEventListener('input', IO.form.validateInputs, false);
    },
    removeListeners : function() {
        new ElementGroup('.filename').removeEventListener('input', IO.form.validateInputs, false);
    },
    validateInputs : function(event) {
        var caller      = event.target || event.srcElement,
            callerText  = caller.value,
            buttons     = new ElementGroup('div.dialog.save button.launch|div.dialog.share button.launch');

        if (Utilities.sanitise(callerText) === '') {
            buttons.setAttr('disabled', true);
            buttons.classList_add('disabled');
        } else {
            buttons.setAttr('disabled', false);
            buttons.classList_remove('disabled');
        }
    }
};

/**
 * Save blocks and upload them to Kanuxbox
 */
IO.shipBlocks = function() {
    IO.form.migrate();

    var challenge = new Challenge(),
        filename  = challenge.getFilename();

    IO.save.XML(true);

    backend.call('ship', filename, function(returnValue) {
        if (returnValue !== 0) {
            window.location.hash = '#loadFileFail';
            AlertsMessages.error.displayMsg(Language.alert.shareFail);
        } else {
            AlertsMessages.success.displayMsg(Language.alert.share);
        }
    });

    location.hash = '#menu';
};

/**
 * Save blocks to local file.
 * @param {boolean}  Is the file being shared?
 */
IO.save = {
    XML : function(shared, loadChallenge) {
        var challenge = new Challenge(undefined, shared),
            filename  = challenge.getFilename();

        challenge.setShared(shared);
        if (Project.advancedModeEnabled) {
            IO.save.advancedMode("share", filename);
        }

        if (loadChallenge === true) {
            IO.loadedChallenge = challenge;
        }
        // Create a request to save the code
        backend.call('save_challenge', filename, challenge.getDescription(), challenge.export(), function(res) {
            if (res == 1) {
                AlertsMessages.success.displayMsg(Language.alert.save);
            }
        });

        Code.closeMenu();
    },
    advancedMode : function(save_type, filename) {
        var code     = CodePreview.advancedMode.getCode();

        filename = filename || document.getElementById('filename_save').value;

        backend.call('save', filename + '.py', code,
            function(){
            });

        Code.closeMenu();
    }
};

IO.loadedChallenge = {};

IO.load = {
    inject : {
        blocks : {
            dialog : function(challenge, skipWarning) {
                Project.switch(Project.challenge.count + 1);

                if (skipWarning) {
                    Blockly.mainWorkspace.clear();
                    IO.load.inject.blocks.onWorkspace(challenge);
                } else {
                    window.location.hash = '#loadMakeOrPlay';
                }
            },
            onWorkspace : function(challenge) {
                //Since we are interested on just pushing the blocks, do not show the tooltips
                if (Project.tooltip) {
                    try {
                        Project.tooltip.setShown(false);
                    } catch (e) {
                        // Just means that the user hasn't visited a project with a tooltip yet.
                    }
                }
                Blockly.Xml.domToWorkspace(Blockly.mainWorkspace, challenge.getBlocks());
                backend.call('on_web_load', function() {});
            },
        },
        steps : {
            dialog : function(challenge) {
                var count;

                Project.switch(Project.challenge.count + 1);

                count = Blockly.mainWorkspace.getAllBlocks().length;
                if (count) {
                    window.location.hash = "#clearBlocksLoadStepsDialog";
                } else {
                    IO.tooltip.display(challenge);
                }

                backend.call('on_web_load', function() {});
            }
        },
        advancedMode : {
            onWorkspace : function(code) {
                Project.switch(Project.challenge.count + 1);

                CodePreview.advancedMode.setCode(code);
            }
        }
    },

    file : {
        local : {
            XML : function(defaultDir) {
                backend.call('chooseFile', defaultDir, function(filename) {
                    if (filename !== '') {
                        backend.call('readFile', filename, function(xmlString) {
                            IO.loadedChallenge = new Challenge(xmlString);
                            IO.load.inject.blocks.dialog(IO.loadedChallenge);
                        });
                    } else {
                        location.hash = '#menu';
                    }
                });
            },
            XMLfromFilename : function(filename) {
                Project.switch(Project.challenge.count + 1);

                backend.call('readFile', filename, function(xmlString) {
                    IO.loadedChallenge = new Challenge(xmlString);
                    IO.load.inject.blocks.dialog(IO.loadedChallenge);
                });
            },
            python : function(defaultDir) {
                backend.call('chooseFile', defaultDir, '{"py": "Code Files"}', function(filename) {
                    if (filename !== '') {
                        backend.call('readFile', filename, function(pythonString) {
                            IO.load.inject.advancedMode.onWorkspace(pythonString);
                        });
                    } else {
                        location.hash = '#menu';
                    }
                });
            }
        },
        remote : {
            XML : function() {
                // Feedback
                var loadButtons = new ElementGroup('div.dialog.loadSource div div.top button');
                loadButtons.setAttr('disabled', true);

                setTimeout(function() {
                    backend.call('web_load', function(xmlString) {
                        if (xmlString !== null) {
                            IO.loadedChallenge = new Challenge(xmlString);
                            IO.load.inject.blocks.dialog(IO.loadedChallenge);
                        } else {
                            location.hash = '#menu';
                        }
                    });

                    loadButtons.setAttr('disabled', false);
                }, 100);
            },
            python : function() {
                backend.call('web_load', function(pythonString) {
                    if (pythonString !== null) {
                        IO.load.inject.advancedMode.onWorkspace(code);
                    } else {
                        location.hash = '#menu';
                    }
                });
            }
        }
    }
};

IO.tooltip = {
    tooltip : {},
    display : function(challenge) {
        IO.tooltip.tooltip = new Tooltip(challenge.getTutorial(),
                                         '<div class=\'tip\'><img src=\'../../kano-blocks/blockly/media/1x1.gif\' class=\'hint-icon hint\'><p class=\'hintlabel\'>',
                                         '</p></div>');
        IO.tooltip.tooltip.displayProject(1);
    }
};

IO.screenshot = {
    src : '',
    updateSrc : function() {
        IO.screenshot.src = '/tmp/screenshot.png';
    },
    refreshElements : function() {
        if (IO.screenshot.src === '') {
            // No screenshot taken yet, don't bother updating.
            return;
        }

        var screenshotElements = new ElementGroup('.screenshot');

        // Trick to make the screenshot refresh.
        screenshotElements.setAttr('src', IO.screenshot.src + "?v=" + Date());
    }
};

})();
