/**
* Copyright (C) 2014 Kano Computing Ltd
* License: GNU General Public License v2 http://www.gnu.org/licenses/gpl-2.0.txt
*
* Author: Tom Bettany <tom.bettany@kano.me>
* Description: Utilities related to displaying and updating the code preview window
*/

var CodePreview = {
    codeInput: function() {
        var editor = ace.edit('advancedModeCode');
        editor.setTheme('ace/theme/tomorrow_night');
        editor.getSession().setMode('ace/mode/python');
        editor.$blockScrolling = Infinity;

        return editor;
    },
    codeDialogInput: function() {
        var editor = ace.edit('code_preview_input');
        editor.setTheme('ace/theme/tomorrow_night');
        editor.setReadOnly(true);
        editor.getSession().setMode('ace/mode/python');
        editor.$blockScrolling = Infinity;

        return editor;
    }
};

(function() {
'use strict';

/**
 * Toggles the code preview on and off
 */
CodePreview.toggle = function() {
    if (document.getElementById('codeSwitch') !== null
        && document.getElementById('codeSwitch').checked) {

        CodePreview.renderCode();
        CodePreview.turn.on();
        window.addEventListener('mouseup', CodePreview.renderCode, false);
    } else {
        CodePreview.turn.off();
        window.removeEventListener('mouseup', CodePreview.renderCode, false);
    }
};

/**
 * Renders the code for the code preview
 */
CodePreview.renderCode = function() {
    var code = Project.getCode();
    CodePreview.codeDialogInput().setValue(code);
};

CodePreview.turn = {
    off : function() {
        document.getElementById('codeSwitch').checked = false;
        var codeDialog = document.getElementById('codePreview');
        codeDialog.classList.add('hidden');
    },
    on : function() {
        if (document.getElementById('codeSwitch') !== null) {
            document.getElementById('codeSwitch').checked = true;
            var codeDialog = document.getElementById('codePreview');
            codeDialog.classList.remove('hidden');
            CodePreview.renderCode();
        }
    }
};

CodePreview.advancedMode = {
    activated : false,
    setup : false,
    _code :   'import minecraft.minecraft as minecraft\n' +
              'import minecraft.block as block\n' +
              'import time\n' +
              '\n' +
              '\n' +
              'mc = minecraft.Minecraft.create()\n' +
              '\n',
    enable: function() {
        var advancedToggle = document.querySelector('.codePreview .basicMode .advancedModeToggle');

        advancedToggle.classList.remove('hidden');
    },
    disable: function() {
        var advancedToggle = document.querySelector('.codePreview .basicMode .advancedModeToggle');

        advancedToggle.classList.add('hidden');
    },
    setCode : function(code) {
        var codeText  = new CodeText(code);

        CodePreview.advancedMode._code = codeText.getCode();
        CodePreview.codeInput().setValue(CodePreview.advancedMode._code);
    },
    getCode : function() {
        var code = new CodeText(CodePreview.codeInput().getValue());

        code = code.getCode();
        return code;
    },
    reset: function() {
        CodePreview.advancedMode._code = '';
        CodePreview.codeInput().setValue('');
    },
    update: function() {
        CodePreview.advancedMode._code = CodePreview.advancedMode.getCode();

        backend.call('merge_code',
                     Project.getCode(),
                     CodePreview.advancedMode._code,
                     function(code) {
                         CodePreview.advancedMode.setCode(code);
                     });
    },
    view : function(state) {
        var codeEditor = (function() {
            var editor = document.getElementById('codePreview');

            return {
                off : function() {
                    editor.classList.remove('advanced');

                    CodePreview.advancedMode.activated = false;
                },
                on : function() {
                    CodePreview.advancedMode.update();
                    CodePreview.turn.on();
                    editor.classList.add('advanced');

                    if ('localStorage' in window
                        && localStorage.advancedModeRun !== 'true' ) {

                        localStorage.advancedModeRun = true;
                        location.href = '#advancedModeExplainDialog';
                    }

                    CodePreview.advancedMode.activated = true;
                },
                setup: function() {
                    var guide = editor.querySelector('.codePreview .advancedMode .guide > span.msg');

                    CodePreview.advancedMode.update();

                    guide.innerHTML = '';
                    var code = '<ul>' +
                               '<li>mc.postToChat(): writes a message on the game</li>' +
                               '<li>mc.setBlock(x, y, z, type): changes the type of a single block</li>' +
                               '<li>mc.getBlock(x, y, z): returns the type of a block</li>' +
                               '<li>mc.setBlocks(x1, y1, z1, x2, y2, z2, type): changes the type of a group of blocks</li>' +
                               '<li>mc.player.setTilePos(x, y, z): changes your position</li>' +
                               '<li>time.sleep(t): pauses for t seconds</li>' +
                               '</ul>';
                    guide.appendChild(document.createTextNode(code));
                    guide.innerHTML = code;
                    CodePreview.advancedMode.setup = true;
                }
            };
        })();

        var codeToggleSwitch = (function() {
            var codeToggle   = document.querySelector('div.toolbar div.half.right > button.toggle.code'),
                toggleSwitch = codeToggle.querySelector('#codeSwitch');

            return {
                enable : function() {
                    toggleSwitch.disabled = false;
                    codeToggle.classList.remove('disabled');
                },
                disable : function() {
                    toggleSwitch.checked = false;
                    toggleSwitch.disabled = true;
                    codeToggle.classList.add('disabled');
                }
            };
        })();

        var advancedToggleSwitch = (function() {
            var codePreviewWindow = document.querySelector('.codePreview');

            return {
                basic : function() {
                    codePreviewWindow.classList.remove('advanced');
                },
                advanced : function() {
                    codePreviewWindow.classList.add('advanced');
                }
            };
        })();

        if (!CodePreview.advancedMode.setup) {
            codeEditor.setup();
        }

        if (state) {
            advancedToggleSwitch.advanced();
            CodePreview.turn.on();
            codeToggleSwitch.disable();
            codeEditor.on();
        } else {
            advancedToggleSwitch.basic();
            codeToggleSwitch.enable();
            codeEditor.off();
            CodePreview.renderCode();
        }
    },
    guide : {
        visible: false,
        toggle: function() {
            if (CodePreview.advancedMode.guide.visible) {
                CodePreview.advancedMode.guide.turn.off();
            } else {
                CodePreview.advancedMode.guide.turn.on();
            }
        },
        turn: {
            on: function() {
                var guide = document.querySelector('.codePreview .advancedMode .guide');
                guide.classList.remove('hidden');
                CodePreview.advancedMode.guide.visible = true;
            },
            off: function() {
                var guide = document.querySelector('.codePreview .advancedMode .guide');
                guide.classList.add('hidden');
                CodePreview.advancedMode.guide.visible = false;
            }
        }
    }
};

})();
