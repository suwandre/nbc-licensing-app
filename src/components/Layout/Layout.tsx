import { Container, Flex, Loader, ScrollArea } from '@mantine/core';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { MainNavbar } from '../Navbar/Navbar';
import { useAccount } from 'wagmi';

type LayoutProps = {
    children?: React.ReactNode;
    pageTitle?: string;
    description?: string;
    keywords?: string;
}

export const Layout = ({
    children,
    pageTitle,
    description = 'Building immersive Web3-native IPs',
    keywords = 'nbc, ip, web3, franchise, realm hunter, multiplayer game, nft gaming, nft, licensing'
}: LayoutProps): JSX.Element => {
    const [loading, setLoading] = useState(true);
    // checks if user is connected via an injected connector.
    const { isConnected } = useAccount();

    const title = !!pageTitle ? `${pageTitle} | Not Boring Company` : 'Not Boring Company';

    useEffect(() => {
        // hacky way to prevent blip/race conditions (will be changed in the future).
        setTimeout(() => {
            setLoading(false);
          }, 150);

          
        console.log('is connected: ', isConnected);
    }, [isConnected])

    return (
        <>
      <Head>
        <title>{title}</title>
        <meta name='description' content={description} />
        <meta name='keywords' content={keywords} />
        <link rel='shortcut icon' href='/favicon/favicon.ico' />
      </Head>
      <Flex
        direction='column'
      >
        <MainNavbar />
        <ScrollArea
          sx={{
            '.mantine-ScrollArea-viewport > div': {
              height: '100%',
            },
          }}
          pos='relative'
          h={'calc(100vh - 80px)'}
        >
          <Container
            pos='relative'
            w='100%'
            h='100%'
            maw='1400px'
            sx={{
              display: 'flex',
            }}
            px={'40px'}
            pb={'24px'}
          >
            {loading ? (
              <Loader
                sx={{ position: 'absolute', left: '50%' }}
                color='green'
              />
            ) : (
              <>
                {children}
                {/* {' '}
                {withAuth ? (
                  <>{(isAuthenticated || isEmailAuthenticated) ? renderedComponent : authWall}</>
                ) : (
                  renderedComponent
                )} */}
              </>
            )}
          </Container>
        </ScrollArea>
      </Flex>
    </>
    )
}