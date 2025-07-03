import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, ScrollView, StyleSheet, Text, ToastAndroid, TouchableOpacity, View } from 'react-native';
import { useState } from 'react';

import { initialItems } from './data/newData';

import ItemCard from './components/ItemCard';

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export default function App() {
  
  const [items, setItems] = useState(initialItems);
  const [lastAddedItem, setLastAddedItem] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(7);
  
  function handleFormInput(name, text) {
    setItems((prevItems) => 
      prevItems.map((item) => 
        item.name === name ? {...item, value: text} : item 
      )
    );
  };

  const showUndoToast = () => {
    ToastAndroid.show('Expense Added!\nTap UNDO if needed!', ToastAndroid.LONG);
  };
  const showItemRemovedToast = () => {
    ToastAndroid.show('Last Added Expense removed', ToastAndroid.SHORT);
  };

  function AddExpenseHandler(name, selectedDate) {
    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.name === name) {
          const amount = parseInt(item.value, 10);
          // const currentDate = new Date();
          if(!isNaN(amount)) {
            setLastAddedItem(item.name);
            return {
              ...item,
              value: "",
              expenses: [...item.expenses, {
                amount: amount,
                month: selectedDate.getMonth(),
              }],
            }
          }
        }
        console.log(item.expenses);
        return item;
      })
    );
    setTimeout(() => {
      setLastAddedItem('');
    }, 11000);
    showUndoToast();
  };

  function UndoHandler() {
    if(lastAddedItem.length === 0)
      return;
    setItems((prevItems) => 
      prevItems.map((item) => {
        if(item.name === lastAddedItem) {
          let newExpenses = [...item.expenses];
          if(newExpenses.length <= 0) {
            return item;
          }
          newExpenses.pop();
          showItemRemovedToast();
          return {
            ...item,
            expenses: newExpenses,
          }
        }
        return item;
      })
    );
    setLastAddedItem('');
  }

  function incrementMonthHandler() {
    setSelectedMonth(currentMonth => (currentMonth+1)%12);
  }

  let MonthlyExpense = items.reduce((sum, item) => {
      let total=0;
      item.expenses.forEach(expense => {
          if(expense.month === selectedMonth) 
            total += expense.amount;
        }
      );
      return sum+total;
    }
  , 0);
  let formattedCurrency = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(MonthlyExpense);

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.container}>

        {/* MonthlyExpense */}
        <View style={styles.monthlyExpenseCard}>
          <View style={styles.amountSection}>
            <Text style={styles.amountText}>{formattedCurrency}</Text>
          </View>
          {/* <View style={styles.monthSection}> */}
          <TouchableOpacity
            onPress={incrementMonthHandler}
            style={styles.monthSection}
          >
            <Text style={styles.monthText}>{monthNames[selectedMonth]}</Text>
            <Text style={{color: '#854d0d'}}>2025</Text>
          </TouchableOpacity>
          {/* </View> */}
        </View>

        {/* undoButton */}
        {lastAddedItem.length > 0 &&
          <Button
            title='Undo'
            onPress={UndoHandler}
          />
        }

        {/* List Items */}
        <ScrollView 
          style={{
            width: '100%'
          }}
          showsVerticalScrollIndicator={false}
        >
          {items.map((item) => {
            return <ItemCard
              key={item.name}
              item={item}
              onAdd={AddExpenseHandler}
              onChangeText={handleFormInput}
              selectedMonth={selectedMonth}
            />;
          })}
        </ScrollView>
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
    backgroundColor: '#f8f7de',
    borderRadius: 15,
    padding: 16,
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowColor: '#3a200c',
    elevation: 14,
    width: 350,
    height: 100,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20
  },
  amountSection: {
    flex: 13,
    borderColor: '#d29d30',
    borderRightWidth: 2,
    width: '70%',
    justifyContent: 'flex-end'
  },
  amountText: {
    fontWeight: 'bold',
    fontSize: 40,
    width: '100%',
    paddingLeft: 5,
    color: '#3a200c',
  },
  monthSection: {
    flex: 6,
    paddingLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  monthText: {
    fontSize: 16,
    color: '#854d0d',
  },
});
