/**
* Copyright (C) 2014 Kano Computing Ltd
* License: GNU General Public License v2 http://www.gnu.org/licenses/gpl-2.0.txt
*
* Author: Tom Bettany <tom.bettany@kano.me>
* Description: Commonly used utility functions
*/

var Utilities = {};

(function() {
'use strict';

/**
 * Converts an array of blocks into an array of block types.
 * @param  {block[]}   The blocks to be converted into types
 * @return {string[]}  The types of the given blocks
 */
Utilities.blocksToBlockTypes = function(blocks) {
    var blockInfo = Utilities.blocksToBlockInfo(blocks),
        types = [];

    for (var x = 0, len = blockInfo.length; x < len; x++) {
        types.push(blockInfo[x].Type);
    }

    return types;
};

Utilities.idToInputLabel = function(block, label) {
    var blockInfo = Utilities.blocksToBlockInfo([block], true);

    try {
        return blockInfo[0].labels[label];
    } catch (err) {
        return label;
    }
};

Utilities.blocksToBlockInfo = function(blocks, isChild) {
    var blockInfo = [],
        lst,
        item,
        row,
        block,
        id,
        label,
        val,
        parent,
        childrenNodes,
        dropdownInputsKeys = [
            'PLAYER',
            'VALUE',
            'OPERATORS',
            'CHAR',
            'DIRECTION',
            'COORD',
            'SPEED',
            'ITEM',
            'TYPE',
            'SOUNDS',
            'SOUND',
            'SCENE',
            'IMAGES'
        ],
        nestedBlocksTypes = [
            'controls_repeat_ext',
            'api_xyzPlugIn',
            'api_getBlock',
            'api_PostToChat',
            'setVariable',
            'api_sleep'
        ],
        childrenIDS = [];

    var isAChild = function(block_id) {
        return childrenIDS.indexOf(block_id) > -1 ? true : false;
    };

    //check if blocks is just an object
    if (!(blocks instanceof Array)) {
        blocks = [blocks];
    }

    for (var x = 0; x < blocks.length; x++) {

        //Check if block is an object and is not a child, so that children nodes are generated only inside their parent block
        if (typeof blocks[x] === 'object' && !isAChild (blocks[x].id)) {

            block = {
                id: blocks[x].id,
                Type: blocks[x].type,
                labels: {},
                inputs: {},
                hasDropdownInput: false
            };
            lst = blocks[x].inputList;

            if (lst) {

                for (var obj = 0, len = lst.length; obj < len; obj++) {
                    item = lst[obj];
                    row = lst[obj].titleRow;

                    // Attempt to stop blocks failing when sharing with a math_arithmetic block
                    if (row.length === 0 && item.name == 'A') {
                        // An input plug at the start of of logic boolean or a number arithmetuc block
                        id = item.name;
                        val = 'input';
                    } else if (row[0]) {
                        label = row[0].text_;

                        if (row.length === 2 || row.length === 3) {
                            // An input with a text box
                            label = row[0].text_;
                            id    = row[row.length - 1].name;
                            val   = row[row.length - 1].text_;

                            if (id === undefined) {
                                if (row[0].src_ && row[2].src_) {
                                    if (row[0].src_.indexOf('quote') !== -1
                                            && row[2].src_.indexOf('quote') !== -1) {  // String block with quotes
                                        id = row[1].name;
                                        val = row[1].text_;
                                        label=id;
                                    }
                                } else {  // Dropdown
                                    id = row[0].name;
                                    val = label;
                                    label = id;
                                }
                            }
                        } else {
                            if (item.name === '' && !row[0].name) {
                                // Not an input
                                continue;
                            }

                            id = row[0].name;
                            val = label;

                            if (id === undefined) {
                                // An input plug
                                id = item.name;
                                val = 'input';
                            } else {
                                // A text input
                                label = id;
                            }
                        }
                    }

                    block.labels[id] = label;
                    block.inputs[id] = val;
                }
            }

            //Getting info on the parent only if it is not a child
            if (blocks[x].parentBlock_ && !isChild){
                parent=[];
                parent.push(blocks[x].parentBlock_);
                block.parentBlock = Utilities.blocksToBlockInfo(parent);
            }

            if (nestedBlocksTypes.indexOf(blocks[x].type) > -1) {

                //Getting info on the children nodes, if any
                if (blocks[x].childBlocks_ && blocks[x].childBlocks_.length>0 ) {
                    childrenNodes=[];

                    for (var index in blocks[x].childBlocks_) {
                        childrenIDS.push(blocks[x].childBlocks_[index].id);
                        childrenNodes.push(blocks[x].childBlocks_[index]);
                    }

                    block.childBlocks = Utilities.blocksToBlockInfo(childrenNodes, true);
                }

            }


            // Check if has dropdown input
            for (var index in dropdownInputsKeys){

                if (dropdownInputsKeys[index] in blocks[x]) {
                    block.hasDropdownInput = true;
                    block.dropdownValuesKey = dropdownInputsKeys[index];
                }
            }

            blockInfo.push(block);
        }
    }
    return blockInfo;
};

/**
 * Retrieves list of blocks in the workspace
 * (from top to bottom with child blocks listed after their parents)
 * @param  {boolean}  sorted  Whether the blocks should be sorted from top to bottom
 * @return {blocks[]}         The blocks in the workspace
 */
Utilities.getBlocks = function(sorted, ignoreDefaults) {
    var steps = [],
        workspace,
        blocks;

    try {
        workspace = Blockly.mainWorkspace;
        blocks = workspace.getTopBlocks(sorted);
    } catch (e) {
        return [];
    }

    return Utilities.getChildChain(blocks, ignoreDefaults);
};

Utilities.getBlockFromId = function(id) {
   var blocks = Utilities.getBlocks(false, false);

    for (var x = 0, len = blocks.length; x < len; x++) {
        if (blocks[x].id === id) {
            return blocks[x];
        }
    }
};

Utilities.getChildChain = function(blocks, ignoreDefaults) {
    var blockChain = [],
        len        = blocks.length,
        children;

    if (len === 1 || len === undefined) {
        blocks = blocks[0] || blocks;
        blockChain.push(blocks);
        blockChain = blockChain.concat(Utilities.getChildChain(blocks.getChildren(), ignoreDefaults));
        return blockChain;
    }

    for (var x = 0; x < len; x++) {
        children = Utilities.getChildChain(blocks[x], ignoreDefaults);

        if (children.length > 0 && ignoreDefaults === true) {
            children = Utilities.removeDefaultChildren(blocks[x], children);
        }

        blockChain = blockChain.concat(children);
    }

    return blockChain;
};

Utilities.getBlocksInfo = function(sorted, ignoreDefaults) {
    return Utilities.blocksToBlockInfo(Utilities.getBlocks(sorted, ignoreDefaults));
};

Utilities.defaultChildBlocks = {};

Utilities.getDefaultChildBlocks = (function() {
    var parser,
        xmlToolbox,
        xmlBlocks,
        joinedBlocks,
        defaultChildBlocks = [];

    if (window.DOMParser) {
        parser = new DOMParser();
        xmlToolbox = parser.parseFromString(toolbox.playgroundunlockedtoolbox(), 'text/xml');
    }

    xmlBlocks = xmlToolbox.getElementsByTagName('block');
    for (var x = 0; x < xmlBlocks.length; x++) {
        joinedBlocks = {};

        joinedBlocks.parent = xmlBlocks[x].parentNode.parentNode.getAttribute('type');
        if (joinedBlocks.parent !== null) {
            joinedBlocks.child = xmlBlocks[x].getAttribute('type');

            defaultChildBlocks.push(joinedBlocks);
        }
    }

    Utilities.defaultChildBlocks = defaultChildBlocks;
})();

Utilities.isChildDefault = function(parent, child) {
    var families = Utilities.defaultChildBlocks;

    for (var x = 0; x < families.length; x++) {
        if (families[x].parent === parent && families[x].child === child) {
            return true;
        }
    }

    return false;
};

Utilities.removeDefaultChildren = function(parent, children) {
    var removedList = [],
        parentType = parent.type,
        child,
        childType;

    for (var x = 0; x < children.length; x++) {
        child = children[x];
        childType = child.type;

        if (!Utilities.isChildDefault(parentType, childType)) {
            removedList.push(child);
        }
    }

    return removedList;
};

/**
 * Retrieves an array of the block types within the workspace.
 * @param  {boolean}  sorted  Should the returned blocks be ordered?
 * @return {string[]}         Array of block types within the workspace
 */
Utilities.getBlocksTypes = function(sorted, ignoreDefaults) {
    var blocks = Utilities.getBlocks(sorted, ignoreDefaults);

    return Utilities.blocksToBlockTypes(blocks);
};

Utilities.blockTypeToName = function(type) {
    // Remove pong/api prefix
    type = type.replace('pong_', '');
    type = type.replace('api_', '');

    // Insert spaces between camelCase words
    type = type.replace(/([A-Z])/g, ' $1');

    // Convert _ and - to spaces
    type = type.replace(/[_-]/g, ' ');

    // Convert to title case
    type = Utilities.toTitleCase(type);

    return type;
};

Utilities.toTitleCase = function(str) {
    return str.replace(/\w\S*/g,
                       function(txt) {
                           return txt.charAt(0).toUpperCase() +
                                  txt.substr(1).toLowerCase();
                       });
};

Utilities.sanitise = function(str) {
    return str.replace(/[^a-z 0-9]+/gi, '');
};

Utilities.isMenu = function() {
    var href = location.href;

    if (href.indexOf('#project') === -1) {
        return true;
    } else {
        return false;
    }
};

Utilities.debug = function(block) {
    console.log(block);
};

if (!Array.prototype.last) {
    Array.prototype.last = function() {
        return this[this.length - 1];
    };
}

})();
