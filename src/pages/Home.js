import React, { useState, useEffect } from 'react';
import { searchRecipes } from '../utils/api';
import SearchBar from '../components/SearchBar';
import RecipeCard from '../components/RecipeCard';
import RecipeModal from '../components/RecipeModal';
import { useFavorites } from '../context/FavoritesContext';
import '../styles/App.css';

const Home = () => {
  const [query, setQuery] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { favorites, toggleFavorite, isFavorite } = useFavorites();

  const handleSearch = async (searchQuery) => {
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

  const handleRecipeClick = (recipe) => {
    setSelectedRecipe(recipe);
  };

  const handleCloseModal = () => {
    setSelectedRecipe(null);
  };

  return (
    <div className="home">
      <h1>Find Your Perfect Recipe</h1>
      <SearchBar onSearch={handleSearch} />
      
      {isLoading && <div className="loading">Searching for recipes...</div>}
      {error && <div className="error">{error}</div>}
      
      <div className="recipes-grid">
        {recipes.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            onFavoriteToggle={(recipe) => toggleFavorite(recipe)}
            isFavorite={isFavorite(recipe.id)}
            onClick={() => handleRecipeClick(recipe)}
          />
        ))}
      </div>
      
      {selectedRecipe && (
        <RecipeModal 
          recipe={selectedRecipe} 
          onClose={handleCloseModal} 
        />
      )}
    </div>
  );
};

export default Home;
