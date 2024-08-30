import { Button, Platform, SafeAreaView, Switch, Text, View } from "react-native";
import { useAtom } from "jotai";
import { accessTokenAtom, apiAtom, biometricsEntrolledAtom, credentialsAtom, preferencesAtom, refreshTokenAtom, userDataAtom } from "../storage/atoms";
import Styles from "../styles";
import Entity from "../drupal/Entity";
import { useEffect } from "react";

const User = () => {

    const [accessToken, setAccessToken] = useAtom(accessTokenAtom);
    const [refreshToken, setRefreshToken] = useAtom(refreshTokenAtom);
    const [userData, setUserData] = useAtom(userDataAtom);
    const [api] = useAtom(apiAtom);
    const [credentials] = useAtom(credentialsAtom);
    const [preferences, setPreferences] = useAtom(preferencesAtom);
    const [biometricsEnrolled] = useAtom(biometricsEntrolledAtom);

    const logout = () => {
        setAccessToken(null);
        setRefreshToken(null);
    };

    const getUser = () => {
        const currentTime = new Date().getTime();

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

    const user = new Entity(userData);

    const setBiometricsPreference = (value) => {
        const newPreferences = {
            useBiometrics: value
        };

        setPreferences(newPreferences);
    };

    let biometricsControl = null;
    if(biometricsEnrolled) {
        let biometricsLabel = 'Biometrics';
        if(Platform.OS === 'ios') {
            biometricsLabel = "FaceID";
        }

        biometricsControl = (
            <View style={Styles.listItem}>
                <View style={Styles.listItemContent}>
                    <Text style={[Styles.title, Styles.controlTitle]}>Enable {biometricsLabel}</Text>
                    <Switch style={[Styles.listTitle, Styles.controlContent]} value={preferences.useBiometrics} onValueChange={setBiometricsPreference} />
                </View>
            </View>
        );
    }

    return (
        <SafeAreaView style={Styles.container}>
            <Text style={Styles.pageTitle}>{user.get('display_name')}</Text>
            {biometricsControl}
            <Button title="Logout" onPress={logout} />
        </SafeAreaView>
    );
};

export default User;