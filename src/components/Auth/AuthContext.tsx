import { CustomSessionType } from '@/utils/session';
import { Dispatch, SetStateAction, createContext } from 'react';

type AuthContextComponents = {
    isAuthenticated: boolean;
    setIsAuthenticated: Dispatch<SetStateAction<boolean>>;
    sessionData: CustomSessionType | null;
    setSessionData: Dispatch<SetStateAction<CustomSessionType | null>>;
    isSigningMessage: boolean;
    setIsSigningMessage: Dispatch<SetStateAction<boolean>>;
    kycVerified: boolean;
    setKYCVerified: Dispatch<SetStateAction<boolean>>;
    signinSignature: string;
    setSigninSignature: Dispatch<SetStateAction<string>>;
}

const AuthContext = createContext({} as AuthContextComponents);

export default AuthContext;