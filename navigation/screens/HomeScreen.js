import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableHighlight,
  TextInput,
} from 'react-native';
import {useState, useEffect, useCallback} from 'react';
import React from 'react';
import RecepieHome from '../../components/RecepieHome';
import Recommended from '../../components/Recommended';
import ButtonSmall from '../../components/ButtonSmall';
import Ionicons from 'react-native-vector-icons/Octicons';
import Ionicons2 from 'react-native-vector-icons/Ionicons';
import useInventoryItems from '../../api/InventoryItem';
import useRecipes from '../../api/Recipe';
import {useFocusEffect} from '@react-navigation/native';
import i18n from '../../localization/I18n';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen({navigation}) {
  // States
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [myIngredients, setMyIngredients] = useState([]);
  const [recommendedRecipe, setRecommendedRecipe] = useState();

  // api
  const inventoryItemsAPI = useInventoryItems();
  const recipesAPI = useRecipes();

  // data for recipes fetching from API
  const refreshRecipes = useCallback(async () => {
    try {
      const recipesData = await recipesAPI.getAll();
      setRecipes(recipesData);
      const dataIngredients = await inventoryItemsAPI.getAll();
      setMyIngredients(dataIngredients);
    } catch (error) {
      console.log(error);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      refreshRecipes();
    }, []),
  );
  useEffect(() => {
    refreshRecipes();
  }, [refreshRecipes]);

  // Filters
  const filters = ['All', 'Breakfast', 'Lunch', 'Dinner'];

  // filter recipe by title
  const filteredRecipes = recipes.filter(recipe =>
    recipe.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );
  sortRecipes();
  // Sort recipes by percentage of matching ingredients
  function sortRecipes() {
    filteredRecipes.forEach(recipe => {
      let match = 0;
      recipe.ingredients.forEach(ingredient => {
        myIngredients.forEach(myIngredient => {
          if (ingredient.name === myIngredient.inventoryItemName) {
            match++;
          }
        });
      });

      recipe.percentage = (match / recipe.ingredients.length) * 100;
    });

    filteredRecipes.sort((a, b) => b.percentage - a.percentage);
  }

  // Delete recipe
  const deleteRecipe = async recipe => {
    const response = await recipesAPI.deleteRecipe(recipe.id);

    refreshRecipes();
  };

  // Go to settings
  const navigateToSetting = () => {
    navigation.navigate('SettingsScreen');
  };

  // Set the preffered category based on your settings
  const [preferredActiveCategory, setpreferredActiveCategory] =
    useState(activeFilter);

  // update
  useEffect(() => {
    updateActiveCategory();
  }, []);

  const updateActiveCategory = async () => {
    try {
      const value = await AsyncStorage.getItem('initialCategory');
      if (value !== null) {
        // value previously stored
        setpreferredActiveCategory(value);
        handleFilter(value);
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topHeader}>
        <View>
          <Text style={styles.titlePage}>{i18n.t('Recipes')}</Text>
          <Text style={styles.secondTitle}>Casper De Bock</Text>
        </View>
        <TouchableHighlight
          onPress={() => navigateToSetting()}
          style={styles.settings}>
          <Ionicons2 name={'cog-outline'} size={32} color={'black'} />
        </TouchableHighlight>
      </View>

      {/* FILTER */}
      <View style={styles.area}>
        <ScrollView
          horizontal
          contentContainerStyle={styles.filters}
          showsHorizontalScrollIndicator={false}>
          {filters.map(filter => {
            return (
              <TouchableHighlight
                key={filter}
                onPress={() => setpreferredActiveCategory(filter)}
                style={
                  preferredActiveCategory === filter
                    ? styles.activeFilter
                    : styles.filter
                }>
                <Text
                  style={
                    preferredActiveCategory === filter
                      ? styles.activeFilterText
                      : styles.filterText
                  }>
                  {i18n.t(filter)}
                </Text>
              </TouchableHighlight>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* RECOMMENDED */}
        <Text style={styles.thirdTitle}>{i18n.t('Recommended')}</Text>
        {filteredRecipes
          .filter(
            recipe =>
              preferredActiveCategory === 'All' ||
              recipe.category === preferredActiveCategory,
          )
          .sort((a, b) => b.percentage - a.percentage)
          .slice(0, 1)
          .map((recipe, index) => (
            <Recommended
              key={index}
              data={recipe}
              myIngredientList={myIngredients}
            />
          ))}

        {/* ALL DISHES */}
        <Text style={styles.thirdTitle}>{i18n.t('All dishes')}</Text>
        <View>
          {/* SEARCHBAR */}
          <View style={styles.searchView}>
            <View style={styles.searchBarIcon}>
              <Ionicons name={'search'} size={20} color={'#A4A4A4'} />
            </View>
            <TextInput
              style={styles.searchBar}
              placeholder={i18n.t('Searchrecipes')}
              onChangeText={text => setSearchQuery(text)}
              value={searchQuery}
            />
          </View>

          <View style={styles.recepieWrap}>
            {filteredRecipes
              .filter(
                recipe =>
                  preferredActiveCategory === 'All' ||
                  recipe.category === preferredActiveCategory,
              )
              .sort((a, b) => b.percentage - a.percentage)
              .slice(1)
              .map((recipe, index) => (
                <RecepieHome
                  key={index}
                  data={recipe}
                  myIngredientList={myIngredients}
                  handleDelete={() => deleteRecipe(recipe)}
                />
              ))}
          </View>
        </View>
      </ScrollView>
      <ButtonSmall page={'recipe'} />
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
    fontWeight: 'bold',
    color: 'black',
  },
  secondTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#A4A4A4',
  },
  area: {
    paddingTop: 5,
    paddingBottom: 5,
  },

  // FILTERS
  filters: {
    marginTop: 10,
    alignItems: 'start',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  filter: {
    fontSize: 16,
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderRadius: 20,
    borderColor: 'black',
    marginRight: 10,
  },
  activeFilter: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderRadius: 20,
    borderColor: 'black',
    backgroundColor: 'black',
    marginRight: 10,
  },
  filterText: {
    fontWeight: 'bold',
  },
  activeFilterText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  searchView: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchBarIcon: {
    position: 'absolute',
    zIndex: 1,
    left: 20,
  },
  searchBar: {
    paddingLeft: 50,
    paddingRight: 20,
    paddingTop: 15,
    paddingBottom: 15,
    backgroundColor: '#F2F2F2',
    borderRadius: 5,
    marginTop: 10,
    marginBottom: 10,
    fontSize: 16,
    color: '#A4A4A4',
    width: '100%',
  },

  // Dishes
  recepieWrap: {
    marginTop: 10,
    marginBottom: 400,
  },
  thirdTitle: {
    marginTop: 20,
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  topHeader: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settings: {
    marginTop: 20,
  },
});
