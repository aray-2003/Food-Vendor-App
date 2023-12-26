import React from 'react';
import { View, Text, Pressable, FlatList, StyleSheet, TouchableOpacity } from 'react-native';

// const foodItems = [
//     { category: "Fruits", items: ["Apple", "Banana", "Orange"] },
//     { category: "Vegetables", items: ["Carrot", "Broccoli", "Spinach"] },
//     // Add more categories and items
// ];

const FoodList = ({ foodItems }) => {
    const renderItem = ({ item }) => (
        <View>
            <Text style={styles.category}>{item.category}</Text>
            {item.items.map(food => (
                <TouchableOpacity style={styles.itemContainer} key={food} onPress={() => console.log(`Pressed ${food}`)}>
                    <Text style={styles.item}>{food}</Text>
                </TouchableOpacity>
            ))}
        </View>
    );

    return (
        <FlatList 
            data={foodItems} 
            renderItem={renderItem} 
            keyExtractor={item => item.category}
        />
    );
}

const styles = StyleSheet.create({
    category: {
        fontSize: 18,
        padding: 10,
        backgroundColor: '#f0f0f0', // Light grey background for category
    },
    itemContainer: {

        backgroundColor: '#D6E6F2', // Blue background for items
        borderRadius: 5, // Rounded corners for items
        padding: 10,
        marginVertical: 5,

        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,

        elevation: Platform.OS === 'android' ? 3 : 0,
    },
    item: {
        color: '#303841', // White text color for better contrast
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default FoodList;