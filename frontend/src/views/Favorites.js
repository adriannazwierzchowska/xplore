import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useSoundContext } from '../SoundContext';
import '../front.css';

const Favorites = () => {
    const navigate = useNavigate();
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { soundClick } = useSoundContext();

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
                setLoading(false);
            } catch (error) {
                console.error('Error fetching favorites:', error);
                setError('Failed to fetch favorites. Please try again.');
                setLoading(false);
            }
        };
        fetchFavorites();
    }, []);

    const handleRemoveFavorite = async (place) => {
        soundClick(); // Add sound when removing a favorite
        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                alert('You need to log in to remove favorites!');
                return;
            }

            await axios.delete(`http://127.0.0.1:8000/api/favorites/${place.id}/`, {
                headers: {
                    Authorization: token,
                },
            });

            setFavorites((prevFavorites) =>
                prevFavorites.filter((favorite) => favorite.id !== place.id)
            );
        } catch (error) {
            console.error('Error removing favorite:', error);
            alert('Failed to remove favorite. Please try again.');
        }
    };

    return (
        <motion.div
            className="favorites-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <motion.h1
                className="favorites-heading"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
            >
                Your Favorite Destinations
            </motion.h1>

            {loading && <p>Loading your favorites...</p>}
            {error && <p className="error">{error}</p>}

            <motion.div
                className="favorites-grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
            >
                {favorites.map((favorite, index) => (
                    <motion.div
                        key={index}
                        className="favorite-item"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                    >
                        <p>{favorite.place}</p>
                        <motion.button
                            className="remove-button"
                            onClick={() => handleRemoveFavorite(favorite)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Remove
                        </motion.button>
                    </motion.div>
                ))}
            </motion.div>

            <motion.button
                className="back-button"
                onClick={() => {
                    soundClick(); // Add sound when going back
                    navigate('/');
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
            >
                Return Home
            </motion.button>
        </motion.div>
    );
};

export default Favorites;
