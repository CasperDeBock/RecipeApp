import React from "react";
import { StyleSheet, Text, TouchableHighlight } from "react-native";
import { useNavigation } from "@react-navigation/native";
import i18n from '../localization/I18n';

const ButtonBlack= (props) => {
  // Nav
  const nav = useNavigation();

  // Check if button is generate or navigate
  const handleNavigate = () => {
    if(props.text === i18n.t("Generate")){
       props.onTouch()
    }
    else if(props.text === i18n.t('Useitems')){ 
      props.onT()
    }
    else{
      nav.navigate(props.navigate)
    }
 
  };

  return (
    <TouchableHighlight  onPress={handleNavigate} style={styles.button}>
        <Text style={styles.buttonText}>{props.text}</Text>
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
    borderRadius: 50,
    height: 50,
    position: "absolute",
    width: "100%",
    bottom: 5,
    shadowColor: "rgba(0, 0, 0, 0.25)",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 6,
    marginLeft: 20,
    
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default ButtonBlack;
