import { View, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

export default function CategoryHistoryScreen({ route }) {

  const category = route?.params?.category ?? '';
  const categoryName = typeof category === 'string' ? category : JSON.stringify(category);
  const [logs, setLogs] = useState([]);
  
  useEffect(() => {
    async function fetchLogs() {
      try {
        const logKey = `log_${categoryName}`;
        const existingLog = await AsyncStorage.getItem(logKey);
        const log = existingLog ? JSON.parse(existingLog) : [];
        const uniqueMonths = new Set(log);
        for(const month of uniqueMonths) {
          if(typeof(month) !== 'string') {
            continue;
          }
          const storageKey = `${categoryName}_`+month;
          try {
            const prevValue = await AsyncStorage.getItem(storageKey);
            if(prevValue !== null) {
              setLogs(prevLogs => [...prevLogs, {
                month: month,
                totalExpense: prevValue
              }]);
            }
          } catch (error) {
            console.log(`Error in fetching prev month logs: `, error);
          }
        }
        // setLogs([...uniqueSet]);
      } catch (error) {
        console.log(`Error in retrieving ${categoryName} logs: `, error);
      }
    }

    fetchLogs();
  }, [categoryName]);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: 22, fontWeight: 'bold' }}>Category Histories</Text>
      <Text style={{ fontSize: 18, marginTop: 16 }}>Category: {categoryName}</Text>
      {
        logs.map((log, idx) => {
          console.log(log, typeof(log))
          return typeof(log) === "string" ? <>
            <Text key={idx}>{String(log.month)}</Text>
            <Text key={idx}>{String(log.totalExpense)}</Text>
          </> : ''
        })
      }
    </View>
  );
}
