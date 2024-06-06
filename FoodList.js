import React, { useState, useEffect, useRef } from 'react'
import { Share } from 'react-native';

import {
  View,
  TextInput,
  Text,
  FlatList,
  Modal,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert
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
  const [coloredCategories, setColoredCategories] = useState([])
  const [selectedItems, setSelectedItems] = useState({}); // Store selected items and quantities
  const [formattedList, setFormattedList] = useState(''); // Store the formatted list string
  const inputRef = useRef(null)

  useEffect(() => {
    // Generate pastel color for each category only once
    const coloredItems = foodItems.map((category) => ({
      ...category,
      color: getColor()
    }))
    setColoredCategories(coloredItems)
  }, [])



  const FoodFlatList = () => {
    const renderItem = ({ item }) => (
      <View>
        <Text style={[styles.category, {color: item.color, borderColor: item.color}]}>
          {item.category}
        </Text>
  
        {item.items.map((food) => {
          if (typeof food === 'object') {
            const [brand, subcategories] = Object.entries(food)[0]
  
            return (
              <View>
                <Text style={[styles.brand, { color: item.color }]}>{brand}</Text>
                {subcategories.map((subcategory) => (
                  <TouchableOpacity
                    style={[styles.subItemContainer, { backgroundColor: item.color }]}
                    key={`${brand} ${subcategory}`}
                    onPress={() => {
                      setColor(item.color)
                      if (brand != 'Soda'){
                        setSelectedItem(`${subcategory} ${brand}`)
                      } else if (brand == 'Soda'){
                        setSelectedItem(`${subcategory}`)
                      }
                      setModalVisible(true)
                      setTimeout(() => {
                        inputRef.current.focus()
                      }, 250)
                    }}
                  >
                    <Text style={styles.item}>{subcategory}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )
          } else {
            return (
              <TouchableOpacity
                style={[styles.itemContainer, { backgroundColor: item.color }]}
                key={food}
                onPress={() => {
                  setColor(item.color)
                  setSelectedItem(food)
                  setModalVisible(true)
                  setTimeout(() => {
                    inputRef.current.focus()
                  }, 250)
                }}
              >
                <Text style={styles.item}>{food}</Text>
              </TouchableOpacity>
            )
          }
        })}
      </View>
    )

    return (
      <FlatList
        data={coloredCategories}
        renderItem={renderItem}
        keyExtractor={(item) => item.category}
        contentContainerStyle={styles.scrollContainer} // Apply padding to content
      />
    )
  }

  const QuantityModal = () => {
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
      setModalVisible(false); // Close modal after confirmation
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
            onPress={handleCloseModal}
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
    const handleCloseModal = () => {
      setFormattedList(''); // Clear formattedList to close modal
    };

    return (
      <Modal animationType="Slide" transparent={true} visible={formattedList !== ''}>
        <View style={styles.centeredView}>
          <TouchableOpacity style={styles.centeredView} activeOpacity={1} onPress={handleCloseModal} />
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Today's List:</Text>
            <ScrollView style={styles.modalList}>
              <Text>{formattedList}</Text>
            </ScrollView>
            <TouchableOpacity onPress={handleCloseModal} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );

  };

  // Function to clear the selected items list
  const clearFoodList = () => {
    Alert.alert( // Confirmation alert
      'Clear List',
      'Are you sure you want to clear the current food list?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Clear',
          onPress: () => setSelectedItems({}), // Reset selectedItems
        },
      ]
    );
  };

  
  const ClearListButton = () => {
    return (
      <TouchableOpacity
      style={[styles.floatingButton, styles.clearButton]}
      onPress={clearFoodList}
      activeOpacity={0.7}
      >
        <Image
          source={require('./assets/delete-icon.png')} // Replace with your delete icon
          style={styles.floatingButtonIcon}
          />
      </TouchableOpacity>
    );
    };
    
    const shareFoodList = async () => {
      const formattedItems = {};

      for (const category of foodItems) {
        for (const item of category.items) {
          if (typeof item === 'object') {
            const [brand, subcategories] = Object.entries(item)[0];
            formattedItems[brand] = formattedItems[brand] || {}; 

            for (const subcategory of subcategories) {
              const itemName = brand === 'Soda' ? subcategory : `${subcategory} ${brand}`;
              const quantity = selectedItems[itemName] || 0;

              if (quantity > 0) {
                if (quantity <= 3) {
                  formattedItems[brand][subcategory] = quantity; 
                } else {
                  let remainingQuantity = quantity;
                  let packNumber = 1;

                  while (remainingQuantity > 0) {
                    const packKey = `Pack ${packNumber}`;
                    formattedItems[brand][packKey] = formattedItems[brand][packKey] || {};

                    const currentPackTotal = Object.values(formattedItems[brand][packKey]).reduce((sum, q) => sum + q, 0);
                    const availableSpace = 24 - currentPackTotal;
                    const quantityToAdd = Math.min(remainingQuantity, availableSpace);

                    formattedItems[brand][packKey][subcategory] = 
                      (formattedItems[brand][packKey][subcategory] || 0) + quantityToAdd;

                    remainingQuantity -= quantityToAdd;

                    if (availableSpace === quantityToAdd) {
                      packNumber++;
                    }
                  }
                }
              }
            }
          } else {
            const quantity = selectedItems[item] || 0;
            if (quantity > 0) {
              formattedItems[category.category] = formattedItems[category.category] || {};
              formattedItems[category.category][item] = quantity;
            }
          }
        }
      }

    // Create the formatted string array 
    let formattedListArray = [];

    for (const [brand, itemsData] of Object.entries(formattedItems)) {
      if (Object.keys(itemsData).length > 0) {
        formattedListArray.push(`${brand}:`); 

        for (const [itemName, quantity] of Object.entries(itemsData)) {
          if (itemName.startsWith('Pack')) {
            const packItemsString = Object.entries(quantity).map(([subcat, qty]) => {
              return `${subcat.charAt(0).toUpperCase()}-${qty}`;
            }).join(', ');
            formattedListArray.push(`  ${itemName}: ${packItemsString}`);
          } else {
            formattedListArray.push(`  ${itemName}: ${quantity}`);
          }
        }

        formattedListArray.push(''); // Add a line break between brands
      }
    }
      
      try {
        const result = await Share.share({
          message: formattedListArray.join('\n')
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
        style={styles.floatingButton} 
        onPress={formatFoodList} 
        activeOpacity={0.7} 
      >
        <Image 
          source={require('./assets/eye-icon.png')} 
          style={styles.floatingButtonIcon} 
        />
      </TouchableOpacity>
    );
  };



    // Function to format the selected items list
    const formatFoodList = () => {
      const formattedItems = {};
    
      for (const category of foodItems) {
        for (const item of category.items) {
          if (typeof item === 'object') {
            const [brand, subcategories] = Object.entries(item)[0];
    
            formattedItems[brand] = formattedItems[brand] || {};
    
            const quantitiesToPack = {};
            for (const subcategory of subcategories) {
              const itemName = brand === 'Soda' ? subcategory : `${subcategory} ${brand}`;
              const quantity = selectedItems[itemName] || 0;
    
              if (quantity > 0) {
                if (quantity <= 3) {
                  // Handle quantities 1-3 as individual items
                  formattedItems[brand][subcategory] = quantity;
                } else {
                  // Quantities greater than 3 go into packing logic
                  const initials = subcategory.split(' ').map(word => word.charAt(0).toUpperCase()).join('.');
                  quantitiesToPack[initials] = quantity;
                }
              }
            }
    
            // Pack the items
            formattedItems[brand]['Pack'] = formattedItems[brand]['Pack'] || [];
            let currentPackSpace = 24;
            let currentPackContents = [];
    
            for (const [initials, quantity] of Object.entries(quantitiesToPack)) {
              if (quantity <= currentPackSpace) {
                currentPackContents.push(`${initials}-${quantity}`);
                currentPackSpace -= quantity;
              } else {
                // Fill the current pack
                const quantityToFit = currentPackSpace;
                currentPackContents.push(`${initials}-${quantityToFit}`);
                formattedItems[brand]['Pack'].push(currentPackContents.join(', '));
    
                // Start a new pack
                currentPackContents = [`${initials}-${quantity - quantityToFit}`];
                currentPackSpace = 24 - (quantity - quantityToFit);
              }
            }
    
            // Add the last pack if not empty
            if (currentPackContents.length > 0) {
              formattedItems[brand]['Pack'].push(currentPackContents.join(', '));
            }
    
          } else {
            const quantity = selectedItems[item] || 0;
            if (quantity > 0) {
              formattedItems[category.category] = formattedItems[category.category] || {};
              formattedItems[category.category][item] = quantity;
            }
          }
        }
      }
    
       // Create the formatted string
      // Create the formatted string
  let formattedListString = '';

  for (const [brand, itemsData] of Object.entries(formattedItems)) {
    // Check if the brand/subcategory has any items (individual or in packs)
    const hasItems = 
      Object.keys(itemsData).some(key => key !== 'Pack' && itemsData[key] > 0) || 
      (itemsData['Pack'] && itemsData['Pack'].length > 0);

    // Only add the brand/subcategory if it has items 
    if (hasItems) {
      formattedListString += `${brand}:\n`;

      for (const [itemName, quantity] of Object.entries(itemsData)) {
        if (itemName !== 'Pack') {
          formattedListString += `\t${itemName}: ${quantity}\n`; 
        }
      }

      if (itemsData['Pack'] && itemsData['Pack'].length > 0) {
        for (const packContent of itemsData['Pack']) {
          formattedListString += `\tPack: ${packContent}\n`;
        }
      }
    }
  }

  setFormattedList(formattedListString);
    };

  return (
    <View style={{ flex: 1 }}>
      <FoodFlatList />
      <QuantityModal />
      <FormattedListModal />
      <ClearListButton />
      <ShareListButton/>
      <ViewFormattedListButton />
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
  clearButton: {
    bottom: 100, // Position it above the ViewFormattedListButton 
  },
  shareButton: {
    bottom: 20, // Position in between the other two buttons
  },
})

export default FoodList
