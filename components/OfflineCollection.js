import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Styles from '../styles';
import { useNavigation } from '@react-navigation/native';

const OfflineCollection = (props) => {

    const navigation = useNavigation();

    return (
        <View>
            <TouchableOpacity style={Styles.listItem} onPress={() => navigation.navigate('Collection Downloads', { collectionId: props.data.get('id') })}>
                <View style={Styles.listItemContent}>
                    <Text style={[Styles.title, Styles.listTitle]}>{props.data.get('title')}</Text>
                </View>
            </TouchableOpacity>
        </View>

    );
};

export default OfflineCollection;