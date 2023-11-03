import axios from 'axios';
const baseUrl = `https://apirecipeapp.gentevent.be/api/inventoryItems`;

const useInventoryItems = () => {
  // GET
  const getAll = async () => {
    const data = await axios.get(baseUrl);
    return data.data.items;
  };

  // POST
  const insertItem = async vals => {
    const values = {
      inventoryItemName: vals.inventoryItemName,
      quantity: vals.quantity,
      expirationDate: vals.expirationDate,
      userId: vals.userId,
      inventoryItemIMG: vals.inventoryItemIMG
        ? vals.inventoryItemIMG
        : 'https://hips.hearstapps.com/hmg-prod/images/super-food-for-a-healthy-diet-royalty-free-image-1576847457.jpg',
    };

    await axios({
      method: 'POST',
      url: `${baseUrl}`,
      data: values,
    });

    return true;
  };

  // PUT
  const updateItem = async (index, updatedValues) => {
    try {
      const values = {
        inventoryItemName: updatedValues.inventoryItemName,
        quantity: updatedValues.quantity,
        expirationDate: updatedValues.expirationDate,
        userId: updatedValues.userId,
        inventoryItemIMG: updatedValues.inventoryItemIMG
          ? updatedValues.inventoryItemIMG
          : 'https://hips.hearstapps.com/hmg-prod/images/super-food-for-a-healthy-diet-royalty-free-image-1576847457.jpg',
      };

      await axios.put(`${baseUrl}/${index}`, values);
      return true;
    } catch (error) {
      console.error('Error updating inventory item:', error);
      throw error;
    }
  };

  // DELETE
  const deleteItem = async index => {
    await axios({
      method: 'DELETE',
      url: `${baseUrl}/${index}`,
    });
    return true;
  };

  return {
    getAll,
    insertItem,
    updateItem,
    deleteItem,
  };
};

export default useInventoryItems;
