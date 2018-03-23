"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Commands_1 = require("./Commands");
const SpotifyStatus_1 = require("./SpotifyStatus");
const SpotifyStatusController_1 = require("./SpotifyStatusController");
// This method is called when your extension is activated. Activation is
// controlled by the activation events defined in package.json.
function activate(context) {
    // This line of code will only be executed once when your extension is activated.        
    let spotifyStatus = new SpotifyStatus_1.SpotifyStatus();
    let controller = new SpotifyStatusController_1.SpotifyStatusController(spotifyStatus, context.globalState);
    // Add to a list of disposables which are disposed when this extension is deactivated.
    context.subscriptions.push(controller);
    context.subscriptions.push(spotifyStatus);
    context.subscriptions.push(Commands_1.createCommands(spotifyStatus, controller));
}
exports.activate = activate;
//# sourceMappingURL=extension.js.map