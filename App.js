import FoodList from './FoodList'
import { StyleSheet, Text, SafeAreaView } from 'react-native'

const foodItems = [
  { category: 'Fruits', items: ['Apple', 'Banana', 'Orange'] },
  { category: 'Vegetables', items: ['Carrot', 'Broccoli', 'Spinach'] }
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
    paddingTop: 30,
    paddingHorizontal: 20,
    flex: 1,
    backgroundColor: '#fff',
  }
})
