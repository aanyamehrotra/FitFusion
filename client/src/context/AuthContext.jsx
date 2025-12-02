import { createContext, useState, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUser = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const res = await api.get('/auth');
                    setUser(res.data);
                } catch (err) {
                    localStorage.removeItem('token');
                }
            }
            setLoading(false);
        };
        loadUser();
    }, []);

    const login = async (email, password) => {
        try {
            const res = await api.post('/auth/login', { email, password });
            if (!res.data.token) {
                throw new Error('No token received');
            }
            localStorage.setItem('token', res.data.token);
            const userRes = await api.get('/auth');
            setUser(userRes.data);
        } catch (err) {
            localStorage.removeItem('token');
            throw err;
        }
    };

    const register = async (name, email, password, role = 'client') => {
        try {
            const res = await api.post('/auth/register', { name, email, password, role });
            if (!res.data.token) {
                throw new Error('No token received');
            }
            localStorage.setItem('token', res.data.token);
            const userRes = await api.get('/auth');
            setUser(userRes.data);
        } catch (err) {
            localStorage.removeItem('token');
            throw err;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
