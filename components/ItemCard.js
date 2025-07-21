import { useState } from "react";
import { View, Text, TextInput, Button, Pressable } from "react-native";
import DateTimePicker from '@react-native-community/datetimepicker';
import { formatCurrency } from '../utils/formatCurrency';
import { calculateItemMonthlyTotal } from '../utils/expenseCalculations';
import { itemCardStyles } from '../styles/ItemCardStyles';
import { colors } from '../theme/colors';

const ItemCard = ({ item, onChangeText, onAdd, selectedMonth }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);

  const addExpenseHandler = () => {
    onAdd(item.name, selectedDate);
  };

  const monthlyExpense = calculateItemMonthlyTotal(item.expenses, selectedMonth);

  const onDateChange = (event, date) => {
    setShowCalendar(false);
    if (date) {
      setSelectedDate(date);
      console.log("Selected Date:", date.toDateString());
    }
  };

  return (
    <View style={itemCardStyles.container}>
      <View style={itemCardStyles.leftSection}>
        <Text style={itemCardStyles.nameText}>{item.name}</Text>
        <Text style={itemCardStyles.amountText}>
          {formatCurrency(monthlyExpense)}
        </Text>
      </View>
      <TextInput
        style={itemCardStyles.input}
        value={item.value}
        keyboardType='numeric'
        inputMode='numeric'
        placeholder="Add"
        placeholderTextColor={colors.placeholder}
        onChangeText={(text) => onChangeText(item.name, text)}
        onSubmitEditing={addExpenseHandler}
      />
      <Pressable
        onPress={() => setShowCalendar(true)}
        style={itemCardStyles.calendarButton}
      >
        <Text style={itemCardStyles.calendarText}>📅</Text>
      </Pressable>
      <Button
        onPress={addExpenseHandler}
        title="Add"
      />
      {showCalendar && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          onChange={onDateChange}
        />
      )}
    </View>
  );
};

export default ItemCard;
