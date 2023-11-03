import React, { useEffect } from "react";
import { StyleSheet, Text, View, Image,FlatList, TouchableOpacity,ScrollView
 } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import i18n from '../localization/I18n';

const Generated = (props) => {

  // Nav
  const navigation = useNavigation();

  // Nav to detail generated
  const navigateToDetailGEN = () => {
    navigation.navigate("DetailRec", { recipeData: props.recipe , type: "generated"});

  }

  return (
    <TouchableOpacity style={styles.recepie} onPress={navigateToDetailGEN}>
            <Image
              src="https://www.9mm.cl/wp-content/uploads/2023/01/openai-logo.png"
              style={styles.imageRecepie}
              resizeMode="cover" // You can adjust the resizeMode as needed
            />
            <View style={styles.recepieInfo}>
              <Text style={styles.recepieTitle}>{props.recipe.title}</Text>
              {/* <Text style={activeIngredients === props.data.ingredients.length ? styles.greenActiveIngredients : activeIngredients/props.data.ingredients.length > 0 ? styles.orangeActiveIngredients : styles.activeIngredients}>{activeIngredients}/{props.data.ingredients.length} ingredients</Text> */}

              <Text style={styles.description}>{i18n.t('generatedrecipeforyou')}</Text>
            </View>
            <View style={styles.arrowRecepie}>
                <Text style={styles.arrow}>&#8594;</Text>
            </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
    recepie: {
        marginBottom: 20,
        flexDirection: "row",
        
      },
      imageRecepie: {
        width: 64,
        height: 64,
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
});

export default Generated;

