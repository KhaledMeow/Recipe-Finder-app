import React from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import '../styles/MealModal.css';

const MealModal = ({ meal, onClose, onFavoriteToggle, isFavorite = false }) => {
  if (!meal) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>
          ×
        </button>
        <h2 className="modal-title">{meal.title}</h2>
        <div className="modal-body">
          <div className="modal-image-container">
            <img
              src={meal.image || 'https://via.placeholder.com/500x300?text=No+Image'}
              alt={meal.title}
              className="modal-image"
            />
            {onFavoriteToggle && (
              <button
                className="favorite-button"
                onClick={e => {
                  e.stopPropagation();
                  onFavoriteToggle(meal);
                }}
                aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              >
                {isFavorite ? (
                  <FaHeart className="favorite-icon" />
                ) : (
                  <FaRegHeart className="favorite-icon" />
                )}
                <span className="favorite-text">
                  {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                </span>
              </button>
            )}
          </div>
          <div className="meal-details">
            <h3>Ingredients</h3>
            <ul className="ingredients-list">
              {meal.extendedIngredients?.map((ingredient, index) => (
                <li key={index}>{ingredient.original}</li>
              )) || <li>No ingredients information available</li>}
            </ul>
            <h3>Instructions</h3>
            <div className="instructions">
              {meal.instructions ? (
                Array.isArray(meal.instructions) ? (
                  <ol>
                    {meal.instructions.map((step, index) => (
                      <li key={index}>{step}</li>
                    ))}
                  </ol>
                ) : (
                  <div dangerouslySetInnerHTML={{ __html: meal.instructions }} />
                )
              ) : (
                <p>No instructions available</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MealModal;
