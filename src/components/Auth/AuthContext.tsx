import { CustomSessionType } from '@/utils/session';
import { Dispatch, SetStateAction, createContext } from 'react';

type AuthContextComponents = {
    isAuthenticated: boolean;
    setIsAuthenticated: Dispatch<SetStateAction<boolean>>;
    sessionData: CustomSessionType | null;
    setSessionData: Dispatch<SetStateAction<CustomSessionType | null>>;
    isSigningMessage: boolean;
    setIsSigningMessage: Dispatch<SetStateAction<boolean>>;
}

const AuthContext = createContext({} as AuthContextComponents);

export default AuthContext;