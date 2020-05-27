/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prefer-spread */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { PlayerState, TrackInfo, AlbumInfo } from "./types";

const log = console.log;
const API_DIR = "https://api.spotify.com/v1";

interface SpotifyWebPlayer {
    connect?: () => void;
    addListener?: (event: string, cb: (arg: any) => void) => void;
}
declare global {
    interface Window {
        MyNamespace: any;
    }
}

window.MyNamespace = window.MyNamespace || {};

export default class SpotifyAPIClient implements EventTarget {
    readonly authToken: string;
    webplayer: SpotifyWebPlayer | undefined;
    deviceId = "";

    constructor(authToken: string, refreshToken: string) {
        this.authToken = authToken;
    }
    private delegate = document.createDocumentFragment();
    addEventListener(...args: never): void {
        this.delegate.addEventListener.apply(this.delegate, args);
    }

    dispatchEvent(...args: any): boolean {
        return this.delegate.dispatchEvent.apply(this.delegate, args);
    }

    removeEventListener(...args: any): void {
        return this.delegate.removeEventListener.apply(this.delegate, args);
    }

    loadScript(src: string): void {
        const tag = document.createElement("script");
        tag.async = false;
        tag.src = src;
        document.getElementsByTagName("head")[0].appendChild(tag);
    }

    fetchAPI(uri: string, method = "GET"): Promise<any> {
        return fetch(API_DIR + uri, {
            method: method,
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + this.authToken
            }
        }).catch(err => {
            log(err);
        });
    }

    fetchAPIPut(uri: string, body: Record<string, any>): Promise<any> {
        return fetch(API_DIR + uri, {
            method: "PUT",
            body: JSON.stringify(body),
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${this.authToken}`
            }
        }).catch(err => console.log(err));
    }

    async getPlayLists(): Promise<AlbumInfo[]> {
        try {
            const playlistJson = await this.fetchAPI(
                "/me/playlists"
            ).then(res => res.json());
            return playlistJson.items.map(item => {
                const AlbumInfo: AlbumInfo = {
                    playlistID: item.id,
                    name: item.name,
                    albumCoverUrl: item.images[0].url
                };
                return AlbumInfo;
            });
        } catch (e) {
            console.error(e);
            return [];
        }
    }

    loadSpotifyPremium(): Promise<unknown> {
        return new Promise((resolve, reject) => {
            if (this.webplayer !== null && this.deviceId !== null) {
                resolve(this.webplayer);
                return;
            }

            window["MyNamespace"].onSpotifyWebPlaybackSDKReady = () => {
                this.webplayer = new Spotify.Player({
                    name: "wtf",
                    getOAuthToken: cb => cb(this.authToken)
                });
                ["initialization_error", "not_ready", "account_error"].forEach(
                    event => {
                        this.webplayer.addListener(event, e => {
                            reject(new Error(event));
                        });
                    }
                );
                this.webplayer.addListener("ready", ({ device_id }) => {
                    this.deviceId = device_id;
                    this.dispatchEvent(new Event("ready"));
                    this.deviceId = device_id;
                });
                this.dispatchEvent(new Event("connecting"));

                this.webplayer.connect();
                this.webplayer.addListener("player_state_change", e => {
                    this.dispatchEvent(player_state_change, e);
                });
            };
        });
    }

    async playTrack(trackId: string) {
        await this.loadSpotifyPremium();
        this.fetchAPIPut("/me/player/play?device_id=" + this.deviceId, {
            uris: ["spotify:track:" + trackId]
        })
            .then(resp => {
                log(resp); //"loaded")
            })
            .catch(e => {
                log(e);
            });
    }
}
