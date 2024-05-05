import FoodList from './FoodList'
import { StyleSheet, Text, SafeAreaView } from 'react-native'

// const foodItems = [
//   { category: 'Fruits', items: ['Apple', 'Banana', 'Orange']},
//   { category: 'Vegetables', items: ['Carrot', 'Broccoli', 'Spinach']},
//   { category: 'Beverages', items: ['Gatorade', 'Fanta', 'Coke']},
  
//   // Add more categories and items
// ]

const foodItems = [
  { category: 'Food', items: ['Hot Dog', 'Sausage', {'Pretzel': ['Regular', 'Cheese']}, 'Churros']},
  { category: 'Beverages', items: [{'Gatorade': ['Red', 'Lime', 'Orange', 'Blue']}, 
  {'Soda':['Coke','Diet Coke', 'Sprite', 'Lemonade', 'Orange']}]},
  // Add more categories and items
]

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <FoodList foodItems={foodItems} />
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
