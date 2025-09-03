import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useFavorites } from '../context/FavoritesContext';
import FavoritesList from '../components/FavoritesList';
import '../styles/Favorites.css';

const Favorites = () => {
  const navigate = useNavigate();
  const { favorites, toggleFavorite } = useFavorites();

  const handleRecipeClick = recipeId => {
    navigate(`/recipe/${recipeId}`);
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  return (
    <div className="favorites-page">
      <div className="favorites-header">
        <button className="back-button" onClick={handleBackClick}>
          &larr; Back
        </button>
        <h1>Your Favorite Recipes</h1>
        {favorites.length > 0 && (
          <p className="favorites-count">
            {favorites.length} {favorites.length === 1 ? 'recipe' : 'recipes'} saved
          </p>
        )}
      </div>
      <div className="favorites-container">
        <FavoritesList
          favorites={favorites}
          onFavoriteToggle={toggleFavorite}
          onRecipeClick={handleRecipeClick}
        />
      </div>
    </div>
  );
};

export default Favorites;
