import React, {useState, useEffect} from 'react';
import ColorPicker from 'react-native-wheel-color-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TouchableHighlight,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Octicons';

const SettingsScreen = ({navigation, route}) => {
  //   const [cardbgcolor, setCardbgcolor] = useState('#282856');
  const [initialCategory, setInitialCategory] = useState('All');

  // All categories
  const categories = ['All', 'Breakfast', 'Lunch', 'Dinner'];

  //   const onColorChangeComplete = async color => {
  //     try {
  //       await AsyncStorage.setItem('cardbgcolor', color);
  //     } catch (e) {
  //       console.log(e);
  //     }
  //   };

  //   update initial category
  const updateInitalCategory = async category => {
    try {
      await AsyncStorage.setItem('initialCategory', category);
      setInitialCategory(category);
    } catch (e) {
      console.log(e);
    }
  };

  //   get initial category
  const getInitialCategory = async () => {
    try {
      const value = await AsyncStorage.getItem('initialCategory');
      if (value !== null) {
        setInitialCategory(value);
      }
    } catch (e) {
      console.log(e);
    }
  };

  //   const getInitialColor = async () => {
  //     try {
  //       const value = await AsyncStorage.getItem('cardbgcolor');
  //       if (value !== null) {
  //         setCardbgcolor(value);
  //       }
  //     } catch (e) {
  //       console.log(e);
  //     }
  //   };

  useEffect(() => {
    getInitialCategory();
    // getInitialColor();
  }, []);

  //   go back
  const navigateBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.next}>
        <TouchableHighlight style={styles.arrowBack} onPress={navigateBack}>
          <Ionicons name={'chevron-left'} size={20} color={'white'} />
        </TouchableHighlight>
        <Text style={styles.title}>Settings</Text>
      </View>

      <View style={styles.setting}>
        <Text style={styles.settingPartTitle}>Initial Category</Text>
        <View style={styles.categories}>
          {categories.map(category => (
            <Pressable onPress={() => updateInitalCategory(category)}>
              <Text
                style={
                  initialCategory === category
                    ? styles.activeCategory
                    : styles.category
                }>
                {category}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>
      {/* <View style={styles.setting}>
        <Text style={styles.settingPartTitle}>Card background color</Text>
        <ColorPicker
          color={cardbgcolor}
          onColorChangeComplete={onColorChangeComplete}
        />
      </View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    padding: 24,
  },
  title: {
    marginLeft: 10,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  setting: {
    marginTop: 24,
  },
  categories: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: 24,
    alignItems: 'center',
  },
  category: {
    marginRight: 10,
    fontSize: 14,
    borderColor: 'black',
    borderWidth: 1,
    fontWeight: '600',
    borderRadius: 50,
    paddingHorizontal: 20,
    paddingVertical: 5,
  },
  settingPartTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  activeCategory: {
    marginRight: 10,
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
    backgroundColor: 'black',
    borderRadius: 50,
    paddingHorizontal: 20,
    paddingVertical: 5,
    borderColor: 'black',
    borderWidth: 1,
  },
  arrowBack: {
    width: 32,
    height: 32,

    backgroundColor: 'black',
    zIndex: 2,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  next: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default SettingsScreen;
