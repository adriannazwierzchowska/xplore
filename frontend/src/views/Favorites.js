import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Favorites = () => {
    const [favorites, setFavorites] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                const token = localStorage.getItem('authToken');
                if (!token) {
                    alert('You need to log in to view favorites!');
                    return;
                }

                const response = await axios.get('http://127.0.0.1:8000/api/favorites/', {
                    headers: {
                        Authorization: token,
                    },
                });
                setFavorites(response.data);
            } catch (error) {
                console.error('Error fetching favorites:', error);
                alert('Failed to fetch favorites. Please try again.');
            }
        };
        fetchFavorites();
    }, []);

    return (
        <motion.div
            className="favorites-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
        >
            <h1>Your Favorite Places</h1>

            <motion.ul
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.2 }}
            >
                {favorites.map((favorite, index) => (
                    <motion.li
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                    >
                        {favorite.place}
                    </motion.li>
                ))}
            </motion.ul>

            <div className="button-group">
                <motion.button
                    type="button1"
                    onClick={() => navigate('/')}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="back-button"
                >
                    Home
                </motion.button>
            </div>
        </motion.div>
    );
};

export default Favorites;
