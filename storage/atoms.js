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
const songDataAtom = atom();
const userDataAtom = atom();
const collectionDataAtom = atom();
const classDateDataAtom = atom();
const needsRefreshAtom = atom(true);
const isAuthenticatedAtom = atom(false);

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
    classDateDataAtom 
};
