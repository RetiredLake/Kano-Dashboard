/**
* Copyright (C) 2014 Kano Computing Ltd
* License: GNU General Public License v2 http://www.gnu.org/licenses/gpl-2.0.txt
*
* Author: Tom Bettany <tom.bettany@kano.me>
* Description: A class to create and cycle through tutorial messages
*/

var Pointer = {};

(function() {
'use strict';

/**
 * A class to create and cycle through tutorial messages with
 * @param selector          The selector of the containing element to be directed
 * @param content           An array of content to be displayed
 *                            Can be formatted with HTML
 *                            e.g. ["First message", "Second message"]
 * @param position          An array of positions.
 *                            Can take the form of a list of selectors or coordinates for the display
 *                            Inserting a "hide" element will hide the tutorial for that step.
 *                            e.g. [["100px","100px"],"myselector",["200px","150px"],"hide"]
 * @param direction         An array of directions
 *                            r  for the message to appear to the left
 *                            u  for the message to appear beneath
 *                            l  for the message to appear to the right
 *                            d  for the message to appear above
 *                      [other]  message will appear at the bottom.
 *                            e.g. ['u', 'd', 'l', 'l', 'r']
 * @param progressSelector  An array of selectors which will be used to trigger progress through the steps
 *                            e.g. ["selector1","selector2"]
 */
Pointer = function(selector, content, position, direction, progressSelector) {

    // Validate inputs.
    if (content.length !== direction.length
        || content.length !== position.length
        || content.length !== progressSelector.length) {
        console.log('The length of the content, position, direction and '
                    + 'progress selector arrays must be the same.');
        return -1;
    }

    // Initialization variables
    this.selector = document.getElementById(selector);
    this.shown = true;

    // Computed values
    this.currentStep = 1;
    this.maxSteps = content.length;

    this.progress_bar = new ChallengeProgressBar({
        max_steps: this.maxSteps
    });

    this.workspace_history = new WorkspaceHistory({
        step_count: this.maxSteps,
        events: progressSelector,
        tip_messages: content,
        positions: position,
        directions: direction,
        progressors: progressSelector
    });

    var self = this;

    try {
        // Make sure that we can't see the tutorial in playground mode.
        document.getElementById('playground')
                .addEventListener('click',
                                  function() {
                                      self.hide();
                                  },
                                  false);
    } catch (e) {

    }

    this.addListeners();

    this.draw();
};

Pointer.prototype.getStep = function(offset) {
    offset = offset || 0;

    return this.workspace_history.get(this.currentStep + offset);
};

Pointer.prototype.addListeners = function() {
    var self = this;

    var blockAddHandler = function(evt) {
        self._reset_furthest_step();

        if (self.getStep().event_type !== 'blockAdd') {
            return;
        }

        var block = evt.blocksChanged.type;

        for (var x = 0, len = block.length; x < len; x++) {
            if (block === self.getStep().progressor_tree[x]) {
                //check if the following step suggests to set an already selected value
                skipStepIfDefaultValue(evt.blocksChanged);
                self.showNext();

                return;
            }
        }



        self.showPrevious();
    };

    var skipStepIfDefaultValue = function (block) {
        var nextStep = self.getStep(1);
                if (nextStep.event_type === 'dropdownInputChange') {
                    var info_block = Utilities.blocksToBlockInfo(block)[0];
                    var default_value = info_block.inputs[info_block.dropdownValuesKey];
                    if (default_value === nextStep.value) {
                        self.showNext();
                    }
                }
                return;
    };

    var flyoutCloseHandler = function() {
        if (self.getStep().event_type !== 'blockAdd' || self.currentStep === self.maxSteps) {
            return;
        }

        setTimeout(
            function() {
                self.showPrevious();
            }, 100);
    };

    var textInputChangeHandler = function(evt) {
        self._reset_furthest_step();

        var operator;
        var objectToCompare;

        if (self.getStep().event_type !== 'textInputChange') {
            return;
        }

        var change = evt.blocksChanged,
            block = change.sourceBlock_,
            fieldName = change.name,
            fieldText = change.text_;

        if (self.getStep().parent) {
            // We don't want to change the previous block added
            self.getStep().progressor_tree.push(self.getStep().parent);
        }

        for (var i = 0, len = self.getStep().progressor_tree.length; i < len; i++) {

            if (block.type === self.getStep().progressor_tree[i]) {
                if (fieldName === self.getStep().field && fieldText.length > 0) {
                    // I don't see a way around eval without having a case for each operation :-(
                    if (eval('"' + fieldText + '"' + self.getStep().operator + '"' + self.getStep().value + '"')) {
                        self.showNext();
                        return;
                    }
                }
            }
        }
    };

    var dropdownInputChangeHandler = function(evt) {
        self._reset_furthest_step();

        if (self.getStep().event_type !== 'dropdownInputChange') {
            return;
        }

        var change = evt.blocksChanged,
            block = change.sourceBlock_,
            dropdownText = change.value_;

        for (var i = 0, len = self.getStep().progressor_tree.length; i < len; i++) {
            if (block.type === self.getStep().progressor_tree[i]) {
                if (dropdownText === self.getStep().value) {
                    self.showNext();
                    return;
                }
            }
        }
    };

    var colourInputChangeHandler = function(evt) {
        self._reset_furthest_step();

        if (self.getStep().event_type !== 'colourInputChange') {
            return;
        }

        var change = evt.blocksChanged,
            block = change.sourceBlock_;

        for (var i = 0, len = self.getStep().progressor_tree.length; i < len; i++) {
            if (block.type === self.getStep().progressor_tree[i]) {
                self.showNext();
                return;
            }
        }
    };

    var blockConnectHandler = function(evt) {
        self._reset_furthest_step();

        if (self.getStep().event_type !== 'blockConnect') {
            return;
        }

        // Blocks sent by the blockConnect event
        var change = evt.blocksChanged;

        // Check the blocks sent by the blockConnect event are the same as the ones
        // listed in the tutorial
        if (change[0].type == self.getStep().parent
            && change[1].type == self.getStep().child) {

            self.showNext();
            return;
        }
    };

    var blockMouseReleaseHandler = function(evt) {
        self._reset_furthest_step();

        var block = evt.blocksChanged,
            id = block.id,
            type = Utilities.getBlockFromId(id).type;

        if (self.getStep().progressor_tree[0] === type
            && (self.getStep().selected_id.length === 0
                || Utilities.getBlockFromId(self.getStep().selected_id.last()).type !== type)) {

                self.getStep().selected_id.push(id);
        }
    };

    var blockOrphanedHandler = function(evt) {
        var currentStep = self.getStep() || {},
            currentBlockType = currentStep.child,
            orphanedBlockType = evt.blocksChanged;

        if (currentBlockType === orphanedBlockType) {
            AlertsMessages.error.displayMsg(
                'Your block has been removed, please try again',
                5000
            );
            self.undo();
        }
    };

    var canvas;

    try {
        canvas = Blockly.mainWorkspace.getCanvas();
    } catch(e) {
        // There is no workspace canvas, return gracefully.
        return;
    }

    // Attach event listeners.
    canvas.addEventListener('blockAdd',
                            blockAddHandler,
                            false);

    canvas.addEventListener('textInputChange',
                            textInputChangeHandler,
                            false);

    canvas.addEventListener('dropdownInputChange',
                            dropdownInputChangeHandler,
                            false);

    canvas.addEventListener('colourInputChange',
                            colourInputChangeHandler,
                            false);

    canvas.addEventListener('flyoutClose',
                            flyoutCloseHandler,
                            false);

    canvas.addEventListener("blockConnect",
                            blockConnectHandler,
                            false);

    canvas.addEventListener("blockMouseRelease",
                            blockMouseReleaseHandler,
                            false);

    canvas.addEventListener("blockOrphaned",
                            blockOrphanedHandler,
                            false);
};

Pointer.prototype._reset_furthest_step = function() {
    // Need to guard against restoring as it triggers all the event listeners
    if (!this._is_currently_restoring) {
        this.progress_bar.reset_furthest_step(this.currentStep);
    }
};

Pointer.prototype._restore_workspace = function() {
    this._is_currently_restoring = true;
    this.workspace_history.restore(this.currentStep);
    this._is_currently_restoring = false;

};

/**
 * Moves to the next tutorial message
 * @return {int}  0 Success
 *               -1 Already on the last message
 */
Pointer.prototype.showNext = function(params) {
    if (this.currentStep < this.maxSteps) {
        this.workspace_history.save(this.currentStep);

        this.currentStep++;
        this.progress_bar.update(this.currentStep);

        if (params && params.restore_history) {
            this._restore_workspace();
        }

        this.draw();

        return 0;
    } else {
        this.hide();
    }
};

/**
 * Moves to the previous message
 * @return {int}  0 Success
 *               -1 Already on the first message
 */
Pointer.prototype.showPrevious = function() {
    if (this.currentStep > 1) {
        this.workspace_history.save(this.currentStep);

        this.currentStep--;
        this.progress_bar.update(this.currentStep);

        if (!this._is_next_step_valid()) {
            this._reset_furthest_step();
        }

        this._restore_workspace();
        this.draw();

        return 0;
    } else {
        return -1;
    }
};

/**
 * Resets the current step
 */
Pointer.prototype.resetStep = function() {
    this.addListeners();
    this.draw();
    // FIXME: Need to remove old event listener.
    // FIXME: Need to handle a flyout return caused
    //        by re-initialising the workspace
};

/**
 * Fills the supplied selector with the current tutorial step
 */
Pointer.prototype.draw = function() {
    var coordinates = this.parsePosition(this.getStep().position);

    // Escape if we are told not to draw for this step.
    if (coordinates === 0)
    {
        this.updateListeners();
        this.hide();
        return;
    }

    coordinates = this.ensureCoordinatesOnScreen(coordinates);

	// Content
    var contentWrapperHeader = '<div class = \'tutorialContent\'>';
    var contentWrapperFooter = '</div>';

    this.selector.innerHTML = contentWrapperHeader +
                                this.getStep().tip_message +
                                contentWrapperFooter;

    this.selector.resetStyles = function() {
        this.classList.remove('default');
        this.classList.remove('up');
        this.classList.remove('down');
        this.classList.remove('left');
        this.classList.remove('right');

        this.style.top = 'auto';
        this.style.bottom = 'auto';
        this.style.left = 'auto';
        this.style.right = 'auto';
        this.style.position = '';
    };

    this.selector.centre = function() {
        this.style.left = 0;
        this.style.right = 0;
        this.style.marginLeft = 'auto';
        this.style.marginRight = 'auto';
        this.style.position = 'relative';
    };

    this.selector.resetStyles();

    switch ((coordinates === -1) || this.getStep().direction) {
        case 'r':
            // Message on the left
            this.selector.style.right = coordinates[0];
            this.selector.style.top = coordinates[1];
            this.selector.classList.add('right');
            break;
        case 'u':
            // Message beneath
            this.selector.style.left = coordinates[0];
            this.selector.style.top = coordinates[1];
            this.selector.classList.add('up');
            break;
        case 'l':
            // Message on the right
            this.selector.style.left = coordinates[0];
            this.selector.style.top = coordinates[1];
            this.selector.classList.add('left');
            break;
        case 'd':
            // Message on the top
            this.selector.style.left = coordinates[0];
            this.selector.style.bottom = coordinates[1];
            this.selector.classList.add('down');
            break;
        case 'manual':
            // Place the message with no arrow manually
            if (coordinates[0] === 'auto') {
                this.selector.centre();
            } else {
                this.selector.style.left = coordinates[0];
            }

            this.selector.style.top = coordinates[1];
            break;
        default:
            // Centre the hint at the top of teh screen
            this.selector.classList.add('default');
            // Use this to put the message at the top of the screen
            this.selector.style.top = '10px';
            this.selector.centre();
    }

    this.updateListeners();

    if (this.shown)
        this.show();
};

/**
 * Create an array of coordinate positions from a mixture of coordinates and selectors
 * @param  {string}   position A set of coordinates or a selector
 * @return {string[]}          A 2 dimensional array of coordinate positions
 */
Pointer.prototype.parsePosition = function(position) {
    if (position.length === 2) {
        // This is already a coordinate
        return position;
    }

    // FIXME : Position does not match properly if === is used
    if (position == 'hide') {
        // We want the element to be hidden for this step.
        return 0;
    }

    var splitPos = position.split('+'),
        self = this;

    var parseBlockStr = function(str) {
        var offset = {
                x: 170 + Blockly.mainWorkspace.scrollX,
                y: -55 + Blockly.mainWorkspace.scrollY
            },
            selected = Utilities.getBlockFromId(self.getStep().selected_id.last()),
            conns;

        switch (str) {
        case '':
            var size = selected.svg_.svgGroup_.getBBox(),
                pos  = selected.getRelativeToSurfaceXY();

            return [(pos.x + offset.x + size.width) + 'px',
                    (pos.y + offset.y + (size.height / 2)) + 'px'];

        case 'Child':
            conns = selected.getConnections_();

            for (var x = 0, len = conns.length; x < len; x++) {
                if (conns[x].label === splitPos[1]) {
                    self.getStep().selected_id.push(conns[x].targetConnection.sourceBlock_.id);

                    break;
                }
            }

            return self.parsePosition(splitPos.slice(2).join('+'));

        case 'Input':
            try {
                conns = selected.getConnections_();
            } catch (e) {
                e.description = 'Could not get connections.';
                console.log(e);
                return -1;
            }

            for (var x = 0, len = conns.length; x < len; x++) {
                if (conns[x].label === splitPos[1]) {
                    return [(conns[x].x_ + offset.x) + 'px',
                            (conns[x].y_ + offset.y) + 'px'];
                }

            }
        }
    };

    var prevStr = 'previous',
        workspaceStr = 'workspace';

    /**
     * The 'workspace' prefix allows selection
     * of blocks already on the workspace
     */
    if (position.indexOf(workspaceStr) === 0) {
        var blocks = Utilities.getBlocks(),
            blockStr = splitPos[0].substr(workspaceStr.length);

        // Find the correct block in the workspace
        for (var x = 0, len = blocks.length; x < len; x++) {
            if (blocks[x].type === splitPos[1]) {
                this.getStep().selected_id.push(blocks[x].id);
                splitPos.splice(1, 1);
            }
        }

        return parseBlockStr(blockStr);
    }

    /**
     * The 'previous' prefix uses the last selected block
     */
    if (position.indexOf(prevStr) === 0) {
        var prev = splitPos[0].substr(prevStr.length);

        while (prev[0] === '^') {
            this.getStep().selected_id.pop();
            prev = prev.slice(1);
        }

        return parseBlockStr(prev);
    }

    // This is a selector, so translate it.
    return this.getCoordinatesOfSelector(position, this.getStep().direction);
};

/**
 * Prevents coordinates which would cause the tips to be offscreen from being returned
 * @param  {string[]}   position A set of coordinates to check
 * @return {string[]}            Validated coordinates
 */
Pointer.prototype.ensureCoordinatesOnScreen = function(coords) {
    if (coords.length !== 2) {
        return coords;
    }

    var x = parseInt(coords[0].replace('px','')),
        y = parseInt(coords[1].replace('px', '')),
        screenWidth = document.body.clientWidth,
        offset = {
            x: 100,
            y: 40
        };

    if (isNaN(x) || isNaN(y)) {
        return coords;
    }

    if (x > screenWidth - offset.x
        && this.getStep().direction === 'l') {

        this.getStep().direction = 'r';
        x = screenWidth + offset.x - x;
        y += offset.y;
    }

    x += 'px';
    y += 'px';

    return [x, y];
};

/**
 * Calculates the position of an element from its selector
 * @param {string} selector       The selector to be pointing to
 * @param {int}    direction   r  for the message to appear to the left
 *                             u  for the message to appear beneath
 *                             l  for the message to appear to the right
 *                             d  for the message to appear above
 * @return {string[]}             A 2 dimensional array of coordinates
 */
Pointer.prototype.getCoordinatesOfSelector = function(selector, direction) {
    var xOffset = 20,
        yOffset = -40,
        selectorElement,
        selectorPosition;

    try {
        selectorElement = document.querySelector(selector);
        selectorPosition = selectorElement.getBoundingClientRect();
    } catch (e) {
        e.description = 'Selector not found';
        console.log(e);
        return -1;
    }

    switch (direction) {
    case 'r':
        // Left
        return [(document.body.clientWidth - selectorPosition.left) + 'px',
                selectorPosition.top + yOffset + 'px'];
    case 'u':
        // Beneath
        return [(1.5 * selectorPosition.left - 0.5 * selectorPosition.right) + 'px',
                (selectorPosition.bottom + 20) + 'px'];
    case 'l':
        // Right
        return [(selectorPosition.right + xOffset) + 'px',
                (selectorPosition.top + yOffset) + 'px'];
    case 'd':
        // Above
        return [(0.6 * selectorPosition.left + 0.4 * selectorPosition.right - 120) + 'px',
                (30 + document.body.clientHeight - selectorPosition.top) + 'px'];
    default:
        console.log('Direction not found');
        return [selectorPosition.right + 'px',
                selectorPosition.top + 'px'];
    }
};

/**
 * Hides the tutorial
 */
Pointer.prototype.hide = function() {
    this.selector.style.display = 'none';
};

/**
 * Shows the tutorial
 */
Pointer.prototype.show = function() {
    this.selector.style.display = 'block';
};

/**
 * Adds an event listener to the selector, for the current step, used to progress through the steps
 * Event types:
 *    buttonPress
 *    blockAdd
 *    textInputChange
 *    dropdownInputChange
 */
Pointer.prototype.updateListeners = function() {
    // Remove prior button press handler to prevent it being registered twice
    if (this._buttonPressHandler) {
        this._registeredButton
            .removeEventListener('mouseup',
                                 this._buttonPressHandler,
                                 false);

        this._registeredButton = null;
        this._buttonPressHandler = null;
    }

    /**
     * buttonPress events are different because the listener
     * changes and needs to be removed after being triggered
     */
    switch(this.getStep().event_type) {
    case 'buttonPress':
        var self = this;

        this._registeredButton = document.querySelector(this.getStep().button);
        this._buttonPressHandler = function() {
            self.showNext();
        };

        this._registeredButton
            .addEventListener('mouseup',
                              this._buttonPressHandler,
                              false);
        break;
    case 'blockAdd':
        this.getStep().progressor_tree = [this.getStep().block];
        break;
    }
};

/**
 * Retrieves the current step of tutorial
 * @return {int}  The current progress
 */
Pointer.prototype.getProgress = function() {
    return this.currentStep;
};

/**
 * Sets the current progress
 * TODO: Implement updating of the step and switching event listeners.
 * @param {int} progress  The step to set the tutorial to
 */
Pointer.prototype.setProgress = function(progress) {
    this.currentStep = progress;
};

/**
 * Sets whether the object should be displayed
 * @param {Boolean} value  Should the object be displayed?
 *                           true   Display
 *                           false  Don't display
 */
Pointer.prototype.setShown = function(value) {
    this.shown = value;
    if (!this.shown)
        this.hide();
    else if (this.parsePosition(this.getStep().position) !== -1)
        this.show();
};

Pointer.prototype._skipped_undo_events = [
    'blockAdd',
    'textInputChange',
    'dropdownInputChange',
    'colourInputChange',
    'blockConnect'
];

Pointer.prototype._skipped_redo_events = [
    'buttonPress'
];

Pointer.prototype._is_next_step_valid = function() {
    var remaining_steps = this.progress_bar.furthest_step - this.currentStep;

    for (var step_no = 1, step; step_no < remaining_steps; step++) {
        step = this.getStep(step_no);

        if (this._skipped_redo_events.indexOf(step.event_type) === -1) {
            return true;
        }
    }

    return false;
};

Pointer.prototype.undo = function() {
    var event_type = this.getStep(-1).event_type;

    // Some events should be skipped as they lead to problems
    if (this._skipped_undo_events.indexOf(event_type) !== -1) {
        this.workspace_history.save(this.currentStep);
        this.currentStep--;

        this.undo();
    } else {
        this.showPrevious();
    }
};

Pointer.prototype.redo = function() {
    if (this.currentStep === this.progress_bar.furthest_step) {
        return;
    }

    var event_type = this.getStep(1).event_type;

    // Some events should be skipped as they lead to problems
    if (this._skipped_undo_events.indexOf(event_type) !== -1) {
        this.currentStep++;
        this.redo();
    } else {
        this.showNext({
            restore_history: true
        });
    }
};

})();
