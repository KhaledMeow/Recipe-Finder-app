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

    fetchRecipeDetails();
  }, [id]);

  if (isLoading) {
    return <div className="loading">Loading recipe details...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!recipe) {
    return <div className="not-found">Recipe not found</div>;
  }

  return (
    <div className="recipe-details-page">
      <button 
        className="back-button"
        onClick={() => window.history.back()}
      >
        ← Back to results
      </button>
      
      <div className="recipe-header">
        <h1>{recipe.title}</h1>
        <button 
          className={`favorite-button ${isFavorite(recipe.id) ? 'favorited' : ''}`}
          onClick={() => toggleFavorite(recipe)}
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
          />
        </div>
        
        <div className="recipe-info">
          <div className="recipe-meta">
            <div className="meta-item">
              <span className="meta-label">Ready in:</span>
              <span>{recipe.readyInMinutes} minutes</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Servings:</span>
              <span>{recipe.servings}</span>
            </div>
            {recipe.healthScore && (
              <div className="meta-item">
                <span className="meta-label">Health Score:</span>
                <span>{recipe.healthScore}/100</span>
              </div>
            )}
          </div>
          
          <div className="ingredients-section">
            <h2>Ingredients</h2>
            <ul className="ingredients-list">
              {recipe.extendedIngredients?.map((ingredient, index) => (
                <li key={index} className="ingredient-item">
                  <span className="ingredient-amount">{ingredient.amount} {ingredient.unit}</span>
                  <span className="ingredient-name">{ingredient.name}</span>
                </li>
              )) || <li>No ingredients information available</li>}
            </ul>
          </div>
          
          <div className="instructions-section">
            <h2>Instructions</h2>
            {recipe.instructions ? (
              <div 
                className="instructions" 
                dangerouslySetInnerHTML={{ __html: recipe.instructions }} 
              />
            ) : (
              <p>No instructions available for this recipe.</p>
            )}
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
