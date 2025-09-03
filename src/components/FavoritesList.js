import React from 'react';
import PropTypes from 'prop-types';
import RecipeCard from './RecipeCard';
import '../styles/FavoritesList.css';

const FavoritesList = ({ favorites, onFavoriteToggle, onRecipeClick }) => {
  const handleFavoriteToggle = (e, recipe) => {
    e.stopPropagation();
    if (onFavoriteToggle) {
      onFavoriteToggle(recipe);
    }
  };

  if (favorites.length === 0) {
    return (
      <div className="no-favorites">
        <p>No favorite recipes yet. Start adding some!</p>
      </div>
    );
  }

  return (
    <div className="favorites-grid">
      {favorites.map(recipe => (
        <div
          key={recipe.id}
          className="favorite-recipe-item"
          onClick={() => onRecipeClick && onRecipeClick(recipe.id)}
          role="button"
          tabIndex={0}
          onKeyDown={e => e.key === 'Enter' && onRecipeClick && onRecipeClick(recipe.id)}
        >
          <RecipeCard
            recipe={recipe}
            onFavoriteToggle={e => handleFavoriteToggle(e, recipe)}
            isFavorite={true}
          />
        </div>
      ))}
    </div>
  );
};

FavoritesList.propTypes = {
  favorites: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      image: PropTypes.string,
      readyInMinutes: PropTypes.number,
      servings: PropTypes.number,
    })
  ).isRequired,
  onFavoriteToggle: PropTypes.func.isRequired,
  onRecipeClick: PropTypes.func,
};

FavoritesList.defaultProps = {
  onRecipeClick: null,
};

export default FavoritesList;
