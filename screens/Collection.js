import { useCallback, useEffect, useState } from "react";
import { RefreshControl, SafeAreaView, ScrollView, Text } from "react-native";
import Styles from "../styles";
import { useAtom } from "jotai";
import { userDataAtom, isRefreshingAtom } from "../storage/atoms";
import Entity from "../drupal/Entity";
import Include from "../drupal/Include";
import Song from "../components/Song";
import { useFocusEffect } from "@react-navigation/native";
import useUserData from "../drupal/useUserData";

const Collection = (props) => {

    const [title, setTitle] = useState();
    const [userData] = useAtom(userDataAtom);
    const [isRefreshing, setIsRefreshing] = useAtom(isRefreshingAtom);

    const [items, setItems] = useState();

    const getUserData = useUserData();

    // Refresh the screen data.
    const refresh = useCallback(() => {
        // Set isRefreshing so that the spinner displays
        setIsRefreshing(true);
        getUserData();
    }, []);

    // A callback to refresh the screen.
    const load = () => {
        refresh();
    };

    // A callback to reset the screen.
    const unload = () => {
        setItems(null);
    }

    // When the screen becomes focused.
    useFocusEffect(
        useCallback(() => {
            // Load the data.
            load();

            // Cleanup for when the screen becomes unfocused.
            return () => {
                unload();
            };
        }, [])
    );

    // React to userData being updated.
    useEffect(() => {
        // If we have a userData object and it has a data property...
        if(userData instanceof Object && userData.hasOwnProperty('data')) {
            // create a user entity fromt the songData.
            const user = new Entity(userData);

            const collections = user.get('field_application_access');

            const favorites = user.get('field_favorites');

            const collection = collections.find((element) => element.get('id') === props.route.params.collectionId);

            // Initialize a list of songs.
            let songs = [];

            // If we have a collection Entity and it has a data property...
            if(collection instanceof Include && collection.hasOwnProperty('data')) {
                // Get the songs from the collection.
                songs = collection.get('field_songs');

                // Set the screen title to the collection title.
                setTitle(collection.get('title'));
            }

            // If we have a list of songs...
            if(songs instanceof Array && songs.length > 0) {
                // Map each song to a trackItem object that the Player can handle.
                const trackItems = songs.map((song) => {
                    // Populate all the properties the Player needs for each song.
                    return {
                        title: song.get('title'),
                        artist: collection.get('title'),
                        artwork: song.get('field_image')?.get('uri')?.url,
                        url: song.get('field_full_song').get('uri')?.url,
                        id: song.get('id'),
                    };
                })

                // Map each song to a Song component for display.
                const content = songs.map((song, i) => {
                    // Determine if the song is a favorite.
                    let isFavorite = false;
                    if(favorites instanceof Array && favorites.find((e) => e.get('id') === song.get('id'))) {
                        isFavorite = true;
                    }

                    // Create the Song component for each song.
                    return (
                        <Song key={song.get('id')} data={song} trackIndex={i} isFavorite={isFavorite} tracks={trackItems} />
                    );
                });

                // Set the items list to the list of Song components.
                setItems(content);
            }
        }
    }, [userData]);

    // Set the content for the screen.
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

    // Create a swipe down to refresh widget.
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

export default Collection;