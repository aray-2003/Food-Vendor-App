import FoodList from './FoodList'
import { StyleSheet, Text, SafeAreaView } from 'react-native'

// const foodItems = [
//   { category: 'Fruits', items: ['Apple', 'Banana', 'Orange']},
//   { category: 'Vegetables', items: ['Carrot', 'Broccoli', 'Spinach']},
//   { category: 'Beverages', items: ['Gatorade', 'Fanta', 'Coke']},
  
//   // Add more categories and items
// ]

const foodItems = [
  {
    category: 'Food',
    items: 
    [
      'Hot Dog',
      'Sausage',
      'Bread',
        { 'Pretzel': ['Regular', 'Cheese'] },
      'Churros',
    ]
  },
  {
    category: 'Beverages',
    items: 
    [
      {'Gatorade': ['Red', 'Lime', 'Orange', 'Blue']}, 
      {'Soda':['Coke','Diet Coke', 'Sprite', 'Lemonade', 'Fanta','Pepsi', 'Coke Zero', 'Diet Pepsi']},
      'Red Bull',
      'Sparkling Water',
        'Water',
        'Small Water',
        'Vitamin Water',
      {'Snapple':['Peach','Lemon','Kiwi', 'Diet Peach','Diet Lemon']}
    ]
  },
  {
    category: 'Ice Cream',
    items: 
    [
      'Oreo Bar',
      'Klondike',
        'Strawberry Shortcake',
        'Vanilla Bar',
        'Giant Sandwich',
        'Cookie Sandwich',
        'Choc Éclair',
        'King Kone',
        'Birthday Cake',
        'Original',
        { 'Magnum': ['2x Choc', 'Almond', 'Caramel', 'Peanut B.'] },
        'Häagen-Dazs',
    ]
  },
  {
    category: 'Frozen Ice Cream',
    items: 
    [
        'Spiderman',
        'Spongebob',
        'Spacejam',
        'Sonic',
        'Snowcone',
        {'Minute Maid': ['Lemon','Strawberry']}
    ]
  },
  {
    category: 'Nuts',
    items: 
    [
      'Peanuts',
        'Cashews',
        'Almonds',
        'Pecans'
    ]
  },
  {
    category: 'Miscellaneous',
    items: 
      [
      {'Food': ['Onions','Sauerkraut','Mustard','Ketchup']},
        'Sterno',
        'Napkins',
        'Roll Towels',
        'Gloves',
        'Straws',
        'Foil',
        'Spoons',
        'Sugar',
        'Vanillin',
        {'Bags': ['Garbage Bags','White Bags','Brown Bags','Black Bags']}      
    ]
  },

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
