import { apiAtom, isAuthenticatedAtom, userDataAtom, offlineAtom, isRefreshingAtom, sessionAtom, needsDataAtom } from "../storage/atoms";
import { useAtom } from "jotai";
import LoginForm from "./Authentication/LoginForm";
import Home from "../screens/Home";
import React, { useEffect, useState } from "react";
import User from "../screens/User";
import Collections from "../screens/Collections";
import OfflineCollections from "../screens/OfflineCollections";
import Playlist from "../screens/Playlist";
import Navbar from "./Navbar";
import Styles from "../styles";
import { ActivityIndicator, View } from "react-native";
import Collection from "../screens/Collection";
import Player from "./Player";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Entity from "../drupal/Entity";
import DownloadManager from "./DownloadManager";
import { useNavigation } from "@react-navigation/native";
import * as FileSystem from 'expo-file-system';
import OfflineCollection from "../screens/OfflineCollection";
import useUserData from "../drupal/useUserData";

const Stack = createNativeStackNavigator();

const Controller = () => {

    const [api] = useAtom(apiAtom);
    const [isAuthenticated] = useAtom(isAuthenticatedAtom);
    const [userData] = useAtom(userDataAtom);
    const [offline] = useAtom(offlineAtom);
    const [isRefreshing, setIsRefreshing] = useAtom(isRefreshingAtom);
    const [session] = useAtom(sessionAtom);
    const [needsData] = useAtom(needsDataAtom);

    const [isInitialized, setIsInitialized] = useState(false);

    const navigation = useNavigation();

    const getUserData = useUserData();

    useEffect(() => {
        const initializeSongsDirectory = async () => {
            // Get the songs directory info.
            const dirInfo = await FileSystem.getInfoAsync(FileSystem.documentDirectory + 'songs/');

            // If the directory doesn't exist...
            if(!dirInfo.exists) {
                // Create the directory.
                await FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + 'songs/');
            }
        };

        initializeSongsDirectory();

        if(api && isAuthenticated && session) {
            setIsInitialized(true);
        }
    }, [api, isAuthenticated, session]);

    useEffect(() => {
        if(isAuthenticated && isInitialized && navigation.hasOwnProperty('navigate')) {
            if(offline) {
                navigation.navigate('My Downloads');
            } else {
                getUserData(false);
                navigation.navigate('Home');
            }
        }
    }, [offline, isAuthenticated, isInitialized]);

    useEffect(() => {
        if(session?.username?.toLowerCase() !== userData?.data?.name?.toLowerCase()) {
            setIsRefreshing(true);
        }
    }, [session]);

    useEffect(() => {
        if(needsData && !offline) {
            getUserData(false);
        }
    }, [needsData]);

    useEffect(() => {
        if(isRefreshing) {
            getUserData(true);
        }
    }, [isRefreshing]);

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
                    <DownloadManager />
                    <Stack.Navigator initialRouteName="Home" screenOptions={{headerShown: true}}>
                        <Stack.Screen name="Home" component={Home} options={{headerShown: false}} />
                        <Stack.Screen name="Collections" component={Collections} />
                        <Stack.Screen name="My Downloads" component={OfflineCollections} options={{headerLeft: () => { null }, headerBackVisible: false}} />
                        <Stack.Screen name="Collection Downloads" component={OfflineCollection} />
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