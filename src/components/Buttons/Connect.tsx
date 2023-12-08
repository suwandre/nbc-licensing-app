import { Button, createStyles } from '@mantine/core';
import { useAuthRequestChallengeEvm } from '@moralisweb3/next';
import { InjectedConnector } from '@wagmi/core/connectors';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import { Dispatch, SetStateAction, useContext } from 'react';
import { useAccount, useConnect, useDisconnect, useSignMessage } from 'wagmi';
import AuthContext from '../Auth/AuthContext';
import { web3Auth } from '@/utils/web3Auth';

const useStyles = createStyles((theme) => ({
    connectButton: {
        backgroundColor: '#42ca9f',
        transitionDuration: '200ms',
        '&:hover': {
          transform: 'scale(1.01) translate(1px, -3px)',
          backgroundColor: '#42ca9f',
        },
    
        '&:active': {
          transform: 'translateY(2px)',
        },
      }
}))

export const ConnectButton = () => {
    const { connectAsync } = useConnect();
    const { signMessageAsync } = useSignMessage();
    // we currently only support EVM chains.
    const { requestChallengeAsync } = useAuthRequestChallengeEvm();
    const { classes } = useStyles();
    const { isConnected } = useAccount();
    const { disconnectAsync } = useDisconnect();

    const { setIsAuthenticated, setIsSigningMessage } = useContext(AuthContext);

    const handleAuth = async () => {
        await web3Auth(
            isConnected,
            setIsAuthenticated,
            setIsSigningMessage,
            connectAsync,
            disconnectAsync,
            requestChallengeAsync,
            signMessageAsync,
            signIn,
        );
    }

    return (
        <Button
            className={classes.connectButton}
            onClick={handleAuth}
        >
            Connect
        </Button>
    )
}