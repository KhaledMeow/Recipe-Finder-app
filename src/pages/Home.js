import React, { useState, useEffect } from 'react';
import { searchMeals, getRandomMeals, getMealById } from '../utils/api';
import SearchBar from '../components/SearchBar';
import MealCard from '../components/MealCard';
import MealModal from '../components/MealModal';
import { useFavorites } from '../context/FavoritesContext';
import '../styles/Home.css';

const Home = () => {
  const [query, setQuery] = useState('');
  const [meals, setMeals] = useState([]);
  const [featuredMeals, setFeaturedMeals] = useState([]);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFeaturedLoading, setIsFeaturedLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isFavorite, toggleFavorite } = useFavorites();

  // Filter featured meals based on search query
  const filteredFeaturedMeals = featuredMeals.filter(meal =>
    meal.title.toLowerCase().includes(query.toLowerCase())
  );

  // Load and refresh featured meals on component mount or refresh
  useEffect(() => {
    const loadFeaturedMeals = async () => {
      try {
        setIsFeaturedLoading(true);
        const meals = await getRandomMeals(100);
        setFeaturedMeals(meals);
      } catch (err) {
        console.error('Error loading featured meals:', err);
      } finally {
        setIsFeaturedLoading(false);
      }
    };

    // Load meals immediately when component mounts
    loadFeaturedMeals();

    // Set up refresh interval (every 5 minutes)
    const refreshInterval = setInterval(loadFeaturedMeals, 5 * 60 * 1000);

    // Clean up interval on component unmount
    return () => clearInterval(refreshInterval);
  }, []);

  // Add a refresh button handler
  const handleRefreshFeatured = async () => {
    try {
      setIsFeaturedLoading(true);
      const meals = await getRandomMeals(100);
      setFeaturedMeals(meals);
    } catch (err) {
      console.error('Error refreshing featured meals:', err);
    } finally {
      setIsFeaturedLoading(false);
    }
  };

  const handleSearch = async searchQuery => {
    if (!searchQuery.trim()) return;
    setQuery(searchQuery);
    setIsLoading(true);
    setError(null);
    try {
      const results = await searchMeals(searchQuery);
      setMeals(results);
    } catch (err) {
      setError('Failed to fetch meals. Please try again later.');
      console.error('Search error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMealClick = async meal => {
    try {
      // Fetch full meal details including instructions
      const fullMeal = await getMealById(meal.id);
      setSelectedMeal(fullMeal);
    } catch (error) {
      console.error('Error fetching meal details:', error);
      // Fallback to basic meal data if there's an error
      setSelectedMeal(meal);
    }
  };

  const showFeaturedHeader = !query && !isLoading && !error;
  const showNoResults = !isLoading && !error && query && meals.length === 0;

  return (
    <div className="home">
      <h1>Find Your Perfect Meal Ideas</h1>
      <SearchBar onSearch={handleSearch} />
      {isLoading && (
        <div className="loading-state">
          <p>Searching for meals...</p>
        </div>
      )}
      {error && (
        <div className="error-state">
          <p>{error}</p>
        </div>
      )}
      {showNoResults && (
        <div className="no-results">
          <h3>No meals found for "{query}"</h3>
          <p>Try a different search term or check your spelling.</p>
        </div>
      )}
      {showFeaturedHeader && (
        <div className="featured-meals">
          <div className="featured-header">
            <h2>Featured Meals</h2>
            <button
              onClick={handleRefreshFeatured}
              className="refresh-button"
              disabled={isFeaturedLoading}
            >
              {isFeaturedLoading ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
          <div className="meals-grid">
            {filteredFeaturedMeals.map(meal => (
              <MealCard
                key={meal.id}
                meal={meal}
                onFavoriteToggle={e => {
                  e.stopPropagation();
                  toggleFavorite(meal);
                }}
                isFavorite={isFavorite(meal.id)}
                onClick={() => handleMealClick(meal)}
              />
            ))}
          </div>
        </div>
      )}
      {query && meals.length > 0 && (
        <div className="search-results">
          <h2>Search Results for "{query}"</h2>
          <div className="meals-grid">
            {meals.map(meal => (
              <MealCard
                key={meal.id}
                meal={meal}
                onFavoriteToggle={e => {
                  e.stopPropagation();
                  toggleFavorite(meal);
                }}
                isFavorite={isFavorite(meal.id)}
                onClick={() => handleMealClick(meal)}
              />
            ))}
          </div>
        </div>
      )}
      {selectedMeal && (
        <MealModal
          meal={selectedMeal}
          onClose={() => setSelectedMeal(null)}
          onFavoriteToggle={toggleFavorite}
          isFavorite={isFavorite(selectedMeal.id)}
        />
      )}
    </div>
  );
};

export default Home;
