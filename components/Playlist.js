import React from "react";
import { Image, Text, TouchableHighlight, View } from "react-native";
import Styles from "../styles";
import { useNavigation } from "@react-navigation/native";

const Collection = (props) => {

    const navigation = useNavigation();

    return (
        <View style={Styles.padded}>
            <TouchableHighlight style={Styles.listItem} onPress={() => navigation.navigate('Playlist', { playlistId: props.playlistId })}>
                <View style={Styles.listItemContent}>
                    <Image style={Styles.listItemImage} />
                    <Text style={Styles.title}>{props.title}</Text>
                </View>
            </TouchableHighlight>
        </View>
    );
};

export default Collection;