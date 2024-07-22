import { apiAtom, credentialsAtom, isAuthenticatedAtom, playlistSyncAtom, lastPlaylistSyncAtom, playlistAtom, userDataAtom } from "../storage/atoms";
import { useAtom } from "jotai";
import LoginForm from "./Authentication/LoginForm";
import Home from "../screens/Home";
import React, { useEffect, useState } from "react";
import User from "../screens/User";
import Collections from "../screens/Collections";
import Playlist from "../screens/Playlist";
import Navbar from "./Navbar";
import Styles from "../styles";
import { ActivityIndicator, Text, View } from "react-native";
import Collection from "../screens/Collection";
import Player from "./Player";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Entity from "../drupal/Entity";

const Stack = createNativeStackNavigator();

const Controller = () => {

    const [api] = useAtom(apiAtom);
    const [credentials] = useAtom(credentialsAtom);
    const [isAuthenticated] = useAtom(isAuthenticatedAtom);
    const [playlists] = useAtom(playlistAtom);
    const [playlistSync, setPlaylistSync] = useAtom(playlistSyncAtom);
    const [lastPlaylistSync, setLastPlaylistSync] = useAtom(lastPlaylistSyncAtom);
    const [userData, setUserData] = useAtom(userDataAtom);

    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        if(api && isAuthenticated && credentials.hasOwnProperty('username')) {
            setIsInitialized(true);
        }
    }, [api, isAuthenticated, credentials]);

    useEffect(() => {
        if(api && playlistSync && userData) {
            const currentTime = new Date().getTime();

            if(currentTime > lastPlaylistSync + (30 * 1000)) {
            
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
                    <Stack.Navigator initialRouteName="Home" screenOptions={{headerShown: true}}>
                        <Stack.Screen name="Home" component={Home} />
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