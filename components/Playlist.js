import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import Styles from "../styles";
import { useNavigation } from "@react-navigation/native";

const Playlist = (props) => {

    const navigation = useNavigation();

    return (
        <View>
            <TouchableOpacity style={Styles.listItem} onPress={() => navigation.navigate('Playlist', { playlistId: props.playlistId })}>
                <View style={Styles.listItemContent}>
                    <Image style={Styles.listItemImage} src={props.imageUrl} />
                    <Text style={Styles.title}>{props.title}</Text>
                </View>
            </TouchableOpacity>
        </View>
    );
};

export default Playlist;