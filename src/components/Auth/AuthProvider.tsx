import { useState } from 'react';
import AuthContext from './AuthContext';

export const AuthProvider = ({ children }: any) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    return (
        <AuthContext.Provider value={{isAuthenticated, setIsAuthenticated}}>
            {children}
        </AuthContext.Provider>
    )
}