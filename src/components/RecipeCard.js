import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import '../styles/RecipeCard.css';

const RecipeCard = ({ recipe, onFavoriteToggle, isFavorite = false }) => {
  const handleImageError = e => {
    e.target.onerror = null;
    e.target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Available';
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
      <Link to={`/recipe/${recipe.id}`} className="recipe-image-link">
        <img
          src={recipe.image || 'https://via.placeholder.com/300x200?text=No+Image'}
          alt={recipe.title}
          className="recipe-image"
          onError={handleImageError}
          loading="lazy"
        />
      </Link>
      <div className="recipe-info">
        <h3 className="recipe-title">
          <Link to={`/recipe/${recipe.id}`}>{recipe.title}</Link>
        </h3>
        <div className="recipe-meta">
          {recipe.readyInMinutes && (
            <span className="meta-item">⏱️ {recipe.readyInMinutes} min</span>
          )}
          {recipe.servings && <span className="meta-item">🍽️ {recipe.servings} servings</span>}
        </div>
        <div className="recipe-actions">
          <Link to={`/recipe/${recipe.id}`} className="view-button">
            View Recipe
          </Link>
          <button
            onClick={handleFavoriteClick}
            className={`favorite-button ${isFavorite ? 'favorited' : ''}`}
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            {isFavorite ? '❤️' : '♡'}
          </button>
        </div>
      </div>
    </div>
  );
};

RecipeCard.propTypes = {
  recipe: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    image: PropTypes.string,
    readyInMinutes: PropTypes.number,
    servings: PropTypes.number,
  }).isRequired,
  onFavoriteToggle: PropTypes.func,
  isFavorite: PropTypes.bool,
};

RecipeCard.defaultProps = {
  onFavoriteToggle: null,
  isFavorite: false,
};

export default RecipeCard;
