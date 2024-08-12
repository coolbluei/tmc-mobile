import { TouchableHighlight, View } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faHome, faCog, faMusic, faUser } from "@fortawesome/pro-solid-svg-icons";
import Styles from "../styles";
import { useNavigation } from "@react-navigation/native";

const Navbar = () => {

    const navigation = useNavigation();

    return (
        <View style={Styles.navbar}>
            <View style={Styles.navbarItems}>
                <TouchableHighlight onPress={() => navigation.navigate('Home')}>
                    <FontAwesomeIcon icon={faHome} size={24} style={Styles.navbarItem} />
                </TouchableHighlight>

                <TouchableHighlight onPress={() => navigation.navigate('Collections')}>
                    <FontAwesomeIcon icon={faMusic} size={24} style={Styles.navbarItem} />
                </TouchableHighlight>

                <TouchableHighlight onPress={() => console.log('dashboard')}>
                    <FontAwesomeIcon icon={faCog} size={24} style={Styles.navbarItem} />
                </TouchableHighlight>

                <TouchableHighlight onPress={() => navigation.navigate('User')}>
                    <FontAwesomeIcon icon={faUser} size={24} style={Styles.navbarItem} />
                </TouchableHighlight>
            </View>
        </View>
    );
};

export default Navbar;