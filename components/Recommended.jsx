import React, {useState, useEffect} from "react";
import { StyleSheet, Text, View, ImageBackground, TouchableHighlight } from "react-native";
import { useNavigation } from "@react-navigation/native";
import i18n from '../localization/I18n';

const Recommended= (props) => {
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
          if (recipeIngredient.name === ingredient.inventoryItemName) {
            count++;
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

  return (
    <TouchableHighlight onPress={navigateToDetail} style={styles.recommendedBox}>
      <ImageBackground
        source={{ uri: props.data.image }} // Use 'source' instead of 'src'
        style={styles.imageBackground}
        imageStyle={styles.image}
      >
        {/* Dark overlay */}
        <View style={styles.darkOverlay}></View>

        <View style={styles.infoRecommended}>
          <Text style={styles.recommendedText}>
            {props.data.title}
          </Text>
          <Text style={styles.recommendedIngredient}>
            {truncatedDescription}
          </Text>
          <Text style={styles.greenActiveIngredients}>
            {activeIngredients}/{props.data.ingredients.length} {i18n.t('ingredients')}
          </Text>
        </View>
      </ImageBackground>
    </TouchableHighlight>
  );
};

const styles = StyleSheet.create({
    recommendedBox: {
        backgroundColor: "#ccc",
        height: 220,
        marginTop: 20,
        borderRadius: 10,
        overflow: "hidden",
      },
      imageBackground: {
        flex: 1,
        resizeMode: "cover",
      },
      image: {},
      recommendedText: {
        fontSize: 16,
        fontWeight: "bold",
        color: "white",
        zIndex: 1,
      },
      recommendedIngredient: {
        color: "white",
      },
      ingredientsavailble: {
        color: "#DBFAF8",
        fontWeight: "bold",
        marginTop: 10,
      },
      infoRecommended: {
        position: "absolute",
        bottom: 0,
        padding: 25,
      },
      recepieWrap: {
        marginTop: 20,
      },
      extraBright: {
        backgroundColor: "black",
        flex: 1,
        resizeMode: "cover",
        opacity: 0.5,
      },
      greenActiveIngredients:{
        fontWeight: "bold",
        color: "#DBFAF8",
     
      },
      darkOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Adjust opacity as needed
      },
    
});

export default Recommended;
