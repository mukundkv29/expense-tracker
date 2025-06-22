import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
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
        if (item.name === name) {
          const value = parseInt(item.value, 10);
          if(!isNaN(value)) {
            return {
              ...item, 
              total: item.total+value,
              value: ""
            }
          }
        }
        return item;
      })
    );
  };
  let MonthlyExpense = items.reduce((sum, item) => sum+item.total, 0);
  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.container}>

        {/* MonthlyExpense */}
        <View style={styles.monthlyExpenseCard}>
          <View style={styles.amountSection}>
            <Text style={styles.amountText}>{MonthlyExpense}</Text>
          </View>
          <View style={styles.monthSection}>
            <Text style={styles.monthText}>June 2025</Text>
          </View>
        </View>

        {/* List Items */}
        {items.map((item) => (
          <View key={item.name} style={{marginTop: 40}}>
            <Text>{item.name}</Text>
            <Text>{item.total}</Text>
            <TextInput
              value={item.value}
              onChangeText={(text) => handleFormInput(item.name, text)}
              keyboardType='numeric'
              inputMode='numeric'
              onSubmitEditing={() => AddExpenseHandler(item.name)}
            />
            <Button
              title='Add'
              onPress={() => AddExpenseHandler(item.name)}
            />
          </View>
        ))}
        <StatusBar style="auto" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    padding: 20,
  },
  monthlyExpenseCard: {
    backgroundColor: '#f5f5f5',
    borderRadius: 15,
    padding: 16,
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 14,
    width: 350,
    height: 110,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center'
  },
  amountSection: {
    flex: 4,
    borderColor: '#ccc',
    borderRightWidth: 2,
    width: '70%',
    justifyContent: 'flex-end'
  },
  amountText: {
    fontWeight: 'bold',
    fontSize: 50,
    width: '100%'
  },
  monthSection: {
    flex: 1,
    paddingLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  monthText: {
    fontSize: 16,
    color: '#555'
  },
});
