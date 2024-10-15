import { atom } from "jotai";

const tracksAtom = atom([]);
const indexAtom = atom();
const loopAtom = atom(false);

export { tracksAtom, indexAtom, loopAtom };