import React, { useEffect } from 'react';
import { Text } from 'react-native';
import { useAtom } from 'jotai';
import { downloadsAtom } from '../storage/atoms';

const OfflineCollections = () => {

    return <Text>This is where the downloaded collections go.</Text>;
};

export default OfflineCollections;