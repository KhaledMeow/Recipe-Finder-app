const BASE_URL = 'https://www.themealdb.com/api/json/v1/1';

// Search for recipes by query and return cleaned data
export const searchRecipes = async query => {
  try {
    const url = `${BASE_URL}/search.php?s=${encodeURIComponent(query)}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch recipes: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    // Transform TheMealDB API response to match our expected format
    return (data.meals || []).map(meal => ({
      id: meal.idMeal,
      title: meal.strMeal,
      image: meal.strMealThumb || 'https://via.placeholder.com/300x200?text=No+Image',
      category: meal.strCategory,
      area: meal.strArea,
      instructions: meal.strInstructions ? meal.strInstructions.split('\n').filter(Boolean) : [],
      ingredients: getIngredientsList(meal),
      tags: meal.strTags ? meal.strTags.split(',') : [],
      youtube: meal.strYoutube,
      source: meal.strSource,
    }));
  } catch (error) {
    console.error('Error searching recipes:', error);
    throw error;
  }
};

// Helper function to extract ingredients and measurements from meal object
const getIngredientsList = meal => {
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    if (ingredient && ingredient.trim()) {
      ingredients.push({
        name: ingredient,
        measure: measure ? measure.trim() : 'to taste',
      });
    }
  }
  return ingredients;
};

// Get detailed information about a specific recipe
export const getRecipeDetails = async id => {
  try {
    const response = await fetch(`${BASE_URL}/lookup.php?i=${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch recipe details');
    }
    const data = await response.json();
    return data.meals ? data.meals[0] : null;
  } catch (error) {
    console.error('Error fetching recipe details:', error);
    throw error;
  }
};

// Get similar recipes by category
export const getSimilarRecipes = async category => {
  try {
    const response = await fetch(`${BASE_URL}/filter.php?c=${encodeURIComponent(category)}`);
    if (!response.ok) {
      throw new Error('Failed to fetch similar recipes');
    }
    const data = await response.json();
    // Return up to 4 random recipes from the same category
    const recipes = data.meals || [];
    return recipes.sort(() => 0.5 - Math.random()).slice(0, 4);
  } catch (error) {
    console.error('Error fetching similar recipes:', error);
    return [];
  }
};

// Get random recipes (for the home page)
export const getRandomRecipes = async (count = 6) => {
  try {
    // TheMealDB only returns one random meal at a time, so we need to make multiple requests
    const requests = Array(count)
      .fill()
      .map(() => fetch(`${BASE_URL}/random.php`));
    const responses = await Promise.all(requests);
    const data = await Promise.all(
      responses.map(res => {
        if (!res.ok) throw new Error('Failed to fetch random recipes');
        return res.json();
      })
    );

    // Extract meals from responses and flatten the array
    return data.map(item => item.meals[0]).filter(Boolean);
  } catch (error) {
    console.error('Error fetching random recipes:', error);
    return [];
  }
};
