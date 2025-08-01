import { View, Text, TextInput, Button  } from "react-native";

import { styles } from "../styles/ItemCardStyles";

function formattedTotal(total) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(total);
}

export default function ItemCard({item, onChangeText, onAdd}) {
  return (
    <View key={item.name} style={styles.container}>
      <View style={styles.leftSection}>
        <Text style={styles.nameText}>{item.name}</Text>
        <Text style={styles.amountText}>{formattedTotal(item.total)}</Text>
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
