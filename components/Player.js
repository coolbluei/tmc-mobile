import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from "expo-av";
import { useAtom } from "jotai";
import { tracksAtom, titleAtom, indexAtom, positionAtom, durationAtom, isPlayingAtom, playbackInstanceAtom, loopAtom, isReadyAtom } from '../storage/audioAtoms';
import { downloadsAtom, offlineAtom } from "../storage/atoms";
import { useEffect, useState } from "react";
import { View, Text, TouchableHighlight, ActivityIndicator } from "react-native";
import Slider from "@react-native-community/slider";
import Styles from "../styles";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faBackward, faForward, faPause, faPlay, faRotateLeft } from "@fortawesome/pro-solid-svg-icons";
import * as FileSystem from 'expo-file-system';

const Player = () => {

    const [tracks] = useAtom(tracksAtom);
    const [title, setTitle] = useAtom(titleAtom);
    const [playbackInstance, setPlaybackInstance] = useAtom(playbackInstanceAtom);
    const [index, setIndex] = useAtom(indexAtom);
    const [duration, setDuration] = useAtom(durationAtom);
    const [position, setPosition] = useAtom(positionAtom);
    const [isPlaying, setIsPlaying] = useAtom(isPlayingAtom);
    const [loop, setLoop] = useAtom(loopAtom);
    const [isReady, setIsReady] = useAtom(isReadyAtom);
    const [offline] = useAtom(offlineAtom);
    const [downloads] = useAtom(downloadsAtom);

    const [advanceIndex, setAdvanceIndex] = useState(false);
    const [playerOffline, setPlayerOffline] = useState(offline);

    // React to advanceIndex flag being updated.
    useEffect(() => {
        // If advanceIndex is true...
        if(advanceIndex) {
            // If this is not the last track in the playlist...
            if(index + 1 < tracks.length) {
                // Go to the next track.
                setIndex(index + 1);
            } else if(loop) {
                // Otherwise, if we're looping...go to the first track.
                setIndex(0);
            }

            // Set the advanceIndex flag back to false.
            setAdvanceIndex(false);
        }
    }, [advanceIndex]);

    // Callback to handle playback status updates from the playbackInstance
    const onPlaybackStatusUpdate = (status) => {
        // Update the player state with each update
        if(status.isLoaded) {
            setPosition(status.positionMillis);
            setIsPlaying(status.isPlaying);
            setDuration(status.durationMillis);
            setIsReady(!status.isBuffering);
        } else {
            setIsReady(false);
        }

        // When a track finishes playing...
        if(status.didJustFinish) {
            // Set the advanceIndex flag to true so that the useEffect will fire.
            setAdvanceIndex(true);
        }
    }

    // React to the index being updated
    useEffect(() => {
        if(offline && !playerOffline) {
            playbackInstance.unloadAsync();
            setPlaybackInstance(null);
            setIsPlaying(false);
            setIndex(null);
            setPlayerOffline(true);
            
        } else {

            if(isReady) {
                // Get the track object from the array of tracks for the current playlist.
                const track = tracks[index];

                // Creates a new playbackInstance for the current track and begins playing.
                const beginPlayback = async () => {

                    // Create a source object
                    let source = {
                        uri: track.url
                    };

                    if(downloads.includes(track.id + '.mp3')) {
                        source = {
                            uri: FileSystem.documentDirectory + 'songs/' + track.id + '.mp3'
                        };
                    }

                    // If we have a playbackInstance, kill it because the index just changed.
                    if(playbackInstance instanceof Object) {
                        await playbackInstance.unloadAsync();
                        await playbackInstance.loadAsync(source, { positionMillis: 0, shouldPlay: true });
                    } else {
                        await Audio.setAudioModeAsync({
                            staysActiveInBackground: true,
                            playsInSilentModeIOS: true,
                            interruptionModeIOS: InterruptionModeIOS.DoNotMix,
                            interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
                            shouldDuckAndroid: true,
                            playThroughEarpieceAndroid: true
                        });
            
                        // Create a new playbackInstance and pass in our onPlaybackStatusUpdate method to listen to status updates.
                        const { sound, status } = await Audio.Sound.createAsync(source, { positionMillis: 0, shouldPlay: true }, onPlaybackStatusUpdate);
            
                        // Set the playbackInstance in state.
                        await setPlaybackInstance(sound);
                    }
                }

                // If the index is set...
                if(typeof index === 'number') {
                    // Set the title of the current track in state.
                    setTitle(track.title);
                    setPosition(0);

                    // Create a new playbackInstance with the current track source.
                    beginPlayback();
                }
            }
        }
    }, [index]);

    // React to the playbackInstance being loaded.
    useEffect(() => {
        if(playbackInstance instanceof Object) {
            playbackInstance.playAsync();
        }

        // This is the cleanup function for this component. If the Player unmounts, stop the sound.
        return playbackInstance ? () => { playbackInstance.unloadAsync(); setPlaybackInstance(null); setIsPlaying(false); setIndex(null) } : undefined;
    }, [playbackInstance]);

    // React to play/pause button press.
    const togglePlay = () => {
        if(isReady) {
            if(isPlaying) {
                playbackInstance.pauseAsync();
            } else {
                playbackInstance.playAsync();
            }
        }
    };

    const toggleLoop = () => {
        setLoop(!loop);
    }

    // React to previous button press. 
    const rewindOrPrev = () => {
        if(isReady) {
            // If the position is more than 500 milliseconds...
            if(position > 500) {
                // Go back to the beginning of the track.
                playbackInstance.setPositionAsync(0);
            } else {
                // Otherwise, if there is an earlier song in the playlist...
                if(index > 0) {
                    // Go to the previous song.
                    setIndex(index - 1);
                }
            }
        }
    };

    // React to next button press.
    const next = () => {
        if(isReady) {
            // Set the advanceIndex flat to true so the useEffect will fire.
            setAdvanceIndex(true);
        }
    };

    // React to seek slider changes.
    const seek = (value) => {
        // If the value is in range (probably unnecessary to check)...
        if(value >= 0 && value <= 1) {
            /* Multiply the value from the slider (a float between 0 and 1) by the duration of the 
               track as a percentage. The position value is always in milliseconds. Round down to 
               avoid out of range error (probably unnecessary). */
            const milliseconds = Math.floor(duration * value);

            // Set the playbackInstance position to the seek position.
            playbackInstance.setPositionAsync(milliseconds);
        }
    }

    let playPauseButton = <FontAwesomeIcon icon={faPlay} size={24} />;

    if(isPlaying) {
        playPauseButton = <FontAwesomeIcon icon={faPause} size={24} />;
    }

    let content = null;

    if(isPlaying || typeof index === 'number') {
        let displayTitle = <ActivityIndicator size="small" color="#000000" />

        if(isReady) {
            displayTitle = <Text style={Styles.playerTitle}>{title}</Text>;
        }

        let loopStyle = Styles.inactive;

        if(loop) {
            loopStyle = {};
        }
        
        content = (
            <View style={Styles.player}>
                <View style={Styles.alignCenter}>{displayTitle}</View>
                <Slider style={{ width: '100%' }} value={position / duration} onSlidingComplete={seek} />
                <View style={Styles.alignCenter}>
                    <View style={Styles.playerControls}>
                        <TouchableHighlight onPress={rewindOrPrev}><FontAwesomeIcon icon={faBackward} size={24} /></TouchableHighlight>
                        <TouchableHighlight onPress={togglePlay}>{playPauseButton}</TouchableHighlight>
                        <TouchableHighlight onPress={next}><FontAwesomeIcon icon={faForward} size={24} /></TouchableHighlight>
                        <TouchableHighlight onPress={toggleLoop}><FontAwesomeIcon icon={faRotateLeft} size={24} style={loopStyle} /></TouchableHighlight>
                    </View>
                </View>
            </View>
        );
    }

    return content;
};

export default Player;