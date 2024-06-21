import React from "react";
import { Image, Text, TouchableHighlight, View } from "react-native";
import Styles from "../styles";
import { pageIdAtom } from "../storage/atoms";
import { useAtom } from "jotai";

const Collection = (props) => {

    const [pageId, setPageId] = useAtom(pageIdAtom);

    const navigate = () => {
        setPageId(`Songs:${props.data.get('id')}`);
    };

    return (
        <View style={Styles.padded}>
            <TouchableHighlight style={Styles.listItem} onPress={navigate}>
                <View style={Styles.listItemContent}>
                    <Image style={Styles.listItemImage} src={props.data.get('field_image').get('uri').url} />
                    <Text style={Styles.title}>{props.data.get('title')}</Text>
                </View>
            </TouchableHighlight>
        </View>
    );
};

export default Collection;