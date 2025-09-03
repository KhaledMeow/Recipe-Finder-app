import React, { createContext, useContext, useState, useEffect } from 'react';

const FavoritesContext = createContext();

const FAVORITES_STORAGE_KEY = 'recipe-finder-favorites';

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);

  // Load favorites from localStorage on initial render
  useEffect(() => {
    const storedFavorites = localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (storedFavorites) {
      try {
        setFavorites(JSON.parse(storedFavorites));
      } catch (error) {
        console.error('Failed to parse favorites from localStorage', error);
        localStorage.removeItem(FAVORITES_STORAGE_KEY);
      }
    }
  }, []);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    if (favorites.length > 0) {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
    } else {
      localStorage.removeItem(FAVORITES_STORAGE_KEY);
    }
  }, [favorites]);

  const toggleFavorite = (recipe) => {
    setFavorites(prevFavorites => {
      const isAlreadyFavorite = prevFavorites.some(fav => fav.id === recipe.id);
      
      if (isAlreadyFavorite) {
        return prevFavorites.filter(fav => fav.id !== recipe.id);
      } else {
        return [...prevFavorites, recipe];
      }
    });
  };

  const isFavorite = (recipeId) => {
    return favorites.some(fav => fav.id === recipeId);
  };

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};

export default FavoritesContext;
