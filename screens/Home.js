import { Linking, Platform, RefreshControl, SafeAreaView, ScrollView, Text, View } from "react-native";
import { WebView } from "react-native-webview";
import { useCallback, useEffect, useRef, useState } from "react";
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
    const [isRefreshing, setIsRefreshing] = useState(false);

    let message = null;

    const currentTime = new Date().getTime();

    const getUser = () => {
        const params = {
            'filter[email][path]': 'name',
            'filter[email][value]': credentials.username
        };

        api.getEntities('user', 'user', params)
        .then((response) => {
            if(response.status === 200) {
                const data = {
                    expiration: currentTime + (30 * 60 * 1000),
                    data: response.data.data[0],
                    included: response.data?.included
                };

                setUserData(data);
            }
        })
        .catch((error) => {
            console.log('Home.getUser:', error);
        });
    };

    const refresh = useCallback(() => {
        setIsRefreshing(true);

        setTimeout(() => {
            setIsRefreshing(false);
        }, 2000);

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

    if(!userData || userData.expiration < currentTime) {
        getUser();
    }

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