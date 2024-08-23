import { useCallback, useEffect, useState } from "react";
import { RefreshControl, SafeAreaView, ScrollView, Text } from "react-native";
import Styles from "../styles";
import { useAtom } from "jotai";
import { apiAtom, collectionDataAtom, playlistAtom, userDataAtom } from "../storage/atoms";
import Entity from "../drupal/Entity";
import Include from "../drupal/Include";
import Collection from "../components/Collection";
import Playlist from "../components/Playlist";

const Collections = () => {

    const [userData] = useAtom(userDataAtom);
    const [collectionData, setCollectionData] = useAtom(collectionDataAtom);
    const [api] = useAtom(apiAtom);
    const [playlists] = useAtom(playlistAtom);

    const [items, setItems] = useState();
    const [isRefreshing, setIsRefreshing] = useState(false);

    const currentTime = new Date().getTime();

    const getCollections = () => {

        const user = new Entity(userData);

        const params = {
            'include': 'field_application_access,field_application_access.field_image,field_application_access.field_songs,field_application_access.field_songs.field_full_song',
            'fields[user--user]': 'id,field_application_access'
        };

        api.getEntity('user', 'user', user.get('id'), params)
        .then((response) => {
            if(response.status === 200) {
                const data = {
                    expiration: currentTime + (30 * 60 * 1000),
                    data: response.data.data,
                    included: response.data?.included
                };
                setCollectionData(data);
            }
        })
        .catch((error) => {
            console.log('Collections.getCollections:', error);
        });
    };

    const refresh = useCallback(() => {
        setIsRefreshing(true);

        setTimeout(() => {
            setIsRefreshing(false);
        }, 2000);

        getCollections();
    }, []);

    useEffect(() => {
        if(collectionData instanceof Object && collectionData.hasOwnProperty('data')) {
            const user = new Entity(collectionData);

            let collections = [];

            if(user instanceof Entity && user.hasOwnProperty('data')) {
                collections = user.get('field_application_access');
            }

            if(collections instanceof Array && collections.length > 0) {
                const content = collections.map((element) => {
                    const collection = new Include(element, user.included);
                    return (
                        <Collection key={collection.get('id')} data={collection} />
                    );
                });

                if(playlists.favorites.songs.length > 0) {
                    content.unshift(<Playlist key="favorites" title="Favorites" playlistId="favorites" />);
                }

                setItems(content);
            }
            
        }
    }, [collectionData, playlists]);

    let collectionDataContent = null;

    if(items instanceof Array) { 
        if(items.length > 0) {
            collectionDataContent = items;
        } else {
            collectionDataContent = (
                <Text>Nothing to see here.</Text>
            );
        }
    }

    const refreshControl = <RefreshControl refreshing={isRefreshing} onRefresh={refresh} />;

    if(!collectionData || collectionData.expiration < currentTime) {
        getCollections();
    }

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