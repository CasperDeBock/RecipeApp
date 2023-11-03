import {
  StyleSheet,
  View,
  Text,
  TouchableHighlight,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {useState, useCallback, useEffect} from 'react';
import Ionicons from 'react-native-vector-icons/Octicons';
import {useNavigation} from '@react-navigation/native';
import useRecipes from '../../api/Recipe';
import {useRoute} from '@react-navigation/native';
import i18n from '../../localization/I18n';

export default function AddRecipeItem() {
  const route = useRoute();
  const {recipeItemData} = route.params;
  const [pageType, setPageType] = useState(recipeItemData ? 'edit' : 'add');
  const filters = ['Breakfast', 'Lunch', 'Dinner'];

  // States
  const [recipeName, setRecipeName] = useState('');
  const [userId, setUserId] = useState(1);
  const [recipeIMG, setRecipeIMG] = useState('');
  const [activeCategory, setActiveCategory] = useState('Breakfast');
  const [description, setDescription] = useState('');
  // States for ingredients
  const [ingredients, setIngredients] = useState([]);
  const [ingredient, setIngredient] = useState('');
  const [quantity, setQuantity] = useState('');
  // States for steps
  const [steps, setSteps] = useState([]);
  const [step, setStep] = useState('');

  // add ingredient to list
  const addIngredient = () => {
    if (ingredient && quantity) {
      const newIngredient = [ingredient, quantity];
      setIngredients([...ingredients, newIngredient]);
      setIngredient('');
      setQuantity('');
    }
  };

  // add step to list
  const addStep = () => {
    if (step) {
      setSteps([...steps, step]);
      setStep('');
    }
  };

  // set items for edit
  const setItems = useCallback(async () => {
    try {
      setRecipeName(recipeItemData.recipeName);
      setRecipeIMG(recipeItemData.recipeIMG);
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    if (pageType === 'edit') {
      setItems();
    }
  }, [setItems]);

  // api
  const recipesAPI = useRecipes();

  //Add recipe
  const addItem = async () => {
    const recipeVlues = {
      title: recipeName,
      description: description,
      category: activeCategory,
      image: recipeIMG,
    };
    const ingredientsValues = ingredients.map(([ingredient, quantity]) => ({
      name: ingredient,
      quantity: quantity,
    }));
    const stepsValues = steps.map((step, index) => ({
      step_number: index + 1,
      description: step,
    }));
    const values = {
      recipe: recipeVlues,
      ingredients: ingredientsValues,
      steps: stepsValues,
    };
    try {
      const response = await recipesAPI.insertRecipe(values);
      if (response) {
        goback();
      }
    } catch (error) {
      console.log(error);
    }
  };

  //Edit recipe
  const editItem = async () => {
    const values = {
      recipeName: recipeName,
      userId: userId,
      recipeIMG: recipeIMG,
    };
    try {
      await recipesAPI.updateRecipe(recipeItemData.idrecipe, values);

      goback();
    } catch (error) {
      console.log(error);
    }
  };

  // Nav
  const navigation = useNavigation();
  const goback = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <View style={styles.upperScreen}>
        <TouchableHighlight style={styles.arrowBack} onPress={goback}>
          <Ionicons name={'chevron-left'} size={20} color={'black'} />
        </TouchableHighlight>
        <Text style={styles.titlePage}>
          {pageType === 'edit' ? i18n.t('Edit') : i18n.t('Add')}{' '}
          {i18n.t('Recipe')}
        </Text>
      </View>

      {/* Items */}
      <ScrollView style={styles.form}>
        <Text style={styles.titleTextFieldHeader}>{i18n.t('Category')}</Text>
        <ScrollView
          horizontal
          contentContainerStyle={styles.filters}
          showsHorizontalScrollIndicator={false}>
          {filters.map(filter => {
            return (
              <TouchableHighlight
                key={filter}
                onPress={() => setActiveCategory(filter)}
                style={
                  activeCategory === filter
                    ? styles.activeCategory
                    : styles.category
                }>
                <Text
                  style={
                    activeCategory === filter
                      ? styles.activeCategoryText
                      : styles.categoryText
                  }>
                  {i18n.t(filter)}
                </Text>
              </TouchableHighlight>
            );
          })}
        </ScrollView>
        <Text style={styles.titleTextFieldHeader}>{i18n.t('RecipeName')}</Text>
        <TextInput
          style={styles.input}
          placeholder="Eggs with avocado"
          onChangeText={recipeName => setRecipeName(recipeName)}
          value={recipeName}
        />
        <Text style={styles.titleTextFieldHeader}>{i18n.t('Description')}</Text>
        <TextInput
          multiline={true}
          numberOfLines={3}
          style={styles.input}
          placeholder={i18n.t('Description')}
          onChangeText={description => setDescription(description)}
          value={description}
        />
        <Text style={styles.titleTextFieldHeader}>{i18n.t('Ingredients')}</Text>
        <View style={styles.nextToEachOtherInput}>
          <TextInput
            style={styles.inputHalf}
            placeholder={i18n.t('Ingredient')}
            value={ingredient}
            onChangeText={text => setIngredient(text)}
          />
          <TextInput
            style={styles.inputHalf}
            placeholder={i18n.t('Quantity')}
            value={quantity}
            onChangeText={text => setQuantity(text)}
          />
        </View>
        <TouchableOpacity onPress={addIngredient}>
          <Text style={styles.addButton}>+</Text>
        </TouchableOpacity>

        <View style={styles.ingredientcontainer}>
          <Text style={styles.titleTextFieldHeader}>
            {i18n.t('IngredientsList')}
          </Text>
          {ingredients.map(([ingredient, quantity], index) => (
            <View style={styles.ingredientcontaineritem} key={index}>
              <Text>- {ingredient}</Text>
              <Text>{quantity}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.titleTextFieldHeader}>{i18n.t('Steps')}</Text>
        <TextInput
          style={styles.input}
          placeholder={i18n.t('Step')}
          value={step}
          onChangeText={text => setStep(text)}
        />
        <TouchableOpacity onPress={addStep}>
          <Text style={styles.addButton}>+</Text>
        </TouchableOpacity>

        <View style={styles.ingredientcontainer}>
          <Text style={styles.titleTextFieldHeader}>{i18n.t('StepsList')}</Text>
          {steps.map((step, index) => (
            <View style={styles.ingredientcontaineritemsteps} key={index}>
              <Text style={{fontWeight: 'bold'}}>{index + 1}: </Text>
              <Text>{step}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.titleTextFieldHeader}>{i18n.t('ImageUrl')}</Text>
        <TextInput
          style={styles.input}
          placeholder="https://www.google.com/"
          onChangeText={recipeIMG => setRecipeIMG(recipeIMG)}
          value={recipeIMG}
        />
      </ScrollView>
      <TouchableHighlight
        onPress={() => (pageType === 'edit' ? editItem() : addItem())}
        style={styles.button}>
        <Text style={styles.buttonText}>
          {pageType === 'edit' ? i18n.t('Save') : i18n.t('Add')}
        </Text>
      </TouchableHighlight>
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
  upperScreen: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  arrowBack: {
    marginRight: 20,
    padding: 10,
  },
  form: {
    marginTop: 20,
    marginBottom: 100,
  },
  titleTextField: {
    marginBottom: 10,
    color: 'black',
  },
  input: {
    padding: 15,
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    marginBottom: 20,
  },
  button: {
    marginBottom: 20,
    backgroundColor: 'black',
    color: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    height: 50,
    position: 'absolute',
    width: '100%',
    bottom: 5,
    shadowColor: 'rgba(0, 0, 0, 0.25)',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 1,
    shadowRadius: 6,
    marginLeft: 20,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  inputDate: {
    padding: 15,
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    marginBottom: 20,
    width: '100%',
  },
  filters: {
    alignItems: 'start',
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginBottom: 20,
  },
  category: {
    fontSize: 16,
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderRadius: 20,
    borderColor: 'black',
    marginRight: 10,
  },
  activeCategory: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderRadius: 20,
    borderColor: 'black',
    backgroundColor: 'black',
    marginRight: 10,
  },
  categoryText: {
    fontWeight: 'bold',
  },
  activeCategoryText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  titleTextFieldHeader: {
    marginBottom: 10,
    color: 'black',
    fontWeight: 'bold',
    borderTopColor: '#F2F2F2',
    borderTopWidth: 1,
    paddingTop: 10,
  },
  addButton: {
    backgroundColor: 'black',
    color: 'white',
    textAlign: 'center',
    padding: 10,
    borderRadius: 50,
    width: 50,
  },
  ingredientcontaineritem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  ingredientcontainer: {
    marginTop: 20,
  },
  nextToEachOtherInput: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputHalf: {
    padding: 15,
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    marginBottom: 20,
    width: '50%',
    marginRight: 10,
  },
  ingredientcontaineritemsteps: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
});
