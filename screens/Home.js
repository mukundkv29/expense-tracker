import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Pressable, Text, View, Platform, KeyboardAvoidingView, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';

import { styles } from '../styles/AppStyles';
import { initialItems } from '../data/newData';
import ItemCard from '../components/ItemCard';
import CalendarModal from '../components/CalendarModal';

import { monthNames } from '../utils/months';

const toastConfig = {
  undoToast: ({ text1, props }) => (
    <View style={{
      height: 60,
      width: '90%',
      backgroundColor: '#333',
      paddingHorizontal: 15,
      paddingVertical: 10,
      borderRadius: 8,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: 20,
    }}>
      <Text style={{
        color: 'white',
        fontSize: 14,
        flex: 1,
      }}>
        {text1}
      </Text>
      <Pressable
        style={{
          backgroundColor: '#4CAF50',
          paddingHorizontal: 12,
          paddingVertical: 6,
          borderRadius: 4,
        }}
        onPress={props.onUndo}
      >
        <Text style={{
          color: 'white',
          fontSize: 12,
          fontWeight: 'bold',
        }}>
          UNDO
        </Text>
      </Pressable>
    </View>
  ),
};

export default function HomeScreen() {
  
  const [items, setItems] = useState(initialItems);
  const [refreshTrigger, setRefreshTrigger] = useState(false);
  const [monthlyExpense, setMonthlyExpense] = useState(0);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [lastAddedExpense, setLastAddedExpense] = useState(null);
  const navigation = useNavigation();

  function handleFormInput(name, text) {
    setItems((prevItems) => 
      prevItems.map((item) => 
        item.name === name ? {...item, value: text} : item 
      )
    );
  };

  async function AddExpenseToAsyncStorage(name, value, month, year) {
    try {
      const storageKey = `${name}_${year}_${month}`;
      const prevValue = await AsyncStorage.getItem(storageKey);
      let total = value;
      if(prevValue !== null) {
        total += parseInt(prevValue);
      }
      console.log("Total expense of ", storageKey, ": ", total);
      await AsyncStorage.setItem(storageKey, String(total));
      const expenseData = {
        storageKey: storageKey,
        expenseAmount: value,
        previousTotal: prevValue ? parseInt(prevValue) : 0
      };
      try {
        const storageArrKey = `array_${name}_${year}_${month}`;
        const prevArray = await AsyncStorage.getItem(storageArrKey);
        const arr = prevArray ? JSON.parse(prevArray) : [];
        arr.push(parseInt(value));
        await AsyncStorage.setItem(storageArrKey, JSON.stringify(arr));
      } catch (error) {
        console.log(`Error in fetching the array of ${name}: `, error);
      }
      setLastAddedExpense(expenseData);
      return expenseData;
    } catch (error) {
      console.log("Error saving expense of item ", key, "...");
      console.log(error);
      throw error;
    }
  }

  async function AddCategoryLog(category, month, year) {
    const key = `log_${category}`;
    try {
      const existing = await AsyncStorage.getItem(key);
      const logs = existing ? JSON.parse(existing) : [];
      // logs.push(logEntry); // logEntry: { amount, date, ... }
      logs.push(year.toString() + "_" + month.toString());
      await AsyncStorage.setItem(key, JSON.stringify(logs));
    } catch (error) {
      console.log(`Error in fetching ${category} logs: `, error);
    }
  }

  async function handleUndoFromToast(expenseDataFromToast) {
    Toast.hide();
    const expenseData = expenseDataFromToast || lastAddedExpense;
    if(!expenseData) {
      Toast.show({
        type: 'error',
        text1: 'Nothing to undo',
        position: 'bottom',
      });
      return;
    }
    
    try {
      const { storageKey, expenseAmount, previousTotal } = expenseData;
      const currentValue = await AsyncStorage.getItem(storageKey);
      
      if(currentValue === null) {
        Toast.show({
          type: 'error',
          text1: 'No data found to undo',
          position: 'bottom',
        });
        return;
      }
      
      const newTotal = parseInt(currentValue) - expenseAmount;
      console.log("Undoing expense. Previous total:", currentValue, "New total:", newTotal);
      
      if(newTotal <= 0) {
        await AsyncStorage.removeItem(storageKey);
        console.log("Removed item from storage as total became 0 or negative");
      } else {
        await AsyncStorage.setItem(storageKey, String(newTotal));
      }
      
      setLastAddedExpense(null);
      setRefreshTrigger(prev => !prev);
      
      Toast.show({
        type: 'success',
        text1: 'Expense undone successfully',
        position: 'bottom',
      });
    } catch (error) {
      console.log("Error while doing undo...");
      console.log(error);
      Toast.show({
        type: 'error',
        text1: 'Failed to undo expense',
        position: 'bottom',
      });
    }
  }

  function AddExpenseHandler(name, date) {
    const item = items.find(item => item.name === name);
    const value = parseInt(item.value, 10);
    if(isNaN(value) || value <=0 ) {
      Toast.show({
        type: 'error',
        text1: 'Please enter a valid number',
        position: 'bottom',
      });
      return;
    }

    console.log("Starting to save data of ", name, "...");
    AddExpenseToAsyncStorage(name, value, date.getMonth(), date.getFullYear())
      .then((expenseData) => {
        console.log("Data of ", name, " added to Async-storage...");
        setRefreshTrigger(prev => prev ? false : true);
        setItems((prevItems) =>
          prevItems.map((item) =>
            item.name === name ? {...item, value: ""} : item
          )
        );
        AddCategoryLog(name, date.getMonth(), date.getFullYear());
        Toast.show({
          type: 'undoToast',
          text1: `₹${value} added to ${name}`,
          position: 'bottom',
          visibilityTime: 5000,
          props: {
            onUndo: () => handleUndoFromToast(expenseData),
          }
        });
      })
      .catch(error => {
        console.log("Error saving data of ", name, " to Async-storage...");
        console.log(error);
        Toast.show({
          type: 'error',
          text1: 'Failed to save the expense',
          position: 'bottom'
        });
      });
  }
  
  // async function handleClearAsyncStorage() {
  //   try {
  //     const allKeys = await AsyncStorage.getAllKeys();
  //     const currentMonthKeys = allKeys.filter(key => 
  //       key.endsWith(`_${selectedYear}_${selectedMonth}`)
  //     );
      
  //     if (currentMonthKeys.length > 0) {
  //       await AsyncStorage.multiRemove(currentMonthKeys);
  //       setRefreshTrigger(prev => prev ? false : true);
  //       console.log('AsyncStorage cleared for current month/year successfully!!!');
  //     }
  //   } catch (error) {
  //     console.error('Error clearing AsyncStorage...', error);
  //   }
  // };

  async function calculateMonthlyExpense() {
    try {
      let total = 0;
      for (const item of items) {
        const storageKey = `${item.name}_${selectedYear}_${selectedMonth}`;
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

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setRefreshTrigger(prev => !prev);
    });
    return unsubscribe;
  }, [navigation]);

  const handleMonthYearSelect = (month, year) => {
    setSelectedMonth(month);
    setSelectedYear(year);
    setShowCalendar(false);
  };

  let formattedCurrency = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(monthlyExpense);

  function handleCategoryPress(categoryName) {
    navigation.navigate('CategoryHistory', {category: categoryName});
  }

  return (
    <SafeAreaView style={{flex: 1}} edges={['top']}>
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

        {/* Clear All Expenses Button
        <Pressable
          style={{
            backgroundColor: '#e53935',
            padding: 12,
            borderRadius: 8,
            alignItems: 'center',
            marginVertical: 10,
            width: '94%',
            alignSelf: 'center'
          }}
          onPress={handleClearAsyncStorage}
        >
          <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>
            Clear All Expenses
          </Text>
        </Pressable> */}

        <KeyboardAvoidingView 
          style={{flex: 1, width: '94%'}} 
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingBottom: 50 }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps='handled'
            keyboardDismissMode='on-drag'
          >
            {items.map((item) => (
              <Pressable
                key={item.name}
                onPress={() => handleCategoryPress(item.name)}
                style={{marginBottom: 8}}
              >
                <ItemCard
                  key={item.name}
                  item={item}
                  onAdd={AddExpenseHandler}
                  onChangeText={handleFormInput}
                  refreshTrigger={refreshTrigger}
                  selectedMonth={selectedMonth}
                  selectedYear={selectedYear}
                />
              </Pressable>
            ))}
          </ScrollView>
        </KeyboardAvoidingView>

        <StatusBar style="auto" />
        <Toast config={toastConfig} />
      </View>
    </SafeAreaView>
  );
}
