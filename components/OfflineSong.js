import React, { useState } from "react";
import { Image, Text, TouchableHighlight, TouchableOpacity, View } from "react-native";
import Styles from "../styles";
import { downloadsAtom, playlistAtom, playlistSyncAtom, updateDownloadsAtom } from "../storage/atoms";
import { useAtom } from "jotai";
import { indexAtom, tracksAtom } from "../storage/audioAtoms";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faHeart as faHeartSolid } from "@fortawesome/pro-solid-svg-icons";
import { faHeart as faHeartRegular, faSquareCheck, faCloudArrowDown } from "@fortawesome/pro-regular-svg-icons";
import * as FileSystem from 'expo-file-system';
import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import { GestureHandlerRootView } from "react-native-gesture-handler";

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