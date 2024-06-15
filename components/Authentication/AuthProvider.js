import { useAtom } from "jotai";
import { accessTokenAtom, needsRefreshAtom, apiAtom, refreshTokenAtom } from "../../storage/atoms";
import { useEffect, useState } from "react";
import Controller from "../Controller";

const AuthProvider = () => {

    const [api] = useAtom(apiAtom);
    const [accessToken, setAccessToken] = useAtom(accessTokenAtom);
    const [refreshToken, setRefreshToken] = useAtom(refreshTokenAtom)
    const [needsRefresh, setNeedsRefresh] = useAtom(needsRefreshAtom);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        let hasSession = false;

        if(api && accessToken) {
            hasSession = true;

            if(needsRefresh) {
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
            }
        }

        setIsAuthenticated(hasSession);
        
    }, [needsRefresh, accessToken]);

    return (
        <Controller isAuthenticated={isAuthenticated} />
    );
};

export default AuthProvider;