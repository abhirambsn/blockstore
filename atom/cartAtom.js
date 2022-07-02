import { atom } from "recoil";
import { persistAtomEffect } from "./ssrComplete";

export const cartAtom = atom({
    key:'cartAtom',
    default: [],
    effects_UNSTABLE: [persistAtomEffect]
})