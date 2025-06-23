import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useState } from 'react';

import { initialItems } from './data/data';

import ItemCard from './components/ItemCard';

export default function App() {
  
  const [items, setItems] = useState(initialItems);
  
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
          <View style={styles.monthSection}>
            <Text style={styles.monthText}>June 2025</Text>
          </View>
        </View>

        {/* List Items */}
        <ScrollView 
          style={{
            width: '94%'
          }}
          showsVerticalScrollIndicator={false}
        >
          {items.map((item) => (
            <ItemCard
              key={item.name}
              item={item}
              onAdd={AddExpenseHandler}
              onChangeText={handleFormInput}
            />
          ))}
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
    height: 100,
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
    fontSize: 40,
    width: '100%',
    paddingLeft: 5
  },
  monthSection: {
    flex: 1,
    paddingLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  monthText: {
    fontSize: 16,
    padding: 10,
    color: '#555'
  },
});
