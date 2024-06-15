import { atom } from "jotai";

const tracksAtom = atom([]);
const indexAtom = atom();
const positionAtom = atom(0);
const durationAtom = atom(0);
const isPlayingAtom = atom(false);
const isLoadingAtom = atom(false);
const titleAtom = atom();
const playbackInstanceAtom = atom();
const loopAtom = atom(false);

export { tracksAtom, indexAtom, positionAtom, durationAtom, isLoadingAtom, isPlayingAtom, titleAtom, playbackInstanceAtom, loopAtom };