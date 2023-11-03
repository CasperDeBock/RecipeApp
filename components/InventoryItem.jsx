import React, {useEffect, useState} from "react";
import { StyleSheet, Text, View, Image, Animated,TouchableOpacity } from "react-native";
import Ionicons from "react-native-vector-icons/Octicons";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import i18n from '../localization/I18n';

const InventoryItem= ({item, handleDelete}) => {
  // Date formatting
  const originalDate = new Date(item.expirationDate);
  const formattedDate = originalDate.toLocaleDateString('en-GB'); 


  // Nav
  const navigation = useNavigation();
  const navigateEdit = () => {
    navigation.navigate("AddInventoryItem", { inventoryItemData: item });
  };
  
  // Delete item with swipe
  const rightSwipe = (progress, dragX) => {
    const scale = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [1, 0.9],
      extrapolate: "clamp",
    })
    return (
      <TouchableOpacity onPress={handleDelete}>
        <View style={styles.deleteItem}>
          <Animated.Text style={{transform: [{scale:scale}] }}><Ionicons name={"trash"} size={16} color={"black"} /></Animated.Text>
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <GestureHandlerRootView>
    <Swipeable renderRightActions={rightSwipe} >
    <View style={styles.inventor}>
        <Image 
        style={styles.imageRecepie}
        src={item.inventoryItemIMG}
        resizeMode="cover" 
        />
            <View style={styles.itemInfo}>
              <Text style={styles.recepieTitle}>{item.inventoryItemName}</Text>
              <View style={styles.bottomInfo}>
                <Text style={styles.quantity}>
                {i18n.t("Quantity")}: {item.quantity}
                </Text>
                <Text style={styles.expDate}>{i18n.t("ExpirationDate")}: {formattedDate}</Text>
              </View>
            </View>
            <TouchableOpacity onPress={navigateEdit} style={styles.editInventory}>
                <Text style={styles.arrow}><Ionicons name={"pencil"} size={24} color={"black"} /></Text>
            </TouchableOpacity>
    </View>
    </Swipeable>
   </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
    inventor: {
        marginBottom: 20,
        width:"100%",
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
        color: 'black',
        fontWeight: "bold",
      },
      editInventory: {
        alignItems: "center",
        justifyContent: "center",
        marginLeft: 50,
      },
      bottomInfo:{
        
        marginTop:10,
      },
      arrow: {
        fontWeight: "bold",
      },
      quantity:{
        color: 'black'
      },
      expDate:{
        color: 'black'
      },
      deleteItem: {
        backgroundColor: "#F16569",
        justifyContent: "center",
        alignItems: "center",
        width: 50,
        height: 64,
        borderRadius: 10,
        
      },


});

export default InventoryItem;
