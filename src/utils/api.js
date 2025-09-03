const API_KEY = process.env.REACT_APP_SPOONACULAR_API_KEY || 'YOUR_API_KEY';
const BASE_URL = 'https://api.spoonacular.com/recipes';

// Search for recipes by query and return cleaned data
export const searchRecipes = async query => {
  try {
    const response = await fetch(
      `${BASE_URL}/complexSearch?apiKey=${API_KEY}&query=${encodeURIComponent(query)}&number=12&addRecipeInformation=true`
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch recipes: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    // Clean and transform the recipe data
    return (data.results || []).map(recipe => ({
      id: recipe.id,
      title: recipe.title,
      image: recipe.image || 'https://via.placeholder.com/300x200?text=No+Image',
      readyInMinutes: recipe.readyInMinutes || 0,
      servings: recipe.servings || 0,
      healthScore: recipe.healthScore || 0,
      vegetarian: recipe.vegetarian || false,
      vegan: recipe.vegan || false,
      glutenFree: recipe.glutenFree || false,
      dairyFree: recipe.dairyFree || false,
      summary: recipe.summary || '',
      instructions: recipe.analyzedInstructions?.[0]?.steps?.map(step => step.step) || [],
      extendedIngredients: (recipe.extendedIngredients || []).map(ingredient => ({
        id: ingredient.id,
        name: ingredient.name,
        amount: ingredient.amount,
        unit: ingredient.unit,
        original: ingredient.original,
      })),
      sourceUrl: recipe.sourceUrl || '',
      sourceName: recipe.sourceName || 'Unknown',
    }));
  } catch (error) {
    console.error('Error searching recipes:', error);
    throw error;
  }
};

// Get detailed information about a specific recipe
export const getRecipeDetails = async id => {
  try {
    const response = await fetch(
      `${BASE_URL}/${id}/information?apiKey=${API_KEY}&includeNutrition=false`
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
    const response = await fetch(`${BASE_URL}/${id}/similar?apiKey=${API_KEY}&number=4`);
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
    const response = await fetch(`${BASE_URL}/random?apiKey=${API_KEY}&number=${count}`);
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
