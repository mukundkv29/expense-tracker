import { createStaticNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './screens/Home';
import HistoryScreen from './screens/History';

const RootStack = createNativeStackNavigator({
  initialRouteName: 'History',
  screens: {
    Home: HomeScreen,
    History: HistoryScreen,
  },
});

const Navigation = createStaticNavigation(RootStack);

export default function App() {
  return <Navigation />;
}
