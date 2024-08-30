import { apiAtom, credentialsAtom, downloadsAtom, downloadQueueAtom, isAuthenticatedAtom, playlistSyncAtom, lastPlaylistSyncAtom, playlistAtom, updateDownloadsAtom, userDataAtom } from "../storage/atoms";
import { useAtom } from "jotai";
import LoginForm from "./Authentication/LoginForm";
import Home from "../screens/Home";
import React, { useEffect, useState } from "react";
import User from "../screens/User";
import Collections from "../screens/Collections";
import Playlist from "../screens/Playlist";
import Navbar from "./Navbar";
import Styles from "../styles";
import { ActivityIndicator, Modal, View } from "react-native";
import Collection from "../screens/Collection";
import Player from "./Player";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Entity from "../drupal/Entity";
import * as FileSystem from 'expo-file-system';

const Stack = createNativeStackNavigator();

const Controller = () => {

    const [api] = useAtom(apiAtom);
    const [credentials] = useAtom(credentialsAtom);
    const [isAuthenticated] = useAtom(isAuthenticatedAtom);
    const [playlists] = useAtom(playlistAtom);
    const [playlistSync, setPlaylistSync] = useAtom(playlistSyncAtom);
    const [lastPlaylistSync, setLastPlaylistSync] = useAtom(lastPlaylistSyncAtom);
    const [userData, setUserData] = useAtom(userDataAtom);
    const [downloads, setDownloads] = useAtom(downloadsAtom);
    const [updateDownloads, setUpdateDownloads] = useAtom(updateDownloadsAtom);
    const [downloadQueue, setDownloadQueue] = useAtom(downloadQueueAtom);

    const [isInitialized, setIsInitialized] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);

    const removeSongFromDownloadQueue = () => {
        let queue = [...downloadQueue];
        queue.shift();
        setDownloadQueue(queue);
    };

    const downloadProgress = (progress) => {
        if(progress.totalBytesWritten / progress.totalBytesExpectedToWrite > 0.9) {
            removeSongFromDownloadQueue();
        }
    };

    const downloadNextSong = async () => {
        try {
            const song = downloadQueue[0];

            const dirInfo = await FileSystem.getInfoAsync(FileSystem.documentDirectory + 'songs/');
            
            if(!dirInfo.exists) {
                await FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + 'songs/');
            }

            if(downloads.includes(song.get('id') + '.mp3') === false) {
                await FileSystem.createDownloadResumable(song.get('field_full_song').get('uri').url, FileSystem.documentDirectory + 'songs/' + song.get('id') + '.mp3', {}, downloadProgress).downloadAsync();
            } else {
                removeSongFromDownloadQueue();
            }
        } catch (e) {
            console.log('DownloadNextSong:', e);
            setIsDownloading(false);
        }
    };

    useEffect(() => {
        if(downloadQueue.length === 0) {
            setIsDownloading(false);
            setUpdateDownloads(true);
        } else {
            setIsDownloading(true);
            downloadNextSong();
        }
    }, [downloadQueue]);

    useEffect(() => {
        if(updateDownloads) {
            FileSystem.readDirectoryAsync(FileSystem.documentDirectory + 'songs/').then((data) => {
                setDownloads(data);
                setUpdateDownloads(false);
            });
        }
    }, [updateDownloads]);

    useEffect(() => {
        if(api && isAuthenticated && credentials.hasOwnProperty('username')) {
            setIsInitialized(true);
        }
    }, [api, isAuthenticated, credentials]);

    useEffect(() => {
        if(api && playlistSync && userData) {
            console.log('reacting to playlist sync');
            const currentTime = new Date().getTime();

            if(currentTime > lastPlaylistSync + (30 * 1000)) {
                console.log('starting write');
            
                const user = new Entity(userData);

                const songs = playlists.favorites.songs.map((songId) => {
                    return {
                        type: "node--song",
                        id: songId
                    };
                });

                const body = {
                    data: {
                        type: "user--user",
                        id: user.get('id'),
                        relationships: {
                            field_favorites: {
                                data: songs
                            }
                        }
                    }
                };
        
                api.patchEntity('user', 'user', user.get('id'), body)
                .then((response) => {
                    if(response.status === 200) {
                        console.log('write successful');
                        setPlaylistSync(false);
                        setLastPlaylistSync(currentTime);
                    }
                })
                .catch((error) => {
                    console.log('Controller.patchUser:', error);
                });
            }
        }
    }, [api, playlistSync]);

    let content = <LoginForm />;

    if(isAuthenticated) {
        content = (
            <View style={Styles.appWrapper}>
                <ActivityIndicator size="large" color="#000000" />
            </View>
        );

        if(isInitialized) {
            content = (
                <View style={Styles.appWrapper}>
                    <Modal animationType="fade" transparent={true} visible={isDownloading}>
                        <View style={[Styles.container, Styles.modal]}>
                            <ActivityIndicator size="large" color="#ffffff" />
                        </View>
                    </Modal>
                    <Stack.Navigator initialRouteName="Home" screenOptions={{headerShown: true}}>
                        <Stack.Screen name="Home" component={Home} headerShown={false} />
                        <Stack.Screen name="Collections" component={Collections} />
                        <Stack.Screen name="Collection" component={Collection} />
                        <Stack.Screen name="Playlist" component={Playlist} />
                        <Stack.Screen name="User" component={User} />
                    </Stack.Navigator>
                    <Player />
                    <Navbar navigation={Stack} />
                </View>
            );
        }
    }

    return content;
};

export default Controller;