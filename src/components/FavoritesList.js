import React from 'react';
import PropTypes from 'prop-types';
import MealCard from './MealCard';
import '../styles/FavoritesList.css';

const FavoritesList = ({ favorites, onFavoriteToggle, onMealClick }) => {
  const handleFavoriteToggle = (e, meal) => {
    e.stopPropagation();
    if (onFavoriteToggle) {
      onFavoriteToggle(meal);
    }
  };

  if (favorites.length === 0) {
    return (
      <div className="no-favorites">
        <p>No favorite meals yet. Start adding some!</p>
      </div>
    );
  }

  return (
    <div className="favorites-grid">
      {favorites.map(meal => (
        <div
          key={meal.id}
          className="favorite-meal-item"
          onClick={() => onMealClick && onMealClick(meal.id)}
          role="button"
          tabIndex={0}
          onKeyDown={e => e.key === 'Enter' && onMealClick && onMealClick(meal.id)}
        >
          <MealCard
            meal={meal}
            onFavoriteToggle={e => handleFavoriteToggle(e, meal)}
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
  onMealClick: PropTypes.func,
};

FavoritesList.defaultProps = {
  onMealClick: null,
};

export default FavoritesList;
