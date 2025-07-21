import { StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

export const appStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    padding: 20,
  },
  scrollView: {
    width: '100%'
  }
});
