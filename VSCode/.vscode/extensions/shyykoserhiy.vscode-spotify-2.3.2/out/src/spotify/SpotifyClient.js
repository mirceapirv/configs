"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const OsAgnosticSpotifyClient_1 = require("./OsAgnosticSpotifyClient");
const OsxSpotifyClient_1 = require("./OsxSpotifyClient");
const OsxHttpSpotifyClient_1 = require("./OsxHttpSpotifyClient");
const SpotifyConfig_1 = require("../config/SpotifyConfig");
const os = require("os");
class SpoifyClientSingleton {
    static getSpotifyClient(spotifyStatus, spotifyStatusController) {
        if (this.spotifyClient) {
            return this.spotifyClient;
        }
        this.spotifyClient = (os.platform() === 'darwin') ?
            (SpotifyConfig_1.getUseCombinedApproachOnMacOS() ? new OsxHttpSpotifyClient_1.OsxHttpSpotifyClient(spotifyStatus, spotifyStatusController) : new OsxSpotifyClient_1.OsxSpotifyClient(spotifyStatus, spotifyStatusController)) :
            new OsAgnosticSpotifyClient_1.OsAgnosticSpotifyClient(spotifyStatusController);
        return this.spotifyClient;
    }
}
exports.SpoifyClientSingleton = SpoifyClientSingleton;
function createCancelablePromise(executor) {
    let cancel = null;
    const promise = new Promise((resolve, reject) => {
        cancel = () => {
            reject('canceled');
        };
        executor(resolve, reject);
    });
    return { promise, cancel };
}
exports.createCancelablePromise = createCancelablePromise;
//# sourceMappingURL=SpotifyClient.js.map