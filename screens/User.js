import React, { useState } from 'react';
import { Button, Platform, SafeAreaView, Switch, Text, View } from "react-native";
import { useAtom } from "jotai";
import { apiAtom, biometricsEntrolledAtom, debugModeAtom, offlineAtom, preferencesAtom, sessionAtom, userDataAtom } from "../storage/atoms";
import Styles from "../styles";
import Entity from "../drupal/Entity";
import { useEffect } from "react";

const User = () => {

    const [userData, setUserData] = useAtom(userDataAtom);
    const [api] = useAtom(apiAtom);
    const [preferences, setPreferences] = useAtom(preferencesAtom);
    const [biometricsEnrolled] = useAtom(biometricsEntrolledAtom);
    const [offline, setOffline] = useAtom(offlineAtom);
    const [debugMode, setDebugMode] = useAtom(debugModeAtom);
    const [session, setSession] = useAtom(sessionAtom);

    const [name, setName] = useState();

    const logout = () => {
        setSession(null);
        setUserData(null);
    };

    const toggleOffline = () => {
        if(offline) {
            api.checkNetwork();
        } else {
            setOffline(true);
        }
    }

    useEffect(() => {
        if(userData && userData.hasOwnProperty('data')) {
            const user = new Entity(userData);
            setName(user.get('display_name'));
        }
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