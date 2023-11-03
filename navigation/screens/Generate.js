import {StyleSheet, View, Text, ScrollView} from 'react-native';
import {useState, useEffect, useCallback} from 'react';
import ButtonBlack from '../../components/ButtonBlack';
import RecepieHome from '../../components/RecepieHome';
import useGenerate from '../../api/generate';
import useInventoryItems from '../../api/InventoryItem';
import GeneratedRecipe from '../../components/GeneratedRecipe';
import i18n from '../../localization/I18n';

export default function Generate({navigation}) {
  const [generatedRecipes, setGeneratedRecipes] = useState({});
  const [allMyGeneratedRecipes, setAllMyGeneratedRecipes] = useState([]);
  const [myIngredients, setMyIngredients] = useState([]);
  const [tokens, setTokens] = useState(20);
  const [loading, setLoading] = useState(true);
  const [loadingAll, setLoadingAll] = useState(true);
  const [loadingText, setLoadingText] = useState(`${i18n.t('generateclick')}`);

  // api
  const generateAPI = useGenerate();
  const inventoryItemAPI = useInventoryItems();

  // data for recipes fetching from API
  const refreshGeneratedRecipes = useCallback(async () => {
    setLoadingAll(true);
    try {
      const allgeneratedRecipesData =
        await generateAPI.getAllGeneratedRecipes();

      console.log(allgeneratedRecipesData.count);

      const formattedArray = [];
      for (let i = 0; i < allgeneratedRecipesData.count; i++) {
        const formattedRecipe = await formatRecipe(
          allgeneratedRecipesData.generatedRecipes[i].generatedRecipeContent,
        );
        formattedArray.push(formattedRecipe);
      }
      setAllMyGeneratedRecipes(formattedArray);

      setLoadingAll(false);
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    refreshGeneratedRecipes();
  }, [refreshGeneratedRecipes]);

  // generate recipe with API
  const handleGenerate = async () => {
    setGeneratedRecipes({});
    setLoading(true);
    setLoadingText(`${i18n.t('loadingtext')}`);

    try {
      let inventoryItems = await inventoryItemAPI.getAll();
      let theRecipe = await generateAPI.generateRecipe(inventoryItems);
      let formattedRecipe = await formatRecipe(theRecipe);
      setGeneratedRecipes(formattedRecipe);
      setLoading(false);
      setTokens(tokens - 1);
      refreshGeneratedRecipes();
    } catch (error) {
      console.error('Error generating recipe:', error);
    }
  };

  // format recipe
  const formatRecipe = async recipe => {
    const splitedMesage = recipe.split('Ingredients:');
    const title = splitedMesage[0].trim();

    const ingredients = splitedMesage[1].split('Instructions:')[0];
    const instructions = splitedMesage[1].split('Instructions:')[1];
    const ingredientsArray = ingredients.split('-');
    ingredientsArray.shift();
    const instructionsArray = instructions
      .split(/\d+\./)
      .filter(instruction => instruction.trim() !== '');

    const trimmedInstructionsArray = instructionsArray.map(instruction =>
      instruction.trim(),
    );

    const formattedRecipe = {
      title: title,
      ingredients: ingredientsArray,
      instructions: trimmedInstructionsArray,
    };

    console.log(formattedRecipe);
    return formattedRecipe;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titlePage}>{i18n.t('Generate')}</Text>
      <Text style={styles.secondTitle}>
        {i18n.t('tokens')}: {tokens}
      </Text>
      <ScrollView
        style={styles.generatedRecepies}
        showsVerticalScrollIndicator={false}>
        <View style={styles.recepieContainer}>
          {loading ? (
            <Text>{loadingText}</Text>
          ) : (
            <GeneratedRecipe recipe={generatedRecipes} />
          )}
        </View>

        <View style={styles.allGeneratedBigContainer}>
          <Text style={styles.thirdTitle}>
            {i18n.t('yourgeneratedrecipes')}
          </Text>
          {loadingAll ? (
            <Text>{i18n.t('loading')}</Text>
          ) : (
            <View style={styles.allGeneratedContainer}>
              {allMyGeneratedRecipes.map((recipe, index) => (
                <View key={index} style={styles.recepieContainer}>
                  <GeneratedRecipe recipe={recipe} />
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
      <ButtonBlack text={i18n.t('Generate')} onTouch={handleGenerate} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 10,
  },
  titlePage: {
    marginTop: 20,
    fontSize: 32,
    color: 'black',
    fontWeight: 'bold',
  },
  secondTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#A4A4A4',
  },
  thirdTitle: {
    marginTop: 20,
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  generatedRecepies: {
    marginTop: 20,
  },
  allGeneratedBigContainer: {
    paddingBottom: 100,
  },
  allGeneratedContainer: {
    marginTop: 20,
  },
});
