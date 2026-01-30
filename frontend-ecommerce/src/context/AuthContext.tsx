'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api, { Permission } from '@/lib/api';

interface AuthContextType {
    isAuthenticated: boolean;
    user: User | null;
    tenantId: string | null;
    login: (email: string, password: string) => Promise<any>;
    logout: () => void;
    setTenant: (tenantId: string) => void;
    setIsAuthenticated: (val: boolean) => void;
    setUser: (user: User | null) => void;
}

interface User {
    id: string;
    email: string;
    role: string;
    permissions: Permission[];
    requiresPasswordChange: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [tenantId, setTenantId] = useState<string | null>(null);

    useEffect(() => {
        // Check for stored auth on mount
        const token = localStorage.getItem('token');
        const storedTenantId = localStorage.getItem('tenantId');
        const storedUser = localStorage.getItem('user');

        if (token && storedTenantId) {
            api.setToken(token);
            api.setTenantId(storedTenantId);
            setIsAuthenticated(true);
            setTenantId(storedTenantId);
            if (storedUser) {
                try {
                    const parsedUser = JSON.parse(storedUser);
                    setUser({
                        id: parsedUser.id || 'unknown',
                        email: parsedUser.email || '',
                        role: parsedUser.role || 'STAFF',
                        permissions: parsedUser.permissions || [],
                        requiresPasswordChange: parsedUser.requiresPasswordChange || false
                    });
                } catch (e) {
                    console.error('Failed to parse stored user', e);
                    localStorage.removeItem('user');
                }
            }
        }
    }, []);

    const login = async (email: string, password: string) => {
        // "For now" admin bypass
        if (email === 'admin@brolf.tech' && password === '1234567') {
            const mockToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${btoa(JSON.stringify({ email, role: 'ADMIN', sub: 'demo-admin-id' }))}.signature`;
            localStorage.setItem('token', mockToken);
            api.setToken(mockToken);
            setIsAuthenticated(true);
            const userData: User = {
                id: 'demo-admin-id',
                email,
                role: 'ADMIN',
                permissions: ['ALL'],
                requiresPasswordChange: false
            };
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
            return;
        }

        const response = await api.login(email, password);
        localStorage.setItem('token', response.access_token);
        api.setToken(response.access_token);

        // Decode JWT to get user info (using window.atob for mock)
        const payload = JSON.parse(atob(response.access_token.split('.')[1]));
        const userData: User = {
            id: payload.sub,
            email: payload.email,
            role: payload.role,
            permissions: payload.permissions || [],
            requiresPasswordChange: payload.requiresPasswordChange || false
        };

        if (!userData.requiresPasswordChange) {
            setIsAuthenticated(true);
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
        }

        return userData; // Return to handle "Requires Change" redirect in UI
    };

    const logout = () => {
        localStorage.removeItem('token');
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
