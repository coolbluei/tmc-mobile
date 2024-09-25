import React from "react";
import { Text, TouchableHighlight, View } from "react-native";
import Styles from "../styles";
import { useAtom } from "jotai";
import { indexAtom, tracksAtom } from "../storage/audioAtoms";

const OfflineSong = (props) => {
    const [index, setIndex] = useAtom(indexAtom);
    const [tracks, setTracks] = useAtom(tracksAtom);

    const play = () => {
        setTracks(props.tracks);
        setIndex(props.trackIndex);
    };

    return (
        <View>
            <TouchableHighlight style={Styles.listItem} onPress={play}>
                <View style={Styles.listItemContent}>
                    <Text style={[Styles.title, Styles.listTitle]}>{props.data.get('title')}</Text>
                </View>
            </TouchableHighlight>
        </View>
    );
};

export default OfflineSong;