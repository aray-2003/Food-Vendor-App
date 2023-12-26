import FoodList  from './FoodList';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, SafeAreaView } from 'react-native';

const foodItems = [
  { category: "Fruits", items: ["Apple", "Banana", "Orange"] },
  { category: "Vegetables", items: ["Carrot", "Broccoli", "Spinach"] },
  // Add more categories and items
];

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <FoodList foodItems={foodItems}/>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
