import Head from "next/head";
import { useEffect } from "react";
import { useSsrCompleteState } from "../atom/ssrComplete";
import Main from "../components/Main";

export default function Home() {
  const setSsrComplete = useSsrCompleteState();
  useEffect(setSsrComplete, [setSsrComplete]);
  return (
    <div className="bg-base-200">
      <Head>
        <title>Blockstore - Home</title>
      </Head>
      <Main />
    </div>
  );
}
