import { apiAtom, credentialsAtom, isAuthenticatedAtom, pageIdAtom, userDataAtom, collectionDataAtom, songDataAtom, accessTokenAtom } from "../storage/atoms";
import { useAtom } from "jotai";
import LoginForm from "./Authentication/LoginForm";
import Home from "../screens/Home";
import React, { useEffect } from "react";
import User from "../screens/User";
import Collections from "../screens/Collections";
import Navbar from "./Navbar";
import Styles from "../styles";
import { ActivityIndicator, View } from "react-native";
import Entity from "../drupal/Entity";
import Songs from "../screens/Songs";
import Player from "./Player";

const Controller = (props) => {

    const [api] = useAtom(apiAtom);
    const [pageId] = useAtom(pageIdAtom);
    const [userData, setUserData] = useAtom(userDataAtom);
    const [collectionData, setCollectionData] = useAtom(collectionDataAtom);
    const [songData, setSongData] = useAtom(songDataAtom)
    const [credentials] = useAtom(credentialsAtom);
    const [isAuthenticated] = useAtom(isAuthenticatedAtom);
    const [accessToken] = useAtom(accessTokenAtom);

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
            console.log('Controller.getUser:', error);
        });
    }

    const getCollections = () => {
        const currentTime = new Date().getTime();

        const user = new Entity(userData);

        const params = {
            'include': 'field_application_access,field_application_access.field_image',
            'fields[user--user]': 'id,field_application_access'
        };

        api.getEntity('user', 'user', user.get('id'), params)
        .then((response) => {
            if(response.status === 200) {
                const data = {
                    expiration: currentTime,
                    data: response.data.data,
                    included: response.data?.included
                };
                setCollectionData(data);
            }
        })
        .catch((error) => {
            console.log('Controller.getCollections:', error);
        });
    }

    const getSongs = (collectionId) => {
        const currentTime = new Date().getTime();

        api.getEntity('node', 'collection', collectionId)
        .then((response) => {
            if(response.status === 200) {
                const data = {
                    expiration: currentTime,
                    data: response.data.data,
                    included: response.data?.included
                };
                setSongData(data);
            }
        })
        .catch((error) => {
            console.log('Controller.getCollections:', error);
        });
    }

    let detailId = null;
    let destination = pageId;

    if(pageId && pageId.includes(':')) {
        const routeParts = pageId.split(':');
        detailId = routeParts[1];
        destination = routeParts[0];
    }

    const screens = {
        "Home": {
            component: <Home />,
            get: getUser
        },
        "Collections": {
            component: <Collections />,
            get: getCollections
        },
        "User": {
            component: <User />,
            get: getUser
        },
        "Songs": {
            component: <Songs />,
            get: getSongs
        }
    };

    useEffect(() => {
        if(api && isAuthenticated && credentials.hasOwnProperty('username')) {
            if(detailId) {
                screens[destination].get(detailId);
            } else {
                screens[destination].get();
            }
        }

    }, [pageId, api, isAuthenticated, credentials]);

    let content = <LoginForm />;

    if(isAuthenticated) {
        content = (
            <View style={Styles.appWrapper}>
                <ActivityIndicator size="large" color="#000000" />
            </View>
        );

        if(userData instanceof Object) {
            content = (
                <>
                    <View style={Styles.container}>
                        {screens[destination].component}
                        <Player />
                    </View>
                    <Navbar />
                </>
            );
        }
    }

    return content;
};

export default Controller;