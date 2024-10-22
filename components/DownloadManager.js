import React, { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { downloadsAtom, downloadQueueAtom, updateDownloadsAtom } from '../storage/atoms';
import * as FileSystem from 'expo-file-system';
import { ActivityIndicator, Text, Modal, View } from "react-native";
import Styles from '../styles';

const DownloadManager = () => {

    const [downloads, setDownloads] = useAtom(downloadsAtom);
    const [updateDownloads, setUpdateDownloads] = useAtom(updateDownloadsAtom);
    const [downloadQueue, setDownloadQueue] = useAtom(downloadQueueAtom);

    const [isDownloading, setIsDownloading] = useState(false);
    const [downloadsInProgress, setDownloadsInProgress] = useState([]);
    const [downloadComplete, setDownloadComplete] = useState(false);

    const downloadProgress = (progress) => {
        // If we have finished downloading the file...
        if(progress.totalBytesWritten === progress.totalBytesExpectedToWrite) {
            setDownloadComplete(true);
        }
    };

    const downloadNextSong = async () => {
        try {
            // Get the next index. The next index is conveniently the same as the length of the downloadsInProgress array.
            let nextIndex = downloadsInProgress.length;

            // Get the first song in the queue.
            const song = downloadQueue[nextIndex];
            setDownloadsInProgress([...downloadsInProgress, song]);

            console.log(`Downloading ${song.get('title')}`);
            setDownloadComplete(false);
            const downloadResumable = FileSystem.createDownloadResumable(song.get('field_full_song').get('uri').url, FileSystem.documentDirectory + 'songs/' + song.get('id') + '.mp3', {}, downloadProgress);
            // Download the song.
            await downloadResumable.downloadAsync();
        } catch (e) {
            console.log('DownloadNextSong:', e);
            setIsDownloading(false);
            setUpdateDownloads(true);
            setDownloadQueue([]);
            setDownloadComplete(true);
        }
    };

    // React to a download completing.
    useEffect(() => {
        // If the download is complete...
        if(downloadComplete) {
            downloadNextSong();
        }

        // If all the downloads are complete...
        if(downloadsInProgress.length === downloadQueue.length) {
            setUpdateDownloads(true);
        }
    }, [downloadComplete]);

    // React to the downloadQueue being updated.
    useEffect(() => {
        // If the download queue is empty...
        if(downloadQueue.length === 0) {
            // set the isDownloading state.
            setIsDownloading(false);

            // Reset the downloadsInProgress Array.
            setDownloadsInProgress([]);

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
            }).catch((e) => {
                console.log('updateDownloads:', e);
            });
        }
    }, [updateDownloads]);

    return (
        <View>
            <Modal animationType="fade" transparent={true} visible={isDownloading}>
                <View style={[Styles.container, Styles.modal]}>
                    <ActivityIndicator size="large" color="#ffffff" />
                    <Text style={[Styles.title, Styles.textInverted]}>{downloadsInProgress.length} of {downloadQueue.length}</Text>
                </View>
            </Modal>
        </View>
    );
};

export default DownloadManager;