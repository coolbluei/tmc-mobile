export default class AudioController {

    constructor() {
        this.tracks = [];
        this.playbackInstance = null;
        this.isPlaying = false;
        this.isLoading = false;
        this.isReady = false;
        this.title = null;
        this.duration = null;
        this.position = null;
        this.index = null;
    }

    getTrack = (index) => {
        return this.tracks[index];
    };

    getNextTrack = (index) => {
        if(this.tracks.length <= index + 1) {
            this.getTrack(index + 1);
        }

        return null;
    }

    getPrevTrack = (index) => {
        if(index > 0) {
            this.getTrack(index - 1);
        }

        return this.getTrack(0);
    }
}