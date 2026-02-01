'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api, { Permission } from '@/lib/api';

interface AuthContextType {
    isAuthenticated: boolean;
    user: User | null;
    tenantId: string | null;
    login: (email: string, password: string, portal?: 'STOREFRONT' | 'ADMIN') => Promise<any>;
    logout: () => Promise<void>;
    deleteAccount: () => Promise<void>;
    setTenant: (tenantId: string) => void;
    setIsAuthenticated: (val: boolean) => void;
    setUser: (user: User | null) => void;
}

interface User {
    id: string;
    email: string;
    name?: string;
    phone?: string;
    avatar?: string;
    role: string;
    permissions: Permission[];
    requiresPasswordChange: boolean;
    isPrimary?: boolean;
    preferences?: {
        locale?: string;
        timezone?: string;
    };
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [tenantId, setTenantId] = useState<string | null>(null);

    useEffect(() => {
        // Hydrate from localStorage for fast UI, then verify session
        const storedUser = localStorage.getItem('user');
        const storedTenantId = localStorage.getItem('tenantId');

        if (storedTenantId) {
            api.setTenantId(storedTenantId);
            setTenantId(storedTenantId);
        }

        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser);
                setIsAuthenticated(true);
            } catch (e) {
                console.error('Failed to parse stored user', e);
            }
        }

        // Ideally call a `/auth/me` or similar to verify cookie session
        // api.getProfile().then(user => { ... }).catch(() => logout())
    }, []);

    const login = async (email: string, password: string, portal: 'STOREFRONT' | 'ADMIN' = 'STOREFRONT') => {
        const response = await api.login(email, password, portal);
        // response.user contains all necessary fields
        const userData = response.user;

        if (!userData.requiresPasswordChange) {
            setIsAuthenticated(true);
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
        }

        return userData;
    };

    const logout = async () => {
        try {
            await api.logout();
        } catch (e) {
            console.error('Logout failed', e);
        }
        localStorage.removeItem('user');
        setIsAuthenticated(false);
        setUser(null);
    };

    const deleteAccount = async () => {
        await api.deleteAccount();
        localStorage.removeItem('user');
        setIsAuthenticated(false);
        setUser(null);
    };

    const setTenant = (id: string) => {
        localStorage.setItem('tenantId', id);
        api.setTenantId(id);
        setTenantId(id);
    };

    return (
        <AuthContext.Provider value={{
            isAuthenticated,
            user,
            tenantId,
            login,
            logout,
            deleteAccount,
            setTenant,
            setIsAuthenticated,
            setUser
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
