import { Linking, Platform, Text, View } from "react-native";
import { WebView } from "react-native-webview";
import { useEffect, useRef, useState } from "react";
import { userDataAtom } from "../storage/atoms";
import { useAtom } from "jotai";
import { SafeAreaView } from "react-native-safe-area-context";
import Styles from "../styles";
import Entity from "../drupal/Entity";

const Home = (props) => {

    const uri = 'https://themusicclass.com/ios-content';

    const webViewRef = useRef(null);

    const [userData] = useAtom(userDataAtom);

    const [centerMessage, setCenterMessage] = useState();

    useEffect(() => {
        props.fetch();
    }, []);

    useEffect(() => {
        if(userData instanceof Object && userData.hasOwnProperty('data')) {
            const user = new Entity(userData);

            setCenterMessage(<View style={Styles.highlight}><Text>{user.get('center_message')}</Text></View>);
        }
    }, [userData]);

    return (
        <SafeAreaView style={Styles.container}>
            {centerMessage}
            <WebView 
                ref={webViewRef} 
                originWhitelist={['*']} 
                source={{ uri: uri }} 
                containerStyle={{width: '100%'}}
                javascriptEnabled={false}
                onShouldStartLoadWithRequest={(request) => {
                    if(request.url !== uri && request.url !== "about:blank" && request.url !== 'about:srcdoc' && (Platform.OS === 'android' || request.url === request.mainDocumentURL)) {
                        Linking.openURL(request.url);
                        return false;
                    } else {
                        return true;
                    }
                }}
            />
        </SafeAreaView>
    );
};

export default Home;