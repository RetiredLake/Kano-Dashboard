/**
* Copyright (C) 2014 Kano Computing Ltd
* License: GNU General Public License v2 http://www.gnu.org/licenses/gpl-2.0.txt
*
* Author: Team Kano <team-software@kano.me>
* Description: A class to create new projects.
*/

var NewProject = {};

(function() {
'use strict';

NewProject = function(level) {
    var latestLevel = Project.level,
        levelCount  = Project.challenge.count;

    // 1st project has level 1
    this.level = level;
    this.currentProject = false;
    this.unlocked = (this.level == 1 || this.level == levelCount + 1);
    this.lastVisited = (this.level <= latestLevel);
    this.cache = '';
    this.projectButton = document.getElementById('project' + this.level);
    this.img = document.getElementById('img' + this.level);

    this.updateLanguage();
};

NewProject.prototype.updateLanguage = function() {
    if (this.level === Project.challenge.count + 1) {
        this.language = Language.playground;
        this.language.number = '';
        this.language.numberOfTotal = '';
    } else {
        this.language = Language.project[this.level];
        this.language.number = this.level;
        this.language.numberOfTotal = '(' + this.level + '/' + Project.challenge.count + ')';
    }
};

NewProject.prototype.unlock = function() {
    var latestLevel = Project.level;

    if (this.level <= latestLevel) {
        this.unlocked = true;

        if (this.level > Project.challenge.count) {
            this.projectButton.classList.remove('locked');
            this.projectButton.classList.add('unlocked');
        } else if (this.level < latestLevel) {
            this.projectButton.classList.remove('locked');
            this.projectButton.classList.remove('working');
            this.projectButton.classList.add('completed');

            var xpLabel = document.querySelectorAll('.dialog.challenge .dialogItem.projectMenu .bottom .xp .xpLabel');
            xpLabel[this.level - 1].innerHTML = this.xp;
            try {
                this.img.classList.remove('padlock');
                this.img.classList.remove('lightning');
                this.img.classList.add('tick');
            } catch (e) {
            }
            this.projectButton.disabled = false;
        } else {
            this.projectButton.classList.add('working');
            try {
                this.img.classList.remove('padlock');
                this.img.classList.add('lightning');
            } catch (e) {
            }
            this.projectButton.disabled = false;
        }
    }

    this.setIcons();
};

NewProject.prototype.setIcons = function() {
    var objective = this.language.objective || '',
        badge = this.language.badge || '';

    if (objective !== '') {
        this.projectButton.classList.add('objective');
    }

    if (badge !== '') {
        this.projectButton.classList.add('badge');
    }
};

})();
