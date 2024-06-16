import FoodList from './FoodList'
import {StyleSheet, SafeAreaView} from 'react-native'
import React, { useState, useEffect } from 'react'
// const foodItems = [
//   { category: 'Fruits', items: ['Apple', 'Banana', 'Orange']},
//   { category: 'Vegetables', items: ['Carrot', 'Broccoli', 'Spinach']},
//   { category: 'Beverages', items: ['Gatorade', 'Fanta', 'Coke']},
  
//   // Add more categories and items
// ]



export default function App() {
  const [filteredFoodItems, setFilteredFoodItems] = useState([
  ]);
  

  const itemExists = (arr, newItem) => {
    try {
      return arr.some(item => {
        if (typeof item === 'string' && typeof newItem === 'string') {
          return item === newItem;
        } else if (typeof item === 'object' && typeof newItem === 'object') {
          // Correctly compare objects in subcategories
          const [[key1, values1]] = Object.entries(item);
          const [[key2, values2]] = Object.entries(newItem);
          return key1 === key2 && JSON.stringify(values1) === JSON.stringify(values2);
        }
        return false;
      });
    } catch (error) {
      console.error('Error in itemExists:', error);
      return false;
    }
  };

  const addFoodItem = (category, newItem) => {
    console.log('Adding item:', newItem, 'to category:', category);
  
    setFilteredFoodItems(prevItems => {
      console.log('Previous foodItems:', prevItems);
      const categoryIndex = prevItems.findIndex(item => item.category === category);
      console.log('Category Index:', categoryIndex);
  
      if (categoryIndex !== -1) {
        if (!itemExists(prevItems[categoryIndex].items, newItem)) {
          // *** CORRECT WAY TO UPDATE updatedItems ***
          const updatedItems = [
            ...prevItems.slice(0, categoryIndex), // Items before the category
            { 
              ...prevItems[categoryIndex], // Existing category data
              items: [...prevItems[categoryIndex].items, newItem] // Add newItem to items
            },
            ...prevItems.slice(categoryIndex + 1) // Items after the category 
          ];
          // ****************************************
  
          console.log('Updated foodItems:', updatedItems);
  
          // ... (Rest of your AsyncStorage logic)
  
          return updatedItems; 
        } else { 
          console.log('Item already exists:', newItem);
        }
      } else {
        console.log('Category not found:', category);
      }
  
      return prevItems;
    });
  };



  return (
    <SafeAreaView style={styles.container}>
      <FoodList
        onAddItem={addFoodItem}
        filteredFoodItems={filteredFoodItems} 
        setFilteredFoodItems={setFilteredFoodItems} 
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    paddingHorizontal: 20,
    flex: 1,
    backgroundColor: '#fff',
  }
})
