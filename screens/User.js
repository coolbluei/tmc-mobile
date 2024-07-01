import { Button, Text, View } from "react-native";
import { useAtom } from "jotai";
import { accessTokenAtom, refreshTokenAtom, userDataAtom } from "../storage/atoms";
import Styles from "../styles";
import Entity from "../drupal/Entity";

const User = () => {

    const [accessToken, setAccessToken] = useAtom(accessTokenAtom);
    const [refreshToken, setRefreshToken] = useAtom(refreshTokenAtom);
    const [userData, setUserData] = useAtom(userDataAtom);

    const logout = () => {
        setAccessToken(null);
        setRefreshToken(null);
        setUserData(null);
    };

    const user = new Entity(userData);

    return (
        <View style={Styles.content}>
            <Text style={Styles.title}>{user.get('display_name')}</Text>
            <Button title="Logout" onPress={logout} />
        </View>
    );
};

export default User;