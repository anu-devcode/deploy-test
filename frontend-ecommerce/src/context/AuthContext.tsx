'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '@/lib/api';

interface AuthContextType {
    isAuthenticated: boolean;
    user: User | null;
    tenantId: string | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    setTenant: (tenantId: string) => void;
}

interface User {
    email: string;
    role: string;
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
                setUser(JSON.parse(storedUser));
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
            const userData = { email, role: 'ADMIN' };
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
            return;
        }

        const response = await api.login(email, password);
        localStorage.setItem('token', response.access_token);
        api.setToken(response.access_token);
        setIsAuthenticated(true);
        // Decode JWT to get user info (simplified)
        const payload = JSON.parse(atob(response.access_token.split('.')[1]));
        const userData = { email: payload.email, role: payload.role };
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
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
        <AuthContext.Provider value={{ isAuthenticated, user, tenantId, login, logout, setTenant }}>
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
