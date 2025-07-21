import { StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

export const monthSelectorStyles = StyleSheet.create({
  monthlyExpenseCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: 15,
    padding: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 14,
    width: 350,
    height: 100,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20
  },
  amountSection: {
    flex: 13,
    borderColor: colors.accent,
    borderRightWidth: 2,
    width: '70%',
    justifyContent: 'flex-end'
  },
  amountText: {
    fontWeight: 'bold',
    fontSize: 40,
    width: '100%',
    paddingLeft: 5,
    color: colors.primary,
  },
  monthSection: {
    flex: 6,
    paddingLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  monthText: {
    fontSize: 16,
    color: colors.secondary,
  },
  yearText: {
    color: colors.secondary
  }
});
