import React, { useState } from "react";
import { Image, Text, TouchableHighlight, TouchableOpacity, View } from "react-native";
import Styles from "../styles";
import { playlistAtom, playlistSyncAtom } from "../storage/atoms";
import { useAtom } from "jotai";
import { indexAtom, tracksAtom } from "../storage/audioAtoms";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faStar as faStarSolid } from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarRegular } from "@fortawesome/free-regular-svg-icons";

const Song = (props) => {
    const [index, setIndex] = useAtom(indexAtom);
    const [tracks, setTracks] = useAtom(tracksAtom);
    const [playlists, setPlaylists] = useAtom(playlistAtom);
    const [playlistSync, setPlaylistSync] = useAtom(playlistSyncAtom);

    const [isFavorite, setIsFavorite] = useState(props.isFavorite);

    const play = () => {
        setTracks(props.tracks);
        setIndex(props.trackIndex);
    };

    const toggleFavorite = () => {
        // Copy state variables.
        let lists = {...playlists};

        if(isFavorite) {
            // Remove from favorites.
            const i = lists.favorites.songs.indexOf(props.data.get('id'));
            if(i) {
                lists.favoriates.songs.splice(i, 1);
            }
        } else {
            // Add to favorites.
            lists.favorites.songs.push(props.data.get('id'));
        }
        setPlaylists(lists);
        setPlaylistSync(true);
        setIsFavorite(!isFavorite);
    };

    let favoriteIcon = faStarRegular;
    if(isFavorite) {
        favoriteIcon = faStarSolid;
    }
    
    return (
        <View style={Styles.padded}>
            <TouchableHighlight style={Styles.listItem} onPress={play}>
                <View style={Styles.listItemContent}>
                    <Image style={Styles.listItemImage} src={props.data.get('field_image')?.get('uri')?.url} />
                    <Text style={[Styles.title, Styles.listTitle]}>{props.data.get('title')}</Text>
                    <TouchableOpacity onPress={toggleFavorite}>
                        <FontAwesomeIcon size={24} icon={favoriteIcon} />
                    </TouchableOpacity>
                </View>
            </TouchableHighlight>
        </View>
    );
};

export default Song;