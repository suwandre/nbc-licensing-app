import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import AuthContext from './AuthContext';
import { getSession, signIn, signOut } from 'next-auth/react';
import { Connector, ConnectorData, useAccount, useConnect, useDisconnect, useSignMessage } from 'wagmi';
import { web3Auth } from '@/utils/web3Auth';
import { useAuthRequestChallengeEvm } from '@moralisweb3/next';
import { CustomSessionType } from '@/utils/session';

export const AuthProvider = ({ children }: any) => {
    // `isConnected` from `useAccount` only checks if Metamask is connected and NOT if the user is `authenticated`, thus we add an extra state here to check for auth.
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [sessionData, setSessionData] = useState(null) as [CustomSessionType | null, Dispatch<SetStateAction<CustomSessionType | null>>];
    // whether the user is currently signing a message on their wallet provider.
    const [isSigningMessage, setIsSigningMessage] = useState(false);
    const { isConnected, address, connector: activeConnector } = useAccount();
    const { connectAsync } = useConnect();
    const { disconnectAsync } = useDisconnect();
    const { requestChallengeAsync } = useAuthRequestChallengeEvm();
    const { signMessageAsync } = useSignMessage();

    // check for connector (chain/account) changes that are done from the web3 provider.
    useEffect(() => {
        const handleConnectorUpdate = async ({ account, chain }: ConnectorData) => {
            if (account) {
                // recalls `web3Auth`
                await web3Auth(
                    isConnected,
                    setIsAuthenticated,
                    setIsSigningMessage,
                    connectAsync,
                    disconnectAsync,
                    requestChallengeAsync,
                    signMessageAsync,
                    signIn
                );
            } else if (chain) {
                // TBD: handle chain change modal (and check if chain is wrong)
                console.log('chain change');
            }
        }

        if (activeConnector) {
            activeConnector.on('change', handleConnectorUpdate);
        }

        return () => {
            activeConnector?.off('change', handleConnectorUpdate);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeConnector]);

    useEffect(() => {
        const sessionData = async () => {
          const session = await getSession() as CustomSessionType | null;
    
          if (session) {
            console.log('session: ', session);
            setIsAuthenticated(true);
            setSessionData(session);
          } else {
            // default set to false just in case `isAuthenticated` is stuck at true even when there is no session.
            setIsAuthenticated(false);
          }
        };
    
        sessionData();
      }, [isConnected, address, isSigningMessage, activeConnector]);

    return (
        <AuthContext.Provider value={{isAuthenticated, setIsAuthenticated, sessionData, setSessionData, isSigningMessage, setIsSigningMessage}}>
            {children}
        </AuthContext.Provider>
    )
}