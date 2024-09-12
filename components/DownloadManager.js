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
        // Make a mutable copy of the downloadQueue state variable.
        let queue = [...downloadQueue];

        // Remove the first item.
        queue.shift();

        // Set the new queue to the downloadQueue state variable.
        setDownloadQueue(queue);

        // Set some debug info.
        setDebugErrors(queue.toString());
    };

    const downloadProgress = (progress) => {
        // If we have finished downloading the file...
        if(progress.totalBytesWritten === progress.totalBytesExpectedToWrite) {
            // Remove it from the queue.
            removeSongFromDownloadQueue();
        }
    };

    const downloadNextSong = async () => {
        try {
            // Get the first song in the queue.
            const song = downloadQueue[0];

            // If the song isn't already downloaded...
            if(downloads.includes(song.get('id') + '.mp3') === false) {
                // Download the song.
                await FileSystem.createDownloadResumable(song.get('field_full_song').get('uri').url, FileSystem.documentDirectory + 'songs/' + song.get('id') + '.mp3', {}, downloadProgress).downloadAsync();
            } else {
                // Otherwise, just remove it from the queue.
                removeSongFromDownloadQueue();
            }
        } catch (e) {
            console.log('DownloadNextSong:', e);
            setIsDownloading(false);
            setDebugErrors(e);
        }
    };

    // React to component mounting for the first time.
    useEffect(() => {
        const initializeSongsDirectory = async () => {
            // Get the songs directory info.
            const dirInfo = await FileSystem.getInfoAsync(FileSystem.documentDirectory + 'songs/');

            // If the directory doesn't exist...
            if(!dirInfo.exists) {
                // Create the directory.
                await FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + 'songs/');
            }    
        };

        initializeSongsDirectory();
    }, []);

    // React to the downloadQueue being updated.
    useEffect(() => {
        // If the download queue is empty...
        if(downloadQueue.length === 0) {
            // set the isDownloading state.
            setIsDownloading(false);

            // Trigger the downloads list to update.
            setUpdateDownloads(true);
        } else {
            // Otherwise, set the isDownloading state.
            setIsDownloading(true);

            // Start downloading the next song.
            downloadNextSong();
        }
    }, [downloadQueue]);

    // React to the updateDownloads trigger.
    useEffect(() => {
        // If the trigger is true...
        if(updateDownloads) {
            // Read the contents of the songs directory.
            FileSystem.readDirectoryAsync(FileSystem.documentDirectory + 'songs/').then((data) => {
                // Then update the downloads state.
                setDownloads(data);

                // And unset the updateDownloads trigger.
                setUpdateDownloads(false);
            });
        }
    }, [updateDownloads]);

    // Initialize the debugContent.
    let debugContent = null;

    // If we're in debugMode...
    if(debugMode) {
        // Output some debugErrors.
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