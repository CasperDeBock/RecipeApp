import React from "react";
import { StyleSheet, Text, TouchableHighlight } from "react-native";
import Ionicons from "react-native-vector-icons/Octicons";
import { useNavigation } from "@react-navigation/native";


const ButtonSmall= (props) => {
  // Nav
  const navigation = useNavigation();

  // Nav to add inventory item
  const handleOpenAddInventoryItem = () => {
    navigation.navigate("AddInventoryItem", { inventoryItemData: "" });
  };
  // Nav to add recipe
  const handleOpenAddRecipe = () => {
    navigation.navigate("AddRecipe", { recipeItemData: "" });
  };

  return (
    <TouchableHighlight onPress={props.page === "inventory" ? handleOpenAddInventoryItem : props.page === "recipe" ? handleOpenAddRecipe : ""} style={styles.button}>
        <Ionicons name={"plus"} size={16} color={"white"} />
    </TouchableHighlight>
  );
};

const styles = StyleSheet.create({
// Button
button: {
    marginBottom: 20,
    backgroundColor: "black",
    color: "white",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 100,
    position: "absolute",
    right: 25,
    bottom: 5,
    padding:20,
    width: 64,
    height: 64,
    shadowColor: "rgba(0, 0, 0, 0.25)",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 6,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize:32,
  },
});

export default ButtonSmall;
