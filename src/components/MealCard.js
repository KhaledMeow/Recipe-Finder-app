import React from 'react';
import PropTypes from 'prop-types';
import { FaSearch, FaUtensils, FaYoutube } from 'react-icons/fa';
import '../styles/MealCard.css';

const MealCard = ({ meal, onFavoriteToggle, isFavorite = false, onClick }) => {
  const handleImageError = e => {
    e.target.onerror = null;
    e.target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Available';
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

  const handleFavoriteClick = e => {
    e.preventDefault();
    e.stopPropagation();
    if (onFavoriteToggle) {
      onFavoriteToggle(e);
    }
  };

  return (
    <div className="meal-card" onClick={onClick} role="button" tabIndex={0}>
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
              href={`https://www.google.com/search?q=${encodeURIComponent(`${meal.title} ingredients`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="search-ingredients-button"
              title="Search for ingredients"
            >
              <FaSearch className="search-icon" />
              <span>Find Ingredients</span>
            </a>
            {onFavoriteToggle && (
              <button
                onClick={handleFavoriteClick}
                className={`favorite-button ${isFavorite ? 'favorited' : ''}`}
                aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                onKeyDown={e => e.key === 'Enter' && handleFavoriteClick(e)}
              >
                {isFavorite ? '❤️' : '🤍'}
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
    source: PropTypes.string,
    youtube: PropTypes.string,
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
