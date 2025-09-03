import React from 'react';
import PropTypes from 'prop-types';
import '../styles/RecipeCard.css';

const RecipeCard = ({ recipe, onFavoriteToggle, isFavorite = false }) => {
  const handleImageError = e => {
    e.target.onerror = null;
    e.target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Available';
  };

  const handleViewRecipe = e => {
    e.preventDefault();
    if (recipe.url) {
      window.open(recipe.url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleFavoriteClick = e => {
    e.preventDefault();
    e.stopPropagation();
    if (onFavoriteToggle) {
      onFavoriteToggle(recipe);
    }
  };

  return (
    <div className="recipe-card">
      <div className="recipe-image-container">
        <img
          src={recipe.image || 'https://via.placeholder.com/300x200?text=No+Image'}
          alt={recipe.title}
          className="recipe-image"
          onError={handleImageError}
          loading="lazy"
        />
      </div>
      <div className="recipe-info">
        <h3 className="recipe-title">{recipe.title}</h3>
        <div className="recipe-meta">
          {recipe.calories && (
            <span className="meta-item">🔥 {Math.round(recipe.calories)} calories</span>
          )}
          {recipe.dietLabels?.length > 0 && (
            <div className="diet-tags">
              {recipe.dietLabels.map((label, index) => (
                <span key={index} className="diet-tag">
                  {label}
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="recipe-actions">
          <button onClick={handleViewRecipe} className="view-button" disabled={!recipe.url}>
            View Recipe
          </button>
          {onFavoriteToggle && (
            <button
              onClick={handleFavoriteClick}
              className={`favorite-button ${isFavorite ? 'favorited' : ''}`}
              aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              {isFavorite ? '❤️' : '♡'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

RecipeCard.propTypes = {
  recipe: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string.isRequired,
    image: PropTypes.string,
    calories: PropTypes.number,
    dietLabels: PropTypes.arrayOf(PropTypes.string),
    url: PropTypes.string,
  }).isRequired,
  onFavoriteToggle: PropTypes.func,
  isFavorite: PropTypes.bool,
};

RecipeCard.defaultProps = {
  onFavoriteToggle: null,
  isFavorite: false,
};

export default RecipeCard;
