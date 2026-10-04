(function (root) {
    "use strict";

    var CHALLENGE_COUNT = 13;
    var PLAYGROUND = CHALLENGE_COUNT + 1;
    var PROGRESS_KEY = "kano.make-minecraft.port.progress.v1";
    var WORKSPACE_PREFIX = "kano.make-minecraft.port.workspace:";
    var frame = document.getElementById("game-frame");
    var runButton = document.getElementById("run-button");
    var nativeMode = new URLSearchParams(root.location.search).get("native") === "1";
    var workspace = null;
    var activeLevel = 1;
    var unlockedLevel = 1;
    var completed = {};
    var challengeSteps = [];
    var tipIndex = 0;
    var gameReady = false;
    var messageTimer = null;
    var previewTimer = null;

    function byId(id) {
        return document.getElementById(id);
    }

    function readStorage(key) {
        try { return root.localStorage.getItem(key); } catch (error) { return null; }
    }

    function writeStorage(key, value) {
        try { root.localStorage.setItem(key, value); } catch (error) { /* memory/session remains usable */ }
    }

    function gameUrl() {
        return location.pathname.indexOf("/handheld/project/web/") !== -1
            ? "../../../build/web/minecraftpe.html"
            : "minecraftpe.html";
    }

    function loadProgress() {
        try {
            var saved = JSON.parse(readStorage(PROGRESS_KEY) || "{}");
            completed = saved.completed && typeof saved.completed === "object" ? saved.completed : {};
            unlockedLevel = Math.max(1, Math.min(PLAYGROUND,
                Number(saved.unlockedLevel) || 1));
        } catch (error) {
            completed = {};
            unlockedLevel = 1;
        }
    }

    function saveProgress() {
        writeStorage(PROGRESS_KEY, JSON.stringify({
            unlockedLevel: unlockedLevel,
            completed: completed
        }));
    }

    function message(text) {
        var toast = byId("message-toast");
        toast.textContent = String(text || "");
        toast.classList.add("visible");
        if (messageTimer) root.clearTimeout(messageTimer);
        messageTimer = root.setTimeout(function () {
            toast.classList.remove("visible");
        }, 3400);
    }

    root.KanoMakeUI = { showMessage: message };

    function currentProject() {
        if (activeLevel === PLAYGROUND) {
            return root.Language.playground;
        }
        return root.Language.project[activeLevel];
    }

    function currentLevelTitle() {
        var data = currentProject();
        return data ? data.title : "PLAYGROUND";
    }

    function toolboxForLevel(level) {
        var toolboxLevel = Math.min(level, CHALLENGE_COUNT);
        var xmlText = root.toolbox.toolboxTemplate({ project: toolboxLevel });
        var xml = root.Blockly.KanoLegacy.migrateXml(xmlText);
        Array.prototype.slice.call(xml.querySelectorAll("category")).forEach(function (category) {
            var name = category.getAttribute("name") || "";
            if (name.slice(0, 2) === "x-" || !category.querySelector("block")) {
                category.parentNode.removeChild(category);
            }
        });
        return xml;
    }

    function challengeData(level) {
        var project = currentProject();
        var number = level === PLAYGROUND ? "PLAYGROUND" : "CHALLENGE " + level;
        byId("challenge-number").textContent = number;
        byId("challenge-title").textContent = project ? project.title : "MAKE MINECRAFT";
        byId("challenge-description").textContent = project ? project.description : "";
        byId("challenge-objective").textContent = project ? project.objective : "Everything";
    }

    function activeStep() {
        if (!challengeSteps.length) return null;
        return challengeSteps[Math.max(0, Math.min(tipIndex, challengeSteps.length - 1))];
    }

    function renderTip() {
        var step = activeStep();
        var count = challengeSteps.length || 1;
        byId("tip-step").textContent = "TIP " + (tipIndex + 1) + " / " + count;
        byId("tip-text").textContent = "";
        if (step) {
            // The recovered lesson XML contains markup such as <b>Make</b>.
            // Keep only the simple emphasis tags used by those authored tips.
            var markup = step.tip || "";
            markup = markup.replace(/<(?!\/?(?:b|strong|em)\b)[^>]*>/gi, "");
            byId("tip-text").innerHTML = markup;
        } else {
            byId("tip-text").textContent = "Explore the unlocked blocks and build something of your own.";
        }
        byId("tip-previous").disabled = tipIndex <= 0;
        byId("tip-next").disabled = tipIndex >= challengeSteps.length - 1;
        byId("tip-direction").textContent = step && step.direction === "l" ? "‹" : "›";
    }

    function renderChallengeList() {
        var container = byId("challenge-items");
        container.textContent = "";
        for (var level = 1; level <= PLAYGROUND; level++) {
            var accessible = level <= unlockedLevel;
            var isComplete = !!completed[level];
            var data = level === PLAYGROUND ? root.Language.playground : root.Language.project[level];
            var button = document.createElement("button");
            var number = document.createElement("span");
            var name = document.createElement("span");
            button.type = "button";
            button.className = "challenge-item" + (level === activeLevel ? " active" : "") +
                (isComplete ? " complete" : "");
            button.disabled = !accessible;
            number.className = "challenge-number";
            number.textContent = level === PLAYGROUND ? "★" : String(level);
            name.className = "challenge-name";
            name.textContent = data ? data.title : (level === PLAYGROUND ? "PLAYGROUND" : "CHALLENGE " + level);
            button.appendChild(number);
            button.appendChild(name);
            if (accessible) {
                button.addEventListener("click", (function (selected) {
                    return function () { selectLevel(selected); };
                }(level)));
            }
            container.appendChild(button);
        }
        var completedCount = 0;
        for (var i = 1; i <= CHALLENGE_COUNT; i++) {
            if (completed[i]) completedCount++;
        }
        byId("progress-count").textContent = completedCount + " / " + CHALLENGE_COUNT;
    }

    function updateToolbox(level) {
        var toolbox = workspace.getToolbox();
        if (!toolbox) return;

        if (level === 1) {
            if (toolbox.HtmlDiv) toolbox.HtmlDiv.style.display = "none";
            if (toolbox.flyout_ && toolbox.flyout_.hide) toolbox.flyout_.hide();
            root.Blockly.svgResize(workspace);
            return;
        }
        workspace.updateToolbox(toolboxForLevel(level));
        toolbox = workspace.getToolbox();
        if (toolbox && toolbox.HtmlDiv) toolbox.HtmlDiv.style.display = "";
        root.Blockly.svgResize(workspace);
    }

    function saveWorkspace() {
        if (!workspace) return;
        try {
            var xml = root.Blockly.Xml.workspaceToDom(workspace);
            writeStorage(WORKSPACE_PREFIX + activeLevel, root.Blockly.Xml.domToText(xml));
        } catch (error) {
            // A workspace edit should never be lost solely because storage is disabled.
        }
    }

    function restoreWorkspace(level) {
        var source = readStorage(WORKSPACE_PREFIX + level);
        if (!source) return;
        try {
            var xml = root.Blockly.KanoLegacy.migrateXml(source);
            root.Blockly.Xml.domToWorkspace(xml, workspace);
        } catch (error) {
            message("This saved workspace could not be opened: " + error.message);
        }
    }

    function updateCodePreview() {
        if (previewTimer) root.clearTimeout(previewTimer);
        previewTimer = root.setTimeout(function () {
            try {
                var code = root.Blockly.KanoLegacy.workspaceToCode(workspace);
                byId("code-preview").textContent = code;
            } catch (error) {
                byId("code-preview").textContent = "Code preview unavailable: " + error.message;
            }
        }, 100);
    }

    function selectLevel(level) {
        if (level < 1 || level > PLAYGROUND || level > unlockedLevel) return;
        saveWorkspace();
        activeLevel = level;
        tipIndex = 0;
        challengeData(level);
        updateToolbox(level);
        workspace.clear();
        root.Blockly.KanoLegacy.attachWorkspace(workspace);
        restoreWorkspace(level);
        challengeSteps = level <= CHALLENGE_COUNT ? (root.KanoMakeChallenges[level - 1] || []) : [];
        renderTip();
        renderChallengeList();
        updateCodePreview();
        byId("run-status").className = "run-status";
        byId("run-status").textContent = gameReady
            ? "Arrange blocks, then press MAKE to run your program."
            : "Minecraft is starting in the game panel…";
        root.Blockly.svgResize(workspace);
    }

    function setGameReady() {
        gameReady = true;
        byId("game-loading").classList.add("hidden");
        if (nativeMode) {
            byId("native-game-status").classList.add("ready");
            byId("native-game-title").textContent = "MINECRAFT IS CONNECTED";
            byId("native-game-message").textContent = "Your lesson can now control the open world.";
        }
        runButton.disabled = false;
        byId("run-status").textContent = "Arrange blocks, then press MAKE to run your program.";
    }

    function inspectNativeGame() {
        fetch("/api/status", { cache: "no-store" })
            .then(function (response) {
                if (!response.ok) throw new Error("Native game status check failed");
                return response.json();
            })
            .then(function (status) {
                gameReady = !!status.gameReady;
                runButton.disabled = !gameReady;
                byId("native-game-status").classList.toggle("ready", gameReady);
                byId("native-game-title").textContent = gameReady
                    ? "MINECRAFT IS CONNECTED"
                    : "CONNECT TO MINECRAFT";
                byId("native-game-message").textContent = gameReady
                    ? "Your lesson can now control the open world."
                    : "Start Minecraft and open a world. This editor will connect to the game on this computer.";
                byId("run-status").textContent = gameReady
                    ? "Arrange blocks, then press MAKE to run your program."
                    : "Waiting for Minecraft and an open world…";
            })
            .catch(function () {
                gameReady = false;
                runButton.disabled = true;
                byId("run-status").textContent = "Could not reach the native editor bridge.";
            })
            .then(function () {
                if (nativeMode) root.setTimeout(inspectNativeGame, 1000);
            });
    }

    function inspectGameFrame() {
        try {
            var game = frame.contentWindow;
            var module = game && game.Module;
            if (module && module.calledRun && typeof module._webGetFrameCount === "function" &&
                    module._webGetFrameCount() > 0 && game.KanoMakeBackend && game.KanoLessons) {
                setGameReady();
                return;
            }
        } catch (error) {
            // The iframe may still be navigating; try again on the next tick.
        }
        root.setTimeout(inspectGameFrame, 400);
    }

    function setStatus(text, kind) {
        var node = byId("run-status");
        node.textContent = text;
        node.className = "run-status" + (kind ? " " + kind : "");
    }

    function completeChallenge(level) {
        completed[level] = true;
        if (level <= CHALLENGE_COUNT) {
            unlockedLevel = Math.max(unlockedLevel, Math.min(PLAYGROUND, level + 1));
        }
        saveProgress();
        renderChallengeList();
        if (level <= CHALLENGE_COUNT) {
            setStatus("Challenge complete — " + currentLevelTitle() + "! The next challenge is unlocked.", "success");
            if (level < CHALLENGE_COUNT) {
                message("Challenge " + (level + 1) + " unlocked");
            } else {
                message("All challenges complete — Playground unlocked");
            }
        } else {
            setStatus("Program ran successfully in Playground.", "success");
        }
    }

    function runProgram() {
        if (!gameReady) {
            setStatus("Minecraft is still preparing. Try MAKE again in a moment.");
            return;
        }
        saveWorkspace();
        runButton.disabled = true;
        setStatus("Running your blocks in Minecraft…");
        var code;
        try {
            code = root.Blockly.KanoLegacy.workspaceToCode(workspace);
        } catch (error) {
            runButton.disabled = false;
            setStatus("Could not generate Python: " + error.message, "error");
            return;
        }

        function handleRunResult(result) {
            runButton.disabled = false;
            if (!result.ok) {
                setStatus(result.error || "The program stopped with an error.", "error");
                return;
            }
            if (activeLevel === PLAYGROUND || Project.isLevelComplete(code, activeLevel)) {
                completeChallenge(activeLevel);
            } else {
                setStatus("Minecraft ran the program. Follow the lesson tip and try again.");
            }
        }

        if (nativeMode) {
            fetch("/api/lesson/run", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ source: code })
            }).then(function (response) {
                return response.json().then(function (result) {
                    if (!response.ok && !result.error) {
                        result.error = "Native lesson runner returned HTTP " + response.status + ".";
                    }
                    return result;
                });
            }).then(handleRunResult).catch(function (error) {
                runButton.disabled = false;
                setStatus(error.message || String(error), "error");
            });
            return;
        }

        try {
            var game = frame.contentWindow;
            game.KanoMakeBackend.save("mc_script.py", code);
            game.KanoMakeBackend.run(null, {
                allowTimedStop: activeLevel === 11 || activeLevel === 12
            }).then(handleRunResult).catch(function (error) {
                runButton.disabled = false;
                setStatus(error.message || String(error), "error");
            });
        } catch (error) {
            runButton.disabled = false;
            setStatus("Could not connect to the Minecraft game: " + error.message, "error");
        }
    }

    function initBlockly() {
        root.Blockly.pathToBlockly = "vendor/legacy-blockly/";
        var initialToolbox = root.Blockly.KanoLegacy.migrateXml(
            root.toolbox.toolboxTemplate({ project: 2 }));
        workspace = root.Blockly.inject("blocklyDiv", {
            toolbox: initialToolbox,
            media: "vendor/legacy-blockly/media/",
            scrollbars: true,
            sounds: true,
            zoom: { controls: true, wheel: true, startScale: 0.85, maxScale: 1.4, minScale: 0.55, scaleSpeed: 1.15 }
        });
        root.Blockly.KanoLegacy.attachWorkspace(workspace);
        workspace.addChangeListener(function (event) {
            if (event && event.isUiEvent) return;
            saveWorkspace();
            updateCodePreview();
        });
        selectLevel(1);
    }

    function loadChallengeContent() {
        return fetch("vendor/make-minecraft/content/minecraft-tutorial.xml")
            .then(function (response) {
                if (!response.ok) throw new Error("Could not load recovered Make Minecraft challenge tips");
                return response.text();
            })
            .then(function (text) {
                var xml = new DOMParser().parseFromString(text, "text/xml");
                var projects = Array.prototype.slice.call(xml.getElementsByTagName("project"));
                if (projects.length !== CHALLENGE_COUNT) {
                    throw new Error("Expected 13 recovered challenges; found " + projects.length);
                }
                root.KanoMakeChallenges = projects.map(function (project) {
                    return Array.prototype.slice.call(project.children).filter(function (element) {
                        return element.tagName.toLowerCase() === "step";
                    }).map(function (step) {
                        var tip = step.getElementsByTagName("tip")[0];
                        var direction = step.getElementsByTagName("direction")[0];
                        return {
                            tip: tip ? tip.textContent : "",
                            direction: direction ? direction.textContent : ""
                        };
                    });
                });
            });
    }

    function connectControls() {
        runButton.addEventListener("click", runProgram);
        var resetButton = byId("reset-world");
        resetButton.hidden = nativeMode;
        resetButton.addEventListener("click", function () {
            function reportReset(message, kind) {
                byId("reset-world-status").textContent = message;
                setStatus(message, kind);
            }
            var game = frame.contentWindow;
            if (!game || !game.KanoMakeBackend) {
                reportReset("Wait for Minecraft to finish starting.", "error");
                return;
            }
            if (!root.confirm("Reset Kano World to its original state? Your current Kano World will be kept as a backup. Other worlds and lesson progress will not change.")) return;
            resetButton.disabled = true;
            Promise.resolve(game.KanoMakeBackend.call("reset_world")).then(function (code) {
                reportReset(code === 0 ? "Kano World restored. Its previous version is kept as a backup." : game.KanoMakeBackend.getLastError(), code === 0 ? "success" : "error");
            }).catch(function (error) {
                reportReset("World reset failed: " + String(error), "error");
            }).finally(function () { resetButton.disabled = false; });
        });
        byId("previous-level").addEventListener("click", function () {
            if (activeLevel > 1) selectLevel(activeLevel - 1);
        });
        byId("next-level").addEventListener("click", function () {
            if (activeLevel < unlockedLevel) selectLevel(activeLevel + 1);
        });
        byId("tip-previous").addEventListener("click", function () {
            if (tipIndex > 0) { tipIndex--; renderTip(); }
        });
        byId("tip-next").addEventListener("click", function () {
            if (tipIndex < challengeSteps.length - 1) { tipIndex++; renderTip(); }
        });
        byId("code-toggle").addEventListener("click", function () {
            var showing = !byId("code-preview").hidden;
            byId("code-preview").hidden = showing;
            byId("blocklyDiv").hidden = !showing;
            byId("code-toggle").textContent = showing ? "VIEW CODE" : "VIEW BLOCKS";
            root.Blockly.svgResize(workspace);
        });
        Array.prototype.slice.call(document.querySelectorAll(".tab")).forEach(function (tab) {
            tab.addEventListener("click", function () {
                var showChallenges = tab.getAttribute("data-panel") === "challenges";
                byId("lesson-panel-body").hidden = showChallenges;
                byId("challenges-panel").hidden = !showChallenges;
                document.querySelectorAll(".tab").forEach(function (candidate) {
                    candidate.classList.toggle("active", candidate === tab);
                });
            });
        });
    }

    function start() {
        loadProgress();
        connectControls();
        if (nativeMode) {
            frame.hidden = true;
            byId("native-game-status").hidden = false;
            byId("game-loading").classList.add("hidden");
            runButton.disabled = true;
            inspectNativeGame();
        } else {
            frame.src = gameUrl();
        }
        loadChallengeContent().then(function () {
            initBlockly();
            renderChallengeList();
            if (!nativeMode) inspectGameFrame();
        }).catch(function (error) {
            var message = error.message || String(error);
            if (!root.KanoMakeChallenges) {
                setStatus("Challenge data failed to load: " + message, "error");
                byId("tip-text").textContent = "Challenge data failed to load.";
            } else {
                setStatus("Make Minecraft could not start: " + message, "error");
            }
        });
    }

    root.addEventListener("load", start);
}(window));
