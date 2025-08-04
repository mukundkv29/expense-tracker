import { View, Text, TextInput, Button  } from "react-native";

import { styles } from "../styles/ItemCardStyles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

export default function ItemCard({item, onChangeText, onAdd, refreshTrigger}) {

  const [total, setTotal] = useState(0);

  useEffect(() => {
    async function fetchTotal() {
      try {
        const value = await AsyncStorage.getItem(String(item.name));
        setTotal(value !== null ? parseInt(value) : 0);
      } catch (error) {
        console.log("Error getting total for", item.name, error);
        setTotal(0);
      }
    };
    fetchTotal();
  }, [item.name, refreshTrigger]);

  const formattedTotal = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(total);

  return (
    <View key={item.name} style={styles.container}>
      <View style={styles.leftSection}>
        <Text style={styles.nameText}>{item.name}</Text>
        <Text style={styles.amountText}>{formattedTotal!==null ? formattedTotal : 0}</Text>
      </View>
      <TextInput
        style={styles.input}
        value={item.value}
        keyboardType='numeric'
        inputMode='numeric'
        placeholder="Add"
        placeholderTextColor='#888'
        onChangeText={(text) => onChangeText(item.name, text)}
        onSubmitEditing={() => onAdd(item.name)}
      />
      <Button
        onPress={() => onAdd(item.name)}
        title="Add"
      />
    </View>
  );
}
