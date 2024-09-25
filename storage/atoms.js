import AsyncStorage from "@react-native-async-storage/async-storage";
import { atom } from "jotai";
import { atomWithStorage, createJSONStorage } from "jotai/utils";

const storage = createJSONStorage(() => AsyncStorage);

const apiAtom = atom();
const pageIdAtom = atom('Home');
const credentialsAtom = atomWithStorage('credentials', {}, storage);
const accessTokenAtom = atomWithStorage('accessToken', null, storage);
const refreshTokenAtom = atomWithStorage('refreshToken', null, storage);
const preferencesAtom = atomWithStorage('preferences', { useBiometrics: false }, storage);
const playlistAtom = atomWithStorage('playlists', { favorites: { id: 'favorites', title: 'Favorites', songs: [] }, userDefined: [] }, storage);
const playlistSyncAtom = atomWithStorage('playlistsSync', false, storage);
const lastPlaylistSyncAtom = atomWithStorage('lastPlaylistSync', 0, storage);
const collectionDataAtom = atomWithStorage('collectionData', null, storage);
const userDataAtom = atomWithStorage('userData', null, storage);

const songDataAtom = atom();
const needsRefreshAtom = atom(true);
const isAuthenticatedAtom = atom(false);
const downloadsAtom = atom([]);
const updateDownloadsAtom = atom(true);
const downloadQueueAtom = atom([]);
const downloadsInProgressAtom = atom([]);
const biometricsEntrolledAtom = atom(false);
const offlineAtom = atom(true);
const debugModeAtom = atom(false);
const isRefreshingAtom = atom(false);

export { 
    apiAtom,
    credentialsAtom,
    accessTokenAtom,
    refreshTokenAtom,
    preferencesAtom,
    pageIdAtom,
    needsRefreshAtom,
    userDataAtom,
    isAuthenticatedAtom,
    collectionDataAtom,
    songDataAtom,
    playlistAtom,
    playlistSyncAtom,
    lastPlaylistSyncAtom,
    downloadsAtom,
    updateDownloadsAtom,
    downloadQueueAtom,
    downloadsInProgressAtom,
    biometricsEntrolledAtom,
    offlineAtom,
    debugModeAtom,
    isRefreshingAtom
};
