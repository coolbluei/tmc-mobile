import { useAtom } from "jotai";
import { accessTokenAtom, needsRefreshAtom, apiAtom, isAuthenticatedAtom } from "../../storage/atoms";
import { useEffect, useState } from "react";
import Controller from "../Controller";

const AuthProvider = () => {

    const [api] = useAtom(apiAtom);
    const [accessToken] = useAtom(accessTokenAtom);
    const [needsRefresh, setNeedsRefresh] = useAtom(needsRefreshAtom);
    const [isAuthenticated, setIsAuthenticated] = useAtom(isAuthenticatedAtom);
    const [isInitialized, setIsInitialized] = useState(false);

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
        <Controller isAuthenticated={isAuthenticated} />
    );
};

export default AuthProvider;