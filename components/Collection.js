import React from "react";
import { Image, Text, TouchableHighlight, View } from "react-native";
import Styles from "../styles";
import { useNavigation } from "@react-navigation/native";

const Collection = (props) => {

    const navigation = useNavigation();

    return (
        <View style={Styles.padded}>
            <TouchableHighlight style={Styles.listItem} onPress={() => navigation.navigate('Songs', { collectionId: props.data.get('id') })}>
                <View style={Styles.listItemContent}>
                    <Image style={Styles.listItemImage} src={props.data.get('field_image').get('uri').url} />
                    <Text style={Styles.title}>{props.data.get('title')}</Text>
                </View>
            </TouchableHighlight>
        </View>
    );
};

export default Collection;