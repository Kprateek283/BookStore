import React from 'react';
import { AuthProvider } from './AuthContext';
import { BookProvider } from './BookContext';
import { AppProvider } from './AppContext';

export const RootProvider = ({ children }) => {
    return (
        <AuthProvider>
            <BookProvider>
                <AppProvider>
                    {children}
                </AppProvider>
            </BookProvider>
        </AuthProvider>
    );
};

export * from './AuthContext';
export * from './BookContext';
export * from './AppContext'; 