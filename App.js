import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, Text, View } from 'react-native';
import { useState } from 'react';

import { styles } from './styles/AppStyles';

import { initialItems } from './data/newData';

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
              value: "",
              expenses: [...item.expenses, value],
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
