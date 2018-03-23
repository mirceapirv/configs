"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Request_1 = require("../request/Request");
const SpotifyConfig_1 = require("../config/SpotifyConfig");
const Info_1 = require("../info/Info");
const vscode_1 = require("vscode");
let previewUri = vscode_1.Uri.parse('vscode-spotify://authority/vscode-spotify');
let html = '';
class TextContentProvider {
    constructor() {
        this._onDidChange = new vscode_1.EventEmitter();
    }
    provideTextDocumentContent(_uri) {
        return html;
    }
    get onDidChange() {
        return this._onDidChange.event;
    }
    update(uri) {
        this._onDidChange.fire(uri);
    }
}
let provider = new TextContentProvider();
function previewLyrics(lyrics) {
    return __awaiter(this, void 0, void 0, function* () {
        html = lyrics.trim();
        provider.update(previewUri);
        try {
            const document = yield vscode_1.workspace.openTextDocument(previewUri);
            yield vscode_1.window.showTextDocument(document, SpotifyConfig_1.openPanelLyrics(), true);
        }
        catch (_ignored) {
            Info_1.showInformationMessage('Failed to show lyrics' + _ignored);
        }
    });
}
class LyricsController {
    constructor(spotifyStatus) {
        this.spotifyStatus = spotifyStatus;
    }
    findLyrics() {
        return __awaiter(this, void 0, void 0, function* () {
            vscode_1.window.withProgress({ location: vscode_1.ProgressLocation.Window, title: 'Searching for lyrics. This might take a while.' }, () => {
                return this._findLyrics();
            });
        });
    }
    _findLyrics() {
        return __awaiter(this, void 0, void 0, function* () {
            const { artist, name } = this.spotifyStatus.state.track;
            try {
                const result = yield Request_1.xhr({ url: `${SpotifyConfig_1.getLyricsServerUrl()}?artist=${encodeURIComponent(artist)}&title=${encodeURIComponent(name)}` });
                yield previewLyrics(`${result.responseText}`);
            }
            catch (e) {
                if (e.status === 404) {
                    yield previewLyrics(`Song lyrics for ${artist} - ${name} not found.\n You can add it on https://genius.com/ .`);
                }
                if (e.status === 500) {
                    yield previewLyrics(`Error: ${e.responseText}`);
                }
            }
        });
    }
}
exports.LyricsController = LyricsController;
exports.registration = vscode_1.workspace.registerTextDocumentContentProvider('vscode-spotify', provider);
//# sourceMappingURL=Lyrics.js.map