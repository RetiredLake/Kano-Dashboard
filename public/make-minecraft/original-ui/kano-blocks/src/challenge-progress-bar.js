/**
* Copyright (C) 2015 Kano Computing Ltd
* License: GNU GPL v2 http://www.gnu.org/licenses/gpl-2.0.txt
*
* Author: Tom Bettany <tom@kano.me>
* Description: A class to handle the progress bar
*/

var ChallengeProgressBar = {};

(function() {
'use strict';

ChallengeProgressBar = function(params) {
    this.max_steps = params.max_steps || 1;
    this.furthest_step = 1;

    this._progress_bar = document.querySelector('.toolbar .progressBar');
    this._progress_done_bar = this._progress_bar.querySelector('.progressDoneBar');
    this._current_step_label = this._progress_bar.querySelector('.currentStep');

    this._max_step_indicator = this._progress_bar.querySelector('.maxStepsIndicator');
    this._max_step_icon = this._max_step_indicator.querySelector('.icon');
    this._max_step_label = this._max_step_indicator.querySelector('.maxSteps');

    this.undoButton = document.querySelector('.stepsNavigation .previousStep');
    this.redoButton = document.querySelector('.stepsNavigation .nextStep');

    if (params.disabled) {
        this.disable();
        return;
    } else {
        this.enable();
    }

    this._max_step_label.innerHTML = this.max_steps;

    this.update(1);
};

ChallengeProgressBar.prototype.disable = function() {
    this._update_progress_bar(this.max_steps);
    this.redoButton.disabled = true;
    this.undoButton.disabled = true;
    this._max_step_label.style.display = 'none';
};

ChallengeProgressBar.prototype.enable = function() {
    this._max_step_label.style.display = '';
};

ChallengeProgressBar.prototype.update = function(current_step) {
    this._update_progress_bar(current_step);
    this._update_furthest_step(current_step);
    this._update_navigation_buttons(current_step);
    this._current_step_label.innerHTML = current_step;
};

ChallengeProgressBar.prototype._update_progress_bar = function(current_step) {
    var progress = 100 * (current_step - 1) / (this.max_steps - 1),
        progress_width;

    this._progress_bar.classList.remove('complete');
    this._max_step_icon.classList.remove('lightning');
    this._max_step_icon.classList.add('greyLightning');

    this._max_step_indicator.style.display = '';
    switch(isNaN(progress) || progress) {
    case 0:
        progress_width = '15px';
        break;
    case 100:
    case true:
        progress_width = '100%';
        this._progress_bar.classList.add('complete');
        this._max_step_icon.classList.remove('greyLightning');
        this._max_step_icon.classList.add('lightning');
        break;
    default:
        progress_width = progress + '%';
    }

    this._progress_done_bar.style.width = progress_width;
};

ChallengeProgressBar.prototype._update_furthest_step = function(current_step) {
    this.furthest_step = Math.max(current_step, this.furthest_step);
};

ChallengeProgressBar.prototype._update_navigation_buttons = function(current_step) {
    this.redoButton.disabled = (current_step >= this.furthest_step);
    this.undoButton.disabled = (current_step <= 1);
};

ChallengeProgressBar.prototype.reset_furthest_step = function(new_furthest) {
    this.furthest_step = new_furthest;
    this._update_navigation_buttons(new_furthest);
};

})();
