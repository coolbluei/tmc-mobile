import { useCallback, useEffect, useState } from "react";
import { RefreshControl, SafeAreaView, ScrollView, Text } from "react-native";
import Styles from "../styles";
import { useAtom } from "jotai";
import { favoritesAtom, userDataAtom, isRefreshingAtom } from "../storage/atoms";
import Entity from "../drupal/Entity";
import Song from "../components/Song";

const Playlist = () => {

    const [userData] = useAtom(userDataAtom);
    const [isRefreshing, setIsRefreshing] = useAtom(isRefreshingAtom);
    const [favorites] = useAtom(favoritesAtom);

    const [items, setItems] = useState();
    const [title, setTitle] = useState();

    const refresh = useCallback(() => {
        setIsRefreshing(true);
    }, []);

    useEffect(() => {
        if(userData instanceof Object && userData.hasOwnProperty('data')) {
            const user = new Entity(userData);

            setTitle('Favorites');

            if(favorites instanceof Array && favorites.length > 0) {
                const trackItems = favorites.map((song) => {
                    return song;
                });

                const content = favorites.map((song, i) => {
                    return (
                        <Song key={song.id} data={song} trackIndex={i} isFavorite={true} tracks={trackItems} />
                    );
                });

                setItems(content);
            }
        }
    }, [favorites]);

    let songDataContent = null;

    if(items instanceof Array) { 
        if(items.length > 0) {
            songDataContent = items;
        } else {
            songDataContent = (
                <Text>Nothing to see here.</Text>
            );
        }
    }

    const refreshControl = <RefreshControl refreshing={isRefreshing} onRefresh={refresh} />;

    return (
        <SafeAreaView style={[Styles.container, Styles.content]}>
            <Text style={Styles.pageTitle}>{title}</Text>
            <ScrollView contentContainerStyle={Styles.scroll} refreshControl={refreshControl}>
                {songDataContent}
            </ScrollView>
        </SafeAreaView>
    );
};

export default Playlist;