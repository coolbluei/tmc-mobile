import { useCallback, useEffect, useState } from "react";
import { RefreshControl, SafeAreaView, ScrollView, Text } from "react-native";
import Styles from "../styles";
import { useAtom } from "jotai";
import { userDataAtom, isRefreshingAtom, downloadsAtom } from "../storage/atoms";
import Entity from "../drupal/Entity";
import Include from "../drupal/Include";
import Song from "../components/Song";
import { useFocusEffect } from "@react-navigation/native";
import * as FileSystem from 'expo-file-system';

const Collection = (props) => {

    const [title, setTitle] = useState();
    const [userData] = useAtom(userDataAtom);
    const [isRefreshing, setIsRefreshing] = useAtom(isRefreshingAtom);
    const [downloads] = useAtom(downloadsAtom);

    const [items, setItems] = useState();

    // Refresh the screen data.
    const refresh = useCallback(() => {
        // Set isRefreshing so that the spinner displays
        setIsRefreshing(true);
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
                    let source = song.get('field_full_song').get('uri')?.url;

                    if(downloads.includes(song.get('id') + '.mp3')) {
                        source = FileSystem.documentDirectory + 'songs/' + song.get('id') + '.mp3';
                    }
                    // Populate all the properties the Player needs for each song.
                    return {
                        title: song.get('title'),
                        artist: collection.get('title'),
                        artwork: song.get('field_image')?.get('uri')?.url,
                        url: source,
                        id: song.get('id'),
                    };
                })

                // Map each song to a Song component for display.
                const content = songs.map((song, i) => {
                    // Create the Song component for each song.
                    return (
                        <Song key={song.get('id')} data={trackItems[i]} trackIndex={i} tracks={trackItems} />
                    );
                });

                // Set the items list to the list of Song components.
                setItems(content);
            }
        }
    }, [userData, downloads]);

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