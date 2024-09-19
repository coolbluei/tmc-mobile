import { useCallback, useEffect, useState } from "react";
import { RefreshControl, SafeAreaView, ScrollView, Text } from "react-native";
import Styles from "../styles";
import { useAtom } from "jotai";
import { apiAtom, songDataAtom, playlistData, userDataAtom, playlistAtom, collectionDataAtom } from "../storage/atoms";
import Entity from "../drupal/Entity";
import Include from "../drupal/Include";
import Song from "../components/Song";
import { useFocusEffect } from "@react-navigation/native";
import OfflineSong from "../components/OfflineSong";

const OfflineCollection = (props) => {

    const [collectionData] = useAtom(collectionDataAtom);

    const [title, setTitle] = useState();
    const [items, setItems] = useState();

    useEffect(() => {
        const collectionIndex = collectionData.data.relationships.field_application_access?.data?.findIndex((element) => element.id === props.route.params.collectionId);

        if(collectionIndex >= 0) {
            const collection = new Include(collectionData.data.relationships.field_application_access.data[collectionIndex], collectionData.included);

            const songs = collection.get('field_songs');

            console.log(songs);
            setTitle(collection.get('title'));
    
            if(songs instanceof Array && songs.length > 0) {
                const trackItems = songs.map((song) => {
                    return {
                        title: song.get('title'),
                        artist: collection.get('title'),
                        artwork: song.get('field_image')?.get('uri')?.url,
                        url: song.get('field_full_song').get('uri').url,
                        id: song.get('id'),
                    };
                })
    
                const content = songs.map((song, i) => {
                    return (
                        <OfflineSong key={song.get('id')} data={song} trackIndex={i} tracks={trackItems} />
                    );
                });
    
                setItems(content);
            }
        }
    }, []);

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

    return (
        <SafeAreaView style={[Styles.container, Styles.content]}>
            <Text style={Styles.pageTitle}>{title}</Text>
            <ScrollView contentContainerStyle={Styles.scroll}>
                {songDataContent}
            </ScrollView>
        </SafeAreaView>
    );
};

export default OfflineCollection;