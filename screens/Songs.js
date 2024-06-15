import { useEffect, useState } from "react";
import { ScrollView, Text } from "react-native";
import Styles from "../styles";
import { useAtom } from "jotai";
import { songDataAtom } from "../storage/atoms";
import Entity from "../drupal/Entity";
import Include from "../drupal/Include";
import { SafeAreaView } from "react-native-safe-area-context";
import Song from "../components/Song";

const Songs = (props) => {

    const [songData] = useAtom(songDataAtom);
    const [title, setTitle] = useState();

    const [items, setItems] = useState();

    useEffect(() => {
        props.fetch(props.collectionId);
    }, []);

    useEffect(() => {
        if(songData instanceof Object && songData.hasOwnProperty('data')) {
            const collection = new Entity(songData);

            let songs = [];

            if(collection instanceof Entity && collection.hasOwnProperty('data')) {
                songs = collection.get('field_songs');
                setTitle(collection.get('title'));
            }

            if(songs instanceof Array && songs.length > 0) {
                const trackItems = songs.map((element) => {
                    const song = new Include(element, collection.included);
                    return {
                        title: song.get('title'),
                        artist: collection.get('title'),
                        artwork: song.get('field_image').get('uri').url,
                        url: song.get('field_full_song').get('uri').url
                    };
                })

                const content = songs.map((element, i) => {
                    const song = new Include(element, collection.included);
                    return (
                        <Song key={song.get('id')} data={song} trackIndex={i} tracks={trackItems} />
                    );
                });

                setItems(content);
            }
        }
    }, [songData]);

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
        <SafeAreaView style={Styles.container}>
            <Text style={Styles.pageTitle}>{title}</Text>
            <ScrollView>
                {songDataContent}
            </ScrollView>
        </SafeAreaView>
    );
};

export default Songs;