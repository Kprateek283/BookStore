import React, { createContext, useContext, useState, useEffect } from "react";
import Alert from "../components/Alert";

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    });
    const [token, setToken] = useState(() => localStorage.getItem('token'));
    const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);
    const [alert, setAlert] = useState(null);

    // Initialize auth state
    useEffect(() => {
        const initializeAuth = () => {
            try {
                const storedUser = localStorage.getItem('user');
                const storedToken = localStorage.getItem('token');

                if (storedUser && storedToken) {
                    const parsedUser = JSON.parse(storedUser);
                    setUser(parsedUser);
                    setToken(storedToken);
                    setIsAuthenticated(true);
                }
            } catch (error) {
                console.error('Error initializing auth:', error);
                // Only clear if there's an error parsing the data
                if (error instanceof SyntaxError) {
                    localStorage.removeItem('user');
                    localStorage.removeItem('token');
                }
            } finally {
                setLoading(false);
            }
        };

        initializeAuth();
    }, []);

    // Persist auth state changes to localStorage
    useEffect(() => {
        if (user && token) {
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('token', token);
        }
    }, [user, token]);

    const showAlert = (type, message, duration = 3000) => {
        setAlert({ type, message });
        setTimeout(() => {
            setAlert(null);
        }, duration);
    };

    const clearAlert = () => {
        setAlert(null);
    };

    const loginUser = async (formData) => {
        try {
            setLoading(true);
            const response = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            console.log('Login Response:', data);

            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }

            if (!data.token) {
                throw new Error('No token received');
            }

            console.log('User data from login:', data.user);
            setToken(data.token);
            setUser(data.user);
            setIsAuthenticated(true);
            showAlert('success', 'Login successful');
            return { success: true };
        } catch (error) {
            console.error('Login error:', error);
            showAlert('error', error.message);
            return { success: false, error: error.message };
        } finally {
            setLoading(false);
        }
    };

    const registerUser = async (userData) => {
        try {
            setLoading(true);
            const response = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Registration failed');
            }

            showAlert('success', 'Registration successful');
            return { success: true };
        } catch (error) {
            showAlert('error', error.message);
            return { success: false, error: error.message };
        } finally {
            setLoading(false);
        }
    };

    const logoutUser = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
        showAlert('success', 'Logged out successfully');
    };

    const value = {
        user,
        token,
        isAuthenticated,
        loading,
        alert,
        loginUser,
        registerUser,
        logoutUser,
        showAlert,
        clearAlert,
    };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
            {alert && <Alert type={alert.type} message={alert.message} />}
        </AuthContext.Provider>
    );
}; 