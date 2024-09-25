import { useCallback, useEffect, useState } from "react";
import { RefreshControl, SafeAreaView, ScrollView, Text } from "react-native";
import Styles from "../styles";
import { useAtom } from "jotai";
import { userDataAtom, isRefreshingAtom } from "../storage/atoms";
import Entity from "../drupal/Entity";
import Song from "../components/Song";
import useUserData from "../drupal/useUserData";

const Playlist = (props) => {

    const [userData] = useAtom(userDataAtom);
    const [isRefreshing, setIsRefreshing] = useAtom(isRefreshingAtom);

    const [items, setItems] = useState();
    const [title, setTitle] = useState();

    const getUserData = useUserData();

    const refresh = useCallback(() => {
        setIsRefreshing(true);
        getUserData();
    }, []);

    useEffect(() => {
        if(userData instanceof Object && userData.hasOwnProperty('data')) {
            const user = new Entity(userData);

            let songs = user.get('field_favorites');

            setTitle('Favorites');

            if(songs instanceof Array && songs.length > 0) {
                const trackItems = songs.map((song) => {
                    return {
                        title: song.get('title'),
                        artist: "Favorites",
                        artwork: song.get('field_image')?.get('uri')?.url,
                        url: song.get('field_full_song').get('uri')?.url,
                        id: song.get('id'),
                    };
                });

                const content = songs.map((song, i) => {
                    return (
                        <Song key={song.get('id')} data={song} trackIndex={i} isFavorite={true} tracks={trackItems} />
                    );
                });

                setItems(content);
            }
        }
    }, [userData]);

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