import { useAtom } from 'jotai';
import { apiAtom, credentialsAtom, isRefreshingAtom, offlineAtom, userDataAtom } from '../storage/atoms';
import Entity from './Entity';

const useUserData = () => {
    const [userData, setUserData] = useAtom(userDataAtom);
    const [api] = useAtom(apiAtom);
    const [credentials] = useAtom(credentialsAtom);
    const [offline] = useAtom(offlineAtom);
    const [isRefreshing, setIsRefreshing] = useAtom(isRefreshingAtom);

    const getData = () => {

        // Get whatever is stored in userData. Could be null, current, or expired.
        let result = userData;

        if(offline) {
            return result;
        }

        const currentTime = new Date().getTime();

        // If it's not null...
        if(userData) {
            // If it's expired or we're manually refreshing...
            if(userData.expiration < currentTime || isRefreshing) {
            
                // Make a User Entity.
                const user = new Entity(userData);

                // Set up some query params.
                const params = {
                    'include': [
                        'field_application_access',
                        'field_application_access.field_image',
                        'field_application_access.field_songs',
                        'field_application_access.field_songs.field_image',
                        'field_application_access.field_songs.field_full_song',
                        'field_favorites',
                        'field_favorites.field_image',
                        'field_favorites.field_full_song'
                    ].join(','),
                    'fields[user--user]': [
                        'id',
                        'field_application_access',
                        'display_name',
                        'center_message',
                        'field_favorites'
                    ].join(','),
                    'fields[node--song]': [
                        'id',
                        'title',
                        'field_full_song',
                        'field_image'
                    ].join(',')
                };

                // Make an api call to update the User Entity.
                api.getEntity('user', 'user', user.get('id'), params)
                .then((response) => {
                    if(response.status === 200) {
                        const data = {
                            expiration: currentTime + (30 * 60 * 1000),
                            data: response.data.data,
                            included: response.data?.included
                        };
                        result = data;
                        setUserData(data);
                        setIsRefreshing(false);
                    }
                })
                .catch((error) => {
                    console.log('useUserData:', error);
                });
            }
        // If it is null...
        } else {
            // Make an api call to get the user data by email address.
            const params = {
                'filter[email][path]': 'name',
                'filter[email][value]': credentials.username
            };

            api.getEntities('user', 'user', params)
            .then((response) => {
                if(response.status === 200) {
                    const data = {
                        expiration: currentTime + (30 * 60 * 1000),
                        data: response.data.data[0],
                        included: response.data?.included
                    };

                    result = data;
                    setUserData(data);
                    setIsRefreshing(false);
                }
            })
            .catch((error) => {
                console.log('useUserData:', error);
            });
        }
    };

    getData();

    return getData;
};

export default useUserData;