import { StyleSheet, View, Text, TextInput, Button } from "react-native";

export default function ItemCard({item, onChangeText, onAdd}) {
  return (
    <View key={item.name} style={styles.container}>
      <Text>{item.name}</Text>
      <Text>{item.total}</Text>
      <TextInput
        value={item.value}
        keyboardType='numeric'
        inputMode='numeric'
        onChangeText={(text) => onChangeText(item.name, text)}
        onSubmitEditing={() => onAdd(item.name)}
      />
      <Button
        title="Add"
        onPress={() => onAdd(item.name)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    borderWidth: 3,
    borderColor: 'black',
    width: '100%',
  },
})