import { Linking, Platform, SafeAreaView, Text, View } from "react-native";
import { WebView } from "react-native-webview";
import { useEffect, useRef, useState } from "react";
import { apiAtom, credentialsAtom, userDataAtom, playlistAtom } from "../storage/atoms";
import { useAtom } from "jotai";
import Styles from "../styles";
import Entity from "../drupal/Entity";
import Include from "../drupal/Include";

const Home = () => {

    const uri = 'https://themusicclass.com/ios-content';

    const webViewRef = useRef(null);

    const [userData, setUserData] = useAtom(userDataAtom);
    const [api] = useAtom(apiAtom);
    const [credentials] = useAtom(credentialsAtom);
    const [playlists, setPlaylists] = useAtom(playlistAtom);

    const [centerMessage, setCenterMessage] = useState();

    let message = null;

    const getUser = () => {
        const currentTime = new Date().getTime();

        // if(userData && userData.expiration < currentTime) {
        //     return userData.data;
        // }

        const params = {
            'filter[email][path]': 'name',
            'filter[email][value]': credentials.username
        };

        api.getEntities('user', 'user', params)
        .then((response) => {
            if(response.status === 200) {
                const data = {
                    expiration: currentTime,
                    data: response.data.data[0],
                    included: response.data?.included
                };

                setUserData(data);
            }
        })
        .catch((error) => {
            console.log('Home.getUser:', error);
        });
    }

    useEffect(() => {
        getUser();
    }, []);

    useEffect(() => {
        if(userData instanceof Object && userData.hasOwnProperty('data')) {
            const user = new Entity(userData);

            message = user.get('center_message');
            if(message) {
                setCenterMessage(<View style={Styles.highlight}><Text>{message}</Text></View>);
            }

            let favorites = {
                title: 'Favorites',
                id: 'favorites',
                songs: []
            };

            if(user.get('field_favorites') instanceof Array) {
                favorites.songs = user.get('field_favorites').data.map((song) => song.get('id'));
            } else if(user.get('field_favorites') instanceof Include) {
                favorites.songs = [
                    user.get('field_favorites').get('id')
                ];
            }

            setPlaylists({
                favorites: favorites,
                userDefined: []
            });
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