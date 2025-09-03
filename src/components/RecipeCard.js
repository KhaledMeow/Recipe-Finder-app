import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/RecipeCard.css';

const RecipeCard = ({ recipe, onFavoriteToggle, isFavorite }) => {
  return (
    <div className="recipe-card">
      <img
        src={recipe.image || 'https://via.placeholder.com/300x200?text=No+Image'}
        alt={recipe.title}
        className="recipe-image"
      />
      <div className="recipe-info">
        <h3 className="recipe-title">{recipe.title}</h3>
        <div className="recipe-actions">
          <Link to={`/recipe/${recipe.id}`} className="view-button">
            View Recipe
          </Link>
          <button
            onClick={() => onFavoriteToggle(recipe)}
            className={`favorite-button ${isFavorite ? 'favorited' : ''}`}
          >
            {isFavorite ? '★' : '☆'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;
