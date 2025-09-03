const APP_ID = import.meta.env.VITE_EDAMAM_APP_ID || '';
const APP_KEY = import.meta.env.VITE_EDAMAM_APP_KEY || '';
const BASE_URL = 'https://api.edamam.com/search';

// Search for recipes by query and return cleaned data
export const searchRecipes = async query => {
  try {
    if (!APP_ID || !APP_KEY) {
      throw new Error('Missing Edamam API credentials. Please check your .env file.');
    }

    const response = await fetch(
      `${BASE_URL}?q=${encodeURIComponent(query)}&app_id=${APP_ID}&app_key=${APP_KEY}&to=12`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch recipes: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    // Transform the Edamam API response to match our expected format
    return (data.hits || []).map(hit => {
      const recipe = hit.recipe;
      return {
        id: recipe.uri.split('#').pop(), // Extract ID from URI
        title: recipe.label,
        image: recipe.image || 'https://via.placeholder.com/300x200?text=No+Image',
        calories: Math.round(recipe.calories),
        ingredients: recipe.ingredientLines || [],
        dietLabels: recipe.dietLabels || [],
        url: recipe.url,
      };
    });
  } catch (error) {
    console.error('Error searching recipes:', error);
    throw error;
  }
};

// Get detailed information about a specific recipe
export const getRecipeDetails = async id => {
  try {
    const response = await fetch(
      `${BASE_URL}/${id}/information?apiKey=${APP_KEY}&includeNutrition=false`
    );
    if (!response.ok) {
      throw new Error('Failed to fetch recipe details');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching recipe details:', error);
    throw error;
  }
};

// Get similar recipes
export const getSimilarRecipes = async id => {
  try {
    const response = await fetch(`${BASE_URL}/${id}/similar?apiKey=${APP_KEY}&number=4`);
    if (!response.ok) {
      throw new Error('Failed to fetch similar recipes');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching similar recipes:', error);
    return [];
  }
};

// Get random recipes (for the home page)
export const getRandomRecipes = async (count = 6) => {
  try {
    const response = await fetch(`${BASE_URL}/random?apiKey=${APP_KEY}&number=${count}`);
    if (!response.ok) {
      throw new Error('Failed to fetch random recipes');
    }
    const data = await response.json();
    return data.recipes || [];
  } catch (error) {
    console.error('Error fetching random recipes:', error);
    return [];
  }
};
