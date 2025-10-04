import { View, Text } from 'react-native';
import {
  useNavigation,
} from '@react-navigation/native';
import { Button } from '@react-navigation/elements';

export default function HistoryScreen() {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>History Screen</Text>
      <Button onPress={() => navigation.navigate('Home')}>
        Go to HomeScreen
      </Button>
    </View>
  );
};