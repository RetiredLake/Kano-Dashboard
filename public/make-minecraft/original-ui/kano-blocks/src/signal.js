/**
* Copyright (C) 2014 Kano Computing Ltd
* License: GNU General Public License v2 http://www.gnu.org/licenses/gpl-2.0.txt
*
* Author: Tom Bettany <tom.bettany@kano.me>
* Description: Handles keyboard signals.
*/

var Signal = {};

(function() {
'use strict';

Signal.save = function() {
    if (Utilities.isMenu()) {
        return;
    }

    IO.screenshot.refreshElements();
    location.hash='#saveDialog';
    IO.form.addListeners();
};

Signal.load = function(filepath) {
    if (filepath !== undefined) {
        IO.load.file.local.XMLfromFilename(filepath);
        return;
    }

    if (Utilities.isMenu()) {
        return;
    }

    location.hash='#loadSource';
};

Signal.share = function() {
    if (Utilities.isMenu()) {
        return;
    }

    IO.screenshot.refreshElements();
    location.hash='#shareDialog';
    IO.form.addListeners();
};

Signal.make = function() {
    if (Utilities.isMenu()) {
        return;
    }

    SoundFX.make.play();
    Stats.update();
    IO.screenshot.updateSrc();

    if ('Pong' in window) {
        Pong.savePythonScript();
    } else if ('Minecraft' in window) {
        Minecraft.savePythonScript();
    }
};

})();
