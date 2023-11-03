import {
  StyleSheet,
  View,
  Text,
  TouchableHighlight,
  TextInput,
} from 'react-native';
import {useState, useCallback, useEffect} from 'react';
import Ionicons from 'react-native-vector-icons/Octicons';
import {useNavigation} from '@react-navigation/native';
import useInventoryItems from '../../api/InventoryItem';
import DateTimePicker from '@react-native-community/datetimepicker';
import {useRoute} from '@react-navigation/native';
import i18n from '../../localization/I18n';

export default function AddInventoryItem() {
  const route = useRoute();
  const {inventoryItemData} = route.params;
  const [pageType, setPageType] = useState(inventoryItemData ? 'edit' : 'add');
  console.log(inventoryItemData);

  // States
  const [inventoryItemName, setInventoryItemName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [expirationDate, setExpirationDate] = useState(new Date());
  const [userId, setUserId] = useState(1);
  const [inventoryItemIMG, setInventoryItemIMG] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);

  // set items for edit
  const setItems = useCallback(async () => {
    try {
      setExpirationDate(new Date(inventoryItemData.expirationDate));
      setInventoryItemName(inventoryItemData.inventoryItemName);
      setQuantity(inventoryItemData.quantity);
      setInventoryItemIMG(inventoryItemData.inventoryItemIMG);
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
  const inventoryItemsAPI = useInventoryItems();

  //Add item to inventory
  const addItem = async () => {
    const formattedExpirationDate = new Date(expirationDate)
      .toISOString()
      .slice(0, 19)
      .replace('T', ' ');

    const values = {
      inventoryItemName: inventoryItemName,
      quantity: quantity,
      expirationDate: formattedExpirationDate,
      userId: userId,
      inventoryItemIMG: inventoryItemIMG,
    };
    try {
      const response = await inventoryItemsAPI.insertItem(values);
      goback();
    } catch (error) {
      console.log(error);
    }
  };

  //Edit item in inventory
  const editItem = async () => {
    const formattedExpirationDate = new Date(expirationDate)
      .toISOString()
      .slice(0, 19)
      .replace('T', ' ');

    console.log('quantity', quantity);
    const values = {
      inventoryItemName: inventoryItemName,
      quantity: quantity,
      expirationDate: formattedExpirationDate,
      userId: userId,
      inventoryItemIMG: inventoryItemIMG,
    };
    try {
      const response = await inventoryItemsAPI.updateItem(
        inventoryItemData.idinventoryItem,
        values,
      );

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
          {i18n.t('Item')}
        </Text>
      </View>

      {/* Items */}
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder={i18n.t('Name')}
          onChangeText={inventoryItemName =>
            setInventoryItemName(inventoryItemName)
          }
          value={inventoryItemName}
        />
        <TextInput
          style={styles.input}
          placeholder={i18n.t('Quantity')}
          onChangeText={quantity => setQuantity(quantity)}
          value={quantity}
        />
        <TouchableHighlight
          onPress={() => setShowDatePicker(true)}
          style={styles.inputDate}>
          <Text>{expirationDate.toLocaleDateString('en-GB')}</Text>
        </TouchableHighlight>
        {showDatePicker && (
          <DateTimePicker
            value={expirationDate}
            mode={'date'}
            display="default"
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              setExpirationDate(selectedDate);
            }}
          />
        )}

        <TextInput
          style={styles.input}
          placeholder={i18n.t('ImageUrl')}
          onChangeText={inventoryItemIMG =>
            setInventoryItemIMG(inventoryItemIMG)
          }
          value={inventoryItemIMG}
        />
      </View>
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
});
