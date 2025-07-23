import { useState } from 'react';
import { ToastAndroid } from 'react-native';

export function useExpenseOperations(items, setItems) {
  const [lastAddedItem, setLastAddedItem] = useState('');

  function showUndoToast() {
    ToastAndroid.show('Expense Added!\nTap UNDO if needed!', ToastAndroid.LONG);
  };

  function showItemRemovedToast() {
    ToastAndroid.show('Last Added Expense removed', ToastAndroid.SHORT);
  };

  function handleFormInput(name, text) {
    setItems((prevItems) => 
      prevItems.map((item) => 
        item.name === name ? {...item, value: text} : item 
      )
    );
  };
  
  function addExpenseHandler(name, selectedDate) {
    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.name === name) {
          const amount = parseInt(item.value, 10);
          if (!isNaN(amount)) {
            setLastAddedItem(item.name);
            return {
              ...item,
              value: "",
              expenses: [...item.expenses, {
                amount: amount,
                month: selectedDate.getMonth(),
              }],
            };
          }
        }
        return item;
      })
    );
    
    setTimeout(() => {
      setLastAddedItem('');
    }, 11000);
    
    showUndoToast();
  };

  function undoHandler() {
    if (lastAddedItem.length === 0) return;
    
    setItems((prevItems) => 
      prevItems.map((item) => {
        if (item.name === lastAddedItem) {
          let newExpenses = [...item.expenses];
          if (newExpenses.length <= 0) {
            return item;
          }
          newExpenses.pop();
          showItemRemovedToast();
          return {
            ...item,
            expenses: newExpenses,
          };
        }
        return item;
      })
    );
    setLastAddedItem('');
  };

  return {
    lastAddedItem,
    handleFormInput,
    addExpenseHandler,
    undoHandler
  };
};
