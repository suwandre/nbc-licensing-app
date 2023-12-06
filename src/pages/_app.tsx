import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { MantineProvider } from '@mantine/core';
import { COLORS } from '@/components/Globals/colors';
import GlobalStyles from '@/components/Globals/Styles';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{
        colorScheme: 'dark',
        fontFamily: 'Chakra Petch, sans-serif',
        headings: { fontFamily: 'Chakra Petch, sans-serif' },
        loader: 'oval',
        colors: {
          nbcGreen: [COLORS.green],
          nbcRed: [COLORS.red],
        },
      }}
    >
      <GlobalStyles />
      <Component {...pageProps} />
    </MantineProvider>
  )
}
