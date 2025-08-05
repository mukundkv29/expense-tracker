import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, ScrollView, Text, ToastAndroid, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useEffect, useState } from 'react';

import { styles } from './styles/AppStyles';
import { initialItems } from './data/newData';
import ItemCard from './components/ItemCard';

export default function App() {
  
  const [items, setItems] = useState(initialItems);
  const [refreshTrigger, setRefreshTrigger] = useState(false);
  const [monthlyExpense, setMonthlyExpense] = useState(0);
  
  function handleFormInput(name, text) {
    setItems((prevItems) => 
      prevItems.map((item) => 
        item.name === name ? {...item, value: text} : item 
      )
    );
  };

  async function AddExpenseToAsyncStorage(key, value) {
    try {
      const prevValue = await AsyncStorage.getItem(String(key));
      let total = value;
      if(prevValue !== null) {
        total += parseInt(prevValue);
      }
      console.log("Total expense of ", key, ": ", total);
      await AsyncStorage.setItem(String(key), String(total));
    } catch (error) {
      console.log("Error saving expense of item ", key, "...");
      console.log(error);
    }
  }

  function AddExpenseHandler(name) {
    const item = items.find(item => item.name === name);
    const value = parseInt(item.value, 10);
    if(isNaN(value) || value <=0 ) {
      ToastAndroid.show("Please Enter a valid number", ToastAndroid.SHORT);
      return;
    }

    console.log("Starting to save data of ", name, "...");
    AddExpenseToAsyncStorage(name, value)
      .then(() => {
        console.log("Data of ", name, " added to Async-storage...");
        setRefreshTrigger(prev => prev ? false : true);
        setItems((prevItems) =>
          prevItems.map((item) =>
            item.name === name ? {...item, value: ""} : item
          )
        );
      })
      .catch(error => {
        console.log("Error saving data of ", name, " to Async-storage...");
        console.log(error);
      });
  };
  
  async function handleClearAsyncStorage() {
    try {
      await AsyncStorage.clear();
      setRefreshTrigger(prev => prev ? false : true);
      console.log('AsyncStorage cleared successfully!!!');
    } catch (error) {
      console.error('Error clearing AsyncStorage...', error);
    }
  };

  async function calculateMonthlyExpense() {
    try {
      let total = 0;
      for (const item of items) {
        const storedValue = await AsyncStorage.getItem(String(item.name));
        if (storedValue !== null) {
          total += parseInt(storedValue, 10);
        }
      }
      setMonthlyExpense(total);
      console.log("Total monthly expense calculated: ", total);
    } catch (error) {
      console.log("Error calculating monthly expense: ", error);
    }
  }

  useEffect(() => {
    calculateMonthlyExpense();
  }, [refreshTrigger]);

  let formattedCurrency = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(monthlyExpense);

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.container}>

        {/* MonthlyExpense */}
        <View style={styles.monthlyExpenseCard}>
          <View style={styles.amountSection}>
            <Text style={styles.amountText}>{formattedCurrency}</Text>
          </View>
          <View style={styles.monthSection}>
            <Text style={styles.monthText}>June 2025</Text>
          </View>
        </View>
        <Button
          onPress={handleClearAsyncStorage}
          title='Clear All Expenses'
        />
        {/* List Items */}
        <ScrollView 
          style={{
            width: '94%'
          }}
          showsVerticalScrollIndicator={false}
          keyboardDismissMode='on-drag'
          keyboardShouldPersistTaps='handled'
        >
          {items.map((item) => (
            <ItemCard
              key={item.name}
              item={item}
              onAdd={AddExpenseHandler}
              onChangeText={handleFormInput}
              refreshTrigger={refreshTrigger}
            />
          ))}
        </ScrollView>
        <StatusBar style="auto" />
      </View>
    </SafeAreaView>
  );
}
