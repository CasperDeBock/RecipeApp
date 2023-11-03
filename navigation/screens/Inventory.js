import {StyleSheet, View, Text, ScrollView} from 'react-native';
import {useState, useEffect, useCallback} from 'react';
import ButtonBlack from '../../components/ButtonBlack';
import InventoryItem from '../../components/InventoryItem';
import ButtonSmall from '../../components/ButtonSmall';
import {SafeAreaView} from 'react-native-safe-area-context';
import useInventoryItems from '../../api/InventoryItem';
import {useFocusEffect} from '@react-navigation/native';
import i18n from '../../localization/I18n';

export default function Inventory({navigation}) {
  const [inventoryItems, setInventoryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // api
  const inventoryItemsAPI = useInventoryItems();

  // data for recipes fetching from API
  const refreshIngredients = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await inventoryItemsAPI.getAll();
      setInventoryItems(data);
    } catch (error) {
      console.log(error);
      setError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshIngredients();
  }, [refreshIngredients]);

  useFocusEffect(
    useCallback(() => {
      console.log('refreshing');
      refreshIngredients();
    }, []),
  );

  // delete item
  const deleteItem = async item => {
    const response = await inventoryItemsAPI.deleteItem(item.idinventoryItem);
    refreshIngredients();
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.titlePage}>{i18n.t('Inventory')}</Text>
      <Text style={styles.secondTitle}>Casper De Bock</Text>

      {/* Items */}
      <ScrollView
        style={styles.ingredients}
        showsVerticalScrollIndicator={false}>
        <View style={styles.containerIngredients}>
          {inventoryItems.map((item, index) => (
            <InventoryItem
              key={index}
              item={item}
              handleDelete={() => deleteItem(item)}
            />
          ))}
        </View>
      </ScrollView>

      <ButtonSmall page={'inventory'} />
    </SafeAreaView>
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
  ingredients: {
    marginTop: 20,
  },
  containerIngredients: {
    marginBottom: 80,
  },
});
