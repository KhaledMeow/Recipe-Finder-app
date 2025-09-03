import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useFavorites } from '../context/FavoritesContext';
import FavoritesList from '../components/FavoritesList';
import '../styles/Favorites.css';

const Favorites = () => {
  const navigate = useNavigate();
  const { favorites, toggleFavorite } = useFavorites();

  const handleMealClick = mealId => {
    navigate(`/meal/${mealId}`);
  };

  return (
    <div className="favorites-page">
      <div className="favorites-header">
        <h1>Your Favorite Meals</h1>
        {favorites.length > 0 && (
          <p className="favorites-count">
            {favorites.length} {favorites.length === 1 ? 'meal' : 'meals'} saved
          </p>
        )}
      </div>
      <div className="favorites-container">
        <FavoritesList
          favorites={favorites}
          onFavoriteToggle={toggleFavorite}
          onMealClick={handleMealClick}
        />
      </div>
    </div>
  );
};

export default Favorites;
