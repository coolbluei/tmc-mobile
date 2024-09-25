import { useAtom } from 'jotai';
import { useEffect, useState } from 'react';
import { Button, Image, KeyboardAvoidingView, Platform, Switch, Text, TextInput, View } from 'react-native';
import { apiAtom, credentialsAtom, accessTokenAtom, preferencesAtom, refreshTokenAtom, pageIdAtom, biometricsEntrolledAtom } from '../../storage/atoms';
import Styles from '../../styles';
import * as LocalAuthentication from 'expo-local-authentication';

const LoginForm = () => {

    const [usernameValue, setUsernameValue] = useState("");
    const [passwordValue, setPasswordValue] = useState("");
    const [message, setMessage] = useState();

    const [api] = useAtom(apiAtom);
    const [accessToken, setAccessToken] = useAtom(accessTokenAtom);
    const [refreshToken, setRefreshToken] = useAtom(refreshTokenAtom);
    const [credentials, setCredentials] = useAtom(credentialsAtom);
    const [preferences, setPreferences] = useAtom(preferencesAtom);
    const [biometricsEnrolled] = useAtom(biometricsEntrolledAtom);

    let biometricsWidget = null;

    const login = async (usernameParameter = null, passwordParameter = null) => {

        let username = usernameValue;
        let password = passwordValue;

        if(usernameParameter && passwordParameter) {
            username = usernameParameter;
            password = passwordParameter;
        }

        const response = await api.login(username, password);

        if(response.type === 'error') {
            setMessage((
                <Text style={Styles.highlight}>{response.error.data.message}</Text>
            ));    
        } else {
            if(response.status === 200) {
                setAccessToken(response.data.access_token);
                setRefreshToken(response.data.refresh_token);
                setCredentials({
                    username: username,
                    password: password
                });
            }
        }
    }

    const biometricLogin = async () => {
        const result = await LocalAuthentication.authenticateAsync({
            promptMessage: 'Authenticate with FaceID',
            fallbackLabel: 'Use username and password instead.',
            disableDeviceFallback: true,
            cancelLabel: 'Cancel'
        });

        if(result.success) {
            setUsernameValue(credentials.username);
            setPasswordValue(credentials.password);
            login(credentials.username, credentials.password);
            return true;
        }

        return false;
    }

    const setBiometricsPreference = () => {
        setPreferences({
            useBiometrics: !preferences.useBiometrics
        });
    }

    biometricsWidget = null;

    if(biometricsEnrolled) {
        let biometricsLabel = 'Biometrics';
        if(Platform.OS === 'ios') {
            biometricsLabel = "FaceID";
        }

        if(preferences.useBiometrics) {
            if(credentials instanceof Object && credentials.hasOwnProperty('username')) {
                biometricsWidget = <Button title={`Login with ${biometricsLabel}`} onPress={biometricLogin} />;
            }
        } else {
            biometricsWidget = (
                <View style={Styles.alignCenter}>
                    <Text>Enable {biometricsLabel} for future logins</Text>
                    <Switch value={preferences.useBiometrics} onValueChange={setBiometricsPreference} />
                </View>
            );
        }
    }

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={[Styles.appWrapper, Styles.alignCenter]}>
            <Image style={{height: 140, width: 140, marginBottom: 10}} source={require("../../assets/icon.png")} />
            {message}
            <Text style={Styles.title}>Login</Text>
            <TextInput value={usernameValue} onChangeText={setUsernameValue} style={Styles.input} placeholder="Username" />
            <TextInput value={passwordValue} onChangeText={setPasswordValue} secureTextEntry={true} style={Styles.input} placeholder="Password" />
            <Button onPress={login} title="Login" />
            {biometricsWidget}
        </KeyboardAvoidingView>
    );
};

export default LoginForm;