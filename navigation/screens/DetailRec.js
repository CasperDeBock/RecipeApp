import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Image,
  TouchableHighlight,
} from 'react-native';
import {useState, useEffect, useCallback} from 'react';
import ButtonBlack from '../../components/ButtonBlack';
import {useRoute} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Octicons';
import {useNavigation} from '@react-navigation/native';
import {CheckBox} from 'react-native-elements';
import useRecipeSteps from '../../api/Recipe_steps';
import useInventoryItems from '../../api/InventoryItem';
import i18n from '../../localization/I18n';

export default function DetailRecipe() {
  const route = useRoute();
  const {recipeData} = route.params;
  const {myIngredientList} = route.params;
  const {type} = route.params;
  const [matchingIngredients, setMatchingIngredients] = useState([]);
  const [recipeSteps, setRecipeSteps] = useState([]);
  const [checked, setChecked] = useState([]);
  const [loading, setLoading] = useState(true);

  // api
  const recipeStepsAPI = useRecipeSteps();
  const inventoryItemsAPI = useInventoryItems();

  // data for recipes fetching from API
  const refreshRecipeSteps = useCallback(async () => {
    try {
      const recipeStepsData = await recipeStepsAPI.getAllWithRecipeId(
        recipeData.id,
      );
      setRecipeSteps(recipeStepsData);

      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  }, []);

  // get matching ingredients
  useEffect(() => {
    try {
      let match = [];
      recipeData.ingredients.forEach(ingredient => {
        myIngredientList.forEach(myIngredient => {
          if (ingredient.name === myIngredient.inventoryItemName) {
            const quantityInventory = parseInt(
              myIngredient.quantity.split(/(\d+)/)[1],
            );
            const quantityRecipe = parseInt(
              ingredient.quantity.split(/(\d+)/)[1],
            );
            if (quantityInventory >= quantityRecipe) {
              match.push(myIngredient);
            }
          }
        });
      });
      setMatchingIngredients(match);

      const initialCheckedState = checkChecked(match, recipeData.ingredients);
      setChecked(initialCheckedState);
    } catch (error) {
      console.log(error);
    } finally {
      refreshRecipeSteps();
    }
  }, []);

  // check if ingredient is in inventory
  const checkChecked = (matchingIngredients, recipeIngredients) => {
    const initialCheckedState = recipeIngredients.map(ingredient => {
      return matchingIngredients.some(
        matchingIngredient =>
          matchingIngredient.inventoryItemName === ingredient.name &&
          parseInt(matchingIngredient.quantity.split(/(\d+)/)[1]) >=
            parseInt(ingredient.quantity.split(/(\d+)/)[1]),
      );
    });

    return initialCheckedState;
  };

  // update inventory
  const updateInventory = async () => {
    const ingredientsToUpdate = [];

    //check if the quantiy from each matchingIngredient is bigger than the quantity from the recipe ingredient
    matchingIngredients.forEach(matchingIngredient => {
      recipeData.ingredients.forEach(recipeIngredient => {
        if (
          matchingIngredient.inventoryItemName === recipeIngredient.name &&
          parseInt(matchingIngredient.quantity.split(/(\d+)/)[1]) >=
            parseInt(recipeIngredient.quantity.split(/(\d+)/)[1])
        ) {
          ingredientsToUpdate.push({
            id: matchingIngredient.idinventoryItem,
            inventoryItemName: matchingIngredient.inventoryItemName,
            quantity:
              `${
                parseInt(matchingIngredient.quantity.split(/(\d+)/)[1]) -
                parseInt(recipeIngredient.quantity.split(/(\d+)/)[1])
              }` + matchingIngredient.quantity.split(/(\d+)/)[2],
            inventoryItemIMG: matchingIngredient.inventoryItemIMG,
            userId: matchingIngredient.userId,
          });
        }
      });
    });
    //update in dtb
    ingredientsToUpdate.forEach(async ingredient => {
      try {
        const response = await inventoryItemsAPI.updateItem(
          ingredient.id,
          ingredient,
        );

        //check the checkboxes again to see of all ingredients are still in my inventory
        const initialCheckedState = checkChecked(
          ingredientsToUpdate,
          recipeData.ingredients,
        );
        setChecked(initialCheckedState);
      } catch (error) {
        console.log(error);
      }
    });
  };

  // Nav
  const navigation = useNavigation();

  // go back
  const navigateToDetail = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.bigContainer}>
      <View style={styles.imageContainer}>
        <TouchableHighlight style={styles.arrowBack} onPress={navigateToDetail}>
          <Ionicons name={'chevron-left'} size={20} color={'white'} />
        </TouchableHighlight>
        <Image
          src={
            type === 'generated'
              ? 'https://www.unimedia.tech/wp-content/uploads/2022/12/cover7-e1670947910455.jpg'
              : recipeData.image
          }
          style={styles.imageRecepie}
          resizeMode="cover"
        />
        <View style={styles.blackbox}></View>
      </View>

      {/* Items */}
      <View style={styles.container}>
        <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
          <Text style={styles.titlePage}>{recipeData.title}</Text>
          <View>
            <Text style={styles.smallTitle}>{i18n.t('Description')}:</Text>
            <Text style={styles.textStuk}>
              {type === 'generated'
                ? 'This recipe is generated by AI'
                : recipeData.description}
            </Text>
          </View>
          <View>
            <Text style={styles.smallTitle}>{i18n.t('Ingredients')}:</Text>
            <View style={styles.ingredientsContainer}>
              {type === 'generated'
                ? recipeData.ingredients.map((ingredient, index) => (
                    <View key={index} style={styles.listItem}>
                      <CheckBox
                        style={styles.bullet}
                        checked={checked[index]}
                      />
                      <Text style={styles.item}>{ingredient}</Text>
                    </View>
                  ))
                : recipeData.ingredients.map((ingredient, index) => (
                    <View key={index} style={styles.listItem}>
                      <CheckBox
                        style={styles.bullet}
                        checked={checked[index]}
                        onPress={() => {
                          // Create a copy of the current state
                          const updatedChecked = [...checked];

                          // Toggle the checked state for the specific ingredient at the given index
                          updatedChecked[index] = !updatedChecked[index];

                          // Update the state with the new checked state
                          setChecked(updatedChecked);
                        }}
                      />
                      <Text style={styles.item}>
                        {ingredient.quantity}
                        {ingredient.quantity && ` ${ingredient.name}`}
                      </Text>
                    </View>
                  ))}
            </View>
          </View>
          <View>
            <Text style={styles.smallTitle}>{i18n.t('HowToMake')}</Text>

            {type === 'generated' ? (
              <View style={styles.stepContainer}>
                {recipeData.instructions.map((step, index) => (
                  <View key={index} style={styles.steps}>
                    <Text style={styles.stepNr}>
                      {i18n.t('Step')}: {index + 1}
                    </Text>
                    <Text style={styles.stepdescription}>{step}</Text>
                  </View>
                ))}
              </View>
            ) : !loading ? (
              <View style={styles.stepContainer}>
                {recipeSteps.map((step, index) => (
                  <View key={index} style={styles.steps}>
                    <Text style={styles.stepNr}>Step: {step.step_number}</Text>
                    <Text style={styles.stepdescription}>
                      {step.description}
                    </Text>
                  </View>
                ))}
              </View>
            ) : null}
          </View>
        </ScrollView>
        <ButtonBlack onT={() => updateInventory()} text={i18n.t('Useitems')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bigContainer: {
    flex: 1,
  },
  container: {
    backgroundColor: '#fff',
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 10,
    paddingTop: 20,
    flex: 1,
  },
  titlePage: {
    fontSize: 32,
    color: 'black',
    fontWeight: 'bold',
  },
  imageRecepie: {
    flexShrink: 0,
    width: '100%',
    height: '100%',
  },
  imageContainer: {
    width: '100%',
    height: '30%',
  },
  blackbox: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    top: 0,
    zIndex: 1,
  },
  arrowBack: {
    position: 'absolute',
    width: 48,
    height: 48,
    top: 50,
    left: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    zIndex: 2,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  smallTitle: {
    color: 'black',
    fontWeight: 'bold',
    marginTop: 20,
    fontSize: 16,
  },
  listItem: {
    color: 'black',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  bullet: {
    fontSize: 16,
    marginRight: 4,
  },
  textStuk: {
    marginTop: 10,
    color: 'black',
  },
  ingredientsContainer: {
    marginTop: 10,
  },

  bullet: {
    color: 'black',
    fontSize: 16,
    checkedColor: '#5CA8A3',
  },
  item: {
    color: 'black',
    fontSize: 16,
  },

  stepContainer: {
    marginTop: 10,
    paddingBottom: 200,
  },

  steps: {
    flexDirection: 'column',
    color: 'black',
    marginBottom: 20,
  },
  stepNr: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
  stepdescription: {
    color: 'black',
    fontSize: 16,
  },
});
