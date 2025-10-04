import { View, Text } from 'react-native';
import { useRoute } from '@react-navigation/native';

export default function CategoryHistoryScreen() {
  const route = useRoute();
  const { category } = route.params;

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: 22, fontWeight: 'bold' }}>Category History</Text>
      <Text style={{ fontSize: 18, marginTop: 16 }}>Category: {category}</Text>
    </View>
  );
}
