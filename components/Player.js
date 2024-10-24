import { useAtom } from "jotai";
import { tracksAtom, indexAtom, loopAtom } from '../storage/audioAtoms';
import { offlineAtom } from "../storage/atoms";
import { useEffect, useState } from "react";
import { View, Text, TouchableHighlight, ActivityIndicator } from "react-native";
import Slider from "@react-native-community/slider";
import Styles from "../styles";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faBackward, faForward, faPause, faPlay, faRotateLeft } from "@fortawesome/pro-solid-svg-icons";
import TrackPlayer, { Capability, Event, RepeatMode, State, usePlaybackState, useProgress, useTrackPlayerEvents } from 'react-native-track-player';

const Player = () => {

    const [tracks] = useAtom(tracksAtom);
    const [loop, setLoop] = useAtom(loopAtom);
    const [index, setIndex] = useAtom(indexAtom);
    const [offline] = useAtom(offlineAtom);

    const [title, setTitle] = useState();

    const progress = useProgress();

    const playerState = usePlaybackState();
    const isReady = playerState.state === State.Ready || playerState.state === State.Playing || playerState.state === State.Paused;
    const isPlaying = playerState.state === State.Playing;

    const setupPlayer = async () => {
        try {
            await TrackPlayer.setupPlayer();
            await TrackPlayer.updateOptions({
                capabilities: [
                    Capability.Play,
                    Capability.Pause,
                    Capability.SkipToNext,
                    Capability.SkipToPrevious
                ],
            });
            TrackPlayer.setPlayWhenReady(true);
        } catch (error) { 
            console.log(error);
        }
    };

    const beginPlayback = async () => {
        if(tracks.length > 0) {
            try {
                await TrackPlayer.reset();
                await TrackPlayer.add(tracks);
                if(typeof index === 'number') {
                    await TrackPlayer.skip(index);
                }
                TrackPlayer.play();
            } catch (error) { 
                console.log(error); 
            }
        }
    };
    
    useTrackPlayerEvents([Event.PlaybackActiveTrackChanged], async (event) => {
        if (event.type === Event.PlaybackActiveTrackChanged) {
            gettrackdata();
            TrackPlayer.play();
        }
    });
    
    const gettrackdata = async () => {
        const trackObject = await TrackPlayer.getActiveTrack();
        setTitle(trackObject?.title);
    };
    
    const togglePlay = async playBackState => {
        if ((playerState.state === State.Paused) || (playerState.state === State.Ready)) {
            await TrackPlayer.play();
        } else {
            await TrackPlayer.pause();
        }
    };
    
    const next = async () => {
        await TrackPlayer.skipToNext();
        TrackPlayer.play();
        gettrackdata();
    };

    const rewindOrPrev = async () => {
        if(tracks.length > 0) {
            await TrackPlayer.skipToPrevious();
            TrackPlayer.play();
            gettrackdata();
        }
    };

    const seek = async (value) => {
        // If the value is in range (probably unnecessary to check)...
        if(value >= 0 && value <= 1) {
            /* Multiply the value from the slider (a float between 0 and 1) by the duration of the 
               track as a percentage. The position value is always in seconds. Round down to 
               avoid out of range error (probably unnecessary). */
            const seconds = Math.floor(progress.duration * value);

            // Set the playbackInstance position to the seek position.
            TrackPlayer.seekTo(seconds);
        }
    };

    const toggleLoop = () => {
        setLoop(!loop);
    }
      
    useEffect(() => {
        setupPlayer();
    }, []);

    useEffect(() => {
        beginPlayback();
    }, [tracks]);

    useEffect(() => {
        if(typeof index === 'number') {
            TrackPlayer.skip(index);
            TrackPlayer.play();
        }
    }, [index]);

    useEffect(() => {
        let repeatMode = RepeatMode.Off;

        if(loop) {
            repeatMode = RepeatMode.Queue;
        }

        TrackPlayer.setRepeatMode(repeatMode);
    }, [loop]);

    useEffect(() => {
        TrackPlayer.reset();
    }, [offline]);

    let playPauseButton = <FontAwesomeIcon icon={faPlay} size={24} />;

    let content = null;

    if(typeof playerState.state === 'string' && playerState.state !== State.None && playerState.state !== State.Stopped) {
        let displayTitle = <ActivityIndicator size="small" color="#000000" />

        if(isReady) {
            displayTitle = <Text style={Styles.playerTitle}>{title}</Text>;
        }

        if(isPlaying) {
            playPauseButton = <FontAwesomeIcon icon={faPause} size={24} />;
        }

        let loopStyle = Styles.inactive;

        if(loop) {
            loopStyle = {};
        }
        
        content = (
            <View style={Styles.player}>
                <View style={Styles.alignCenter}>{displayTitle}</View>
                <Slider style={{ width: '100%' }} value={progress.position / progress.duration} onSlidingComplete={seek} />
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