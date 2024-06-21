import { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import Styles from "../styles";
import { useAtom } from "jotai";
import { collectionDataAtom } from "../storage/atoms";
import Entity from "../drupal/Entity";
import Include from "../drupal/Include";
import Collection from "../components/Collection";

const Collections = (props) => {

    const [collectionData] = useAtom(collectionDataAtom);

    const [items, setItems] = useState();

    useEffect(() => {
        props.fetch();
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
        <View style={Styles.container}>
            <Text style={Styles.pageTitle}>My Music</Text>
            <ScrollView contentContainerStyle={Styles.scroll}>
                {collectionDataContent}
            </ScrollView>
        </View>
    );
};

export default Collections;