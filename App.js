import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Pressable, Text, ToastAndroid, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useEffect, useState } from 'react';

import { styles } from './styles/AppStyles';
import { initialItems } from './data/newData';
import ItemCard from './components/ItemCard';
import CalendarModal from './components/CalendarModal';

import { monthNames } from './utils/months';

export default function App() {
  
  const [items, setItems] = useState(initialItems);
  const [refreshTrigger, setRefreshTrigger] = useState(false);
  const [monthlyExpense, setMonthlyExpense] = useState(0);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  function handleFormInput(name, text) {
    setItems((prevItems) => 
      prevItems.map((item) => 
        item.name === name ? {...item, value: text} : item 
      )
    );
  };

  async function AddExpenseToAsyncStorage(key, value, month, year) {
    try {
      const storageKey = `${key}_${month}_${year}`;
      const prevValue = await AsyncStorage.getItem(storageKey);
      let total = value;
      if(prevValue !== null) {
        total += parseInt(prevValue);
      }
      console.log("Total expense of ", storageKey, ": ", total);
      await AsyncStorage.setItem(storageKey, String(total));
    } catch (error) {
      console.log("Error saving expense of item ", key, "...");
      console.log(error);
    }
  }

  function AddExpenseHandler(name, date) {
    const item = items.find(item => item.name === name);
    const value = parseInt(item.value, 10);
    if(isNaN(value) || value <=0 ) {
      ToastAndroid.show("Please Enter a valid number", ToastAndroid.SHORT);
      return;
    }

    console.log("Starting to save data of ", name, "...");
    AddExpenseToAsyncStorage(name, value, date.getMonth(), date.getFullYear())
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
      const allKeys = await AsyncStorage.getAllKeys();
      const currentMonthKeys = allKeys.filter(key => 
        key.endsWith(`_${selectedMonth}_${selectedYear}`)
      );
      
      if (currentMonthKeys.length > 0) {
        await AsyncStorage.multiRemove(currentMonthKeys);
        setRefreshTrigger(prev => prev ? false : true);
        console.log('AsyncStorage cleared for current month/year successfully!!!');
      }
    } catch (error) {
      console.error('Error clearing AsyncStorage...', error);
    }
  };

  async function calculateMonthlyExpense() {
    try {
      let total = 0;
      for (const item of items) {
        const storageKey = `${item.name}_${selectedMonth}_${selectedYear}`;
        const storedValue = await AsyncStorage.getItem(storageKey);
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
  }, [refreshTrigger, selectedMonth, selectedYear]);

  const handleMonthYearSelect = (month, year) => {
    setSelectedMonth(month);
    setSelectedYear(year);
    setShowCalendar(false);
  };

  let formattedCurrency = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(monthlyExpense);

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.container}>

        <CalendarModal 
          visibility={showCalendar}
          month={selectedMonth}
          year={selectedYear}
          onMonthYearSelect={handleMonthYearSelect}
          onClose={() => setShowCalendar(false)}
        />

        {/* MonthlyExpense */}
        <View style={styles.monthlyExpenseCard}>
          <View style={styles.amountSection}>
            <Text style={styles.amountText}>{formattedCurrency}</Text>
          </View>
          <View style={styles.monthSection}>
            <Pressable
              onPress={() => setShowCalendar(true)}
            >
              <Text style={styles.monthText}>
                {monthNames[selectedMonth]} {selectedYear}
              </Text>
            </Pressable>
          </View>
        </View>
        <Button
          onPress={handleClearAsyncStorage}
          title={`Clear ${monthNames[selectedMonth]} ${selectedYear} Expenses`}
        />
        {/* List Items */}
        <KeyboardAwareScrollView
          style={{ width: '94%' }}
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps='handled'
          enableOnAndroid={true}
          extraScrollHeight={100}
          keyboardDismissMode='on-drag'
        >
          {items.map((item) => (
            <ItemCard
              key={item.name}
              item={item}
              onAdd={AddExpenseHandler}
              onChangeText={handleFormInput}
              refreshTrigger={refreshTrigger}
              selectedMonth={selectedMonth}
              selectedYear={selectedYear}
            />
          ))}
        </KeyboardAwareScrollView>

        <StatusBar style="auto" />
      </View>
    </SafeAreaView>
  );
}
