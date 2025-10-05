import { View, Text } from 'react-native';
import { useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';

export default function CategoryHistoryScreen() {
  const route = useRoute();
  const { category } = route.params;

  async function getCategoryLogs(category) {
    const key = `log_${category}`;
    try {
      const existing = await AsyncStorage.getItem(key);
      return existing ? JSON.parse(existing) : [];
    } catch (e) {
      console.error(`Error in fetching ${category} Logs`, e);
      return [];
    }
  }

  useEffect(() => {
    getCategoryLogs(category).then(logs => {
      console.log('Category Logs: ', logs);
    })
  }, [category]);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: 22, fontWeight: 'bold' }}>Category History</Text>
      <Text style={{ fontSize: 18, marginTop: 16 }}>Category: {category}</Text>
    </View>
  );
}
