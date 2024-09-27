import AsyncStorage from "@react-native-async-storage/async-storage";
import { atom } from "jotai";
import { atomWithStorage, createJSONStorage } from "jotai/utils";

const storage = createJSONStorage(() => AsyncStorage);

const apiAtom = atom();
const biometricUsernameAtom = atomWithStorage('biometricUsername', null, storage);
const biometricPasswordAtom = atomWithStorage('biometricPassword', null, storage)
const accessTokenAtom = atomWithStorage('accessToken', null, storage);
const refreshTokenAtom = atomWithStorage('refreshToken', null, storage);
const preferencesAtom = atomWithStorage('preferences', { useBiometrics: false }, storage);
const playlistAtom = atomWithStorage('playlists', { favorites: { id: 'favorites', title: 'Favorites', songs: [] }, userDefined: [] }, storage);
const playlistSyncAtom = atomWithStorage('playlistsSync', false, storage);
const lastPlaylistSyncAtom = atomWithStorage('lastPlaylistSync', 0, storage);
const userDataAtom = atomWithStorage('userData', null, storage);
const sessionAtom = atomWithStorage('session', null, storage);

const needsRefreshAtom = atom(true);
const isAuthenticatedAtom = atom(false);
const downloadsAtom = atom([]);
const updateDownloadsAtom = atom(true);
const downloadQueueAtom = atom([]);
const biometricsEntrolledAtom = atom(false);
const offlineAtom = atom(false);
const debugModeAtom = atom(false);
const isRefreshingAtom = atom(false);
const needsDataAtom = atom(true);

export { 
    apiAtom,
    biometricUsernameAtom,
    biometricPasswordAtom,
    accessTokenAtom,
    refreshTokenAtom,
    preferencesAtom,
    needsRefreshAtom,
    userDataAtom,
    isAuthenticatedAtom,
    playlistAtom,
    playlistSyncAtom,
    lastPlaylistSyncAtom,
    downloadsAtom,
    updateDownloadsAtom,
    downloadQueueAtom,
    biometricsEntrolledAtom,
    offlineAtom,
    debugModeAtom,
    isRefreshingAtom,
    sessionAtom,
    needsDataAtom
};
