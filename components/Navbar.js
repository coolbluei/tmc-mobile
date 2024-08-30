import { Linking, TouchableOpacity, View } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faHome, faCog, faMusic, faUser } from "@fortawesome/pro-solid-svg-icons";
import Styles from "../styles";
import { useNavigation } from "@react-navigation/native";
import { useAtom } from "jotai";
import { refreshTokenAtom } from "../storage/atoms";

const Navbar = () => {

    const [refreshToken] = useAtom(refreshTokenAtom);

    const navigation = useNavigation();

    return (
        <View style={Styles.navbar}>
            <View style={Styles.navbarItems}>
                <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                    <FontAwesomeIcon icon={faHome} size={24} style={Styles.navbarItem} />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate('Collections')}>
                    <FontAwesomeIcon icon={faMusic} size={24} style={Styles.navbarItem} />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => Linking.openURL(`https://themusicclass.com/app/user/home?token=${refreshToken}`)}>
                    <FontAwesomeIcon icon={faCog} size={24} style={Styles.navbarItem} />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate('User')}>
                    <FontAwesomeIcon icon={faUser} size={24} style={Styles.navbarItem} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default Navbar;