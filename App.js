import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, View } from 'react-native';
import { useEffect, useState } from 'react';

import { AsyncStorageItems } from './data/AsyncStorageItems';
import { useExpenseOperations } from './hooks/useExpenseOperations';
import { calculateMonthlyExpense } from './utils/expenseCalculations';
import { appStyles } from './styles/AppStyles';

import ItemCard from './components/ItemCard';
import MonthSelector from './components/MonthSelector';
import UndoButton from './components/UndoButton';

export default function App() {
  const [items, setItems] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(6);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadExpenseData();
  }, []);

  async function loadExpenseData() {
    try {
      await AsyncStorageItems.initializeStorage();
      const savedItems = AsyncStorageItems.getExpenseItems();
      setItems(savedItems);
    } catch (error) {
      console.error('failed to laod expense data: ', error);
    } finally {
      setIsLoading(false);
    }
  }
  const {
    lastAddedItem,
    handleFormInput,
    addExpenseHandler,
    undoHandler
  } = useExpenseOperations(items, setItems);
  
  function incrementMonthHandler() {
    setSelectedMonth(currentMonth => (currentMonth + 1) % 12);
  };

  const monthlyExpense = calculateMonthlyExpense(items, selectedMonth);

  if(isLoading) {
    <SafeAreaView style={{ flex: 1 }}>
      <View style={[appStyles.container, { justifyContent: 'center' }]}>
        <Text>Loading expenses...</Text>
      </View>
    </SafeAreaView>
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={appStyles.container}>
        <MonthSelector
          selectedMonth={selectedMonth}
          monthlyExpense={monthlyExpense}
          onMonthChange={incrementMonthHandler}
        />

        <UndoButton
          visible={lastAddedItem.length > 0}
          onUndo={undoHandler}
        />

        <ScrollView 
          style={appStyles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          {items.map((item) => (
            <ItemCard
              key={item.name}
              item={item}
              onAdd={addExpenseHandler}
              onChangeText={handleFormInput}
              selectedMonth={selectedMonth}
            />
          ))}
        </ScrollView>
        
        <StatusBar style="auto" />
      </View>
    </SafeAreaView>
  );
}