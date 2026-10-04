/**
*
* sound-fx.js
*
* Copyright (C) 2014 Kano Computing Ltd
* License: GNU General Public License v2 http://www.gnu.org/licenses/gpl-2.0.txt
*
* Description: Sound FX Definitions.
*/

var Sound = {};

(function() {
'use strict';

Sound = function(file) {
    this.file = file;
};

Sound.prototype.play = function() {
    backend.call('play_sound', this.file, function() {
    });
};

})();


var SoundFX = {};

(function() {
'use strict';

SoundFX = {
    make     : new Sound('../../kano-media/sounds/kano_make.wav'),
    complete : new Sound('../../kano-media/sounds/kano_challenge_complete.wav'),
    block    : {
        grab    : new Sound('../../kano-media/sounds/blocks/kano_blocks_grab.wav'),
        release : new Sound('../../kano-media/sounds/blocks/kano_blocks_ungrab.wav')
    }
};

})();
