import { useEffect, useState } from "react";
import { SafeAreaView, ScrollView, Text } from "react-native";
import Styles from "../styles";
import { useAtom } from "jotai";
import { apiAtom, collectionDataAtom, userDataAtom } from "../storage/atoms";
import Entity from "../drupal/Entity";
import Include from "../drupal/Include";
import Collection from "../components/Collection";

const Collections = () => {

    const [userData] = useAtom(userDataAtom);
    const [collectionData, setCollectionData] = useAtom(collectionDataAtom);
    const [api] = useAtom(apiAtom);

    const [items, setItems] = useState();

    const getCollections = () => {
        const currentTime = new Date().getTime();

        const user = new Entity(userData);

        const params = {
            'include': 'field_application_access,field_application_access.field_image',
            'fields[user--user]': 'id,field_application_access'
        };

        api.getEntity('user', 'user', user.get('id'), params)
        .then((response) => {
            if(response.status === 200) {
                const data = {
                    expiration: currentTime,
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

    useEffect(() => {
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

                setItems(content);
            }
            
        }
    }, [collectionData]);

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

    return (
        <SafeAreaView style={[Styles.container, Styles.content]}>
            <Text style={Styles.pageTitle}>My Music</Text>
            <ScrollView contentContainerStyle={Styles.scroll}>
                {collectionDataContent}
            </ScrollView>
        </SafeAreaView>
    );
};

export default Collections;