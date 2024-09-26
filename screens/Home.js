import { Linking, Platform, RefreshControl, SafeAreaView, ScrollView, Text, View } from "react-native";
import { WebView } from "react-native-webview";
import { useCallback, useEffect, useRef, useState } from "react";
import { userDataAtom, isRefreshingAtom } from "../storage/atoms";
import { useAtom } from "jotai";
import Styles from "../styles";
import Entity from "../drupal/Entity";
import useUserData from '../drupal/useUserData.js';

const Home = () => {

    const uri = 'https://themusicclass.com/ios-content';

    const webViewRef = useRef(null);

    const [isRefreshing, setIsRefreshing] = useAtom(isRefreshingAtom);
    const [userData] = useAtom(userDataAtom);

    const [centerMessage, setCenterMessage] = useState();

    let message = null;

    const getUserData = useUserData();

    useEffect(() => {
        getUserData();
    }, [])

    const refresh = useCallback(() => {
        setIsRefreshing(true);
        getUserData();
    }, []);

    useEffect(() => {
        if(userData instanceof Object && userData.hasOwnProperty('data')) {
            const user = new Entity(userData);

            message = user.get('center_message');
            if(message) {
                setCenterMessage(<View style={Styles.highlight}><Text>{message}</Text></View>);
            }
        }
    }, [userData]);

    const refreshControl = <RefreshControl refreshing={isRefreshing} onRefresh={refresh} />;

    return (
        <SafeAreaView style={Styles.container}>
            <ScrollView contentContainerStyle={[Styles.scroll, { flexShrink: 10 }]} refreshControl={refreshControl}>
                {centerMessage}
            </ScrollView>

            <WebView 
                ref={webViewRef}
                originWhitelist={['*']}
                source={{ uri: uri }}
                containerStyle={{width: '100%', flexGrow: 1000}}
                javascriptEnabled={false}
                onShouldStartLoadWithRequest={(request) => {
                    if(request.url !== uri && request.url !== "about:blank" && request.url !== 'about:srcdoc' && (Platform.OS === 'android' || request.url === request.mainDocumentURL)) {
                        Linking.openURL(request.url);
                        return false;
                    } else {
                        return true;
                    }
                }}
                onHttpError={(syntheticEvent) => {
                    const { nativeEvent } = syntheticEvent;
                    console.warn(
                      'WebView received error status code: ',
                      nativeEvent.statusCode,
                    )
                }}
                onError={(syntheticEvent) => {
                    const { nativeEvent } = syntheticEvent;
                    console.warn('WebView error: ', nativeEvent);
                }}
            />

        </SafeAreaView>
    );
};

export default Home;