import { Dispatch, SetStateAction, createContext } from 'react';

type AuthContextComponents = {
    isAuthenticated: boolean;
    setIsAuthenticated: Dispatch<SetStateAction<boolean>>;
}

const AuthContext = createContext({} as AuthContextComponents);

export default AuthContext;