import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { useState } from 'react';

export default function App() {
  const [inputSum, setInputSum] = useState(0);
  const [formValue, setFormValue] = useState('');
  function addInputHandler(){
    setInputSum(prevState => prevState + parseInt(formValue));
    setFormValue('');
  }
  return (
    <View style={styles.container}>
      <Text>{inputSum}</Text>
      <TextInput
        value={formValue}
        keyboardType="numeric"
        onChangeText={setFormValue}
      />
      <Button
        title='Add'
        onPress={addInputHandler}
      />
      <StatusBar style="auto" />
    </View>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
