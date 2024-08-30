import { useAtom } from "jotai";
import { accessTokenAtom, needsRefreshAtom, apiAtom, isAuthenticatedAtom, biometricsEntrolledAtom } from "../../storage/atoms";
import { useEffect, useState } from "react";
import Controller from "../Controller";
import * as LocalAuthentication from 'expo-local-authentication';

const AuthProvider = () => {

    const [api] = useAtom(apiAtom);
    const [accessToken] = useAtom(accessTokenAtom);
    const [needsRefresh, setNeedsRefresh] = useAtom(needsRefreshAtom);
    const [isAuthenticated, setIsAuthenticated] = useAtom(isAuthenticatedAtom);
    const [isInitialized, setIsInitialized] = useState(false);
    const [biometricsEntrolled, setBiometricsEnrolled] = useAtom(biometricsEntrolledAtom);

    useEffect(() => {
        const checkBiometricsEnrollment = async () => {
            return await LocalAuthentication.isEnrolledAsync();
        }

        const biometricsStatus = checkBiometricsEnrollment();

        setBiometricsEnrolled(biometricsStatus);
    }, []);

    useEffect(() => {
        let hasSession = false;

        if(api && accessToken) {
            hasSession = true;

            if(needsRefresh || !isInitialized) {
                const refresh = async () => {
                    api.refresh()
                    .then((response) => {
                        if(response instanceof Object) {
                            setNeedsRefresh(false);
                            hasSession = true;
                        }
                    })
                    .catch((error) => {
                        hasSession = false;
                        console.log('AuthProvider.refresh:', error);
                    });
                };

                refresh();
                setIsInitialized(true);
            }
        }

        setIsAuthenticated(hasSession);
        
    }, [needsRefresh, accessToken]);

    return (
        <Controller />
    );
};

export default AuthProvider;