import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


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
        <div>
            <h1>Your Favorite Places</h1>
            <ul>
                {favorites.map((favorite, index) => (
                    <li key={index}>{favorite.place}</li>
                ))}
            </ul>
            <div className="button-group">
                <button type="button1" onClick={() => navigate('/')}>
                    Home
                </button>
            </div>
        </div>
    );
};

export default Favorites;
