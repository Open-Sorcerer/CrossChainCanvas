import "../styles/globals.css";
import type { AppProps } from "next/app";

import { WagmiConfig, createConfig } from "wagmi";
import { fantomTestnet, avalancheFuji, polygonMumbai } from "wagmi/chains";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import Layout from "../components/Layout";
import ConnectKitTheme from "../components/ConnectKitTheme";

const config = createConfig(
  getDefaultConfig({
    appName: "CrossChainCanvas",
    chains: [polygonMumbai, avalancheFuji, fantomTestnet],
    walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
    autoConnect: false
  })
);

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig config={config}>
      <ConnectKitProvider
        mode='light'
        customTheme={ConnectKitTheme}
        options={{
          embedGoogleFonts: true,
        }}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ConnectKitProvider>
    </WagmiConfig>
  );
}

export default MyApp;
