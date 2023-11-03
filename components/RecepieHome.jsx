import React, { useEffect } from "react";
import { StyleSheet, Text, View, Image,FlatList, TouchableOpacity, ScrollView, Animated
 } from "react-native";
import Ionicons from "react-native-vector-icons/Octicons";
 import Swipeable from "react-native-gesture-handler/Swipeable";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import i18n from '../localization/I18n';

const RecepieHome = (props) => {
  // States
  const [activeIngredients, setActiveIngredients] = useState(0);

  // Truncate description
  const maxDescriptionLength = 40   ;
  const truncatedDescription =
    props.data.description.length > maxDescriptionLength
      ? props.data.description.substring(0, maxDescriptionLength) + "..."
      : props.data.description;
 
  useEffect(() => {
    let count = 0;
    props.data.ingredients.forEach((recipeIngredient) => {
      props.myIngredientList.forEach((ingredient) => {
        if (recipeIngredient.name === ingredient.inventoryItemName   ) {
          //split from quantity the number with the unit
          const quantityInventory = parseInt(ingredient.quantity.split(/(\d+)/)[1]);
          const quantityRecipe = parseInt(recipeIngredient.quantity.split(/(\d+)/)[1]);

          if(quantityInventory >= quantityRecipe){
            count++;
          }
        }
      });
    });
    setActiveIngredients(count);
  }, [props.myIngredientList, props.data.ingredients]);

  // Nav
  const navigation = useNavigation();

  // Nav to detail
  const navigateToDetail = () => {
    navigation.navigate("DetailRec", { recipeData: props.data , myIngredientList: props.myIngredientList, type: "home"});

  };

  // Delete item with swipe
  const rightSwipe = (progress, dragX) => {
    const scale = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [1, 0.9],
      extrapolate: "clamp",
    })
    return (
      <TouchableOpacity onPress={props.handleDelete}>
        <View style={styles.deleteItem}>
          <Animated.Text style={{transform: [{scale:scale}] }}><Ionicons name={"trash"} size={16} color={"black"} /></Animated.Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <GestureHandlerRootView>
    <Swipeable renderRightActions={rightSwipe} >
    <TouchableOpacity style={styles.recepie}  onPress={navigateToDetail}>
            <Image
              src={props.data.image}
              style={styles.imageRecepie}
              resizeMode="cover" // You can adjust the resizeMode as needed
            />
            <View style={styles.recepieInfo}>
              <Text style={styles.recepieTitle}>{props.data.title}</Text>
              <Text style={activeIngredients === props.data.ingredients.length ? styles.greenActiveIngredients : activeIngredients/props.data.ingredients.length > 0 ? styles.orangeActiveIngredients : styles.activeIngredients}>{activeIngredients}/{props.data.ingredients.length} {i18n.t("ingredients")}</Text>

              <Text style={styles.description}>{truncatedDescription}</Text>
            </View>
            <View style={styles.arrowRecepie}>
                <Text style={styles.arrow}>&#8594;</Text>
            </View>
    </TouchableOpacity>
    </Swipeable>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
    recepie: {
        marginBottom: 20,
        flexDirection: "row",
        
      },
      imageRecepie: {
        width: 107,
        height: 104,
        borderRadius: 10,
        flexShrink: 0,
        marginRight: 20,
      },
      recepieTitle: {
        fontWeight: "bold",
        color: 'black',
      },
      recepieSmallTitle: {
        color: "#ccc",
        fontWeight: "bold",
      },
      recepieInfo:{
        width: "50%",
        justifyContent:"center"
      },
      activeIngredients: {
        fontWeight: "bold",
        color: "#F16569",
       
      },
      greenActiveIngredients:{
        fontWeight: "bold",
        color: "#5CA8A3",
     
      },

      orangeActiveIngredients:{
        fontWeight: "bold",
        color: "#E97331",
      },
      arrowRecepie: {
        alignItems: "center",
        justifyContent: "center",
        marginLeft: 20,
      },
      arrow: {
        fontWeight: "bold",
      },
      flatlist:{
        flexDirection: "row",
      },
      description:{
        
        color: 'black',
      },
      deleteItem: {
        backgroundColor: "#F16569",
        justifyContent: "center",
        alignItems: "center",
        width: 80,
        height: "80%",
        borderRadius: 10,
        
      },
});

export default RecepieHome;
