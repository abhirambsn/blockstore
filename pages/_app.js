import "../styles/globals.css";
import { MoralisProvider } from "react-moralis";
import { RecoilRoot } from "recoil";
import { Toaster } from "react-hot-toast";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { StoreProvider } from "../context/StoreContext";
import { ThemeProvider } from "next-themes";

function MyApp({ Component, pageProps }) {
  return (
    <MoralisProvider
      appId={process.env.NEXT_PUBLIC_MORALIS_APPID}
      serverUrl={process.env.NEXT_PUBLIC_MORALIS_SERVER}
    >
      <ThemeProvider defaultTheme="dark">
        <RecoilRoot>
          <StoreProvider>
            <Toaster />
            <div suppressHydrationWarning className="flex flex-col min-h-screen">
              <Navbar />
              <div className="mt-4 mb-4 flex-grow">
                <Component {...pageProps} />
              </div>
              <Footer />
            </div>
          </StoreProvider>
        </RecoilRoot>
      </ThemeProvider>
    </MoralisProvider>
  );
}

export default MyApp;
