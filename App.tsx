import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { StyleSheet } from "react-native";
import Ionicons from 'react-native-vector-icons/Octicons';
// Screens
import HomeScreen from "./navigation/screens/HomeScreen";
import Inventory from "./navigation/screens/Inventory";
import Generate from "./navigation/screens/Generate";
import DetailRec from "./navigation/screens/DetailRec";
import AddInventoryItem from "./navigation/screens/AddInventoryItem";
import AddRecipe from "./navigation/screens/AddRecipe";
import SettingsScreen from "./navigation/screens/SettingsScreen";


// Screen names
const homeName = "Home";
const generateName = "Generate";
const inventoryName = "Inventory";
const detailName = "DetailRec";
const addInventoryItem = "AddInventoryItem";
const addRecipe = "AddRecipe";
const settings = "SettingsScreen";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator(); 

function MainTabNavigator() : JSX.Element {
  return (
    <Tab.Navigator
   
      initialRouteName={homeName}
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === homeName) {
            iconName = focused ? "book" : "book";
          } else if (route.name === inventoryName) {
            iconName = focused ? "package" : "package";
          } else if (route.name === generateName) {
            iconName = focused ? "paintbrush" : "paintbrush";
          }
          return <Ionicons name={iconName as string} size={size} color={color} />;
        },
        tabBarActiveTintColor: "white",
        tabBarInactiveTintColor: "gray",
        tabBarActiveBackgroundColor: "black",
        tabBarShowLabel: false,
        tabBarStyle: styles.container,
        tabBarLabelStyle: styles.label,
        tabBarIconStyle: styles.icon,
        tabBarHideOnKeyboard: true,

      })}
    >
      <Tab.Screen
        name={generateName}
        component={Generate}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name={homeName}
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name={inventoryName}
        component={Inventory}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
};

function App() : JSX.Element {
  return (
    
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="homestack"
            component={MainTabNavigator}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name={detailName}
            component={DetailRec}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name={addInventoryItem}
            component={AddInventoryItem}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name={addRecipe}
            component={AddRecipe}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name={settings}
            component={SettingsScreen}
            options={{ headerShown: false }}
          />


        </Stack.Navigator>
      </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 65,
    border: 0,
    borderRadius: 10,
    marginLeft: 20,
    marginRight: 20,
    position: "relative",
    bottom: 15,
    elevation: 5,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },


  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 10,
  },
  icon: {
    width: 30,
    height: 30,
  },




});

export default App;