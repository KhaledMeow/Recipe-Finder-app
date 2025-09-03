import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getRecipeDetails, getSimilarRecipes } from '../utils/api';
import { useFavorites } from '../context/FavoritesContext';
import '../styles/RecipeDetails.css';

const RecipeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [similarRecipes, setSimilarRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toggleFavorite, isFavorite } = useFavorites();

  useEffect(() => {
    const fetchRecipeData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Fetch main recipe details
        const recipeData = await getRecipeDetails(id);
        setRecipe(recipeData);
        // Fetch similar recipes
        const similar = await getSimilarRecipes(id);
        setSimilarRecipes(similar);
      } catch (err) {
        setError('Failed to fetch recipe details. Please try again later.');
        console.error('Error fetching recipe data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchRecipeData();
    } else {
      setError('No recipe ID provided');
      setIsLoading(false);
    }
  }, [id]);

  const handleFavoriteClick = () => {
    if (recipe) {
      toggleFavorite(recipe);
    }
  };

  const handleSimilarRecipeClick = recipeId => {
    navigate(`/recipe/${recipeId}`);
    window.scrollTo(0, 0);
  };

  const renderInstructions = () => {
    if (!recipe.instructions) {
      return <p>No instructions available for this recipe.</p>;
    }

    if (Array.isArray(recipe.instructions)) {
      return (
        <ol className="instructions-list">
          {recipe.instructions.map((step, index) => (
            <li key={index} className="instruction-step">
              <p>{step}</p>
            </li>
          ))}
        </ol>
      );
    }

    if (typeof recipe.instructions === 'string') {
      if (recipe.instructions.startsWith('<') || recipe.instructions.includes('</')) {
        return (
          <div className="instructions" dangerouslySetInnerHTML={{ __html: recipe.instructions }} />
        );
      }
      return (
        <div className="instructions">
          {recipe.instructions.split('\n').map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>
      );
    }

    return <p>No instructions available for this recipe.</p>;
  };

  if (isLoading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading recipe details...</p>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="error-container">
        <p>{error || 'Recipe not found'}</p>
        <button className="btn btn-primary" onClick={() => navigate('/')}>
          Back to Home
        </button>
      </div>
    );
  }

  const favoriteButtonClass = isFavorite(recipe.id) ? 'favorited' : '';

  return (
    <div className="recipe-details">
      <button className="back-button" onClick={() => navigate(-1)}>
        &larr; Back
      </button>
      <div className="recipe-header">
        <h1>{recipe.title}</h1>
        <div className="recipe-meta">
          <div className="meta-item">
            <span className="meta-label">⏱️ Ready in:</span>
            <span>{recipe.readyInMinutes || 'N/A'} minutes</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">🍽️ Serves:</span>
            <span>{recipe.servings || 'N/A'}</span>
          </div>
          {recipe.healthScore > 0 && (
            <div className="meta-item">
              <span className="meta-label">⭐ Health Score:</span>
              <span>{Math.round(recipe.healthScore)}/100</span>
            </div>
          )}
          <button
            className={`favorite-button ${favoriteButtonClass}`}
            onClick={handleFavoriteClick}
            aria-label={isFavorite(recipe.id) ? 'Remove from favorites' : 'Add to favorites'}
          >
            {isFavorite(recipe.id) ? '❤️ Saved' : '♡ Save Recipe'}
          </button>
        </div>
      </div>

      <div className="recipe-content">
        <div className="recipe-image-container">
          <img
            src={recipe.image || 'https://via.placeholder.com/600x400?text=No+Image'}
            alt={recipe.title}
            className="recipe-main-image"
            onError={e => {
              e.target.onerror = null;
              e.target.src = 'https://via.placeholder.com/600x400?text=Image+Not+Available';
            }}
          />
          <div className="dietary-tags">
            {recipe.vegetarian && <span className="tag vegetarian">Vegetarian</span>}
            {recipe.vegan && <span className="tag vegan">Vegan</span>}
            {recipe.glutenFree && <span className="tag gluten-free">Gluten Free</span>}
            {recipe.dairyFree && <span className="tag dairy-free">Dairy Free</span>}
          </div>
        </div>

        <div className="recipe-info">
          <div className="ingredients-section">
            <h2>Ingredients</h2>
            <ul className="ingredients-list">
              {recipe.extendedIngredients?.map((ingredient, index) => (
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

      {similarRecipes.length > 0 && (
        <div className="similar-recipes">
          <h2>You Might Also Like</h2>
          <div className="similar-recipes-grid">
            {similarRecipes.map(similarRecipe => (
              <div
                key={similarRecipe.id}
                className="similar-recipe-card"
                onClick={() => handleSimilarRecipeClick(similarRecipe.id)}
              >
                <img
                  src={similarRecipe.image || 'https://via.placeholder.com/200x150?text=No+Image'}
                  alt={similarRecipe.title}
                  onError={e => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/200x150?text=Image+Not+Available';
                  }}
                />
                <h4>{similarRecipe.title}</h4>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RecipeDetails;
