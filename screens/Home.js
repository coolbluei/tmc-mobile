import { Linking, Platform, SafeAreaView, Text, View } from "react-native";
import { WebView } from "react-native-webview";
import { useCallback, useEffect, useRef, useState } from "react";
import { userDataAtom, isRefreshingAtom, needsDataAtom } from "../storage/atoms";
import { useAtom } from "jotai";
import Styles from "../styles";
import Entity from "../drupal/Entity";

const Home = () => {

    const uri = 'https://themusicclass.com/ios-content';

    const webViewRef = useRef(null);

    const [isRefreshing, setIsRefreshing] = useAtom(isRefreshingAtom);
    const [userData] = useAtom(userDataAtom);
    const [needsData, setNeedsData] = useAtom(needsDataAtom);

    const [centerMessage, setCenterMessage] = useState();

    let message = null;

    const refresh = useCallback(() => {
        setIsRefreshing(true);
    }, []);

    useEffect(() => {
        if(userData instanceof Object && userData.hasOwnProperty('data')) {
            const user = new Entity(userData);

            message = user.get('center_message');
            if(message) {
                setCenterMessage(<View style={Styles.highlight}><Text>{message}</Text></View>);
            }
        } else {
            setNeedsData(true);
        }
    }, [userData]);

    return (
        <SafeAreaView style={Styles.container}>
            <View>
                {centerMessage}
            </View>

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