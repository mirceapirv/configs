"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const SpotifyClient_1 = require("./SpotifyClient");
const spotilocal_1 = require("spotilocal");
const Info_1 = require("../info/Info");
const SpotifyConfig_1 = require("../config/SpotifyConfig");
function returnIfNotInitialized(_ignoredTarget, _ignoredPropertyKey, descriptor) {
    const fn = descriptor.value;
    if (typeof fn !== 'function') {
        throw new Error(`@returnIfNotInitialized can only be applied to method and not to ${typeof fn}`);
    }
    return Object.assign({}, descriptor, {
        value: function () {
            if (!this.initialized && SpotifyConfig_1.getShowInitializationError()) {
                Info_1.showInformationMessage('Failed to initialize vscode-spotify. We\'ll keep trying every 20 seconds.');
                return;
            }
            return fn.apply(this, arguments);
        }
    });
}
function notSupported(_ignoredTarget, _ignoredPropertyKey, descriptor) {
    const fn = descriptor.value;
    if (typeof fn !== 'function') {
        throw new Error(`@notSupported can only be applied to method and not to ${typeof fn}`);
    }
    return Object.assign({}, descriptor, {
        value: function () {
            Info_1.showInformationMessage('This functionality is not supported on this platform.');
            return;
        }
    });
}
function convertSpotilocalStatus(spotilocalStatus) {
    return {
        isRunning: true,
        state: {
            volume: spotilocalStatus.volume,
            position: spotilocalStatus.playing_position,
            state: spotilocalStatus.playing ? 'playing' : 'paused'
        },
        track: {
            album: spotilocalStatus.track.album_resource.name,
            artist: spotilocalStatus.track.artist_resource.name,
            name: spotilocalStatus.track.track_resource.name
        },
        isRepeating: spotilocalStatus.repeat,
        isShuffling: spotilocalStatus.shuffle
    };
}
const EMPTY_FN = () => { };
class OsAgnosticSpotifyClient {
    constructor(spotifyStatusController) {
        this.spotifyStatusController = spotifyStatusController;
        this.spotilocal = new spotilocal_1.Spotilocal();
        this.retryInit();
    }
    retryInit() {
        this.initialized = false;
        this.initTimeoutId && clearTimeout(this.initTimeoutId);
        const lastUsedPort = this.spotifyStatusController.globalState.get("lastUsedPort");
        this.spotilocal.init(lastUsedPort).then(() => {
            this.initialized = true;
            this.showedReinitMessage = false;
            this.spotifyStatusController.globalState.update("lastUsedPort", this.spotilocal.port);
        }).catch((ignorredError) => {
            if (!this.showedReinitMessage && SpotifyConfig_1.getShowInitializationError()) {
                Info_1.showInformationMessage('Failed to initialize vscode-spotify. We\'ll keep trying every 20 seconds.');
            }
            console.error('Failed to initialize vscode-spotify. We\'ll keep trying every 20 seconds.', ignorredError);
            this.showedReinitMessage = true;
            this.initTimeoutId = setTimeout(this.retryInit.bind(this), 20 * 1000);
        });
    }
    next() {
    }
    previous() {
    }
    play() {
        this.spotilocal.pause(false).catch((error) => {
            Info_1.showInformationMessage(`Failed to play. We are going to retry reinit spotilocal. ${error}`);
            this.retryInit.bind(this);
        });
    }
    pause() {
        this.spotilocal.pause(true).catch((error) => {
            Info_1.showInformationMessage(`Failed to pause. We are going to retry reinit spotilocal. ${error}`);
            this.retryInit.bind(this);
        });
    }
    playPause() {
        this.spotilocal.getStatus().then((status) => {
            if (status.playing) {
                this.pause();
            }
            else {
                this.play();
            }
        }).catch((error) => {
            Info_1.showInformationMessage(`Failed to playPause. We are going to retry reinit spotilocal. ${error}`);
            this.retryInit.bind(this);
        });
        ;
    }
    pollStatus(cb) {
        if (!this.initialized) {
            return { promise: Promise.reject('Failed to initiate status polling. spotilocal is not initialized'), cancel: EMPTY_FN };
        }
        let canceled = false;
        const p = SpotifyClient_1.createCancelablePromise((_resolve, reject) => {
            this.spotilocal.getStatus().then(status => {
                cb(convertSpotilocalStatus(status));
                const _poll = () => {
                    if (canceled) {
                        return;
                    }
                    this.spotilocal.getStatus(['play', 'pause'], 0).then(status => {
                        cb(convertSpotilocalStatus(status));
                        _poll();
                    }).catch(reject);
                };
                _poll();
            }).catch(reject);
        });
        p.promise = p.promise.catch((err) => {
            if (err && err.code === 'ECONNREFUSED') {
                this.retryInit();
            }
            canceled = true;
            throw err;
        });
        return p;
    }
    muteVolume() {
    }
    unmuteVolume() {
    }
    muteUnmuteVolume() {
    }
    volumeUp() {
    }
    volumeDown() {
    }
    toggleRepeating() {
    }
    toggleShuffling() {
    }
}
__decorate([
    notSupported
], OsAgnosticSpotifyClient.prototype, "next", null);
__decorate([
    notSupported
], OsAgnosticSpotifyClient.prototype, "previous", null);
__decorate([
    returnIfNotInitialized
], OsAgnosticSpotifyClient.prototype, "play", null);
__decorate([
    returnIfNotInitialized
], OsAgnosticSpotifyClient.prototype, "pause", null);
__decorate([
    returnIfNotInitialized
], OsAgnosticSpotifyClient.prototype, "playPause", null);
__decorate([
    notSupported
], OsAgnosticSpotifyClient.prototype, "muteVolume", null);
__decorate([
    notSupported
], OsAgnosticSpotifyClient.prototype, "unmuteVolume", null);
__decorate([
    notSupported
], OsAgnosticSpotifyClient.prototype, "muteUnmuteVolume", null);
__decorate([
    notSupported
], OsAgnosticSpotifyClient.prototype, "volumeUp", null);
__decorate([
    notSupported
], OsAgnosticSpotifyClient.prototype, "volumeDown", null);
__decorate([
    notSupported
], OsAgnosticSpotifyClient.prototype, "toggleRepeating", null);
__decorate([
    notSupported
], OsAgnosticSpotifyClient.prototype, "toggleShuffling", null);
exports.OsAgnosticSpotifyClient = OsAgnosticSpotifyClient;
//# sourceMappingURL=OsAgnosticSpotifyClient.js.map