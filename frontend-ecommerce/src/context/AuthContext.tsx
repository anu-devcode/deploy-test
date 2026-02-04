'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api, { Permission } from '@/lib/api';

interface AuthContextType {
    isAuthenticated: boolean;
    isAdminAuthenticated: boolean;
    user: User | null;
    adminUser: User | null;
    tenantId: string | null;
    login: (email: string, password: string, portal?: 'STOREFRONT' | 'ADMIN') => Promise<any>;
    register: (email: string, password: string, firstName?: string, lastName?: string, role?: string) => Promise<any>;
    logout: (portal?: 'STOREFRONT' | 'ADMIN') => Promise<void>;
    deleteAccount: () => Promise<void>;
    setTenant: (tenantId: string) => void;
    setIsAuthenticated: (val: boolean) => void;
    setIsAdminAuthenticated: (val: boolean) => void;
    setUser: (user: User | null) => void;
    setAdminUser: (user: User | null) => void;
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
    isEmailVerified?: boolean;
    preferences?: {
        locale?: string;
        timezone?: string;
    };
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [adminUser, setAdminUser] = useState<User | null>(null);
    const [tenantId, setTenantId] = useState<string | null>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const storedAdminUser = localStorage.getItem('admin_user');
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

        if (storedAdminUser) {
            try {
                const parsedAdmin = JSON.parse(storedAdminUser);
                setAdminUser(parsedAdmin);
                setIsAdminAuthenticated(true);
            } catch (e) {
                console.error('Failed to parse stored admin user', e);
            }
        }
    }, []);

    const login = async (email: string, password: string, portal: 'STOREFRONT' | 'ADMIN' = 'STOREFRONT') => {
        const response = await api.login(email, password, portal);
        const userData = response.user;

        if (!userData.requiresPasswordChange) {
            if (portal === 'ADMIN') {
                setIsAdminAuthenticated(true);
                setAdminUser(userData);
                localStorage.setItem('admin_user', JSON.stringify(userData));
            } else {
                setIsAuthenticated(true);
                setUser(userData);
                localStorage.setItem('user', JSON.stringify(userData));
            }
        }

        return userData;
    };

    const register = async (email: string, password: string, firstName?: string, lastName?: string, role: string = 'CUSTOMER') => {
        const response = await api.register(email, password, firstName, lastName, role);
        // response contains { access_token, refresh_token, user }
        const userData = response.user;

        // Automatically log the user in
        setIsAuthenticated(true);
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));

        return userData;
    };

    const logout = async (portal: 'STOREFRONT' | 'ADMIN' = 'STOREFRONT') => {
        try {
            await api.logout();
        } catch (e) {
            console.error('Logout failed', e);
        }

        if (portal === 'ADMIN') {
            localStorage.removeItem('admin_user');
            setIsAdminAuthenticated(false);
            setAdminUser(null);
        } else {
            localStorage.removeItem('user');
            setIsAuthenticated(false);
            setUser(null);
        }
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
            isAdminAuthenticated,
            user,
            adminUser,
            tenantId,
            login,
            register,
            logout,
            deleteAccount,
            setTenant,
            setIsAuthenticated,
            setIsAdminAuthenticated,
            setUser,
            setAdminUser
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
