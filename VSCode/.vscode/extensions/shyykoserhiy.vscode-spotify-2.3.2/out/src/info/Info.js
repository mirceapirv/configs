"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
function showInformationMessage(message) {
    return vscode_1.window.showInformationMessage(`vscode-spotify: ${message}`);
}
exports.showInformationMessage = showInformationMessage;
//# sourceMappingURL=Info.js.map