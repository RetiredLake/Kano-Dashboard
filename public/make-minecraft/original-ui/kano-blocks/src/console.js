/**
* Copyright (C) 2014 Kano Computing Ltd
* License: GNU General Public License v2 http://www.gnu.org/licenses/gpl-2.0.txt
*
* Author: Tom Bettany <tom.bettany@kano.me>
* Description: Overrides the console to log using Kano-Logger
*/

(function() {
'use strict';

var logger = {
    debug: false,
    console: console,
    log: function(type) {
        if (logger.debug) {
            logger.console[type].apply(logger.console, arguments[1]);
        }

        var args = [];
        for (var x = 0, len = arguments[1].length; x < len; x++) {
            args.push(arguments[1][x]);
        }

        backend.call('log', type, args);
    }
};

console = {
    assert: function() {
        logger.log('assert', arguments);
    },
    count: function() {
        logger.log('count', arguments);
    },
    debug: function() {
        logger.log('debug', arguments);
    },
    dir: function() {
        logger.log('dir', arguments);
    },
    dirxml: function() {
        logger.log('dirxml', arguments);
    },
    error: function() {
        logger.log('error', arguments);
    },
    group: function() {
        logger.log('group', arguments);
    },
    groupCollapsed: function() {
        logger.log('groupCollapsed', arguments);
    },
    groupEnd: function() {
        logger.log('groupEnd', arguments);
    },
    info: function() {
        logger.log('info', arguments);
    },
    log: function() {
        logger.log('log', arguments);
    },
    markTimeline: function() {
        logger.log('markTimeline', arguments);
    },
    profile: function() {
        logger.log('profile', arguments);
    },
    profileEnd: function() {
        logger.log('profileEnd', arguments);
    },
    time: function() {
        logger.log('time', arguments);
    },
    timeEnd: function() {
        logger.log('timeEnd', arguments);
    },
    timeStamp: function() {
        logger.log('timeStamp', arguments);
    },
    trace: function() {
        logger.log('trace', arguments);
    },
    warn: function() {
        logger.log('warn', arguments);
    }
};

})();
