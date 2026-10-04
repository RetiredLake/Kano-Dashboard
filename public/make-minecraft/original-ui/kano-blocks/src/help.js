/**
* Copyright (C) 2014-2015 Kano Computing Ltd
* License: GNU General Public License v2 http://www.gnu.org/licenses/gpl-2.0.txt
*
* Author: Team Kano <team-software@kano.me>
* Description: Handles the help window.
*/

var Help = {};

(function() {
'use strict';

Help.getForumLink = function() {
    return Project.getCurrent().language.forum;
};

/**
 * Toggles the help on and off
 */
Help.toggle = function() {
    document.getElementById("helpSwitch").classList.toggle("down");
    if (document.getElementById("helpSwitch").classList.contains("down")) {
        Help.updateInfo();
        document.getElementById("helpScreen").style.display = "block";
    } else {
        Help.showMenu();
        document.getElementById("helpScreen").style.display = "none";
    }
};

Help.showBlockConfiguration = function() {
    document.getElementById("blockSolution").style.display = "table-cell";
    document.getElementById("stillStuck").style.display = "none";
    Help.change_forumPage_display("none");
    Help.change_blockControls_display("none");
};

Help.showForumPage = function() {
    Help.change_forumPage_display("table-cell");
    document.getElementById("stillStuck").style.display = "none";
    document.getElementById("blockSolution").style.display = "none";
    Help.change_blockControls_display("none");

    var url = Help.getForumLink();
    backend.call('launch_forum', url, function(){});
};

Help.showMenu = function() {
    document.getElementById("stillStuck").style.display = "table-cell";
    document.getElementById("blockSolution").style.display = "none";
    Help.change_forumPage_display("none");
    Help.change_blockControls_display("none");
};

Help.showBlockControls = function() {
    Help.change_blockControls_display("table-cell");
    document.getElementById("stillStuck").style.display = "none";
    document.getElementById("blockSolution").style.display = "none";
    Help.change_forumPage_display("none");
};

// In pong, the block controls screen doesn't exist
Help.change_blockControls_display = function(display_type) {
    if (document.getElementById("blockControls") !== null) {
        document.getElementById("blockControls").style.display = display_type;
    }
};

// In minecraft, the forum page screen may not exist
Help.change_forumPage_display = function(display_type) {
    if (document.getElementById("forumPage") !== null) {
        document.getElementById("forumPage").style.display = display_type;
    }
};

Help.updateInfo = function() {
    var title = Project.getCurrent().language.title;
    var description = Project.getCurrent().language.description;
    var prev_step = Project.tooltip.getTipText(-1);
    var next_step = Project.tooltip.getTipText();
    document.getElementById("helpTitle").innerHTML = title;
    document.getElementById("helpDescription").innerHTML = description;
    document.getElementById("prevStep").innerHTML = prev_step;
    document.getElementById("nextStep").innerHTML = next_step;

    if (Project.getCurrent().level == 1) {
        document.getElementById("showSolutionButton").disabled = true;
    } else {
        document.getElementById("showSolutionButton").disabled = false;
    }

    // update the info of each of the elements in the hide section
    // Update block configuration image
    var name = Project.getName();
    var challengeNumber = Project.getCurrent().level;
    var filename = "../../make-" +
                    name +
                    "/" +
                    name +
                    "/media/completed-challenges/challenge-" +
                    challengeNumber +
                    ".png";

    document.getElementById("blockSolutionImg").src = filename;

    // Update forum post link
    //var forumLink = Help.getForumLink();
    //document.getElementById("forumPageIFrame").src = forumLink;
};

Help.hideScreen = function() {
    Help.showMenu();
    document.getElementById("helpScreen").style.display = "none";
    document.getElementById("helpSwitch").classList.remove("down");
};

Help.toggle_button = (function() {
    var set_help_switch_display = function(display_state) {
        var help_switch = document.getElementById('helpSwitch');

        if (help_switch) {
            help_switch.style.display = display_state;
        }
    };

    return {
        show: function() {
            set_help_switch_display('');
        },
        hide: function() {
            set_help_switch_display('none');
        }
    };
})();

})();
