import React from 'react';
import { useFavorites } from '../context/FavoritesContext';
import FavoritesList from '../components/FavoritesList';
import '../styles/Favorites.css';

const Favorites = () => {
  const { favorites, toggleFavorite } = useFavorites();

  return (
    <div className="favorites-page">
      <h1>Your Favorite Recipes</h1>
      {favorites.length === 0 ? (
        <div className="empty-favorites">
          <p>You haven't added any recipes to your favorites yet.</p>
          <p>Search for recipes and click the star icon to add them here!</p>
        </div>
      ) : (
        <>
          <p className="favorites-count">
            {favorites.length} {favorites.length === 1 ? 'recipe' : 'recipes'} saved
          </p>
          <FavoritesList favorites={favorites} onFavoriteToggle={toggleFavorite} />
        </>
      )}
    </div>
  );
};

export default Favorites;
