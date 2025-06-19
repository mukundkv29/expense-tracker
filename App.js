import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, TextInput, ToastAndroid, View } from 'react-native';
import { useState } from 'react';

export default function App() {

  const [items, setItems] = useState([
    {
      name: "Groceries",
      value: "",
      total: 0,
    },
    {
      name: "Electronics",
      value: "",
      total: 0,
    },
    {
      name: "Sports",
      value: "",
      total: 0,
    },
  ]);

  function handleFormInput(name, text) {
    setItems((prevItems) => 
      prevItems.map((item) => 
        item.name === name ? {...item, value: text} : item
      )
    );
  };

  function AddExpenseHandler(name) {
    setItems((prevItems) =>
      prevItems.map((item) => {
        const value = parseInt(item.value);
        return item.name === name ? {...item, total: item.total+value, value: ""} : item
      }
      )
    );
  };

  return (
    <View style={styles.container}>
      <Text>Hello world</Text>
      {items.map((item) => (
        <View key={item.name} style={{marginTop: 40}}>
          <Text>{item.name}</Text>
          <Text>{item.total}</Text>
          <TextInput
            value={item.value}
            onChange={(text) => handleFormInput(item.name, text)}
            keyboardType='numeric'
          />
          <Button
            title='Add'
            onPress={() => AddExpenseHandler(item.name)}
          />
        </View>
      ))}
      <StatusBar style="auto" />
    </View>
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
