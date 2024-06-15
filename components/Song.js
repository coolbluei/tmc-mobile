import React from "react";
import { Image, Text, TouchableHighlight, View } from "react-native";
import Styles from "../styles";
import { pageIdAtom } from "../storage/atoms";
import { useAtom } from "jotai";
import { indexAtom, tracksAtom } from "../storage/audioAtoms";

const Song = (props) => {
    const [pageId, setPageId] = useAtom(pageIdAtom);
    const [index, setIndex] = useAtom(indexAtom);
    const [tracks, setTracks] = useAtom(tracksAtom);

    const goBack = () => {
        setPageId('Collections');
    };

    const play = () => {
        setTracks(props.tracks);
        setIndex(props.trackIndex);
    };
    
    return (
        <TouchableHighlight style={Styles.listItem} onPress={play}>
            <View>
                <Image style={Styles.listItemImage} src={props.data.get('field_image').get('uri').url} />
                <Text style={Styles.title}>{props.data.get('title')}</Text>
            </View>
        </TouchableHighlight>
    );
};

export default Song;