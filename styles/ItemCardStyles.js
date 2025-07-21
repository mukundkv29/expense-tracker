import { StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

export const itemCardStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.itemBackground,
    marginTop: 30,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 5,
    padding: 10,
    marginHorizontal: 5,
    justifyContent: 'space-between',
  },
  leftSection: {
    flex: 2,
    flexDirection: 'column',
    marginRight: 10,
  },
  nameText: {
    fontSize: 16,
    color: colors.primary,
    marginBottom: 4,
  },
  amountText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.primary,
  },
  input: {
    flex: 1,
    paddingHorizontal: 5,
    marginHorizontal: 10,
    fontSize: 16,
    minWidth: 15,
    borderColor: colors.accent,
    borderWidth: 1,
    borderRadius: 7,
    textAlign: 'center'
  },
  calendarButton: {
    marginRight: 10,
    padding: 6,
    borderWidth: 1,
    borderColor: colors.accent,
    borderRadius: 5,
    backgroundColor: colors.buttonBackground,
  },
  calendarText: {
    fontSize: 20,
  },
});
