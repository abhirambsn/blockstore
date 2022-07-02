import { atom, useSetRecoilState } from "recoil";
import { recoilPersist } from "recoil-persist";

const ssrComplete = atom({
  key: "ssrComplete",
  default: false,
});

export const useSsrCompleteState = () => {
  const setSsrComplete = useSetRecoilState(ssrComplete);
  return () => setSsrComplete(true);
};

const { persistAtom } = recoilPersist();

export const persistAtomEffect = (param) => {
  param.getPromise(ssrComplete).then(() => persistAtom(param));
};
