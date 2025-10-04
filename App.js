import HomeScreen from './screens/Home';
import CategoryHistoryScreen from './screens/CategoryHistory';
import { createStaticNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const RootStack = createNativeStackNavigator({
  screens: {
    Home: HomeScreen,
    CategoryHistory: CategoryHistoryScreen,
  },
});

const Navigation = createStaticNavigation(RootStack);

export default function App() {
  return <Navigation />;
}
