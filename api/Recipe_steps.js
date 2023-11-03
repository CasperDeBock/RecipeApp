import axios from 'axios';

const baseUrl = `https://apirecipeapp.gentevent.be/api/recipeSteps`;

const useRecipeSteps = () => {
  // GET
  const getAllWithRecipeId = async recipeId => {
    const data = await axios.get(`${baseUrl}/${recipeId}`);
    return data.data;
  };

  // POST
  const insertRecipeStep = async stepData => {
    try {
      // await axios.post(baseUrl, stepData);
    } catch (error) {
      console.error(error);
    }
  };

  // DELETE
  const deleteRecipeStep = async id => {
    await axios.delete(`${baseUrl}/${id}`);
  };

  return {
    getAllWithRecipeId,
    insertRecipeStep,
    deleteRecipeStep,
  };
};

export default useRecipeSteps;
