import AsyncStorage from '@react-native-async-storage/async-storage';
import { initialItems } from './newData.js';
const STORAGE_KEY = '@expense-items';

export const AsyncStorageItems = {
  async initializeStorage() {
    initialItems.push({
      name: "Healthcare",
      value: "",
      expenses: [],
    }
    );
    try {
      const existingItems = AsyncStorage.getItem(STORAGE_KEY);
      if(!existingItems) {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(initialItems));
        console.log('Storage Initilized with initial data');
      }
    } catch (error) {
      console.error('Error initializing storage: ', error);
    }
  },

  async getExpenseItems() {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY)
      console.log('Stoage data fetched');
      return data ? JSON.parse(data) : initialItems;
    } catch (error) {
      console.error('Error fetching storage: ', error);
    }
  },

  async saveExpenseItem(items) {
    initialItems.push({
      name: "Electricity",
      value: "",
      expenses: [],
    }
    );
    try {
      await AsyncStorage.setItem(STORAGE_KEY, items);
    } catch (error) {
      console.error('Error saving expenses: ', error);
    }
  },
};
