import React from 'react'
import {
  View,
  Text,
  Pressable,
  FlatList,
  StyleSheet,
  TouchableOpacity
} from 'react-native'

// const foodItems = [
//     { category: "Fruits", items: ["Apple", "Banana", "Orange"] },
//     { category: "Vegetables", items: ["Carrot", "Broccoli", "Spinach"] },
//     // Add more categories and items
// ];

const FoodList = ({ foodItems }) => {
  const renderItem = ({ item }) => (
    <View>
      <Text style={styles.category}>{item.category}</Text>
      {item.items.map((food) => (
        <TouchableOpacity
          style={styles.itemContainer}
          key={food}
          onPress={() => {
            console.log(`Pressed ${food}`)
          }}
        >
          <Text style={styles.item}>{food}</Text>
        </TouchableOpacity>
      ))}
    </View>
  )

  return (
    <FlatList
      data={foodItems}
      renderItem={renderItem}
      keyExtractor={(item) => item.category}
    />
  )
}

const styles = StyleSheet.create({
  category: {
    fontSize: 20,
    padding: 10,
    fontWeight: 'bold'
  },
  itemContainer: {
    backgroundColor: '#3285f3', // Blue background for items
    borderRadius: 5, // Rounded corners for items
    padding: 10,
    marginVertical: 5,

    // shadow for ios
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,

    //shadow for android
    elevation: Platform.OS === 'android' ? 3 : 0
  },
  item: {
    color: '#FFFFFF', // White text color for better contrast
    fontSize: 16,
    fontWeight: 'bold'
  }
})

export default FoodList
