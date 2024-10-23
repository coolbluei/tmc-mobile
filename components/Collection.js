import React, { useEffect, useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import Styles from "../styles";
import { useNavigation } from "@react-navigation/native";
import { useAtom } from "jotai";
import { downloadsAtom, downloadQueueAtom, updateDownloadsAtom } from "../storage/atoms";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faCloudArrowDown, faSquareCheck } from "@fortawesome/pro-regular-svg-icons";
import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as FileSystem from 'expo-file-system';

const Collection = (props) => {

    const [downloadQueue, setDownloadQueue] = useAtom(downloadQueueAtom);
    const [downloads] = useAtom(downloadsAtom);
    const [updateDownloads, setUpdateDownloads] = useAtom(updateDownloadsAtom);

    const [isDownloaded, setIsDownloaded] = useState(false);

    useEffect(() => {
        let downloaded = true;
        for(const song of props.data.get('field_songs')) {
            if(downloads.includes(song.get('id') + '.mp3') === false) {
                downloaded = false;
            }
        }

        setIsDownloaded(downloaded);
    }, [downloads]);

    const navigation = useNavigation();

    const download = () => {
        const queue = props.data.get('field_songs');

        setDownloadQueue(queue);
    }

    const deleteSongs = async () => {
        for(const song of props.data.get('field_songs')) {
            await FileSystem.deleteAsync(FileSystem.documentDirectory + 'songs/' + song.get('id') + '.mp3');
        }
        setUpdateDownloads(true);
    };

    const deleteButton = () => {
        return (
            <TouchableOpacity style={Styles.deleteButton} onPress={deleteSongs}>
                <Text style={[Styles.textBig, Styles.textInverted]}>Delete</Text>
            </TouchableOpacity>
        );
    };

    let downloadButton = (
        <TouchableOpacity onPress={download}>
            <FontAwesomeIcon size={24} icon={faCloudArrowDown} style={Styles.download} />
        </TouchableOpacity>
    );

    let content = (
        <View>
            <TouchableOpacity style={Styles.listItem} onPress={() => navigation.navigate('Collection', { collectionId: props.data.get('id') })}>
                <View style={Styles.listItemContent}>
                    <Image style={Styles.listItemImage} src={props.data.get('field_image').get('uri').url} />

                    <Text style={[Styles.title, Styles.listTitle]}>{props.data.get('title')}</Text>

                    {downloadButton}
                </View>
            </TouchableOpacity>
        </View>     
    );

    if(isDownloaded) {
        downloadButton = (
            <FontAwesomeIcon size={24} icon={faSquareCheck} style={Styles.downloaded} />
        );

        content = (
            <GestureHandlerRootView>
                <Swipeable dragOffsetFromRightEdge={100} renderRightActions={deleteButton}>
                    <View>
                        <TouchableOpacity style={Styles.listItem} onPress={() => navigation.navigate('Collection', { collectionId: props.data.get('id') })}>
                            <View style={Styles.listItemContent}>
                                <Image style={Styles.listItemImage} src={props.data.get('field_image').get('uri').url} />

                                <Text style={[Styles.title, Styles.listTitle]}>{props.data.get('title')}</Text>

                                {downloadButton}
                            </View>
                        </TouchableOpacity>
                    </View>
                </Swipeable>
            </GestureHandlerRootView>
        );
    }

    return (
        content
    );
};

export default Collection;