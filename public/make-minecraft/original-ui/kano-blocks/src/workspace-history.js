/**
* Copyright (C) 2015 Kano Computing Ltd
* License: GNU GPL v2 http://www.gnu.org/licenses/gpl-2.0.txt
*
* Author: Tom Bettany <tom.bettany@kano.me>
* Description: A class to handle the historical states of the workspace
*/

var WorkspaceHistory = {};

(function() {
'use strict';

WorkspaceHistory = function(params) {
    this.step_count = params.step_count || 1;

    var events = params.events || [],
        tip_messages = params.tip_messages || [],
        positions = params.positions || [],
        directions = params.directions || [],
        progressors = params.progressors || [];

    this.steps = [];
    for (var i = 0; i < this.step_count; i++) {
        this.steps.push(new WorkspaceState({
            event: events[i],
            tip_message: tip_messages[i],
            position: positions[i],
            direction: directions[i],
            progressor: progressors[i]
        }));
    }
};

WorkspaceHistory.prototype._save_workspace = function(current_step_idx) {
    this.get(current_step_idx).workspace = Blockly.Xml.workspaceToDom(Blockly.mainWorkspace, true);
};

WorkspaceHistory.prototype._migrate_mutables = function(current_step_idx) {
    var current_step = this.get(current_step_idx),
        next_step = this.get(current_step_idx + 1);

    // '.slice()' to create a copy rather than a reference to the original
    if (next_step) {
        next_step.selected_id = current_step.selected_id.slice();
        next_step.progressor_tree = current_step.progressor_tree.slice();
    }
    
};

WorkspaceHistory.prototype.save = function(idx) {
    this._save_workspace(idx);
    this._migrate_mutables(idx);
};


WorkspaceHistory.prototype._load_workspace = function(current_step_idx) {
    Blockly.mainWorkspace.clear();
    Blockly.Xml.domToWorkspace(Blockly.mainWorkspace,
                               this.get(current_step_idx).workspace);
};

WorkspaceHistory.prototype.restore = function(idx) {
    this._load_workspace(idx);
};

WorkspaceHistory.prototype.get = function(idx) {
    return this.steps[idx - 1];
};

})();
