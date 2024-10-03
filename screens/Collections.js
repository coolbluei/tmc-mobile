import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, RefreshControl, SafeAreaView, ScrollView, Text, View } from "react-native";
import Styles from "../styles";
import { useAtom } from "jotai";
import { favoritesAtom, isRefreshingAtom, needsDataAtom, userDataAtom } from "../storage/atoms";
import Entity from "../drupal/Entity";
import Collection from "../components/Collection";
import Playlist from "../components/Playlist";

const Collections = () => {

    const [userData] = useAtom(userDataAtom);
    const [isRefreshing, setIsRefreshing] = useAtom(isRefreshingAtom);
    const [needsData, setNeedsData] = useAtom(needsDataAtom);
    const [favorites] = useAtom(favoritesAtom);

    const [items, setItems] = useState();

    const refresh = useCallback(() => {
        setIsRefreshing(true);
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

                if(favorites instanceof Array && favorites.length > 0) {
                    content.unshift(<Playlist key="favorites" title="Favorites" playlistId="favorites" imageUrl={require('../assets/favorites-icon.jpg')} />);
                }

                setItems(content);
            }
            
        } else {
            setNeedsData(true);
        }
    }, [userData, favorites]);

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