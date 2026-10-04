/**
* Copyright (C) 2014 Kano Computing Ltd
* License: GNU General Public License v2 http://www.gnu.org/licenses/gpl-2.0.txt
*
* Author: Tom Bettany <tom.bettany@kano.me>
* Description: A class to generate tutorial steps.
*/

var Steps = {};

(function() {
'use strict';

/**
 * Generates steps from the blocks on the workspace.
 */
Steps.generateSteps = function() {
    var category,
        categoryDiv,
        steps    = Utilities.getBlocksInfo(true, true),
        stepsXML = '<?xml version="1.0" encoding="UTF-8"?>\n' +
                   '<level>\n' +
                   '    <project>\n';

    var generateSetValueSteps = function (step) {
        for (var input in step.inputs) {

            if (step.inputs[input] !== 'input') {

                if (Steps.getLabelFromInput(input,step.labels)){
                    var label = Steps.getLabelFromInput(input,step.labels);
                    var progressor;

                    if (step.inputs[input] === '<') {
                        step.inputs[input]='lessThan';
                    }

                    //pong_ball block has both dropdown and text input, so treat it differently
                    if (step.Type === 'pong_ball') {
                        if (label === 'IMAGE') {
                            progressor = 'dropdownInputChange+' + label + '+' + step.inputs[input];
                        } else {
                            progressor = 'textInputChange+' + label + '+===' + step.inputs[input];
                        }
                    } else {
                        // Check if it is a dropdown input and it is not the math_arithmetic or the logic_compare blocks
                        if (step.hasDropdownInput
                            && step.Type !== 'math_arithmetic'
                            && step.Type !== 'logic_compare') {

                            progressor = 'dropdownInputChange+' + label + '+' + step.inputs[input];
                        } else if (step.Type === 'math_arithmetic' || step.Type === 'logic_compare') {
                            progressor = 'dropdownInputChange+' + label + '+' + Steps.mapToHTMLOperator(step.inputs[input]);
                        } else if (step.Type === 'colour_picker') {
                            progressor = 'colourInputChange+COLOUR';
                            step.inputs[input] = 'a colour';
                        } else {
                            progressor = 'textInputChange+' + label + '+===' + step.inputs[input];
                        }
                    }

                    stepsXML += Steps.generateStepXML('',
                                                      'Set ' + label + ' to ' + step.inputs[input],
                                                      'l',
                                                      progressor);
                }
            }
        }
    };

    for (var x = 0, len = steps.length; x < len; x++) {
        category    = Steps.getCategoryFromType(steps[x].Type);

        // Skip step if the block isn't in the menu.
        if (category) {
            categoryDiv = 'div.blocks-tree-' + category.replace(' ', '-').toLowerCase();

            // Category selection
            stepsXML += Steps.generateStepXML(categoryDiv,
                                              'Select the ' + Utilities.toTitleCase(category) + ' category',
                                              'l',
                                              'buttonPress+' + categoryDiv);


            // Block selection
            stepsXML += Steps.generateStepXML('g.flyout.svgBlock-' + steps[x].Type,
                                              'Choose the ' +
                                                  Utilities.blockTypeToName(steps[x].Type) +
                                                  ' block',
                                              'l',
                                              'blockAdd+' + steps[x].Type);

            //Check if it should be attached to some other blocks
            if (steps[x].parentBlock) {

              stepsXML += Steps.generateStepXML('',
                                                'Connect to the ' + Utilities.blockTypeToName(steps[x].parentBlock[0].Type) + ' block',
                                                'l',
                                                'blockConnect+' + steps[x].parentBlock[0].Type + '+' + steps[x].Type);
            }

            //generate steps to set the value on inner inputs
            generateSetValueSteps(steps[x]);

            //generate steps to set the values on inner inputs of children nodes
            if (steps[x].childBlocks) {
                for (var index in steps[x].childBlocks) {
                    generateSetValueSteps(steps[x].childBlocks[index]);
                }
            }
        }
        // Check if it already comes connected to a parent block
        else if (steps[x].parentBlock) {
            generateSetValueSteps(steps[x]);
        }
    }

    // Add an instruction to Make and then finish up the xml.
    stepsXML += Steps.generateStepXML('#runButton', 'Make', 'd', 'NONE') +
                '    </project>\n' +
                '</level>';
    return stepsXML;
};

/**
*  It maps the symbol operators (+,-,x,÷,^,...) to HTML unicode characters
*/
Steps.mapToHTMLOperator = function(operator) {
    switch (operator) {
    case '÷':
        return '&#247;';
    case '+':
        return '&#43;';
    case '-':
        return '&#45;';
    case '×':
        return '&#215;';
    case '^':
        return '&#94;';
    case '≠':
        return '&#8800;';
    case '=':
        return '&#61;';
    case '≤':
        return '&#8804;';
    case 'lessThan':
        return '&#60;';
    case '≥':
        return '&#8805;';
    case '>':
        return '&#62;';
    }

};

/**
 * Map the input into the label to show it to the user.
 */
Steps.getLabelFromInput = function(input, labels) {
    for (var label in labels) {
        if (label==input) {
            return labels[label];
        }
    }

    return;
};

Steps.generateStepXML = function(position, tip, direction, progressor) {
    return '        <step>\n' +
           '            <position>' + position + '</position>\n' +
           '            <tip>' + tip + '</tip>\n' +
           '            <direction>' + direction + '</direction>\n' +
           '            <progressor>' + progressor + '</progressor>\n' +
           '        </step>\n';
};

Steps.getCategoryFromType = function(type) {
    var parser,
        xmlToolbox,
        xmlCategories,
        xmlBlocks,
        cat_no,
        block_no;

    if (!window.DOMParser) {
        return false;
    }

    parser = new DOMParser();
    xmlToolbox = parser.parseFromString(toolbox.playgroundunlockedtoolbox(), 'text/xml');
    xmlCategories = xmlToolbox.getElementsByTagName('category');
    cat_no = xmlCategories.length;

    for (var x = 0; x < cat_no; x++) {
        xmlBlocks = xmlCategories[x].getElementsByTagName('block');
        block_no = xmlBlocks.length;

        for (var i = 0; i < block_no; i++) {
            if (xmlBlocks[i].getAttribute('type') === type) {
                return xmlCategories[x].getAttribute('name');
            }
        }
    }

    return false;
};

})();
