import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, RefreshControl, SafeAreaView, ScrollView, Text, View } from "react-native";
import Styles from "../styles";
import { useAtom } from "jotai";
import { playlistAtom, isRefreshingAtom, userDataAtom } from "../storage/atoms";
import Entity from "../drupal/Entity";
import Collection from "../components/Collection";
import Playlist from "../components/Playlist";
import useUserData from "../drupal/useUserData";

const Collections = () => {

    const [userData] = useAtom(userDataAtom);
    const [isRefreshing, setIsRefreshing] = useAtom(isRefreshingAtom);

    const [items, setItems] = useState();

    const getUserData = useUserData();

    const refresh = useCallback(() => {
        setIsRefreshing(true);
        getUserData();
    }, []);

    useEffect(() => {
        if(userData instanceof Object && userData.hasOwnProperty('data')) {
            const user = new Entity(userData);

            let collections = [];

            if(user) {
                collections = user.get('field_application_access');
            }

            if(collections instanceof Array && collections.length > 0) {
                const content = collections.map((collection) => {
                    return (
                        <Collection key={collection.get('id')} data={collection} />
                    );
                });

                const favorites = user.get('field_favorites');

                if(favorites instanceof Object && favorites.length > 0) {
                    content.unshift(<Playlist key="favorites" title="Favorites" playlistId="favorites" imageUrl={require('../assets/favorites-icon.jpg')} />);
                }

                setItems(content);
            }
            
        }

        setIsRefreshing(false);
    }, [userData]);

    let collectionDataContent = (
        <View style={Styles.appWrapper}>
            <ActivityIndicator size="large" color="#000000" />
        </View>
    );

    if(items instanceof Array) { 
        if(items.length > 0) {
            collectionDataContent = items;
        } else {
            collectionDataContent = (
                <Text>Nothing to see here yet. Register for a class to get Music!</Text>
            );
        }
    }

    const refreshControl = <RefreshControl refreshing={isRefreshing} onRefresh={refresh} />;

    return (
        <SafeAreaView style={[Styles.container, Styles.content]}>
            <Text style={Styles.pageTitle}>My Music</Text>
            <ScrollView contentContainerStyle={Styles.scroll} refreshControl={refreshControl}>
                {collectionDataContent}
            </ScrollView>
        </SafeAreaView>
    );
};

export default Collections;