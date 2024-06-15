import { TouchableHighlight, View } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faHome, faCog, faMusic, faUser } from "@fortawesome/free-solid-svg-icons";
import { useAtom } from "jotai";
import { pageIdAtom } from "../storage/atoms";
import Styles from "../styles";

const Navbar = () => {

    const [pageId, setPageId] = useAtom(pageIdAtom);

    return (
        <View style={Styles.navbar}>
            <View style={Styles.navbarItems}>
                <TouchableHighlight onPress={() => setPageId('Home')}>
                    <FontAwesomeIcon icon={faHome} size={24} style={Styles.navbarItem} />
                </TouchableHighlight>

                <TouchableHighlight onPress={() => setPageId('Collections')}>
                    <FontAwesomeIcon icon={faMusic} size={24} style={Styles.navbarItem} />
                </TouchableHighlight>

                <TouchableHighlight onPress={() => console.log('dashboard')}>
                    <FontAwesomeIcon icon={faCog} size={24} style={Styles.navbarItem} />
                </TouchableHighlight>

                <TouchableHighlight onPress={() => setPageId('User')}>
                    <FontAwesomeIcon icon={faUser} size={24} style={Styles.navbarItem} />
                </TouchableHighlight>
            </View>
        </View>
    );
};

export default Navbar;