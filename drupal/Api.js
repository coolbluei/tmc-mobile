import axios from 'axios';
import createAuthRefreshInterceptor from 'axios-auth-refresh';
import { accessTokenAtom, refreshTokenAtom, needsRefreshAtom, offlineAtom } from '../storage/atoms';
import QueryString from 'qs';
import * as Network from 'expo-network';

export default class Api {

    constructor(connection, providerStore) {
        this.drupal = connection;
        createAuthRefreshInterceptor(axios, this.refresh);
        this.jotai = providerStore;
    }

    setSession = (session) => {
        this.jotai.set(accessTokenAtom, session.access_token);
        this.jotai.set(refreshTokenAtom, session.refresh_token);
    }

    checkNetwork = async () => {
        const networkStatus = await Network.getNetworkStateAsync();

        if(networkStatus.isInternetReachable && networkStatus.isConnected) {
            if(this.jotai.get(offlineAtom) === true) {
                this.jotai.set(offlineAtom, false);
            }
            return true;
        }
        
        if(this.jotai.get(offlineAtom) === false) {
            this.jotai.set(offlineAtom, true);
        }

        return false;
    }

    login = async (username, password) => {
        let result = {
            type: 'none',
        };

        await axios.post(this.drupal.getBaseUrl() + '/oauth/token', {
            grant_type: 'password',
            client_id: process.env.EXPO_PUBLIC_CLIENT_ID,
            username: username,
            password: password
        })
        .then((response) => {
            result.type = 'response';
            result.data = response.data;
            result.status = response.status;
        })
        .catch((error) => {
            result.type = 'error';
            result.error = error.response;
        });

        return result;
    }

    refresh = async () => {
        if(this.checkNetwork()) {
            const refreshToken = await this.jotai.get(refreshTokenAtom);
            if(refreshToken instanceof String) {
                axios.post(this.drupal.getBaseUrl() + '/oauth/token', {
                    grant_type: 'refresh_token',
                    client_id: process.env.EXPO_PUBLIC_CLIENT_ID,
                    refresh_token: refreshToken
                })
                .then(async (response) => {
                    this.setSession(response.data);
                    await this.jotai.set(needsRefreshAtom, false);
                    return response.data.access_token;
                })
                .catch((error) => {
                    this.jotai.set(needsRefreshAtom, false);
                    this.jotai.set(refreshTokenAtom, null);
                    this.jotai.set(accessTokenAtom, null);
                    console.log('Api.refresh:', error);
                });
            }
        }

        return null;
    }
    
    retry = async (failedRequest) => {
        const newToken = await this.refresh();

        failedRequest.response.config.headers['Authorization'] = 'Bearer: ' + newToken;
        return Promise.resolve();
    }

    patchEntity = async (entityType, entityBundle, id, body) => {
        if(await this.checkNetwork()) {
            let accessToken = await this.jotai.get(accessTokenAtom);

            const options = this.getStandardHeaders(accessToken);

            const response = await axios.patch(this.drupal.getBaseUrl() + this.drupal.getJsonApiBase() + `${entityType}/${entityBundle}/${id}`, body, options);

            return Object.assign(response);
        }

        return null;
    }

    getEntity = async (entityType, entityBundle, id, params = {}) => {
        if(await this.checkNetwork()) {
        
            let accessToken = await this.jotai.get(accessTokenAtom);
            
            const options = this.getStandardHeaders(accessToken);

            if(Object.keys(params) !== 0 && params.constructor === Object) {
                this.addParametersAsOptions(options, params);
            }

            const response = await axios.get(this.drupal.getBaseUrl() + this.drupal.getJsonApiBase() +`${entityType}/${entityBundle}/${id}`, options);

            return Object.assign(response);
        }

        return null;
    }

    getEntities = async (entityType, entityBundle, params = {}) => {
        if(await this.checkNetwork()) {

            let accessToken = await this.jotai.get(accessTokenAtom);

            const options = this.getStandardHeaders(accessToken);

            if(Object.keys(params) !== 0 && params.constructor === Object) {
                this.addParametersAsOptions(options, params);
            }

            const response = await axios.get(this.drupal.getBaseUrl() + this.drupal.getJsonApiBase() + `${entityType}/${entityBundle}`, options);

            return response;
        }

        return null;
    }

    getStandardHeaders = (accessToken) => {
        let headers = {
            'headers': {
                'Accept': 'application/vnd.api+json',
                'Content-Type': 'application/vnd.api+json',
            },
        };

        if(accessToken) {
            headers.headers['Authorization'] = `Bearer ${accessToken}`;
        };

        return headers;
    }

    addParametersAsOptions = (options, params) => {
        const entries = Object.entries(params);

        options.params = {};

        for(const [prop, value] of entries) {
            options.params[prop] = value;
        }

        options.paramsSerializer = function (params) {
            return QueryString.stringify(params, {arrayFormat: 'brackets'})
        }

        return options;
    }

    hasNext = (links) => {
        if(links instanceof Object 
            && links.hasOwnProperty('next')) 
        {
            return true;
        }

        return false;
    }

    getNextUrl = (links) => {
        if(links instanceof Object && links.hasOwnProperty('next')) {
            return links.next.href;
        }

        return null;
    }

}