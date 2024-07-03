import { apiAtom, credentialsAtom, isAuthenticatedAtom } from "../storage/atoms";
import { useAtom } from "jotai";
import LoginForm from "./Authentication/LoginForm";
import Home from "../screens/Home";
import React, { useEffect, useState } from "react";
import User from "../screens/User";
import Collections from "../screens/Collections";
import Navbar from "./Navbar";
import Styles from "../styles";
import { ActivityIndicator, Text, View } from "react-native";
import Songs from "../screens/Songs";
import Player from "./Player";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();

const Controller = () => {

    const [api] = useAtom(apiAtom);
    const [credentials] = useAtom(credentialsAtom);
    const [isAuthenticated] = useAtom(isAuthenticatedAtom);

    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        if(api && isAuthenticated && credentials.hasOwnProperty('username')) {
            setIsInitialized(true);
        }
    }, [api, isAuthenticated, credentials]);

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
                    <Stack.Navigator initialRouteName="Home" screenOptions={{headerShown: false}}>
                        <Stack.Screen name="Home" component={Home} />
                        <Stack.Screen name="Collections" component={Collections} />
                        <Stack.Screen name="Songs" component={Songs} />
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