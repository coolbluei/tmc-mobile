import { Button, SafeAreaView, Text } from "react-native";
import { useAtom } from "jotai";
import { accessTokenAtom, apiAtom, credentialsAtom, refreshTokenAtom, userDataAtom } from "../storage/atoms";
import Styles from "../styles";
import Entity from "../drupal/Entity";
import { useEffect } from "react";

const User = () => {

    const [accessToken, setAccessToken] = useAtom(accessTokenAtom);
    const [refreshToken, setRefreshToken] = useAtom(refreshTokenAtom);
    const [userData, setUserData] = useAtom(userDataAtom);
    const [api] = useAtom(apiAtom);
    const [credentials] = useAtom(credentialsAtom);

    const logout = () => {
        setAccessToken(null);
        setRefreshToken(null);
    };

    const getUser = () => {
        const currentTime = new Date().getTime();

        // if(userData && userData.expiration < currentTime) {
        //     return userData.data;
        // }

        const params = {
            'filter[email][path]': 'name',
            'filter[email][value]': credentials.username
        };

        api.getEntities('user', 'user', params)
        .then((response) => {
            if(response.status === 200) {
                const data = {
                    expiration: currentTime,
                    data: response.data.data[0],
                    included: response.data?.included
                };

                setUserData(data);
            }
        })
        .catch((error) => {
            console.log('Home.getUser:', error);
        });
    }

    useEffect(() => {
        getUser();
    }, []);

    const user = new Entity(userData.data);

    return (
        <SafeAreaView style={Styles.container}>
            <Text style={Styles.title}>{user.get('display_name')}</Text>
            <Button title="Logout" onPress={logout} />
        </SafeAreaView>
    );
};

export default User;