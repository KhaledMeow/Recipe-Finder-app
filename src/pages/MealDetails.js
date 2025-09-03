import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMealDetails, getSimilarMeals } from '../utils/api';
import { useFavorites } from '../context/FavoritesContext';
import '../styles/MealDetails.css';

const MealDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [meal, setMeal] = useState(null);
  const [similarMeals, setSimilarMeals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toggleFavorite, isFavorite } = useFavorites();

  useEffect(() => {
    const fetchMealData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Fetch main meal details
        const mealData = await getMealDetails(id);
        setMeal(mealData);
        // Fetch similar meals
        const similar = await getSimilarMeals(id);
        setSimilarMeals(similar);
      } catch (err) {
        setError('Failed to fetch meal details. Please try again later.');
        console.error('Error fetching meal data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchMealData();
    } else {
      setError('No meal ID provided');
      setIsLoading(false);
    }
  }, [id]);

  const handleFavoriteClick = () => {
    if (meal) {
      toggleFavorite(meal);
    }
  };

  const handleSimilarMealClick = mealId => {
    navigate(`/meal/${mealId}`);
    window.scrollTo(0, 0);
  };

  const renderInstructions = () => {
    if (!meal.instructions) {
      return <p>No instructions available for this meal.</p>;
    }

    if (Array.isArray(meal.instructions)) {
      return (
        <ol className="instructions-list">
          {meal.instructions.map((step, index) => (
            <li key={index} className="instruction-step">
              <p>{step}</p>
            </li>
          ))}
        </ol>
      );
    }

    if (typeof meal.instructions === 'string') {
      if (meal.instructions.startsWith('<') || meal.instructions.includes('</')) {
        return (
          <div className="instructions" dangerouslySetInnerHTML={{ __html: meal.instructions }} />
        );
      }
      return (
        <div className="instructions">
          {meal.instructions.split('\n').map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>
      );
    }

    return <p>No instructions available for this meal.</p>;
  };

  if (isLoading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading meal details...</p>
      </div>
    );
  }

  if (error || !meal) {
    return (
      <div className="error-container">
        <p>{error || 'Meal not found'}</p>
        <button className="btn btn-primary" onClick={() => navigate('/')}>
          Back to Home
        </button>
      </div>
    );
  }

  const favoriteButtonClass = isFavorite(meal.id) ? 'favorited' : '';

  return (
    <div className="meal-details">
      <button className="back-button" onClick={() => navigate(-1)}>
        &larr; Back
      </button>
      <div className="meal-header">
        <h1>{meal.title}</h1>
        <div className="meal-meta">
          <div className="meta-item">
            <span className="meta-label">⏱️ Ready in:</span>
            <span>{meal.readyInMinutes || 'N/A'} minutes</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">🍽️ Serves:</span>
            <span>{meal.servings || 'N/A'}</span>
          </div>
          {meal.healthScore > 0 && (
            <div className="meta-item">
              <span className="meta-label">⭐ Health Score:</span>
              <span>{Math.round(meal.healthScore)}/100</span>
            </div>
          )}
          <button
            className={`favorite-button ${favoriteButtonClass}`}
            onClick={handleFavoriteClick}
            aria-label={isFavorite(meal.id) ? 'Remove from favorites' : 'Add to favorites'}
          >
            {isFavorite(meal.id) ? '❤️ Saved' : '♡ Save Meal'}
          </button>
        </div>
      </div>

      <div className="meal-content">
        <div className="meal-image-container">
          <img
            src={meal.image || 'https://via.placeholder.com/600x400?text=No+Image'}
            alt={meal.title}
            className="meal-main-image"
            onError={e => {
              e.target.onerror = null;
              e.target.src = 'https://via.placeholder.com/600x400?text=Image+Not+Available';
            }}
          />
          <div className="dietary-tags">
            {meal.vegetarian && <span className="tag vegetarian">Vegetarian</span>}
            {meal.vegan && <span className="tag vegan">Vegan</span>}
            {meal.glutenFree && <span className="tag gluten-free">Gluten Free</span>}
            {meal.dairyFree && <span className="tag dairy-free">Dairy Free</span>}
          </div>
        </div>

        <div className="meal-info">
          <div className="ingredients-section">
            <h2>Ingredients</h2>
            <ul className="ingredients-list">
              {meal.extendedIngredients?.map((ingredient, index) => (
                <li key={index} className="ingredient-item">
                  <span className="ingredient-amount">
                    {ingredient.amount} {ingredient.unit}
                  </span>
                  <span className="ingredient-name">{ingredient.name}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="instructions-section">
            <h2>Instructions</h2>
            {renderInstructions()}
          </div>

          {meal.sourceUrl && (
            <div className="source-link">
              <a
                href={meal.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="external-link"
              >
                View original meal
              </a>
            </div>
          )}
        </div>
      </div>

      {similarMeals.length > 0 && (
        <div className="similar-meals">
          <h2>You Might Also Like</h2>
          <div className="similar-meals-grid">
            {similarMeals.map(similarMeal => (
              <div
                key={similarMeal.id}
                className="similar-meal-card"
                onClick={() => handleSimilarMealClick(similarMeal.id)}
              >
                <img
                  src={similarMeal.image || 'https://via.placeholder.com/200x150?text=No+Image'}
                  alt={similarMeal.title}
                  onError={e => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/200x150?text=Image+Not+Available';
                  }}
                />
                <h4>{similarMeal.title}</h4>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MealDetails;
