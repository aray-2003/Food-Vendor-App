import SearchBar from './SearchBar';
import React, { useState, useEffect, useRef } from 'react'

import {
  View,
  Share,
  TextInput,
  Text,
  FlatList,
  Modal,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  Animated
} from 'react-native'

var colors = ['#C40C0C', '#FF6500', '#FF8A08', '#FFC100', '#00CC66', '#0A6847', '#7ABA78', '#756AB6', '#FF5BAE', '#6C3428', '#00224D'];

function getColor() {
  if (colors.length === 0) {
    // Reset the colors if all have been used
    colors = ['#C40C0C', '#FF6500', '#FF8A08', '#FFC100', '#00CC66', '#0A6847', '#7ABA78', '#756AB6', '#FF5BAE', '#6C3428', '#00224D'];
  }
  var index = Math.floor(Math.random() * colors.length);
  var color = colors[index];
  // Remove the selected color from the array
  colors.splice(index, 1);
  return color;
}


// const foodItems = [
//     { category: "Fruits", items: ["Apple", "Banana", "Orange"]},
//     { category: "Vegetables", items: ["Carrot", "Broccoli", "Spinach"]},
//     // Add more categories and items
// ];

const FoodList = ({ foodItems }) => {
  //react variables
  const [modalVisible, setModalVisible] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [color, setColor] = useState(null)
  const [selectedItems, setSelectedItems] = useState({}); // Store selected items and quantities
  const [formattedList, setFormattedList] = useState([]); // Store the formatted list string
  const [filteredFoodItems, setFilteredFoodItems] = useState(foodItems);
  const [showFormattedList, setShowFormattedList] = useState(false);
  const [coloredCategories, setColoredCategories] = useState([]);
  const inputRef = useRef(null)
  const [searchHistory, setSearchHistory] = useState([]);
  const [isListDirty, setIsListDirty] = useState(true); 
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItemsHistory, setSelectedItemsHistory] = useState([]);

  const bottomSheetOffset = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Generate pastel color for each category only once
    const coloredItems = foodItems.map((category) => ({
      ...category,
      color: getColor()
    }))
    setFilteredFoodItems(coloredItems);
    setColoredCategories(coloredItems);
  }, [])

  useEffect(() => {
    if (isListDirty) { 
      formatFoodList();
      setIsListDirty(false); // Reset the flag after updating
    }
  }, [selectedItems, isListDirty])

  const handleSearchChange = (query) => {
    setSearchQuery(query);

    if (query.trim() === '') {
      // Reset to the full list
      setFilteredFoodItems([...coloredCategories]); 
    } else {
      // Filtering logic (unchanged)
      const filteredItems = coloredCategories.map((category) => ({
        ...category,
        items: category.items.filter((item) => {
          const itemName = typeof item === 'object'
            ? Object.entries(item)[0][1].join(' ')
            : item;
          return itemName.toLowerCase().includes(query.toLowerCase());
        }),
      }));
      setFilteredFoodItems(filteredItems);
    }
  };

  const handleGoBackInSearch = () => {
    setSearchHistory((prevHistory) => {
      const newHistory = prevHistory.slice(0, -1);
      const previousQuery = newHistory[newHistory.length - 1] || '';
  
      // Update searchQuery and apply the filter immediately 
      setSearchQuery(previousQuery);
      handleSearchChange(previousQuery);
  
      // Return the updated history
      return newHistory;
    });
  };

  const FoodFlatList = () => {
    const renderItem = ({ item }) => (
      <View>
        <Text style={[styles.category, { color: item.color, borderColor: item.color }]}>
          {item.category}
        </Text>

        {item.items.map((food) => {
          if (typeof food === 'object') {
            const [brand, subcategories] = Object.entries(food)[0];

            return (
              <View key={brand}> 
                <Text style={[styles.brand, { color: item.color }]}>{brand}</Text>
                {subcategories.map((subcategory) => (
                  <TouchableOpacity
                    style={[styles.subItemContainer, { backgroundColor: item.color }]}
                    key={`${brand} ${subcategory}`}
                    onPress={() => {
                      setSearchHistory([]);
                      setColor(item.color);
                      setSelectedItem(brand !== 'Soda' ? `${subcategory} ${brand}` : `${subcategory}`);
                      setModalVisible(true);
                    }}
                  >
                    <Text style={styles.item}>{subcategory}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            );
          } else {
            return (
              <TouchableOpacity
                style={[styles.itemContainer, { backgroundColor: item.color }]}
                key={food} 
                onPress={() => {
                  setSearchHistory([]);
                  setColor(item.color);
                  setSelectedItem(food);
                  setModalVisible(true);
                }}
              >
                <Text style={styles.item}>{food}</Text>
              </TouchableOpacity>
            );
          }
        })}
      </View>
    );

    return (
      <FlatList
        data={filteredFoodItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.category}
        contentContainerStyle={styles.scrollContainer}
      />
    );
  };

  const QuantityModal = () => {
    useEffect(() => {
      // Show the keyboard when the modal becomes visible
      if (modalVisible) {
        setTimeout(() => { // Use setTimeout to ensure TextInput is rendered
          inputRef.current.focus(); // This will automatically open the keyboard
        }, 100); 
      }
    }, [modalVisible]);

    const [quantity, setQuantity] = useState('')
    const [isValidQuantity, setIsValidQuantity] = useState(false)

    const handleConfirm = () => {
      if (quantity === null || quantity <= 0 || isNaN(quantity) || quantity.includes('.') || quantity.includes(' ')) {
        setIsValidQuantity(false)
        return
      } else {
        setIsValidQuantity(true)
      }
      console.log(`Selected ${quantity} of ${selectedItem}`)
      
      setModalVisible(false) // Close modal after confirmation

      setSelectedItems((prevItems) => ({
        ...prevItems,
        [selectedItem]: parseInt(quantity), // Store quantity as a number
      }));
      setSelectedItemsHistory((prevHistory) => [...prevHistory, { ...selectedItems }]);
      setIsListDirty(true); 
    };

    const handleCloseModal = () => {
      setModalVisible(false)
    }

    const handleChangeQuantity = (quantity) => {
      if (quantity === null || quantity <= 0 || isNaN(quantity) || quantity.includes('.') || quantity.includes(' ')) {
        setIsValidQuantity(false)
        setQuantity(quantity)
        return
      }
      setIsValidQuantity(true)
      setQuantity(quantity)
    }

    return (
      <View style={{ flex: 1 }}>
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <TouchableOpacity
            style={styles.centeredView}
            activeOpacity={1}
            onPress={() => {
              handleConfirm(); // Call handleConfirm on button press
              handleCloseModal(); // Close the modal after confirmation
            }}
          />
          <View style={styles.modalView}>
              <Text style={[styles.modalText]}>
                How much{' '}
                <Text style={[{ fontStyle: 'italic', fontWeight: 'bold', color: color}]}>
                  {selectedItem}
                </Text>
                ?
              </Text>
              <TextInput
                style={[styles.input, { borderColor: color }]}
                onChangeText={handleChangeQuantity}
                value={quantity}
                inputMode="numeric"
                keyboardType="number-pad"
                maxLength={2}
                onBlur={() => handleConfirm()}
                ref={inputRef}
              />
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={
                    isValidQuantity
                      ? [styles.button, { backgroundColor: color }]
                      : styles.buttonError
                  }
                  onPress={handleConfirm}
                >
                  <Text style={styles.textStyle}>Confirm</Text>
                </TouchableOpacity>
              </View>
            </View>
        </Modal>
      </View>
    )
  }

  const FormattedListModal = () => {
    return (
      <Animated.View
        style={[
          styles.bottomSheetContainer,
          {
            height: showFormattedList ? 'auto' : 60, // Partially visible height
            opacity: showFormattedList ? 1 : 0.8, // Slightly transparent when hidden 
          },
        ]}
      >
        <View style={styles.modalView}>
          <TouchableOpacity onPress={toggleBottomSheet}>
            <Text style={styles.modalTitle}>Today's List:</Text>
          </TouchableOpacity>
          {showFormattedList && ( // Conditionally render ScrollView
            <ScrollView style={styles.modalList}>
              <Text>{formattedList}</Text>
            </ScrollView>
          )}
        </View>
      </Animated.View>
    );
  };

  const toggleBottomSheet = () => {
    formatFoodList();
    setShowFormattedList(!showFormattedList);
  };

  // Animation for the bottom sheet
  useEffect(() => {
    Animated.timing(bottomSheetOffset, {
      toValue: showFormattedList ? -300 : 0, // Adjust -300 to your desired height
      duration: 200,
      useNativeDriver: false // Set to false as we are animating height
    }).start();
  }, [showFormattedList, bottomSheetOffset]); // Run when showFormattedList changes

    
  const shareFoodList = async () => {
      try {
        const result = await Share.share({
          message: formattedList
        });
  
        if (result.action === Share.sharedAction) {
          if (result.activityType) {
            // Shared with activity type of result.activityType
            console.log("Shared with activity type:", result.activityType);
          } else {
            // Shared successfully
            console.log("Shared successfully");
          }
        } else if (result.action === Share.dismissedAction) {
          // Dismissed
          console.log("Share dismissed");
        }
      } catch (error) {
        Alert.alert('Error Sharing List', error.message);
      }
  };
  
  const ShareListButton = () => {
    return (
      <TouchableOpacity
        style={[styles.floatingButton, styles.shareButton]}
        onPress={shareFoodList}
        activeOpacity={0.7}
      >
        <Image
          source={require('./assets/share-icon.png')} // Replace with your share icon
          style={styles.floatingButtonIcon}
        />
      </TouchableOpacity>
    );
  };
    
  const ViewFormattedListButton = () => {
    return (
      <TouchableOpacity
        style={[styles.floatingButton, styles.viewListButton]}
        onPress={toggleBottomSheet} // Toggle bottom sheet on button press
        activeOpacity={0.7}
      >
        <Image
          source={require('./assets/eye-icon.png')}
          style={styles.floatingButtonIcon}
        />
      </TouchableOpacity>
    );
  };

  const UndoButton = () => {
    return (
      <TouchableOpacity
        style={[styles.floatingButton, styles.undoButton]}
        onPress={handleUndo}
        activeOpacity={0.7}
      >
        <Image
          source={require('./assets/undo-icon.png')} 
          style={styles.undoButtonIcon}
        />
      </TouchableOpacity>
    );
  };

  const handleUndo = () => {
    if (Object.keys(selectedItems).length === 0) {
      formattedList = []
      // List is empty, show an alert or handle it as needed
      Alert.alert('Food List is Empty', 'There are no items to undo.');
      return; // Exit the function early
    }
    // Get the last added item from selectedItems
    const lastSelectedItemKey = Object.keys(selectedItems)
      .reduce((a, b) => (selectedItems[a] > selectedItems[b] ? a : b));

    if (lastSelectedItemKey) {
      setSelectedItems((prevItems) => {
        // Create a copy of prevItems without modifying the original object
        const newItems = { ...prevItems }; 
        delete newItems[lastSelectedItemKey];
        return newItems;
      });
       // Update the formatted list
      setIsListDirty(true);
    }
    formatFoodList()
  };

  const formatFoodList = () => {
    const formattedItems = {};
  
    for (const category of foodItems) {
      for (const item of category.items) {
        if (typeof item === 'object') {
          const [brand, subcategories] = Object.entries(item)[0];
          formattedItems[brand] = formattedItems[brand] || {}; 
  
          if (category.category === 'Beverages') {
            // ***CORRECTED PACKING LOGIC START***
            let currentPack = {};
            let packTotal = 0;
  
            for (const subcategory of subcategories) {
              const itemName = brand === 'Soda' ? subcategory : `${subcategory} ${brand}`;
              let quantity = selectedItems[itemName] || 0;
  
              // Only process if there's a quantity MORE THAN 3
              if (quantity > 3) { 
                while (quantity > 0) {
                  const availableSpace = 24 - packTotal;
                  const amountToAdd = Math.min(quantity, availableSpace);
  
                  if (amountToAdd > 0) {
                    currentPack[subcategory[0].toUpperCase()] = (currentPack[subcategory[0].toUpperCase()] || 0) + amountToAdd;
                    packTotal += amountToAdd;
                    quantity -= amountToAdd;
                  }
  
                  if (packTotal === 24) {
                    formattedItems[brand]['Pack'] = formattedItems[brand]['Pack'] || []; 
                    formattedItems[brand]['Pack'].push(currentPack);
                    currentPack = {};
                    packTotal = 0;
                  }
                }
              } else if (quantity > 0) { // Handle quantities 1-3
                formattedItems[brand][subcategory] = `${quantity}`; 
              }
            }
  
            if (Object.keys(currentPack).length > 0) {
              formattedItems[brand]['Pack'] = formattedItems[brand]['Pack'] || [];
              formattedItems[brand]['Pack'].push(currentPack);
            }
            // ***CORRECTED PACKING LOGIC END***
  
          } else { // For non-beverage categories
            for (const subcategory of subcategories) {
              const itemName = brand === 'Soda' ? subcategory : `${subcategory} ${brand}`;
              const quantity = selectedItems[itemName] || 0;
  
              if (quantity > 0) {
                formattedItems[brand][subcategory] = quantity;
              }
            }
          }
  
        } else { // For non-subcategory items
          const quantity = selectedItems[item] || 0;
          if (quantity > 0) {
            formattedItems[category.category] = formattedItems[category.category] || {};
            formattedItems[category.category][item] = quantity;
          }
        }
      }
    }
  
    // Format the output list
    let formattedListArray = [];
  
    for (const [brand, itemsData] of Object.entries(formattedItems)) {
      if (Object.keys(itemsData).length > 0) {
        formattedListArray.push(`${brand}:\n`);
  
        for (const itemKey in itemsData) {
          if (itemKey === 'Pack') {
            itemsData['Pack'].forEach((packContent, index) => {
              const formattedPackItems = Object.entries(packContent)
                .map(([initial, qty]) => `${initial}-${qty}`)
                .join(', ');
              formattedListArray.push(`\tPack: (${formattedPackItems})\n`);
            });
          } else {
            formattedListArray.push(`\t${itemKey}: ${itemsData[itemKey]}\n`);
          }
        }
  
        formattedListArray.push(''); 
      }
    }
  
    setFormattedList(formattedListArray.join(''));
  };
  

  return (
    <View style={{ flex: 1 }}>
      <SearchBar onSearchChange={handleSearchChange} onGoBackInSearch={handleGoBackInSearch} /> 
      <FoodFlatList />
      <QuantityModal />
      <FormattedListModal />
        <UndoButton /> 
        <ShareListButton />
    </View>
  );
}





const styles = StyleSheet.create({
  category: {
    fontSize: 20,
    padding: 10,
    fontWeight: 'bold',
    paddingBottom: 2,
    borderBottomWidth: 2,
  },

  itemContainer: {
    borderRadius: 5, // Rounded corners for items
    padding: 7,
    marginVertical: 3.5,
    transparency: 0.5,

    // shadow for ios
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    //shadow for android
    elevation: 3
  },
  item: {
    color: '#fff', // White text color for better contrast
    fontSize: 16
    // fontWeight: 'bold'
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  button: {
    disabled: true,
    borderRadius: 5,
    borderBottomEndRadius: 20,
    borderBottomStartRadius: 20,
    padding: 10,
    paddingHorizontal: '40%',
    elevation: 2,
    marginHorizontal: 5,
    backgroundColor: '#2196F3'
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 15
  },
  modalText: {
    fontSize: 25,
    textAlign: 'center',
    fontWeight: 'bold'
  },
  input: {
    margin: 6,
    borderWidth: 3,
    fontWeight: 'bold',
    borderColor: '#ccc',
    borderRadius: 5,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    textAlign: 'center',
    paddingHorizontal: '45%',
    paddingVertical: 5
  },
  buttonError: {
    borderRadius: 5,
    borderBottomEndRadius: 20,
    borderBottomStartRadius: 20,
    padding: 10,
    paddingHorizontal: '40%',
    elevation: 2,
    marginHorizontal: 5,
    backgroundColor: '#ccc'
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  brand: {
    fontSize: 18,
    padding: 10,
    paddingBottom: 3,
    fontWeight: 'bold',
    marginLeft: 10,
    
  },
  subItemContainer: {
    borderRadius: 5,
    padding: 5,
    marginVertical: 3.5,
    transparency: 0.5,
    marginLeft: 20,
    // shadow for ios
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    //shadow for android
    elevation: 3
  },
  scrollContainer: {
    flexGrow: 1, // Allow ScrollView to take up available space
  },
  doneButton: {
    backgroundColor: 'black',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  doneButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  // ... (Modal styles)
  modalList: {
    padding: 5,
    minWidth: 150,
    maxHeight: 300,
  },
  modalView: {
    backgroundColor: 'white',
    padding: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    textDecorationLine: 'underline',
    fontSize: 16,
  },
  floatingButton: {
    position: 'absolute',
    marginTop: 50,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30, 
    backgroundColor: 'white', 
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5, // For Android shadow
    shadowColor: '#000', // For iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  floatingButtonIcon: {
    width: 25, 
    height: 25,
    tintColor: 'black', // Optional: Set icon color 
  },

  undoButtonIcon: {
    width: 25,
    height: 25,
    tintColor: 'black'
  },

  undoButton: {
    bottom: 140,
  },
  shareButton: {
    bottom: 65, // Position in between the other two buttons
  },
  bottomSheetTrigger: {
    height: 100,
    width: 100,
  },
  bottomSheetContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    overflow: 'hidden',
  },
})

export default FoodList
