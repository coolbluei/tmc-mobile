import { Button, Text, View } from "react-native";
import { useAtom } from "jotai";
import { accessTokenAtom, refreshTokenAtom } from "../storage/atoms";

const User = ({navigation}) => {

    const [accessToken, setAccessToken] = useAtom(accessTokenAtom);
    const [refreshToken, setRefreshToken] = useAtom(refreshTokenAtom);

    const logout = () => {
        setAccessToken(null);
        setRefreshToken(null);
    };

    return (
        <View>
            <Text>User's Name Here</Text>
            <Button title="Logout" onPress={logout} />
        </View>
    );
};

export default User;