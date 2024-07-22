import { useEffect, useState } from "react";
import { SafeAreaView, ScrollView, Text } from "react-native";
import Styles from "../styles";
import { useAtom } from "jotai";
import { apiAtom, songDataAtom, playlistData, userDataAtom, playlistAtom } from "../storage/atoms";
import Entity from "../drupal/Entity";
import Include from "../drupal/Include";
import Song from "../components/Song";

const Collection = (props) => {

    const [songData, setSongData] = useAtom(songDataAtom);
    const [api] = useAtom(apiAtom);
    const [title, setTitle] = useState();
    const [userData] = useAtom(userDataAtom);
    const [playlists] = useAtom(playlistAtom)

    const [items, setItems] = useState();

    const getSongs = () => {
        const currentTime = new Date().getTime();

        api.getEntity('node', 'collection', props.route.params.collectionId)
        .then((response) => {
            if(response.status === 200) {
                const data = {
                    expiration: currentTime,
                    data: response.data.data,
                    included: response.data?.included
                };
                setSongData(data);
            }
        })
        .catch((error) => {
            console.log('Songs.getSongs:', error);
        });
    }

    useEffect(() => {
        getSongs();
    }, [])

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
                        artwork: song.get('field_image')?.get('uri')?.url,
                        url: song.get('field_full_song').get('uri').url
                    };
                })

                const content = songs.map((element, i) => {
                    const song = new Include(element, collection.included);

                    const user = new Entity(userData);
                    let isFavorite = false;

                    if(playlists.favorites.songs.find((e) => e === element.get('id'))) {
                        isFavorite = true;
                    }

                    return (
                        <Song key={song.get('id')} data={song} trackIndex={i} isFavorite={isFavorite} tracks={trackItems} />
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
        <SafeAreaView style={[Styles.container, Styles.content]}>
            <Text style={Styles.pageTitle}>{title}</Text>
            <ScrollView contentContainerStyle={Styles.scroll}>
                {songDataContent}
            </ScrollView>
        </SafeAreaView>
    );
};

export default Collection;