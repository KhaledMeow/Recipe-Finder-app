import React from 'react';
import RecipeCard from './RecipeCard';
import '../styles/RecipeCard.css';

const FavoritesList = ({ favorites, onFavoriteToggle }) => {
  if (favorites.length === 0) {
    return (
      <div className="no-favorites">
        <p>You haven't added any recipes to favorites yet.</p>
      </div>
    );
  }

  return (
    <div className="favorites-grid">
      {favorites.map((recipe) => (
        <RecipeCard
          key={recipe.id}
          recipe={recipe}
          onFavoriteToggle={onFavoriteToggle}
          isFavorite={true}
        />
      ))}
    </div>
  );
};

export default FavoritesList;
