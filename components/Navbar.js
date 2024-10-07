import { Linking, TouchableOpacity, View } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faHome, faCog, faMusic, faWifi, faUser } from "@fortawesome/pro-solid-svg-icons";
import Styles from "../styles";
import { useNavigation } from "@react-navigation/native";
import { useAtom } from "jotai";
import { apiAtom, offlineAtom } from "../storage/atoms";

const Navbar = () => {

    const [api] = useAtom(apiAtom);
    const [offline] = useAtom(offlineAtom);

    const navigation = useNavigation();

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
    
                <TouchableOpacity onPress={() => Linking.openURL(`https://themusicclass.com/app/user/home`)}>
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