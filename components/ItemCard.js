import { View, Text, TextInput, Button, Pressable } from "react-native";
import { useEffect, useState } from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";

import { styles } from "../styles/ItemCardStyles";

export default function ItemCard({
  item, 
  onChangeText, 
  onAdd, 
  refreshTrigger, 
  selectedMonth, 
  selectedYear
}) {

  const [total, setTotal] = useState(0);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    async function fetchTotal() {
      try {
        const storageKey = `${item.name}_${selectedYear}_${selectedMonth}`;
        const value = await AsyncStorage.getItem(storageKey);
        setTotal(value !== null ? parseInt(value) : 0);
      } catch (error) {
        console.log("Error getting total for", item.name, error);
        setTotal(0);
      }
    };
    fetchTotal();
  }, [item.name, refreshTrigger, selectedMonth, selectedYear]);

  function onDateChange(event, date) {
    setShowDatePicker(false);
    if(date) {
      setSelectedDate(date);
    }
  }

  const formattedTotal = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(total);

  return (
    <View key={item.name} style={styles.container}>
      <View style={styles.leftSection}>
        <Text style={styles.nameText}>{item.name}</Text>
        <Text style={styles.amountText}>{formattedTotal !== null ? formattedTotal : '₹0'}</Text>
      </View>
      <TextInput
        style={styles.input}
        value={item.value}
        keyboardType='numeric'
        inputMode='numeric'
        placeholder="Add"
        placeholderTextColor='#888'
        onChangeText={(text) => onChangeText(item.name, text)}
        onSubmitEditing={() => onAdd(item.name, selectedDate)}
      />
      <Pressable
        onPress={() => setShowDatePicker(true)}
        style={styles.calendarButton}
      >
        <Text style={styles.calendarText}>📅</Text>
      </Pressable>
      <Button
        onPress={() => onAdd(item.name, selectedDate)}
        title="Add"
      />
      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode='date'
          onChange={onDateChange}
        />
      )}
    </View>
  );
}
