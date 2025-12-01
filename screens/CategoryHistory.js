import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Modal, TextInput, Pressable, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { monthNames } from '../utils/months';

export default function CategoryHistoryScreen({ route }) {

  const category = route?.params?.category ?? '';
  const categoryName = typeof category === 'string' ? category : JSON.stringify(category);
  const [logs, setLogs] = useState([]);
  const [actionModalVisible, setActionModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [editValue, setEditValue] = useState('');
  useEffect(() => {
    async function fetchLogs() {
      try {
        const logKey = `log_${categoryName}`;
        const existingLog = await AsyncStorage.getItem(logKey);
        const log = existingLog ? JSON.parse(existingLog) : [];

        const uniqueMonths = Array.from(new Set(log));
        const localLogs = [];

        for (const month of uniqueMonths) {
          if (typeof month !== 'string') continue;
          const storageKey = `array_${categoryName}_` + month;
          try {
            const prevValue = await AsyncStorage.getItem(storageKey);
            if (prevValue !== null) {
              const expenses = JSON.parse(prevValue);
              localLogs.push({ month, expenses });
            }
          } catch (error) {
            console.log(`Error in fetching prev month logs: `, error);
          }
        }
        localLogs.sort((a, b) => {
          const [ay, am] = a.month.split('_').map(s => parseInt(s, 10));
          const [by, bm] = b.month.split('_').map(s => parseInt(s, 10));
          if (ay !== by) return by - ay;
          return bm - am;
        });

        setLogs(localLogs);
      } catch (error) {
        console.log(`Error in retrieving ${categoryName} logs: `, error);
      }
    }

    fetchLogs();
  }, [categoryName]);

  const currencyFormatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  });

  async function handleDeleteExpense() {
    if (!selectedExpense) return;
    const { month, index } = selectedExpense;
    const storageArrKey = `array_${categoryName}_` + month;
    const parts = String(month).split('_');
    const yearStr = parts[0];
    const monthIdxStr = parts[1];
    const storageKey = `${categoryName}_${yearStr}_${monthIdxStr}`;
    const logKey = `log_${categoryName}`;

    try {
      const arrStr = await AsyncStorage.getItem(storageArrKey);
      const arr = arrStr ? JSON.parse(arrStr) : [];
      if (!Array.isArray(arr)) return;

      arr.splice(index, 1);

      if (arr.length === 0) {
        await AsyncStorage.removeItem(storageArrKey);
        await AsyncStorage.removeItem(storageKey);

        const logStr = await AsyncStorage.getItem(logKey);
        const logArr = logStr ? JSON.parse(logStr) : [];
        const filtered = logArr.filter(m => m !== month);
        if (filtered.length === 0) {
          await AsyncStorage.removeItem(logKey);
        } else {
          await AsyncStorage.setItem(logKey, JSON.stringify(filtered));
        }

        setLogs(prev => prev.filter(l => l.month !== month));
      } else {
        await AsyncStorage.setItem(storageArrKey, JSON.stringify(arr));
        const sum = arr.reduce((s, n) => s + parseInt(n, 10), 0);
        await AsyncStorage.setItem(storageKey, String(sum));

        setLogs(prev => prev.map(l => l.month === month ? { ...l, expenses: arr } : l));
      }

      setSelectedExpense(null);
      setActionModalVisible(false);
      setEditModalVisible(false);
    } catch (error) {
      console.log('Error deleting expense:', error);
    }
  }

  async function handleEditExpense() {
    if (!selectedExpense) return;
    const parsed = parseInt(editValue, 10);
    if (isNaN(parsed) || parsed < 0) {
      Alert.alert('Invalid amount', 'Please enter a valid non-negative number');
      return;
    }

    const { month, index } = selectedExpense;
    const storageArrKey = `array_${categoryName}_` + month;
    const parts = String(month).split('_');
    const yearStr = parts[0];
    const monthIdxStr = parts[1];
    const storageKey = `${categoryName}_${yearStr}_${monthIdxStr}`;

    try {
      const arrStr = await AsyncStorage.getItem(storageArrKey);
      const arr = arrStr ? JSON.parse(arrStr) : [];
      if (!Array.isArray(arr)) return;

      arr[index] = parsed;
      await AsyncStorage.setItem(storageArrKey, JSON.stringify(arr));
      const sum = arr.reduce((s, n) => s + parseInt(n, 10), 0);
      await AsyncStorage.setItem(storageKey, String(sum));

      setLogs(prev => prev.map(l => l.month === month ? { ...l, expenses: arr } : l));

      setEditModalVisible(false);
      setSelectedExpense(null);
      setEditValue('');
    } catch (error) {
      console.log('Error editing expense:', error);
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>{categoryName}</Text>

      {logs.length === 0 && (
        <Text style={{
          color: '#3a200c'
        }}>No logs found :(</Text>
      )}

      {logs.map((log) => {
        const parts = String(log.month).split('_');
        const year = parseInt(parts[0], 10);
        const monthIndex = parseInt(parts[1], 10);
        const monthLabel = monthNames[monthIndex] ?? `M:${monthIndex}`;

        return (
          <View key={log.month} style={styles.monthSection}>
            <Text style={styles.monthLabel}>{monthLabel} {year}</Text>

            {Array.isArray(log.expenses) && log.expenses.length > 0 ? (
                log.expenses.map((amt, i) => (
                  <TouchableOpacity
                    key={i}
                    activeOpacity={0.7}
                    style={styles.expenseCard}
                    onPress={() => {
                      setSelectedExpense({ month: log.month, index: i, amount: amt });
                      setActionModalVisible(true);
                    }}
                  >
                    <View style={styles.expenseRow}>
                      <Text style={styles.expenseText}>Expense {i + 1}</Text>
                      <Text style={styles.expenseAmount}>{currencyFormatter.format(amt)}</Text>
                    </View>
                  </TouchableOpacity>
                ))
            ) : (
              <Text style={styles.noExpense}>No expenses for this month.</Text>
            )}
          </View>
        );
      })}

        {/* Action modal: Edit / Delete */}
        <Modal
          visible={actionModalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setActionModalVisible(false)}
        >
          <View style={modalStyles.overlay}>
            <View style={modalStyles.box}>
              <Text style={modalStyles.boxTitle}>Choose action</Text>
              <Text style={modalStyles.boxText}>Edit or Delete this expense?</Text>
              <View style={modalStyles.row}>
                <Pressable
                  style={modalStyles.buttonPrimary}
                  onPress={() => {
                    // open edit modal
                    setEditValue(String(selectedExpense?.amount ?? ''));
                    setActionModalVisible(false);
                    setEditModalVisible(true);
                  }}
                >
                  <Text style={modalStyles.buttonText}>Edit</Text>
                </Pressable>
                <Pressable
                  style={modalStyles.buttonDanger}
                  onPress={async () => {
                    setActionModalVisible(false);
                    // confirm
                    Alert.alert(
                      'Delete expense',
                      'Are you sure you want to delete this expense?',
                      [
                        { text: 'Cancel', style: 'cancel' },
                        { text: 'Delete', style: 'destructive', onPress: handleDeleteExpense }
                      ]
                    );
                  }}
                >
                  <Text style={modalStyles.buttonText}>Delete</Text>
                </Pressable>
                <Pressable style={modalStyles.buttonCancel} onPress={() => setActionModalVisible(false)}>
                  <Text style={modalStyles.buttonText}>Cancel</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>

        <Modal
          visible={editModalVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setEditModalVisible(false)}
        >
          <View style={modalStyles.overlay}>
            <View style={modalStyles.box}>
              <Text style={modalStyles.boxTitle}>Edit Expense</Text>
              <TextInput
                style={modalStyles.input}
                value={editValue}
                onChangeText={setEditValue}
                keyboardType="numeric"
                placeholder="Amount"
              />
              <View style={modalStyles.row}>
                <Pressable
                  style={modalStyles.buttonPrimary}
                  onPress={async () => {
                    await handleEditExpense();
                  }}
                >
                  <Text style={modalStyles.buttonText}>Save</Text>
                </Pressable>
                <Pressable style={modalStyles.buttonCancel} onPress={() => setEditModalVisible(false)}>
                  <Text style={modalStyles.buttonText}>Cancel</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { padding: 16 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 6, color: '#3a200c' },
  subtitle: { fontSize: 16, marginBottom: 12, color: '#333' },
  empty: { fontSize: 14, color: '#666', marginTop: 12 },
  monthSection: { marginTop: 12, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#eee' },
  monthLabel: { fontSize: 12, color: '#854d0d', textTransform: 'uppercase', marginBottom: 8 },
  expenseCard: { backgroundColor: '#f8f7de', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, marginVertical: 6 },
  expenseText: { fontSize: 14, color: '#3a200c' },
  expenseAmount: { fontSize: 18, color: '#3a200c', fontWeight: '700' },
  noExpense: { fontSize: 13, color: '#3a200c', paddingVertical: 6 },
});

const modalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  box: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 6,
  },
  boxTitle: { fontSize: 16, fontWeight: '700', marginBottom: 6, color: '#3a200c' },
  boxText: { fontSize: 14, color: '#3a200c', marginBottom: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  buttonPrimary: { backgroundColor: '#3a200c', paddingHorizontal: 12, paddingVertical: 10, borderRadius: 6, flex: 1, alignItems: 'center', marginRight: 6 },
  buttonDanger: { backgroundColor: '#d9534f', paddingHorizontal: 12, paddingVertical: 10, borderRadius: 6, flex: 1, alignItems: 'center', marginRight: 6 },
  buttonCancel: { backgroundColor: '#ccc', paddingHorizontal: 12, paddingVertical: 10, borderRadius: 6, flex: 1, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '700' },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 6, paddingHorizontal: 10, paddingVertical: 8, marginBottom: 12, color: '#3a200c' }
});
