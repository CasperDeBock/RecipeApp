import axios from 'axios';
const baseUrl = `https://apirecipeapp.gentevent.be/api/generate`;

const useGenerate = () => {
  // GET
  const getAllGeneratedRecipes = async () => {
    const data = await axios.get(baseUrl);
    return data.data;
  };

  // POST
  const generateRecipe = async ingredients => {
    const sendingData = ingredients.map(ingredient => {
      return {
        ingredientName: ingredient.inventoryItemName,
        quantity: ingredient.quantity,
      };
    });
    const stringD = JSON.stringify(sendingData);
    const data = await axios.post(baseUrl, sendingData);
    return data.data;
  };

  return {
    generateRecipe,
    getAllGeneratedRecipes,
  };
};

export default useGenerate;
