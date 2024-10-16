import { Linking, TouchableOpacity, View } from "react-native";
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faHome, faCog, faMusic, faWifi, faUser } from "@fortawesome/pro-solid-svg-icons";
import Styles from "../styles";
import { useNavigation } from "@react-navigation/native";
import { useAtom } from "jotai";
import { apiAtom, offlineAtom, userDataAtom } from "../storage/atoms";
import Entity from "../drupal/Entity";

const Navbar = () => {

    const [api] = useAtom(apiAtom);
    const [offline] = useAtom(offlineAtom);
    const [userData] = useAtom(userDataAtom);

    const [user, setUser] = useState();

    const navigation = useNavigation();

    useEffect(() => {
        if(userData instanceof Object && userData.hasOwnProperty('data')) {
            const entity = new Entity(userData);
            setUser(entity);
        }
    }, [userData]);

    let dashboardUrl = 'https://themusicclass.com/app/user/home';

    if(user instanceof Entity && user.get('dashboard_link')) {
        dashboardUrl = user.get('dashboard_link');
    }

    let content = (
        <View style={Styles.navbarItems}>
            <TouchableOpacity onPress={() => api.checkNetwork()}>
                <FontAwesomeIcon icon={faWifi} size={24} style={Styles.navbarItem} />
            </TouchableOpacity>
        </View>
    );

    if(offline === false) {
        content = (
            <View style={Styles.navbarItems}>
                <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                    <FontAwesomeIcon icon={faHome} size={24} style={Styles.navbarItem} />
                </TouchableOpacity>
    
                <TouchableOpacity onPress={() => navigation.navigate('Collections')}>
                    <FontAwesomeIcon icon={faMusic} size={24} style={Styles.navbarItem} />
                </TouchableOpacity>
    
                <TouchableOpacity onPress={() => Linking.openURL(dashboardUrl)}>
                    <FontAwesomeIcon icon={faCog} size={24} style={Styles.navbarItem} />
                </TouchableOpacity>
    
                <TouchableOpacity onPress={() => navigation.navigate('User')}>
                    <FontAwesomeIcon icon={faUser} size={24} style={Styles.navbarItem} />
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={Styles.navbar}>
            {content}
        </View>
    );
};

export default Navbar;