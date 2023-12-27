import { RequestChallengeEvmRequestClient } from '@moralisweb3/next';
import { ConnectArgs, ConnectResult, PublicClient, SignMessageArgs } from '@wagmi/core';
import { BuiltInProviderType } from 'next-auth/providers';
import { LiteralUnion, SignInAuthorizationParams, SignInOptions, SignOutParams, getSession } from 'next-auth/react';
import { Dispatch, SetStateAction, useCallback } from 'react';
import { MutateOptions } from 'react-query';
import { InjectedConnector } from '@wagmi/core/connectors';
import { CustomSessionType } from './session';

/**
 * Connects to an injected Web3 provider, requests and signs a challenge, 
 * and signs the user in via `next-auth/react`'s `signIn`, providing a session token.
 * 
 * If the user does not have an account in the database yet, one will be created for them.
 */
export const web3Auth = async (
    /** `isConnected` from wagmi's `useAccount()` hook. */
    isConnected: boolean,
    /** `setIsAuthenticated` from AuthContext component. */
    setIsAuthenticated: Dispatch<SetStateAction<boolean>>,
    /** `setIsSigningMessage` from AuthContext component. */
    setIsSigningMessage: Dispatch<SetStateAction<boolean>>,
    /** `setSigninSignature` from AuthContext component. */
    setSigninSignature: Dispatch<SetStateAction<string>>,
    // /** `setSessionData` from AuthContext component. */
    // setSessionData: Dispatch<SetStateAction<CustomSessionType|null>>,
    connectAsync: (args?: Partial<ConnectArgs> | undefined) => Promise<ConnectResult<PublicClient>>,
    disconnectAsync: (variables: void, options?: MutateOptions<void, Error, void, unknown> | undefined) => Promise<void>,
    // request challenge currently only supports EVM clients; we will branch this out in the future.
    requestChallengeAsync: (params?: RequestChallengeEvmRequestClient | undefined) => Promise<{
        id: string;
        profileId: string;
        message: string;
    } | undefined>,
    signMessageAsync: (args?: SignMessageArgs | undefined) => Promise<`0x${string}`>,
    signIn: (provider?: LiteralUnion<BuiltInProviderType> | undefined, options?: SignInOptions | undefined, authorizationParams?: SignInAuthorizationParams | undefined) => Promise<any>
): Promise<void> => {
    // disconnects first if already connected, just to be safe.
    if (isConnected) await disconnectAsync();

    const { account, chain } = await connectAsync({
        connector: new InjectedConnector()
    });

    // for some reason, `const { messsage }` doesn't work here, so we don't destructure the result first.
    const requestResult = await requestChallengeAsync({
        address: account,
        chainId: chain.id
    }).catch((err) => {
        console.error(err);

        return;
    });

    const message = requestResult?.message ?? '';

    setIsSigningMessage(true);

    const signature = await signMessageAsync({message}).then(async sig => {
        const userData = { address: account, chainId: chain.id };

        console.log('user data: ', userData);
        console.log('signature: ', sig);

        await signIn('moralis-auth', {
            message,
            signature: sig,
            redirect: false,
            callbackUrl: '/',
        }).then(async data => {
            setIsAuthenticated(true);
            setSigninSignature(sig);

            console.log('signin data: ', data);
        }).catch((err) => {
            console.log('error signing in: ', err);
        });
    }).catch((err) => {
        console.log('error signing message: ', err);
    });

    setIsSigningMessage(false);
}

/**
 * Disconnects from the current Web3 provider and signs the user out via `next-auth/react`'s `signOut`, removing their session.
 */
export const web3Disconnect = async (
    disconnectAsync: (variables: void, options?: MutateOptions<void, Error, void, unknown> | undefined) => Promise<void>,
    signOut: (options?: SignOutParams<true> | undefined) => Promise<undefined>
) => {
    await disconnectAsync().catch((err) => {
        console.error(err);
        return;
    });

    await signOut({
        callbackUrl: '/'
    }).catch((err) => {
        console.error(err);
        return;
    });
}