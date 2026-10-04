/**
* Copyright (C) 2014 Kano Computing Ltd
* License: GNU General Public License v2 http://www.gnu.org/licenses/gpl-2.0.txt
*
* Author: Tom Bettany <tom.bettany@kano.me>
* Description: Alert message definitions
*/

var AlertsMessages = {};

(function() {
'use strict';

AlertsMessages.success = {};
AlertsMessages.hint = {};
AlertsMessages.error = {};
AlertsMessages.levelDone = {};

AlertsMessages.hideOnMake = function() {
    AlertsMessages.success.hide();
    AlertsMessages.hint.hide();
    AlertsMessages.error.hide();
};

AlertsMessages.hideAll = function() {
    AlertsMessages.hideOnMake();
    AlertsMessages.levelDone.hide();
};

(function() {
    function createMessages() {
        AlertsMessages.success = new Alerts('successAlert',
                                            ['<div class=\'success\'>' +
                                                 '<img src=\'../../kano-blocks/blockly/media/1x1.gif\' class=\'hint-icon success\'>' +
                                                 '<span class=\'hintlabel\'>GREAT!&nbsp;&nbsp;' +
                                                 '<span class=\'msg\'>' +
                                                 '</span></span>' +
                                             '</div>' +
                                             '<button class=\'closelabel\' onclick=\'AlertsMessages.success.hide()\'>' +
                                                 'OK' +
                                             '</button>'],
                                            [['auto', '10px']],
                                            ['manual'],
                                            ['.cross']);
        AlertsMessages.success.hide();

        AlertsMessages.hint = new Alerts('hintAlert',
                                         ['<div class=\'hint\'>' +
                                              '<img src=\'../../kano-blocks/blockly/media/1x1.gif\' class=\'hint-icon tip\'>' +
                                              '<span class=\'hintlabel\'>HINT!&nbsp;&nbsp;' +
                                              '<span class=\'msg\'>' +
                                              '</span></span>' +
                                          '</div>' +
                                          '<button class=\'closelabel\' onclick=\'AlertsMessages.hint.hide()\'>' +
                                              'OK' +
                                          '</button>'],
                                         [['auto', '10px']],
                                         ['manual'],
                                         ['.cross']);
        AlertsMessages.hint.hide();

        AlertsMessages.error = new Alerts('errorAlert',
                                          ['<div class=\'error\'>' +
                                               '<img src=\'../../kano-blocks/blockly/media/1x1.gif\' class=\'hint-icon error\'>' +
                                               '<span class=\'hintlabel\'>ERROR!&nbsp;&nbsp;' +
                                               '<span class=\'msg\'>' +
                                               '</span></span>' +
                                           '</div>' +
                                           '<button class=\'closelabel\' onclick=\'AlertsMessages.error.hide()\'>' +
                                               'OK' +
                                           '</button>'],
                                          [['auto', '10px']],
                                          ['manual'],
                                          ['.cross']);
        AlertsMessages.error.hide();

        AlertsMessages.levelDone = new Alerts('finishedLevelAlert',
                                          ['<div class=\'levelDone\'>' +
                                               '<img src=\'../../kano-blocks/blockly/media/1x1.gif\' class=\'hint-icon success\'>' +
                                               '<span class=\'hintlabel\'>CHALLENGE COMPLETE!&nbsp;&nbsp;' +
                                               '<span class=\'msg\'>' +
                                               '</span></span>' +
                                           '</div>' +
                                           '<button class=\'closelabel\' onclick=\'AlertsMessages.levelDone.hide(); Project.goToNext()\'>' +
                                               '<img src=\'../../kano-blocks/blockly/media/1x1.gif\' class=\'icon projectMenuIcons whiteRightArrow\'>' +
                                           '</button>'],
                                          [['auto', '10px']],
                                          ['manual'],
                                          ['.cross']);
        AlertsMessages.levelDone.hide();
    };

    window.addEventListener('load',
                            createMessages,
                            false);
})();

})();
