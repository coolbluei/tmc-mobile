import React, { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { downloadsAtom, downloadQueueAtom, debugModeAtom, updateDownloadsAtom } from '../storage/atoms';
import * as FileSystem from 'expo-file-system';
import { ActivityIndicator, Text, Modal, View } from "react-native";
import Styles from '../styles';

const DownloadManager = () => {

    const [downloads, setDownloads] = useAtom(downloadsAtom);
    const [updateDownloads, setUpdateDownloads] = useAtom(updateDownloadsAtom);
    const [downloadQueue, setDownloadQueue] = useAtom(downloadQueueAtom);
    const [debugMode] = useAtom(debugModeAtom);

    const [isDownloading, setIsDownloading] = useState(false);
    const [debugErrors, setDebugErrors] = useState();

    const removeSongFromDownloadQueue = () => {
        let queue = [...downloadQueue];
        queue.shift();
        setDownloadQueue(queue);
        setDebugErrors(queue.toString());
    };

    const downloadProgress = (progress) => {
        if(progress.totalBytesWritten === progress.totalBytesExpectedToWrite) {
            removeSongFromDownloadQueue();
        }
    };

    const downloadNextSong = async () => {
        try {
            const song = downloadQueue[0];

            if(downloads.includes(song.get('id') + '.mp3') === false) {
                await FileSystem.createDownloadResumable(song.get('field_full_song').get('uri').url, FileSystem.documentDirectory + 'songs/' + song.get('id') + '.mp3', {}, downloadProgress).downloadAsync();
            } else {
                removeSongFromDownloadQueue();
            }
        } catch (e) {
            console.log('DownloadNextSong:', e);
            setIsDownloading(false);
            setDebugErrors(e);
        }
    };

    useEffect(() => {

        const initializeSongsDirectory = async () => {
            const dirInfo = await FileSystem.getInfoAsync(FileSystem.documentDirectory + 'songs/');

            if(!dirInfo.exists) {
                await FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + 'songs/');
            }    
        };

        initializeSongsDirectory();
    }, []);

    useEffect(() => {
        if(downloadQueue.length === 0) {
            setIsDownloading(false);
            setUpdateDownloads(true);
        } else {
            setIsDownloading(true);
            downloadNextSong();
        }
    }, [downloadQueue]);

    useEffect(() => {
        if(updateDownloads) {
            FileSystem.readDirectoryAsync(FileSystem.documentDirectory + 'songs/').then((data) => {
                setDownloads(data);
                setUpdateDownloads(false);
            });
        }
    }, [updateDownloads]);

    let debugContent = null;
    if(debugMode) {
        debugContent = (
            <View style={Styles.highlight}>
                <Text>{debugErrors}</Text>
            </View>
        )
    }

    return (
        <View>
            {debugContent}
            <Modal animationType="fade" transparent={true} visible={isDownloading}>
                <View style={[Styles.container, Styles.modal]}>
                    <ActivityIndicator size="large" color="#ffffff" />
                </View>
            </Modal>
        </View>
    );
};

export default DownloadManager;