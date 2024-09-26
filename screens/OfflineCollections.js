import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView } from 'react-native';
import { useAtom } from 'jotai';
import { downloadsAtom, userDataAtom } from '../storage/atoms';
import OfflineCollection from '../components/OfflineCollection';
import Entity from '../drupal/Entity';
import Styles from '../styles';

const OfflineCollections = () => {

    const [downloads] = useAtom(downloadsAtom);
    const [userData] = useAtom(userDataAtom);

    const [collections, setCollections] = useState([]);

    useEffect(() => {
        // Make a list of Collections for which we have at least one song downloaded.
        let collectionItems = [];
        if(userData instanceof Object && userData.hasOwnProperty('data')) {
            const user = new Entity(userData);
            const collections = user.get('field_application_access');
            if(collections instanceof Array) {
                for(const collection of collections) {
                    let availableSongs = [];
                    const collectionSongs = collection.get('field_songs');
                    if(collectionSongs instanceof Array) {
                        for(const song of collectionSongs) {
                            if(downloads.includes(song.get('id') + '.mp3')) {
                                availableSongs.push(song.get('id'));
                            }
                        }

                        if(availableSongs.length > 0) {
                            collectionItems.push(<OfflineCollection key={collection.get('id')} data={collection} songs={collectionSongs} availableSongs={availableSongs} />);
                        }
                    }
                }
            }
        }

        setCollections(collectionItems);
    }, [])

    return (
        <SafeAreaView style={[Styles.container, Styles.content]}>
            <ScrollView contentContainerStyle={Styles.scroll}>
                {collections}
            </ScrollView>
        </SafeAreaView>
    );
};

export default OfflineCollections;