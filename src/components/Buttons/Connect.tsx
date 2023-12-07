import { Button, createStyles } from '@mantine/core';
import { useAuthRequestChallengeEvm } from '@moralisweb3/next';
import { InjectedConnector } from '@wagmi/core/connectors';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useAccount, useConnect, useDisconnect, useSignMessage } from 'wagmi';

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

    const handleAuth = async () => {
        if (isConnected) {
            await disconnectAsync();
        }
        const { account, chain } = await connectAsync({
            connector: new InjectedConnector()
        });

        // for some reason, `const { message }` doesn't work, so we don't destructure the result.
        const requestResult = await requestChallengeAsync({
            address: account,
            chainId: chain.id,
          });

        const message = requestResult?.message ?? '';

        const signature = await signMessageAsync({ message });

        const userData = { address: account, chainId: chain.id };

        console.log('user data: ', userData);
        console.log('signature: ', signature);

        const signinData = await signIn('moralis-auth', {
            message,
            signature,
            redirect: false,
            callbackUrl: '/',
        });

        console.log('signin data: ', signinData);
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