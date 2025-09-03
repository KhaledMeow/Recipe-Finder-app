import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getRecipeDetails } from '../utils/api';
import { useFavorites } from '../context/FavoritesContext';
import '../styles/RecipeDetails.css';

const RecipeDetails = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toggleFavorite, isFavorite } = useFavorites();

  useEffect(() => {
    const fetchRecipeDetails = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getRecipeDetails(id);
        setRecipe(data);
      } catch (err) {
        setError('Failed to fetch recipe details. Please try again later.');
        console.error('Error fetching recipe details:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchRecipeDetails();
    } else {
      setError('No recipe ID provided');
      setIsLoading(false);
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading recipe details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error">
        <p>{error}</p>
        <button className="retry-button" onClick={() => window.location.reload()}>
          Retry
        </button>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="not-found">
        <h2>Recipe not found</h2>
        <p>The requested recipe could not be found.</p>
        <button className="back-button" onClick={() => window.history.back()}>
          ← Back to recipes
        </button>
      </div>
    );
  }

  const renderIngredients = () => {
    if (!recipe.extendedIngredients || recipe.extendedIngredients.length === 0) {
      return <li>No ingredients information available</li>;
    }
    return recipe.extendedIngredients.map((ingredient, index) => (
      <li key={`${ingredient.id || index}`} className="ingredient-item">
        <span className="ingredient-amount">
          {ingredient.amount} {ingredient.unit}
        </span>
        <span className="ingredient-name">{ingredient.name}</span>
      </li>
    ));
  };

  const renderInstructions = () => {
    if (!recipe.instructions) {
      return <p>No instructions available for this recipe.</p>;
    }

    if (
      typeof recipe.instructions === 'string' &&
      (recipe.instructions.startsWith('<') || recipe.instructions.includes('</'))
    ) {
      return (
        <div className="instructions" dangerouslySetInnerHTML={{ __html: recipe.instructions }} />
      );
    }

    // Handle plain text instructions
    return (
      <div className="instructions">
        {recipe.instructions.split('\n').map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>
    );
  };

  return (
    <div className="recipe-details-page">
      <button 
        className="back-button"
        onClick={() => window.history.back()}
        aria-label="Go back to previous page"
      >
        ← Back to results
      </button>
      <div className="recipe-header">
        <h1>{recipe.title}</h1>
        <button 
          className={`favorite-button ${isFavorite(recipe.id) ? 'favorited' : ''}`}
          onClick={() => toggleFavorite(recipe)}
          aria-label={isFavorite(recipe.id) ? 'Remove from favorites' : 'Add to favorites'}
        >
          {isFavorite(recipe.id) ? '★ Remove from Favorites' : '☆ Add to Favorites'}
        </button>
      </div>
      <div className="recipe-content">
        <div className="recipe-image-container">
          <img 
            src={recipe.image || 'https://via.placeholder.com/600x400?text=No+Image'} 
            alt={recipe.title} 
            className="recipe-detail-image"
            onError={e => {
              e.target.onerror = null;
              e.target.src = 'https://via.placeholder.com/600x400?text=Image+Not+Available';
            }}
          />
        </div>
        <div className="recipe-info">
          <div className="recipe-meta">
            <div className="meta-item">
              <span className="meta-label">Ready in:</span>
              <span>{recipe.readyInMinutes || 'N/A'} minutes</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Servings:</span>
              <span>{recipe.servings || 'N/A'}</span>
            </div>
            {recipe.healthScore > 0 && (
              <div className="meta-item">
                <span className="meta-label">Health Score:</span>
                <span>{Math.round(recipe.healthScore)}/100</span>
              </div>
            )}
          </div>
          <div className="ingredients-section">
            <h2>Ingredients</h2>
            <ul className="ingredients-list">{renderIngredients()}</ul>
          </div>
          <div className="instructions-section">
            <h2>Instructions</h2>
            {renderInstructions()}
          </div>
          {recipe.sourceUrl && (
            <div className="source-link">
              <a 
                href={recipe.sourceUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="external-link"
              >
                View original recipe
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipeDetails;
