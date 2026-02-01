'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import api from '@/lib/api';
import { useAuth } from './AuthContext';
import { useSocket } from './SocketContext';

interface NotificationContextType {
    unreadCount: number;
    refreshCount: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
    const [unreadCount, setUnreadCount] = useState(0);
    const { isAuthenticated } = useAuth();
    const { socket, isConnected } = useSocket();

    const fetchCounts = useCallback(async () => {
        if (!isAuthenticated) {
            setUnreadCount(0);
            return;
        }

        try {
            const [notifData, msgData] = await Promise.all([
                api.getUnreadNotificationsCount().catch(() => ({ count: 0 })),
                api.getUnreadMessagesCount().catch(() => ({ count: 0 }))
            ]);
            setUnreadCount(notifData.count + msgData.count);
        } catch (error) {
            console.error('Failed to fetch unread counts', error);
        }
    }, [isAuthenticated]);

    useEffect(() => {
        fetchCounts();

        // Poll every 2 minutes as a fallback
        const interval = setInterval(fetchCounts, 120000);
        return () => clearInterval(interval);
    }, [fetchCounts]);

    // WebSocket Integration for real-time updates
    useEffect(() => {
        if (socket && isConnected) {
            const handleNewEvent = () => {
                fetchCounts();
            };

            socket.on('new_notification', handleNewEvent);
            socket.on('new_message', handleNewEvent);
            socket.on('notification_read', handleNewEvent);

            return () => {
                socket.off('new_notification', handleNewEvent);
                socket.off('new_message', handleNewEvent);
                socket.off('notification_read', handleNewEvent);
            };
        }
    }, [socket, isConnected, fetchCounts]);

    return (
        <NotificationContext.Provider value={{ unreadCount, refreshCount: fetchCounts }}>
            {children}
        </NotificationContext.Provider>
    );
}

export function useNotifications() {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
}
