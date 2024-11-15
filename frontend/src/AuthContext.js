import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            axios.get('http://127.0.0.1:8000/api/current_user/', {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((response) => setUser(response.data.username))
            .catch(() => setUser(null));
        }
    }, []);

    const login = async (username, password) => {
        const response = await axios.post('http://127.0.0.1:8000/api/login/', { username, password });
        localStorage.setItem('accessToken', response.data.access);
        setUser(response.data.username);
    };

    const logout = () => {
        localStorage.removeItem('accessToken');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider };
