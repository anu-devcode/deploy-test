'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';

interface SocketContextType {
    socket: Socket | null;
    isConnected: boolean;
    emit: (event: string, data: any) => void;
    subscribe: (event: string, callback: (data: any) => void) => () => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3000';

export const SocketProvider = ({ children }: { children: ReactNode }) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const { token, user } = useAuth();

    useEffect(() => {
        // Initialize socket connection
        const newSocket = io(SOCKET_URL, {
            auth: {
                token: token ? `Bearer ${token}` : undefined
            },
            transports: ['websocket'], // Prefer websockets
            autoConnect: true,
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
        });

        newSocket.on('connect', () => {
            console.log('Connected to WebSocket server');
            setIsConnected(true);
        });

        newSocket.on('disconnect', () => {
            console.log('Disconnected from WebSocket server');
            setIsConnected(false);
        });

        newSocket.on('connect_error', (error) => {
            console.error('Socket connection error:', error);
        });

        setSocket(newSocket);

        // Cleanup on unmount
        return () => {
            newSocket.disconnect();
        };
    }, [token]);

    const emit = (event: string, data: any) => {
        if (socket && isConnected) {
            socket.emit(event, data);
        }
    };

    const subscribe = (event: string, callback: (data: any) => void) => {
        if (!socket) return () => { };

        socket.on(event, callback);
        return () => {
            socket.off(event, callback);
        };
    };

    return (
        <SocketContext.Provider value={{ socket, isConnected, emit, subscribe }}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => {
    const context = useContext(SocketContext);
    if (context === undefined) {
        throw new Error('useSocket must be used within a SocketProvider');
    }
    return context;
};
