/**
* Copyright (C) 2014-2015 Kano Computing Ltd
* License: GNU General Public License v2 http://www.gnu.org/licenses/gpl-2.0.txt
*
* Author: Team Kano <team-software@kano.me>
* Description: A base class for the project class defined in each level.
*/

var ProjectBase = {};

(function() {
'use strict';

ProjectBase = function (challengeCount, tooltipPath, name, enableAdv) {
    this.projectName = name;
    this.challenge = {};
    this.challenge.count = challengeCount;
    this.level     = {};
    this.tooltip   = new Tooltip(tooltipPath,
                                 '<div class=\'tip\'><p class=\'hintlabel\'>',
                                 '</p></div>'),
    this.advancedModeEnabled = enableAdv || false;
};

/*
 *  Writes the information about each project to the menu.
 *  This is done here so the text can be put in _messages.js
 */
ProjectBase.prototype.updateInformation = function(level) {
    new ElementGroup('.challengeNumber').setAttr(
        'innerHTML', this.challenge[level].language.number);
    new ElementGroup('.challengeNumberOfTotal').setAttr(
        'innerHTML', this.challenge[level].language.numberOfTotal);
    new ElementGroup('.challengeTitle').setAttr(
        'innerHTML', this.challenge[level].language.title);
    new ElementGroup('.challengeDescription').setAttr(
        'innerHTML', this.challenge[level].language.description);
    new ElementGroup('.objectiveLabel').setAttr(
        'innerHTML', this.challenge[level].language.objective);
    new ElementGroup('.badgeLabel').setAttr(
        'innerHTML', this.challenge[level].language.badge || '');
    new ElementGroup('.challengeInfo .stat.xp .xpLabel').setAttr(
        'innerHTML', this.challenge[level].xp || '');

    var lines = this.challenge[level].language.codeLines,
        line_str = lines  + ' LINE';

    if (lines !== '1') {
        line_str += 'S';
    }
    new ElementGroup('.linesLabel').setAttr(
        'innerHTML', line_str);
};

ProjectBase.prototype.reload = function() {
    var rtl     = BlocklyApps.LANGUAGES[BlocklyApps.LANG][1] == 'rtl',
        toolbox = document.getElementById('toolbox'),
        blocks  = document.getElementById('content_blocks');

    try {
        Blockly.inject(blocks,
            {path: '../blockly/',
             rtl: rtl,
             toolbox: toolbox});

        BlocklyStorage.restoreBlocks();

        // Show the selected pane.
        blocks.style.visibility = 'visible';
        Blockly.fireUiEvent(window, 'resize');
    } catch (e) {
    }
};

ProjectBase.prototype.loadLevel = function(callback) {
    var self = this;

    backend.call('load_level', function(loadedLevel) {
        self.level = loadedLevel;
        if (callback) {
            callback();
        }
    });
};

ProjectBase.prototype.showSplashMenu = function() {
    // Show the menu at startup.
    if (this.readLastUnlocked() === 1) {
        backend.call('play_intro', function() {});
        this.goToIntro(1);
    } else {
        window.location.href = '#splashOther';
    }
};

ProjectBase.prototype.init = function() {
    var self = this;

    // Re-emit the load event, the following relies on it for initialisation.
    // TODO: The 'load' event does come through, but it does so late.
    var evt = document.createEvent('Event');
    evt.initEvent('load', false, false);
    window.dispatchEvent(evt);

    this.loadLevel.call(self, function() {
        backend.call('get_xp', function(xp) {
            xp = JSON.parse(xp);

            for (var i = 1; i <= self.challenge.count + 1; i++) {
                self.challenge[i] = new NewProject(i, self.level, self.challenge.count);
                self.challenge[i].xp = xp[i];
                self.challenge[i].unlock(self.level);
            }

            self.updateInformation(self.level);
            self.showSplashMenu.call(self);
        });

        AlertsMessages.hideAll();
        // ProjectBase.prototype.reload.call(self);
        self.reload();

        // CLI argument parsing
        backend.call('arg_level', function(argLevel) {
            if (!argLevel) {
                return;
            } else if (argLevel == 'make') {
                self.goToNext();
            } else if (argLevel == 'play') {
                self.goToPlayground();
            } else {
                IO.load.file.local.XMLfromFilename(argLevel);
            }
        });
    });
};

ProjectBase.prototype.goToIntro = function(project) {
    if (!this.challenge[project].unlocked) {
        return;
    }

    Project.updateInformation(project);
    Project.setLastVisited(project);

    if (project < this.level) {
        location.href = '#replayProjectIntroDialog';
    } else if (project === this.challenge.count + 1) {
        location.href = '#playgroundIntroDialog';
    } else {
        location.href = "#projectIntroDialog";
    }

};

/**
 * Switches the project workspace.
 * @param  {String} project The project to be loaded.
 *                          Must match the name used in the project's {template .*toolbox} section (omit 'toolbox').
 *                          Leave blank for all the blocks in the toolbox.
 *                          Examples:
 *                            If {template .project1toolbox} is defined, call Code.switchProject('project1')
 *                            Call Code.switchProject('') for the whole toolbox
 */
ProjectBase.prototype.switch = function(project) {
    if (!this.challenge[project].unlocked) {
        return;
    }

    var previousLevel = this.getLastVisited(),
        level         = this.level;

    this.updateInformation(project);
    this.setLastVisited(project);
    location.href = '#project' + project;

    if (project > this.challenge.count) {
        project = 'playgroundunlockedtoolbox';

        if (this.advancedModeEnabled) {
            CodePreview.advancedMode.enable();
            CodePreview.advancedMode.view(CodePreview.advancedMode.activated);
        }

        if (!this.advanceModeEnabled || !CodePreview.advancedMode.activated) {
            document.getElementById('content_blocks').innerHTML = window.toolbox[project]();
            this.reload();
         }

        try {
            this.tooltip.setShown(false);
        } catch (e) {
            // Just means that the user hasn't visited a project with a tooltip yet.
        }

        Help.toggle_button.hide();

        new ChallengeProgressBar({
            disabled: true
        });

    } else {
        var projectName;

        if (project === -1) {
            projectName = "project" + previousLevel + "toolbox";
        } else {
            projectName = "project" + project + "toolbox";
        }

        if (this.advancedModeEnabled) {
            CodePreview.advancedMode.view(false);

            // This is to fix bug when going from Advanced mode to a challenge.
            // Code preview is still shown but toggle button is off.
            if (!document.getElementById('codeSwitch').checked) {
                CodePreview.turn.off();
            }

            CodePreview.advancedMode.disable();
        }

        document.getElementById('content_blocks').innerHTML = window.toolbox[projectName]();
        this.reload();

        if (project !== previousLevel || this.initialStart === undefined) {
            AlertsMessages.hideAll();
            this.tooltip.displayProject(project);
            this.initialStart = true;
        } else {
            // Returning to the same challenge
            // FIXME: For now just reset the tips.
            // Eventually do : this.tooltip.resetStep();
            this.tooltip.displayProject(project);
        }

        try {
            this.tooltip.setShown(Code.tutorial);
        } catch (e) {
            // Just means that the user hasn't visited a project with a tooltip yet.
        }

        Help.toggle_button.hide();
    }

};

ProjectBase.prototype.getCurrent = function() {
    var level = this.getLastVisited();

    return this.challenge[level];
};

ProjectBase.prototype.getName = function() {
    return this.projectName;
};

ProjectBase.prototype.reset = function() {
    Project.switch(-1);
};

ProjectBase.prototype.deleteOrphans = function() {
    var blocks = Blockly.mainWorkspace.getTopBlocks(true);
    // Alert user if a block is sitting on the workspace that perhaps shouldn't be
    // e.g. the rebound block sitting alone can cause odd results
    for (var x = 0, block; block = blocks[x]; x++) {
        if (block.getChildren().length === 0) {
            if (!block.canBeAlone) {
                block.dispose(false, false);
                AlertsMessages.error.displayMsg(Language.alert.blockAlone);
            }
        }
    }
};

/*
 * Decides whether user can level up. Checks to see if the workspace has the blocks required for levelling up.
 */
ProjectBase.prototype.levelUp = function(code) {
    var project = Project.getLastVisited(),
        data    = Project.level;

    if (project != data) {
        return;
    }
    this.deleteOrphans();

    if (this.isLevelComplete(code, data)) {
        this.changeLastUnlocked(data + 1);
        SoundFX.complete.play();
    }
};

/* Unlocks the next level
 * @param  {Number} newLevel, the level you are unlocking
 * Caching of blocks means this must be different to Minecraft
 */
ProjectBase.prototype.changeLastUnlocked = function(newLevel) {
    var self = this;
    this.level = newLevel;

    this.challenge[newLevel].unlock(this.level);
    this.challenge[newLevel - 1].unlock(this.level);

    backend.call('save_level_and_calculate_xp_diff', newLevel, function(xp_gain) {
        var xp_msg,
            code_msg;

        if (newLevel > self.challenge.count) {
            window.location.href = '#congratulations';
        } else {
            self.levelUpCaching(newLevel);
            window.location.href = '#levelUp';
        }
    });
};

/**
 * Reads the level from localStorage in browser.
 * @return {number} The level unlocked.
*/
ProjectBase.prototype.readLastUnlocked = function() {
    return Project.level;
};

/*
 * Sends the user to the current level in the system
 */
 ProjectBase.prototype.goToCurrent = function() {
    var level = this.getLastVisited();

    this.switch(level);
};

/*
 * Sends the user to the previous level in the system
 *
 */
ProjectBase.prototype.goToPrev = function() {
    var level = this.getLastVisited();

    this.goToIntro(level - 1);
};

/*
 * Sends the user to the next level in the system
 */
ProjectBase.prototype.goToNext = function() {
    var level = this.getLastVisited();

    this.goToIntro(level + 1);
};

/*
 * Sends the user to the playground
 */
ProjectBase.prototype.goToPlayground = function() {
    var level = this.challenge.count + 1;

    this.goToIntro(level);
};

})();
