import { useAtom } from "jotai";
import { needsRefreshAtom, apiAtom, isAuthenticatedAtom, biometricsEntrolledAtom, sessionAtom } from "../../storage/atoms";
import { useEffect, useState } from "react";
import Controller from "../Controller";
import * as LocalAuthentication from 'expo-local-authentication';

const AuthProvider = () => {

    const [api] = useAtom(apiAtom);
    const [needsRefresh, setNeedsRefresh] = useAtom(needsRefreshAtom);
    const [isAuthenticated, setIsAuthenticated] = useAtom(isAuthenticatedAtom);
    const [isInitialized, setIsInitialized] = useState(false);
    const [biometricsEntrolled, setBiometricsEnrolled] = useAtom(biometricsEntrolledAtom);
    const [session] = useAtom(sessionAtom);

    useEffect(() => {
        const checkBiometricsEnrollment = async () => {
            return await LocalAuthentication.isEnrolledAsync();
        }

        const biometricsStatus = checkBiometricsEnrollment();

        setBiometricsEnrolled(biometricsStatus);
    }, []);

    useEffect(() => {
        let hasSession = false;

        if(api && session) {
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
        
    }, [needsRefresh, session]);

    return (
        <Controller />
    );
};

export default AuthProvider;