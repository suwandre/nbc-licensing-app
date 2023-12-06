import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { MantineProvider } from "@mantine/core";
import { COLORS } from "@/components/Globals/colors";
import GlobalStyles from "@/components/Globals/Styles";
import { createConfig, configureChains, WagmiConfig } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { SessionProvider } from "next-auth/react";
import { bscTestnet, bsc, mainnet, sepolia } from "wagmi/chains";

const { publicClient, webSocketPublicClient } = configureChains(
  // main chain will still be bsc testnet until licensing smart contract is ready for deployment on mainnets.
  [bscTestnet, bsc, mainnet, sepolia],
  [publicProvider()]
);

const config = createConfig({
  autoConnect: true,
  publicClient,
  webSocketPublicClient,
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig config={config}>
      <SessionProvider session={pageProps.session} refetchInterval={0}>
        <MantineProvider
          withGlobalStyles
          withNormalizeCSS
          theme={{
            colorScheme: "dark",
            fontFamily: "Chakra Petch, sans-serif",
            headings: { fontFamily: "Chakra Petch, sans-serif" },
            loader: "oval",
            colors: {
              nbcGreen: [COLORS.green],
              nbcRed: [COLORS.red],
            },
          }}
        >
          <GlobalStyles />
          <Component {...pageProps} />
        </MantineProvider>
      </SessionProvider>
    </WagmiConfig>
  );
}
