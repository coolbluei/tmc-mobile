import AsyncStorage from "@react-native-async-storage/async-storage";
import { atom } from "jotai";
import { atomWithStorage, createJSONStorage } from "jotai/utils";

const storage = createJSONStorage(() => AsyncStorage);

const apiAtom = atom();
const biometricUsernameAtom = atomWithStorage('biometricUsername', null, storage);
const biometricPasswordAtom = atomWithStorage('biometricPassword', null, storage);
const preferencesAtom = atomWithStorage('preferences', { useBiometrics: false }, storage);
const favoritesAtom = atomWithStorage('playlists', [], storage);
const isAuthenticatedAtom = atom(false);
const biometricsEntrolledAtom = atom(false);
const offlineAtom = atom(false);
const debugModeAtom = atom(false);

// ???
const sessionAtom = atomWithStorage('session', null, storage);

// Move to react-query
const userDataAtom = atomWithStorage('userData', null, storage);
const needsDataAtom = atom(true);
const isRefreshingAtom = atom(false);
const downloadsAtom = atom([]);
const updateDownloadsAtom = atom(true);
const downloadQueueAtom = atom([]);

export {
    apiAtom,
    biometricUsernameAtom,
    biometricPasswordAtom,
    preferencesAtom,
    userDataAtom,
    isAuthenticatedAtom,
    favoritesAtom,
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
