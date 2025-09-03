const BASE_URL = 'https://www.themealdb.com/api/json/v1/1';

// Search for meals by query and return cleaned data
export const searchMeals = async query => {
  try {
    const url = `${BASE_URL}/search.php?s=${encodeURIComponent(query)}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch meals: ${response.status} ${response.statusText}`);
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
    console.error('Error searching meals:', error);
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

// Get detailed information about a specific meal
export const getMealDetails = async id => {
  try {
    const response = await fetch(`${BASE_URL}/lookup.php?i=${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch meal details');
    }
    const data = await response.json();
    const meal = data.meals?.[0];
    if (!meal) return null;

    // Transform the meal data to match our expected format
    return {
      id: meal.idMeal,
      title: meal.strMeal,
      image: meal.strMealThumb || 'https://via.placeholder.com/300x200?text=No+Image',
      category: meal.strCategory,
      area: meal.strArea,
      instructions: meal.strInstructions ? meal.strInstructions.split('\r\n').filter(Boolean) : [],
      ingredients: getIngredientsList(meal),
      tags: meal.strTags ? meal.strTags.split(',') : [],
      youtube: meal.strYoutube,
      source: meal.strSource,
      // Add any additional fields that might be needed by the MealDetails component
      extendedIngredients: getIngredientsList(meal).map(ing => ({
        id: ing.name.toLowerCase().replace(/\s+/g, '-'),
        name: ing.name,
        amount: ing.measure,
        unit: '', // TheMealDB doesn't separate amount and unit
      })),
      servings: 4, // Default value since TheMealDB doesn't provide this
      readyInMinutes: 30, // Default value since TheMealDB doesn't provide this
      vegetarian: meal.strTags?.toLowerCase().includes('vegetarian') || false,
      vegan: meal.strTags?.toLowerCase().includes('vegan') || false,
      glutenFree: meal.strTags?.toLowerCase().includes('gluten free') || false,
      dairyFree: meal.strTags?.toLowerCase().includes('dairy free') || false,
      sourceUrl: meal.strSource || '',
    };
  } catch (error) {
    console.error('Error fetching meal details:', error);
    throw error;
  }
};

// Get similar meals by category
export const getSimilarMeals = async category => {
  try {
    const response = await fetch(`${BASE_URL}/filter.php?c=${encodeURIComponent(category)}`);
    if (!response.ok) {
      throw new Error('Failed to fetch similar meals');
    }
    const data = await response.json();
    // Return up to 4 random meals from the same category
    const meals = data.meals || [];
    return meals.sort(() => 0.5 - Math.random()).slice(0, 4);
  } catch (error) {
    console.error('Error fetching similar meals:', error);
    return [];
  }
};

// Get random meals (for the home page)
export const getRandomMeals = async (count = 6) => {
  try {
    // Create an array of fetch promises for random meals
    const requests = Array.from({ length: count }, () =>
      fetch(`${BASE_URL}/random.php`)
        .then(res => {
          if (!res.ok) throw new Error('Failed to fetch random meals');
          return res.json();
        })
        .then(data => data.meals?.[0])
        .catch(error => {
          console.error('Error in individual meal fetch:', error);
          return null;
        })
    );

    // Wait for all requests to complete and filter out any failed ones
    const meals = (await Promise.all(requests)).filter(Boolean);

    // Transform the meals to match our expected format
    return meals.map(meal => ({
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
    console.error('Error fetching random meals:', error);
    return [];
  }
};
