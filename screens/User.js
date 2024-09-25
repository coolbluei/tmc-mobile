import React, { useState } from 'react';
import { Button, Platform, SafeAreaView, Switch, Text, View } from "react-native";
import { useAtom } from "jotai";
import { accessTokenAtom, apiAtom, biometricsEntrolledAtom, credentialsAtom, debugModeAtom, offlineAtom, preferencesAtom, refreshTokenAtom, userDataAtom } from "../storage/atoms";
import Styles from "../styles";
import Entity from "../drupal/Entity";
import { useEffect } from "react";
import useUserData from "../drupal/useUserData";

const User = () => {

    const [accessToken, setAccessToken] = useAtom(accessTokenAtom);
    const [refreshToken, setRefreshToken] = useAtom(refreshTokenAtom);
    const [userData, setUserData] = useAtom(userDataAtom);
    const [api] = useAtom(apiAtom);
    const [credentials] = useAtom(credentialsAtom);
    const [preferences, setPreferences] = useAtom(preferencesAtom);
    const [biometricsEnrolled] = useAtom(biometricsEntrolledAtom);
    const [offline, setOffline] = useAtom(offlineAtom);
    const [debugMode, setDebugMode] = useAtom(debugModeAtom);

    const [name, setName] = useState();

    const getUserData = useUserData();

    const logout = () => {
        setAccessToken(null);
        setRefreshToken(null);
    };

    const toggleOffline = () => {
        if(offline) {
            api.checkNetwork();
        } else {
            setOffline(true);
        }
    }

    useEffect(() => {
        getUserData();
        
        const user = new Entity(userData);
        setName(user.get('display_name'));
    }, []);

    const toggleDebugMode = () => {
        setDebugMode(!debugMode);
    }

    const setBiometricsPreference = (value) => {
        const newPreferences = {
            useBiometrics: value
        };

        setPreferences(newPreferences);
    };

    let biometricsControl = null;
    if(biometricsEnrolled) {
        let biometricsLabel = 'Biometrics';
        if(Platform.OS === 'ios') {
            biometricsLabel = "FaceID";
        }

        biometricsControl = (
            <View style={Styles.listItem}>
                <View style={Styles.listItemContent}>
                    <Text style={[Styles.title, Styles.controlTitle]}>Enable {biometricsLabel}</Text>
                    <Switch style={[Styles.listTitle, Styles.controlContent]} value={preferences.useBiometrics} onValueChange={setBiometricsPreference} />
                </View>
            </View>
        );
    }

    return (
        <SafeAreaView style={Styles.container}>
            <Text style={Styles.pageTitle}>{name}</Text>
            {biometricsControl}

            <View style={Styles.listItem}>
                <View style={Styles.listItemContent}>
                    <Text style={[Styles.title, Styles.controlTitle]}>Offline Mode</Text>
                    <Switch style={[Styles.listTitle, Styles.controlContent]} value={offline} onValueChange={toggleOffline} />
                </View>
            </View>

            <View style={Styles.listItem}>
                <View style={Styles.listItemContent}>
                    <Text style={[Styles.title, Styles.controlTitle]}>Debug Mode</Text>
                    <Switch style={[Styles.listTitle, Styles.controlContent]} value={debugMode} onValueChange={toggleDebugMode} />
                </View>
            </View>

            <Button title="Logout" onPress={logout} />
        </SafeAreaView>
    );
};

export default User;