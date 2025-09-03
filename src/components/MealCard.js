import React from 'react';
import PropTypes from 'prop-types';
import { FaSearch, FaUtensils, FaYoutube } from 'react-icons/fa';
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

  const handleViewRecipe = e => {
    e.preventDefault();
    e.stopPropagation();
    if (meal.source) {
      window.open(meal.source, '_blank', 'noopener,noreferrer');
    }
  };

  const handleWatchVideo = e => {
    e.preventDefault();
    e.stopPropagation();
    if (meal.youtube) {
      window.open(meal.youtube, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="meal-card">
      <div className="meal-image-container">
        {meal.source && (
          <button
            onClick={handleViewRecipe}
            className="action-button recipe-link"
            title="View Full Recipe"
          >
            <FaUtensils className="action-icon" />
          </button>
        )}
        {meal.youtube && (
          <button
            onClick={handleWatchVideo}
            className="action-button youtube-link"
            title="Watch Video"
          >
            <FaYoutube className="action-icon" />
          </button>
        )}
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
          <div className="meal-actions-buttons">
            <a
              href={`https://www.google.com/search?q=${encodeURIComponent(`${meal.title} recipe`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="search-recipe-button"
              title="Search for recipe"
            >
              <FaSearch className="search-icon" />
              <span>Find Recipe</span>
            </a>
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
