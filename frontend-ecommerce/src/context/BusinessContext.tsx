'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type BusinessMode = 'RETAIL' | 'BULK';

interface BusinessContextType {
    mode: BusinessMode;
    setMode: (mode: BusinessMode) => void;
    toggleMode: () => void;
}

const BusinessContext = createContext<BusinessContextType | undefined>(undefined);

export function BusinessProvider({ children }: { children: React.ReactNode }) {
    const [mode, setMode] = useState<BusinessMode>('RETAIL');

    // Load from local storage
    useEffect(() => {
        const saved = localStorage.getItem('business-mode') as BusinessMode;
        if (saved && (saved === 'RETAIL' || saved === 'BULK')) {
            setMode(saved);
        }
    }, []);

    const handleSetMode = (newMode: BusinessMode) => {
        setMode(newMode);
        localStorage.setItem('business-mode', newMode);
    };

    const toggleMode = () => {
        handleSetMode(mode === 'RETAIL' ? 'BULK' : 'RETAIL');
    };

    return (
        <BusinessContext.Provider value={{ mode, setMode: handleSetMode, toggleMode }}>
            {children}
        </BusinessContext.Provider>
    );
}

export function useBusiness() {
    const context = useContext(BusinessContext);
    if (context === undefined) {
        throw new Error('useBusiness must be used within a BusinessProvider');
    }
    return context;
}
