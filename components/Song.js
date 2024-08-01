import React, { useState } from "react";
import { Image, Text, TouchableHighlight, TouchableOpacity, View } from "react-native";
import Styles from "../styles";
import { downloadsAtom, playlistAtom, playlistSyncAtom, updateDownloadsAtom } from "../storage/atoms";
import { useAtom } from "jotai";
import { indexAtom, tracksAtom } from "../storage/audioAtoms";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faStar as faStarSolid, faCloudArrowDown, faCircleDown } from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarRegular } from "@fortawesome/free-regular-svg-icons";
import * as FileSystem from 'expo-file-system';
import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const Song = (props) => {
    const [index, setIndex] = useAtom(indexAtom);
    const [tracks, setTracks] = useAtom(tracksAtom);
    const [playlists, setPlaylists] = useAtom(playlistAtom);
    const [playlistSync, setPlaylistSync] = useAtom(playlistSyncAtom);
    const [downloads] = useAtom(downloadsAtom);
    const [updateDownloads, setUpdateDownloads] = useAtom(updateDownloadsAtom);

    const [downloadProgress, setDownloadProgress] = useState(0);
    const [isFavorite, setIsFavorite] = useState(props.isFavorite);

    const play = () => {
        setTracks(props.tracks);
        setIndex(props.trackIndex);
    };

    const updateDownloadProgress = (progress) => {
        const percentageDownloaded = progress.totalBytesWritten / progress.totalBytesExpectedToWrite;
        setDownloadProgress(percentageDownloaded);
    };

    const download = async () => {
        try {
            const dirInfo = await FileSystem.getInfoAsync(FileSystem.documentDirectory + 'songs/');
            
            if(!dirInfo.exists) {
                await FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + 'songs/');
            }

            const { uri } = await FileSystem.createDownloadResumable(props.data.get('field_full_song').get('uri').url, FileSystem.documentDirectory + 'songs/' + props.data.get('id') + '.mp3', {}, updateDownloadProgress).downloadAsync();

            setUpdateDownloads(true);
        } catch (e) {
            console.log(e);
        }
    };

    const toggleFavorite = () => {
        // Copy state variables.
        let lists = {...playlists};

        if(isFavorite) {
            // Remove from favorites.
            const i = lists.favorites.songs.indexOf(props.data.get('id'));

            if(i >= 0) {
                lists.favorites.songs.splice(i, 1);
            }
        } else {
            // Add to favorites.
            lists.favorites.songs.push(props.data.get('id'));
        }
        setPlaylists(lists);
        setPlaylistSync(true);
        setIsFavorite(!isFavorite);
    };

    let favoriteIcon = faStarRegular;
    if(isFavorite) {
        favoriteIcon = faStarSolid;
    }

    let downloadButton = (
        <TouchableOpacity onPress={download}>
            <FontAwesomeIcon size={24} icon={faCloudArrowDown} />
        </TouchableOpacity>

    );
    if(downloads.includes(props.data.get('id') + '.mp3')) {
        downloadButton = (
            <FontAwesomeIcon size={24} icon={faCircleDown} />
        );
    }
    
    return (
        <View style={Styles.padded}>
            <TouchableHighlight style={Styles.listItem} onPress={play}>
                <GestureHandlerRootView>
                <Swipeable>
                    <View style={Styles.listItemContent}>
                        <Image style={Styles.listItemImage} src={props.data.get('field_image')?.get('uri')?.url} />

                        <Text style={[Styles.title, Styles.listTitle]}>{props.data.get('title')}</Text>

                        {downloadButton}

                        <TouchableOpacity onPress={toggleFavorite}>
                            <FontAwesomeIcon size={24} icon={favoriteIcon} />
                        </TouchableOpacity>
                    </View>
                </Swipeable>
                </GestureHandlerRootView>
            </TouchableHighlight>
        </View>
    );
};

export default Song;