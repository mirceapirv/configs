"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const SpotifyClient_1 = require("./spotify/SpotifyClient");
const Lyrics_1 = require("./lyrics/Lyrics");
function createCommands(spotifyStatus, spotifyStatusController) {
    var sC = SpotifyClient_1.SpoifyClientSingleton.getSpotifyClient(spotifyStatus, spotifyStatusController);
    const lC = new Lyrics_1.LyricsController(spotifyStatus);
    const lyrics = vscode_1.commands.registerCommand('spotify.lyrics', lC.findLyrics.bind(lC));
    const next = vscode_1.commands.registerCommand('spotify.next', sC.next.bind(sC));
    const previous = vscode_1.commands.registerCommand('spotify.previous', sC.previous.bind(sC));
    const play = vscode_1.commands.registerCommand('spotify.play', sC.play.bind(sC));
    const pause = vscode_1.commands.registerCommand('spotify.pause', sC.pause.bind(sC));
    const playPause = vscode_1.commands.registerCommand('spotify.playPause', sC.playPause.bind(sC));
    const muteVolume = vscode_1.commands.registerCommand('spotify.muteVolume', sC.muteVolume.bind(sC));
    const unmuteVolume = vscode_1.commands.registerCommand('spotify.unmuteVolume', sC.unmuteVolume.bind(sC));
    const muteUnmuteVolume = vscode_1.commands.registerCommand('spotify.muteUnmuteVolume', sC.muteUnmuteVolume.bind(sC));
    const volumeUp = vscode_1.commands.registerCommand('spotify.volumeUp', sC.volumeUp.bind(sC));
    const volumeDown = vscode_1.commands.registerCommand('spotify.volumeDown', sC.volumeDown.bind(sC));
    const toggleRepeating = vscode_1.commands.registerCommand('spotify.toggleRepeating', sC.toggleRepeating.bind(sC));
    const toggleShuffling = vscode_1.commands.registerCommand('spotify.toggleShuffling', sC.toggleShuffling.bind(sC));
    return vscode_1.Disposable.from(lyrics, next, previous, play, pause, playPause, muteVolume, unmuteVolume, muteUnmuteVolume, volumeUp, volumeDown, toggleRepeating, toggleShuffling, Lyrics_1.registration);
}
exports.createCommands = createCommands;
//# sourceMappingURL=Commands.js.map