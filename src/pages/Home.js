import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { searchRecipes, getRandomRecipes } from '../utils/api';
import SearchBar from '../components/SearchBar';
import RecipeCard from '../components/RecipeCard';
import RecipeModal from '../components/RecipeModal';
import { useFavorites } from '../context/FavoritesContext';
import '../styles/Home.css';

const Home = () => {
  const [query, setQuery] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [featuredRecipes, setFeaturedRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFeaturedLoading, setIsFeaturedLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isFavorite, toggleFavorite } = useFavorites();

  // Load featured recipes on component mount
  useEffect(() => {
    const loadFeaturedRecipes = async () => {
      try {
        const recipes = await getRandomRecipes(6);
        setFeaturedRecipes(recipes);
      } catch (err) {
        console.error('Error loading featured recipes:', err);
      } finally {
        setIsFeaturedLoading(false);
      }
    };

    loadFeaturedRecipes();
  }, []);

  const handleSearch = async searchQuery => {
    if (!searchQuery.trim()) return;
    setQuery(searchQuery);
    setIsLoading(true);
    setError(null);
    try {
      const results = await searchRecipes(searchQuery);
      setRecipes(results);
    } catch (err) {
      setError('Failed to fetch recipes. Please try again later.');
      console.error('Search error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRecipeClick = recipe => {
    setSelectedRecipe(recipe);
  };

  const handleCloseModal = () => {
    setSelectedRecipe(null);
  };

  const showFeaturedHeader = !query && !isLoading && !error;
  const showNoResults = !isLoading && !error && query && recipes.length === 0;

  return (
    <div className="home">
      <h1>Find Your Perfect Recipe</h1>
      <div className="search-container">
        <SearchBar onSearch={handleSearch} />
      </div>
      {isLoading && (
        <div className="loading-state">
          <p>Searching for recipes...</p>
        </div>
      )}
      {error && (
        <div className="error-state">
          <p>{error}</p>
        </div>
      )}
      {showNoResults && (
        <div className="no-results">
          <h3>No recipes found for "{query}"</h3>
          <p>Try a different search term or check your spelling.</p>
        </div>
      )}
      {showFeaturedHeader && (
        <div className="featured-recipes">
          <div className="featured-header">
            <h2>Featured Recipes</h2>
            {!isFeaturedLoading && featuredRecipes.length > 0 && (
              <Link to="/favorites" className="view-all">
                View Favorites
              </Link>
            )}
          </div>
          {isFeaturedLoading ? (
            <div className="loading-state">
              <p>Loading featured recipes...</p>
            </div>
          ) : (
            <div className="recipes-grid">
              {featuredRecipes.map(recipe => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  onFavoriteToggle={toggleFavorite}
                  isFavorite={isFavorite(recipe.id)}
                  onClick={() => handleRecipeClick(recipe)}
                />
              ))}
            </div>
          )}
        </div>
      )}
      {query && recipes.length > 0 && (
        <div className="search-results">
          <h2>Search Results for "{query}"</h2>
          <div className="recipes-grid">
            {recipes.map(recipe => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onFavoriteToggle={toggleFavorite}
                isFavorite={isFavorite(recipe.id)}
                onClick={() => handleRecipeClick(recipe)}
              />
            ))}
          </div>
        </div>
      )}
      {selectedRecipe && (
        <RecipeModal
          recipe={selectedRecipe}
          onClose={handleCloseModal}
          onFavoriteToggle={() => toggleFavorite(selectedRecipe)}
          isFavorite={isFavorite(selectedRecipe.id)}
        />
      )}
    </div>
  );
};

export default Home;
