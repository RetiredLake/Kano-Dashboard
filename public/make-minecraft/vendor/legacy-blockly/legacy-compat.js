(function (root) {
    "use strict";

    var Blockly = root.Blockly;
    if (!Blockly || !Blockly.Blocks || !Blockly.Generator) {
        throw new Error("Blockly core must be loaded before the Kano legacy adapter");
    }

    // Make Minecraft was written for Blockly's pre-2016 "Language" and
    // "title" APIs. The archived Kano Code dependency pins Blockly 1.20190215,
    // which retains the same block/generator model but renamed those APIs.
    Blockly.Language = Blockly.Blocks;

    if (!Blockly.Input.prototype.appendTitle) {
        Blockly.Input.prototype.appendTitle = Blockly.Input.prototype.appendField;
    }
    if (!Blockly.Block.prototype.getTitleValue) {
        Blockly.Block.prototype.getTitleValue = Blockly.Block.prototype.getFieldValue;
    }
    if (!Object.getOwnPropertyDescriptor(Blockly.Input.prototype, "titleRow")) {
        Object.defineProperty(Blockly.Input.prototype, "titleRow", {
            configurable: true,
            get: function () { return this.fieldRow; }
        });
    }

    // The recovered Python generator uses the old static generator facade.
    // Route it to the 2019 instance API without changing the original lesson
    // generator definitions.
    if (!Blockly.Generator.get) {
        Blockly.Generator.get = function (name) {
            if (!Blockly[name]) {
                Blockly[name] = new Blockly.Generator(name);
            }
            return Blockly[name];
        };
    }
    if (!Blockly.Generator.workspaceToCode) {
        Blockly.Generator.workspaceToCode = function (name) {
            var workspace = Blockly.mainWorkspace || root.KanoLegacyWorkspace;
            if (!workspace) {
                throw new Error("No Kano Blockly workspace is active");
            }
            return Blockly.Generator.get(name).workspaceToCode(workspace);
        };
    }
    if (!Blockly.Generator.prefixLines) {
        Blockly.Generator.prefixLines = function (text, prefix) {
            return prefix + String(text).replace(/\n(.)/g, "\n" + prefix + "$1");
        };
    }
    if (!Blockly.Generator.allNestedComments) {
        Blockly.Generator.allNestedComments = function (block) {
            var generator = Blockly.Python || Blockly.Generator.get("Python");
            return generator.allNestedComments(block);
        };
    }

    // The legacy generator enumerates variables from a global workspace.
    if (Blockly.Variables && !Blockly.Variables.allVariables) {
        Blockly.Variables.allVariables = function () {
            var workspace = Blockly.mainWorkspace || root.KanoLegacyWorkspace;
            if (!workspace) return [];
            return Blockly.Variables.allUsedVarModels(workspace).map(function (variable) {
                return variable.name;
            });
        };
    }

    Blockly.KanoLegacy = {
        attachWorkspace: function (workspace) {
            root.KanoLegacyWorkspace = workspace;
            Blockly.mainWorkspace = workspace;
            return workspace;
        },
        migrateXml: function (xmlText) {
            var document = new DOMParser().parseFromString(String(xmlText), "text/xml");
            var parseError = document.querySelector("parsererror");
            if (parseError) {
                throw new Error("Invalid legacy Blockly XML: " + parseError.textContent);
            }
            Array.prototype.slice.call(document.getElementsByTagName("title")).forEach(function (title) {
                var field = document.createElement("field");
                Array.prototype.slice.call(title.attributes).forEach(function (attribute) {
                    field.setAttribute(attribute.name, attribute.value);
                });
                field.textContent = title.textContent;
                title.parentNode.replaceChild(field, title);
            });
            return document.documentElement;
        },
        workspaceToCode: function (workspace) {
            Blockly.KanoLegacy.attachWorkspace(workspace);
            return Blockly.Generator.workspaceToCode("Python");
        }
    };
}(typeof globalThis !== "undefined" ? globalThis : this));
