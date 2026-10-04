/**
* Copyright (C) 2015 Kano Computing Ltd
* License: GNU GPL v2 http://www.gnu.org/licenses/gpl-2.0.txt
*
* Author: Tom Bettany <tom.bettany@kano.me>
* Description: A class to store the state of the workspace
*/

var WorkspaceState = {};

(function() {
'use strict';

WorkspaceState = function(args) {
    if (args.event) {
        this._parse_event(args.event);
    } else {
        this.event_type = args.event_type || '';
        this.event_params = args.event_params || '';
    }

    this.tip_message = args.tip_message || '';
    this.position = args.position || '';
    this.direction = args.direction || '';
    this.progressor = args.progressor || '';
    this.progressor_tree = args.progressor_tree || [];
    this.selected_id = args.selected_id || [];
};

WorkspaceState.prototype._parse_event = function(selector) {
    var split_selector = selector.split('+');

    this.event_type = split_selector[0];
    this.event_params = split_selector.slice(1);

    this._parse_event_params(this.event_params);
};

WorkspaceState.prototype._parse_event_params = function(event_params) {
    switch (this.event_type) {
    case 'buttonPress':
        this.button = event_params[0];
        break;
    case 'blockAdd':
        this.block = event_params[0];
        break;
    case 'blockConnect':
        this.parent = event_params[0];
        this.child = event_params[1];
        break;
    case 'dropdownInputChange':
        this.field = event_params[0];
        // Consider as the plus operator if the value is not set,
        // since the splitting of the attributes is on the plus itself
        this.value = event_params[1] || '+';

        break;
    case 'colourInputChange':
        this.field = event_params[0];

        break;
    case 'textInputChange':
        var op;

        if (event_params.length === 3) {
            this.parent = event_params[0];
            event_params.splice(0, 1);
        }

        this.field = event_params[0];
        op = event_params[1].match(/^[!==<>]{1,3}/);

        if (op) {
            this.operator = op[0];
            this.value = event_params[1].substring(this.operator.length);
        } else {
            this.operator = '===';
            this.value = event_params[1];
        }

        break;
    }
};

})();

