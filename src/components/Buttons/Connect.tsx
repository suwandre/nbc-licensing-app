import { Button, createStyles } from '@mantine/core';
import { useAuthRequestChallengeEvm } from '@moralisweb3/next';
import { InjectedConnector } from '@wagmi/core/connectors';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import { Dispatch, SetStateAction } from 'react';
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

type ConnectButtonProps = {
    setIsAuthenticated: Dispatch<SetStateAction<boolean>>;
}

export const ConnectButton = ({setIsAuthenticated}: ConnectButtonProps) => {
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
        }).catch((err) => {
            console.log('error requesting challenge: ', err);
            return;
        });

        const message = requestResult?.message ?? '';

        const signature = await signMessageAsync({ message }).then(sig => {
            const userData = { address: account, chainId: chain.id };

            console.log('user data: ', userData);
            console.log('signature: ', sig);

            const signinData = signIn('moralis-auth', {
                message,
                signature: sig,
                redirect: false,
                callbackUrl: '/',
            }).then(data => {
                setIsAuthenticated(true);

                console.log('signin data: ', data);
            }).catch((err) => {
                console.log('error signing in: ', err);
                return;
            });
        }).catch((err) => {
            console.log('error signing message: ', err);
            return;
        })
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