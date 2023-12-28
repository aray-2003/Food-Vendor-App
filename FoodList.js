import React, {useState} from 'react';
import {
  View,
  Text,
  FlatList,
  Modal,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

function getColor() {
  return (
    'hsl(' +
    (180 + 120 * Math.random()) +
    ',' +
    (70 + 20 * Math.random()) +
    '%,' +
    (40 + 10 * Math.random()) +
    '%)'
  );
}
// const foodItems = [
//     { category: "Fruits", items: ["Apple", "Banana", "Orange"] },
//     { category: "Vegetables", items: ["Carrot", "Broccoli", "Spinach"] },
//     // Add more categories and items
// ];

const FoodList = ({ foodItems }) => {
  const coloredCategories = foodItems.map((category) => ({
    ...category,
    color: getColor(),
  }));

  

  const renderItem = ({ item }) => (
    <View>
      <Text style={[styles.category, {color: item.color}]}>{item.category}</Text>

      {item.items.map((food) => (
        <TouchableOpacity
          style={[styles.itemContainer, { backgroundColor: item.color }]}
          key={food}
          onPress={() => {
            console.log(`Pressed ${food}`);
          }}>
          <Text style={styles.item}>{food}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <FlatList
      data={coloredCategories}
      renderItem={renderItem}
      keyExtractor={(item) => item.category}
    />
  );
};

const styles = StyleSheet.create({
  category: {
    fontSize: 20,
    padding: 10,
    fontWeight: 'bold',
  },

  itemContainer: {
    borderRadius: 5, // Rounded corners for items
    padding: 10,
    marginVertical: 5,

    // shadow for ios
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    //shadow for android
    elevation: 3,
  },
  item: {
    color: '#fff', // White text color for better contrast
    fontSize: 16,
    // fontWeight: 'bold'
  },
});

export default FoodList;
