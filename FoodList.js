import React, { useState, useEffect, useRef } from 'react'
import * as Animatable from 'react-native-animatable';

import {
  View,
  TextInput,
  Text,
  FlatList,
  Modal,
  StyleSheet,
  TouchableOpacity
} from 'react-native'

function getColor() {
  return (
    'hsl(' +
    (180 + 120 * Math.random()) +
    ',' +
    (70 + 20 * Math.random()) +
    '%,' +
    (40 + 10 * Math.random()) +
    '%)'
  )
}
// const foodItems = [
//     { category: "Fruits", items: ["Apple", "Banana", "Orange"] },
//     { category: "Vegetables", items: ["Carrot", "Broccoli", "Spinach"] },
//     // Add more categories and items
// ];

const FoodList = ({ foodItems }) => {
  //react variables
  const [modalVisible, setModalVisible] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [color, setColor] = useState(null)
  const [coloredCategories, setColoredCategories] = useState([])
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
        <Text style={[styles.category, { color: item.color }]}>
          {item.category}
        </Text>

        {item.items.map((food) => (
          <TouchableOpacity
            style={[styles.itemContainer, { backgroundColor: item.color }]}
            key={food}
            onPress={() => {
              setColor(item.color)
              setSelectedItem(food)
              setModalVisible(true)
              //delay
              setTimeout(() => {
                inputRef.current.focus()
              }, 250)
            }}
          >
            <Text style={styles.item}>{food}</Text>
          </TouchableOpacity>
        ))}
      </View>
    )

    return (
      <FlatList
        data={coloredCategories}
        renderItem={renderItem}
        keyExtractor={(item) => item.category}
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
    }

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

  return (
    <View>
      <FoodFlatList />
      <QuantityModal />
    </View>
  )
}

const styles = StyleSheet.create({
  category: {
    fontSize: 20,
    padding: 10,
    fontWeight: 'bold'
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
    elevation: 5
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
  }
})

export default FoodList
