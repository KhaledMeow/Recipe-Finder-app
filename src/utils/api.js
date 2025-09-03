const BASE_URL = 'https://www.themealdb.com/api/json/v1/1';

// Helper function to transform meal data to our format
const transformMealData = meal => ({
  id: meal.idMeal,
  title: meal.strMeal,
  image: meal.strMealThumb || 'https://via.placeholder.com/300x200?text=No+Image',
  category: meal.strCategory || 'Unknown Category',
  area: meal.strArea || 'Unknown Origin',
  instructions: meal.strInstructions
    ? meal.strInstructions.split('\r\n').filter(Boolean)
    : ['No instructions available.'],
  ingredients: getIngredientsList(meal),
  tags: meal.strTags ? meal.strTags.split(',') : [],
  youtube: meal.strYoutube,
  source: meal.strSource,
  isVegetarian: isVegetarian(meal),
  isVegan: isVegan(meal),
  isGlutenFree: isGlutenFree(meal),
  servings: 4, // Default value since TheMealDB doesn't provide this
  readyInMinutes: 30, // Default value since TheMealDB doesn't provide this
});

// Helper function to extract ingredients and measurements
const getIngredientsList = meal => {
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    if (ingredient && ingredient.trim()) {
      ingredients.push({
        name: ingredient,
        amount: meal[`strMeasure${i}`]?.trim() || 'to taste',
      });
    }
  }
  return ingredients;
};

// Helper functions for dietary information
const isVegetarian = meal => {
  const ingredients = getIngredientsList(meal).map(i => i.name.toLowerCase());
  const nonVegIngredients = ['chicken', 'beef', 'pork', 'fish', 'meat', 'bacon', 'sausage'];
  return !ingredients.some(ing => nonVegIngredients.some(nv => ing.includes(nv)));
};

const isVegan = meal => {
  const ingredients = getIngredientsList(meal).map(i => i.name.toLowerCase());
  const nonVeganIngredients = [
    'chicken',
    'beef',
    'pork',
    'fish',
    'meat',
    'bacon',
    'sausage',
    'cheese',
    'milk',
    'egg',
    'butter',
    'honey',
  ];
  return !ingredients.some(ing => nonVeganIngredients.some(nv => ing.includes(nv)));
};

const isGlutenFree = meal => {
  const ingredients = getIngredientsList(meal).map(i => i.name.toLowerCase());
  const glutenIngredients = [
    'wheat',
    'flour',
    'bread',
    'pasta',
    'beer',
    'soy sauce',
    'barley',
    'rye',
    'oats',
  ];
  return !ingredients.some(ing => glutenIngredients.some(gluten => ing.includes(gluten)));
};

// Search for meals by query
export const searchMeals = async query => {
  try {
    const response = await fetch(`${BASE_URL}/search.php?s=${encodeURIComponent(query)}`);
    if (!response.ok) throw new Error('Failed to search meals');
    const data = await response.json();
    return data.meals ? data.meals.map(transformMealData) : [];
  } catch (error) {
    console.error('Error searching meals:', error);
    throw error;
  }
};

// Get detailed information about a specific meal
export const getMealDetails = async id => {
  try {
    const response = await fetch(`${BASE_URL}/lookup.php?i=${id}`);
    if (!response.ok) throw new Error('Failed to fetch meal details');
    const data = await response.json();
    const meal = data.meals?.[0];
    if (!meal) return null;
    return transformMealData(meal);
  } catch (error) {
    console.error('Error fetching meal details:', error);
    throw error;
  }
};

// Get similar meals by category
export const getSimilarMeals = async (category, excludeId = null, limit = 4) => {
  try {
    if (!category) return [];

    const response = await fetch(`${BASE_URL}/filter.php?c=${encodeURIComponent(category)}`);
    if (!response.ok) throw new Error('Failed to fetch similar meals');

    const data = await response.json();
    if (!data.meals) return [];

    // Filter out the current meal and limit results
    let meals = data.meals;
    if (excludeId) {
      meals = meals.filter(meal => meal.idMeal !== excludeId);
    }

    // Get random selection of meals
    const randomMeals = meals.sort(() => 0.5 - Math.random()).slice(0, limit);

    // Get full details for each similar meal
    const detailedMeals = await Promise.all(randomMeals.map(meal => getMealDetails(meal.idMeal)));
    return detailedMeals.filter(meal => meal !== null);
  } catch (error) {
    console.error('Error fetching similar meals:', error);
    return [];
  }
};

// Get random meals (for the home page)
export const getRandomMeals = async (count = 6) => {
  try {
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
    const meals = (await Promise.all(requests)).filter(Boolean);
    return meals.map(meal => ({
      id: meal.idMeal,
      title: meal.strMeal,
      image: meal.strMealThumb || 'https://via.placeholder.com/300x200?text=No+Image',
      category: meal.strCategory || 'Unknown Category',
      area: meal.strArea || 'Unknown Origin',
      tags: meal.strTags ? meal.strTags.split(',') : [],
      isVegetarian: isVegetarian(meal),
      isVegan: isVegan(meal),
      isGlutenFree: isGlutenFree(meal),
    }));
  } catch (error) {
    console.error('Error getting random meals:', error);
    throw error;
  }
};
