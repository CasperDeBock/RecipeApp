import axios from 'axios';
const baseUrl = `https://apirecipeapp.gentevent.be/api/recipes`;
const baseUrlIngredients = `https://apirecipeapp.gentevent.be/api/ingredients`;
const baseUrlSteps = `https://apirecipeapp.gentevent.be/api/recipeSteps`;

const useRecipes = () => {
  // GET
  const getAll = async () => {
    const data = await axios.get(baseUrl);
    return data.data.recipes;
  };

  // POST
  const insertRecipe = async recipeData => {
    try {
      // Insert the new recipe
      const recipeResponse = await axios.post(baseUrl, recipeData.recipe);
      const newRecipeId = await recipeResponse.data[0];

      // Insert ingredients associated with the new recipe
      recipeData.ingredients.forEach(ingredient => {
        ingredient.recipe_id = newRecipeId;
      });
      const ingredientsData = recipeData.ingredients;
      if (ingredientsData && ingredientsData.length > 0) {
        const response1 = await axios.post(
          `${baseUrlIngredients}`,
          ingredientsData,
        );
      }

      // Insert steps associated with the new recipe
      recipeData.steps.forEach(step => {
        step.recipe_id = newRecipeId;
      });
      const stepsData = recipeData.steps;
      if (stepsData && stepsData.length > 0) {
        const response2 = await axios.post(`${baseUrlSteps}`, stepsData);
      }

      //return if all responses are successful
      return true;
    } catch (error) {
      console.error(error);
    }
  };

  // DELETE
  const deleteRecipe = async id => {
    // Delete ingredients associated with the deleted recipe
    await axios.delete(`${baseUrlIngredients}/${id}`);

    // Delete steps associated with the deleted recipe
    await axios.delete(`${baseUrlSteps}/${id}`);

    await axios.delete(`${baseUrl}/${id}`);

    return true;
  };

  // PUT
  const updateRecipe = async (id, recipeData) => {
    await axios.put(`${baseUrl}/${id}`, recipeData);
  };

  // GET
  const getRecipeById = async id => {
    const data = await axios.get(`${baseUrl}/${id}`);
    return data.data;
  };

  return {
    getAll,
    insertRecipe,
    deleteRecipe,
    updateRecipe,
    getRecipeById,
  };
};

export default useRecipes;
