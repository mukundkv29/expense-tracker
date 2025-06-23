import { StyleSheet, View, Text, TextInput, Button  } from "react-native";

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

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#d1eaa3',
    marginTop: 40,
    borderWidth: 3,
    borderColor: '#222',
    borderWidth: 1,
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
    color: '#222',
    marginBottom: 4,
  },
  amountText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
  },
  input: {
    flex: 1,
    borderBottomWidth: 2,
    borderBottomColor: 'orange',
    paddingHorizontal: 5,
    marginHorizontal: 10,
    fontSize: 16,
    minWidth: 50,
  }
})