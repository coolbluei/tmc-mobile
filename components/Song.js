import React, { useEffect, useState } from "react";
import { Image, Text, TouchableHighlight, TouchableOpacity, View } from "react-native";
import Styles from "../styles";
import { downloadsAtom, favoritesAtom, updateDownloadsAtom } from "../storage/atoms";
import { useAtom } from "jotai";
import { indexAtom, tracksAtom } from "../storage/audioAtoms";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faHeart as faHeartSolid } from "@fortawesome/pro-solid-svg-icons";
import { faHeart as faHeartRegular, faSquareCheck, faCloudArrowDown } from "@fortawesome/pro-regular-svg-icons";
import * as FileSystem from 'expo-file-system';
import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const Song = (props) => {
    const [index, setIndex] = useAtom(indexAtom);
    const [tracks, setTracks] = useAtom(tracksAtom);
    const [favorites, setFavorites] = useAtom(favoritesAtom);
    const [downloads] = useAtom(downloadsAtom);
    const [updateDownloads, setUpdateDownloads] = useAtom(updateDownloadsAtom);

    const [downloadProgress, setDownloadProgress] = useState(0);
    const [isFavorite, setIsFavorite] = useState(props.isFavorite);
    const [isDownloading, setIsDownloading] = useState(false);

    const play = () => {
        setTracks(props.tracks);
        setIndex(props.trackIndex);
    };

    const updateDownloadProgress = (progress) => {
        const percentageDownloaded = progress.totalBytesWritten / progress.totalBytesExpectedToWrite;
        setDownloadProgress(percentageDownloaded);
    };

    const download = async () => {
        if(isDownloading === false) {
            setIsDownloading(true);
            try {
                const dirInfo = await FileSystem.getInfoAsync(FileSystem.documentDirectory + 'songs/');
                
                if(!dirInfo.exists) {
                    await FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + 'songs/');
                }

                const { uri } = await FileSystem.createDownloadResumable(props.data.url, FileSystem.documentDirectory + 'songs/' + props.data.id + '.mp3', {}, updateDownloadProgress).downloadAsync();

                setUpdateDownloads(true);
            } catch (e) {
                console.log(e);
            }
        }
    };

    useEffect(() => {
        if(favorites.find((song) => song.id === props.data.id)) {
            setIsFavorite(true);
        }
    }, [])

    const toggleFavorite = () => {
        // Copy state variables.
        let updatedFavorites = [...favorites];

        if(isFavorite) {
            // Remove from favorites.
            const i = updatedFavorites.findIndex((track) => track.id === props.data.id);

            if(i >= 0) {
                updatedFavorites.splice(i, 1);
            }
        } else {
            updatedFavorites.push(props.data);
        }
        setFavorites(updatedFavorites);
        setIsFavorite(!isFavorite);
    };

    let favoriteIcon = faHeartRegular;
    if(isFavorite) {
        favoriteIcon = faHeartSolid;
    }

    const deleteSong = async () => {
        await FileSystem.deleteAsync(FileSystem.documentDirectory + 'songs/' + props.data.id + '.mp3');
        setUpdateDownloads(true);
        setIsDownloading(false);
    };

    const deleteButton = () => {
        return (
            <TouchableOpacity style={Styles.deleteButton} onPress={deleteSong}>
                <Text style={[Styles.textBig, Styles.textInverted]}>Delete</Text>
            </TouchableOpacity>
        );
    };

    let downloadIconStyle = Styles.download;
    if(isDownloading) {
        downloadIconStyle = Styles.isDownloading;
    }

    let downloadButton = (
        <TouchableOpacity onPress={download}>
            <FontAwesomeIcon size={24} icon={faCloudArrowDown} style={downloadIconStyle} />
        </TouchableOpacity>
    );

    let content = (
        <View>
            <TouchableHighlight style={Styles.listItem} onPress={play}>
                <View style={Styles.listItemContent}>
                    <Image style={Styles.listItemImage} src={props.data.artwork} />

                    <Text style={[Styles.title, Styles.listTitle]}>{props.data.title}</Text>

                    {downloadButton}

                    <TouchableOpacity onPress={toggleFavorite}>
                        <FontAwesomeIcon size={24} icon={favoriteIcon} style={Styles.favorite} />
                    </TouchableOpacity>
                </View>
            </TouchableHighlight>
        </View>

    );

    if(downloads.includes(props.data.id + '.mp3')) {
        downloadButton = (
            <FontAwesomeIcon size={24} icon={faSquareCheck} style={Styles.downloaded} />
        );

        content = (
            <GestureHandlerRootView>
                <Swipeable dragOffsetFromRightEdge={100} renderRightActions={deleteButton}>
                    <View>
                        <TouchableHighlight style={Styles.listItem} onPress={play}>

                            <View style={Styles.listItemContent}>
                                <Image style={Styles.listItemImage} src={props.data.artwork} />

                                <Text style={[Styles.title, Styles.listTitle]}>{props.data.title}</Text>

                                {downloadButton}

                                <TouchableOpacity onPress={toggleFavorite}>
                                    <FontAwesomeIcon size={24} icon={favoriteIcon} style={Styles.favorite} />
                                </TouchableOpacity>
                            </View>
                        </TouchableHighlight>
                    </View>
                </Swipeable>
            </GestureHandlerRootView>
        );
    }
    
    return (
        content
    );
};

export default Song;