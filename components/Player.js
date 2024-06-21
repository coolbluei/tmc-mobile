import { Audio } from "expo-av";
import { useAtom } from "jotai";
import { tracksAtom, titleAtom, indexAtom, positionAtom, durationAtom, isLoadingAtom, isPlayingAtom, playbackInstanceAtom, loopAtom } from '../storage/audioAtoms';
import { useEffect, useState } from "react";
import { View, Text, TouchableHighlight } from "react-native";
import Slider from "@react-native-community/slider";
import Styles from "../styles";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faBackward, faForward, faPause, faPlay, faRotateLeft } from "@fortawesome/free-solid-svg-icons";

const Player = () => {

    const [tracks, setTracks] = useAtom(tracksAtom);
    const [title, setTitle] = useAtom(titleAtom);
    const [playbackInstance, setPlaybackInstance] = useAtom(playbackInstanceAtom);
    const [index, setIndex] = useAtom(indexAtom);
    const [duration, setDuration] = useAtom(durationAtom);
    const [position, setPosition] = useAtom(positionAtom);
    const [isPlaying, setIsPlaying] = useAtom(isPlayingAtom);
    const [isLoading, setIsLoading] = useAtom(isLoadingAtom);
    const [loop, setLoop] = useAtom(loopAtom);

    // Callback to handle playback status updates from the playbackInstance
    const onPlaybackStatusUpdate = (status) => {
        // Update the player state with each update
        if(status.isLoaded) {
            setPosition(status.positionMillis);
            setIsPlaying(status.isPlaying);
            setIsLoading(status.isBuffering);
            setDuration(status.durationMillis);
        }

        // When a track finishes playing...
        if(status.didJustFinish) {
            // If this is the last track in the playlist...
            if(index + 1 >= tracks.length) {
                // Set the index back to zero if we're looping. Otherwise, do nothing.
                if(loop) {
                    setIndex(0);
                }
            } else {
                // Not the last track, so set the index to the next track.
                setIndex(index + 1);
            }
        }
    }

    // React to the index being updated
    useEffect(() => {
        // Get the track object from the array of tracks for the current playlist.
        const track = tracks[index];

        // Creates a new playbackInstance for the current track and begins playing.
        const newPlaybackInstance = async () => {
            // Create a source object
            const source = {
                uri: track.url
            };

            // Create a new playbackInstance and pass in our onPlaybackStatusUpdate method to listen to status updates.
            const { sound, status } = await Audio.Sound.createAsync(source, {}, onPlaybackStatusUpdate);

            // Set the playbackInstance in state.
            setPlaybackInstance(sound);

            // Start playing.
            sound.playAsync();
        }

        // If we have a playbackInstance, kill it because the index just changed.
        if(playbackInstance instanceof Object) {
            playbackInstance.unloadAsync();
        }

        // If the index is set...
        if(typeof index === 'number') {
            // Set the title of the current track in state.
            setTitle(track.title);

            // Create a new playbackInstance with the current track source.
            newPlaybackInstance();
        }
    }, [index]);

    // React to play/pause button press.
    const togglePlay = () => {
        if(isPlaying) {
            playbackInstance.pauseAsync();
        } else {
            playbackInstance.playAsync();
        }
    };

    const toggleLoop = () => {
        setLoop(!loop);
    }

    // React to previous button press. 
    const rewindOrPrev = () => {
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
    };

    // React to next button press.
    const next = () => {
        // If this is not the last track in the playlist...
        if(index + 1 <= tracks.length) {
            // Go to the next track.
            setIndex(index + 1);
        } else if(loop) {
            // Otherwise, if we're looping...go to the first track.
            setIndex(0);
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
        content = (
            <View style={Styles.player}>
                <Text style={Styles.playerTitle}>{title}</Text>
                <Slider style={{ width: '100%' }} value={position / duration} onSlidingComplete={seek} />
                <View style={Styles.container}>
                    <View style={Styles.playerControls}>
                        <TouchableHighlight onPress={rewindOrPrev}><FontAwesomeIcon icon={faBackward} size={24} /></TouchableHighlight>
                        <TouchableHighlight onPress={togglePlay}>{playPauseButton}</TouchableHighlight>
                        <TouchableHighlight onPress={next}><FontAwesomeIcon icon={faForward} size={24} /></TouchableHighlight>
                        <TouchableHighlight onPress={toggleLoop}><FontAwesomeIcon icon={faRotateLeft} size={24} /></TouchableHighlight>
                    </View>
                </View>
            </View>
        );
    }

    return content;
};

export default Player;