import React from 'react';
import PropTypes from 'prop-types';
import '../styles/MealCard.css';

const MealCard = ({ meal, onFavoriteToggle, isFavorite = false }) => {
  const handleImageError = e => {
    e.target.onerror = null;
    e.target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Available';
  };

  const handleFavoriteClick = e => {
    e.preventDefault();
    e.stopPropagation();
    if (onFavoriteToggle) {
      onFavoriteToggle(meal);
    }
  };

  return (
    <div className="meal-card">
      <div className="meal-image-container">
        <img
          src={meal.image || 'https://via.placeholder.com/300x200?text=No+Image'}
          alt={meal.title}
          className="meal-image"
          onError={handleImageError}
          loading="lazy"
        />
      </div>
      <div className="meal-info">
        <h3 className="meal-title">{meal.title}</h3>
        <div className="meal-meta">
          {meal.calories && (
            <span className="meta-item">🔥 {Math.round(meal.calories)} calories</span>
          )}
          {meal.dietLabels?.length > 0 && (
            <div className="diet-tags">
              {meal.dietLabels.map((label, index) => (
                <span key={index} className="diet-tag">
                  {label}
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="meal-actions">
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

MealCard.propTypes = {
  meal: PropTypes.shape({
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

MealCard.defaultProps = {
  onFavoriteToggle: null,
  isFavorite: false,
};

export default MealCard;
