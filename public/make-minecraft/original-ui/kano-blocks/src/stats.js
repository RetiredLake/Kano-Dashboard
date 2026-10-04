/**
* Copyright (C) 2014 Kano Computing Ltd
* License: GNU General Public License v2 http://www.gnu.org/licenses/gpl-2.0.txt
*
* Author: Tom Bettany <tom.bettany@kano.me>
* Description: Stores data about stats.
*/

var Stats = {};

(function() {
'use strict';

Stats.update = function(code) {
    var getBlocksAdded = function() {
        var workspace = Blockly.mainWorkspace,
            blocks    = workspace.getAllBlocks();

        return blocks.length;
    };

    var getMakes = function() {
        return 1;
    };

    var getCodeLinesAddCount = function(newCode) {
        if (typeof(newCode) === 'undefined') {
            return 0;
        }

        var newLineCount;

        backend.call('count_new_lines_of_code', newCode,
                     function(return_value) {
                        newLineCount = return_value;
                     });

        return newLineCount;
    };

    // Save to profile.
    backend.call('update_stats', getBlocksAdded(),
                 getMakes(), getCodeLinesAddCount(code));
};

})();
