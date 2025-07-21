import { View, Text, TouchableOpacity } from 'react-native';
import { MONTH_NAMES } from '../constants';
import { formatCurrency } from '../utils/formatCurrency';
import { monthSelectorStyles } from '../styles/MonthSelectorStyles';

const MonthSelector = ({ selectedMonth, monthlyExpense, onMonthChange }) => {
  return (
    <View style={monthSelectorStyles.monthlyExpenseCard}>
      <View style={monthSelectorStyles.amountSection}>
        <Text style={monthSelectorStyles.amountText}>
          {formatCurrency(monthlyExpense)}
        </Text>
      </View>
      <TouchableOpacity
        onPress={onMonthChange}
        style={monthSelectorStyles.monthSection}
      >
        <Text style={monthSelectorStyles.monthText}>
          {MONTH_NAMES[selectedMonth]}
        </Text>
        <Text style={monthSelectorStyles.yearText}>2025</Text>
      </TouchableOpacity>
    </View>
  );
};

export default MonthSelector;
