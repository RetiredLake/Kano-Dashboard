/**
* Copyright (C) 2014 Kano Computing Ltd
* License: GNU General Public License v2 http://www.gnu.org/licenses/gpl-2.0.txt
*
* Author: Tom Bettany <tom.bettany@kano.me>
* Description: Handles operations related to the cursor positioning and manipulation
*/

var Cursor = {};

(function() {
'use strict';

/**
 * Retrieves the current selection range.
 * @return {} selection range
 */
Cursor.getRange = function() {
    var sel   = document.getSelection(),
        range = sel.getRangeAt(0);

    return range;
};

/**
 * Retrieves the current cursor position.
 * @return {int} cursor position
 */
Cursor.getPos = function() {
    var preRange = Cursor.getRange(),
        range    = preRange.cloneRange(),
        node     = preRange.startContainer.parentNode,
        pos;

    range.selectNodeContents(node);
    range.setEnd(preRange.endContainer, preRange.endOffset);

    pos = range.toString().length;

    return pos;
};

/**
 * Set the cursor position.
 * @param {int}     pos     cursor position to set
 * @param {Element} target  element to place the cursor in
 */
Cursor.setPos = function(pos, target) {
    var sel   = document.getSelection(),
        range = Cursor.getRange();

    try {
        range.setStart(target || range.startContainer, Math.max(pos, 0));
        range.setEnd(target || range.startContainer, Math.max(pos, 0));
    } catch (e) {
        range.setStart(target || range.startContainer, range.START_TO_END);
        range.setEnd(target || range.startContainer, range.START_TO_END);
    }

    sel.removeAllRanges();
    sel.addRange(range);
};

Cursor.collapseTextNodes = function(node) {
    var nodeValue = node.nodeValue,
        wholeText = node.wholeText;

    if (nodeValue !== wholeText) {
        // Delete all the subnodes and create a new one with just the text
        var parent = node.parentNode;

        parent.innerHTML = '';
        parent.appendChild(document.createTextNode(wholeText));

        node = parent.firstChild;
    }

    return node;
};

/**
 * Deletes at the cursor position.
 */
Cursor.deleteAt = function(optArgs) {
    var node      = Cursor.getRange().startContainer,
        nodeValue = node.nodeValue,
        pos       = Cursor.getPos(),
        options   = optArgs || {},
        direction;

    if (options.offset) {
        pos += options.offset;
    }

    if (options.forward) {
        direction = 'next';
    } else {
        direction = 'prev';
    }

    if (pos === 0) {
        // delete keyword
        Cursor.deleteElement[direction](node.parentElement);
    } else if (nodeValue === null) {
        // not in a node, probably at end of string.
        // FIXME: This case isn't handled properly yet - mainly the enterNode fn
        Cursor.enterNode(node, pos);
        Cursor.deleteElement[direction](node.childNodes[pos - 1], 0);
    } else {
        Cursor.deleteChar[direction](node, pos);
    }
};

/**
 * Insertss at the cursor position.
 * @param {string} string  String to insert
 */
Cursor.insertAt = function(str) {
    var node      = Cursor.getRange().startContainer,
        pos       = Cursor.getPos(),
        nodeValue;

    node = Cursor.collapseTextNodes(node);
    nodeValue = node.nodeValue;

    node.nodeValue = nodeValue.substr(0, pos) +
                     str +
                     nodeValue.substr(pos);
    Cursor.setPos(pos + str.length);
};

/**
 * Deletes the element next to the provided one
 * @param {Element} node  reference node
 */
Cursor.deleteElement = {
    prev : function(node) {
        try {
            var prev = node.previousSibling;

            if (prev.className !== 'pln') {
                node.parentElement.removeChild(prev);
            }

            Cursor.joinPrevElement(node);
        } catch (e) {
        }
    },
    next: function(node) {
        try {
            var next = node.nextSibling;

            if (next.classname != 'pln') {
                node.parentElement.removeChild(prev);
            }

            Cursor.joinPrevElement(node);
        } catch (e) {
        }
    }
};

/**
 * Set the cursor inside a given node.
 * FIXME: Does not work!
 * @param {Element} node  element to descend into
 * @param {int}     pos   cursor position to set
 */
Cursor.enterNode = function(node, pos) {
    var child = node.childNodes[pos - 1];

    Cursor.setPos(0, child);
};

/**
 * Combines adjacent plain text elements into one tag.
 * @param {Element} node  current node
 */
Cursor.joinPrevElement = function(node) {
        var prev     = node.previousSibling,
            prevData = prev.firstChild.data,
            nodeData = node.firstChild.data;

        if (node.className === 'pln' && prev.className === 'pln') {
            var pos = prevData.length;

            // Remove any leading spaces before joining.
            if (nodeData[0] === ' ') {
                node.firstChild.data = nodeData.substr(1);
            }

            node.firstChild.data = prevData +
                                   nodeData;
            node.parentElement.removeChild(prev);
            Cursor.setPos(pos);
        }
};

/**
 * Deletes the character prior to the given position.
 * @param {Element} target  element in which to delete the character
 * @param {int}     pos     reference cursor position
 */
Cursor.deleteChar = (function() {
    var del = function(node, pos) {
        var nodeValue;

        node = Cursor.collapseTextNodes(node);
        nodeValue = node.nodeValue;

        node.nodeValue = nodeValue.substr(0, pos - 1) +
                         nodeValue.substr(pos);
        Cursor.setPos(pos - 1);
    };

    return {
        prev : function(node, pos) {
            del(node, pos);
        },
        next: function(node, pos) {
            del(node, pos + 1);
        }
    };
})();

/**
 * Moves the cursor to the end of its current selection.
 * FIXME: Not yet implemented
 */
Cursor.goToEnd = function() {
};

})();
