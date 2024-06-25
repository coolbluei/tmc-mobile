import { useAtom } from 'jotai';
import { useEffect, useState } from 'react';
import { Button, SafeAreaView, Switch, Text, TextInput } from 'react-native';
import { apiAtom, credentialsAtom, accessTokenAtom, preferencesAtom, refreshTokenAtom, pageIdAtom } from '../../storage/atoms';
import Styles from '../../styles';
import * as LocalAuthentication from 'expo-local-authentication';

const LoginForm = () => {

    const [usernameValue, setUsernameValue] = useState("");
    const [passwordValue, setPasswordValue] = useState("");
    const [message, setMessage] = useState();
    const [hasBiometrics, setHasBiometrics] = useState(false);

    const [api] = useAtom(apiAtom);
    const [accessToken, setAccessToken] = useAtom(accessTokenAtom);
    const [refreshToken, setRefreshToken] = useAtom(refreshTokenAtom);
    const [pageId, setPageId] = useAtom(pageIdAtom);
    const [credentials, setCredentials] = useAtom(credentialsAtom);
    const [preferences, setPreferences] = useAtom(preferencesAtom);

    useEffect(() => {
        LocalAuthentication.hasHardwareAsync()
        .then((result) => {
            setHasBiometrics(result);
        })
        .catch((error) => {
            console.log(error);
        });
    }, []);

    let biometricsWidget = null;

    const setBiometricsPreference = (value) => {
        const newPreferences = {
            useBiometrics: value
        };

        setPreferences(newPreferences);
    };

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
                setPageId('Home');
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
            console.log('success');
            setUsernameValue(credentials.username);
            setPasswordValue(credentials.password);
            login(credentials.username, credentials.password);
            return true;
        }

        console.log('fail', result);
        return false;
    }

    if(hasBiometrics) {

        biometricsWidget = <Switch onValueChange={setBiometricsPreference} />;

        if(preferences.useBiometrics && credentials instanceof Object && credentials.hasOwnProperty('username')) {
            biometricsWidget = <Button title="Login with FaceID" onPress={biometricLogin} />
        }
    }

    return (
        <SafeAreaView style={Styles.appWrapper}>
            {message}
            <Text style={Styles.title}>Login</Text>
            <TextInput value={usernameValue} onChangeText={setUsernameValue} style={Styles.input} placeholder="Username" />
            <TextInput value={passwordValue} onChangeText={setPasswordValue} secureTextEntry={true} style={Styles.input} placeholder="Password" />
            <Button onPress={login} title="Login" />
            {biometricsWidget}
        </SafeAreaView>
    );
};

export default LoginForm;