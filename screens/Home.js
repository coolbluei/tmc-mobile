import { Linking, Platform, Text, View } from "react-native";
import { WebView } from "react-native-webview";
import { useEffect, useRef, useState } from "react";
import { userDataAtom } from "../storage/atoms";
import { useAtom } from "jotai";
import Styles from "../styles";
import Entity from "../drupal/Entity";

const Home = () => {

    const uri = 'https://themusicclass.com/ios-content';

    const webViewRef = useRef(null);

    const [userData] = useAtom(userDataAtom);

    const [centerMessage, setCenterMessage] = useState();

    let message = null;

    useEffect(() => {
        if(userData instanceof Object && userData.hasOwnProperty('data')) {
            const user = new Entity(userData);

            message = user.get('center_message');
            // if(message instanceof String && message !== "") {
                setCenterMessage(<View style={Styles.highlight}><Text>{message}</Text></View>);
            // }

            console.log(userData);
        }
    }, [userData]);

    return (
        <View style={Styles.container}>
            {centerMessage}
            <Text>{message}</Text>
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
        </View>
    );
};

export default Home;