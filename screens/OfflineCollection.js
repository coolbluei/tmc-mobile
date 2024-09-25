import { useEffect, useState } from "react";
import { SafeAreaView, ScrollView, Text } from "react-native";
import Styles from "../styles";
import { useAtom } from "jotai";
import { userDataAtom, downloadsAtom } from "../storage/atoms";
import Entity from "../drupal/Entity";
import OfflineSong from "../components/OfflineSong";

const OfflineCollection = (props) => {

    const [userData] = useAtom(userDataAtom);
    const [downloads] = useAtom(downloadsAtom);

    const [title, setTitle] = useState();
    const [items, setItems] = useState();

    useEffect(() => {
        if(userData instanceof Object && userData.hasOwnProperty('data')) {
            const user = new Entity(userData);

            const collections = user.get('field_application_access');

            const collection = collections.find((element) => element.get('id') === props.route.params.collectionId);

            if(collection) {
                const songs = collection.get('field_songs');

                setTitle(collection.get('title'));
        
                if(songs instanceof Array && songs.length > 0) {
                    let trackItems = [];
                    for(const song of songs) {
                        if(downloads.includes(song.get('id') + '.mp3')) {
                            trackItems.push({
                                title: song.get('title'),
                                artist: collection.get('title'),
                                artwork: song.get('field_image')?.get('uri')?.url,
                                url: song.get('field_full_song').get('uri').url,
                                id: song.get('id'),
                            });
                        }
                    };
        
                    let index = 0;
                    let content = [];
                    for(const song of songs) {
                        if(downloads.includes(song.get('id') + '.mp3')) {
                            content.push(<OfflineSong key={song.get('id')} data={song} trackIndex={index} tracks={trackItems} />);
                            index++;
                        }
                    };
        
                    setItems(content);
                }
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