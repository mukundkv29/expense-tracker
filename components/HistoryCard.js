import { View, Text } from "react-native";

import { styles } from "../styles/HistoryCard";

export default function HistoryCard({item}) {
  const date = new Date(item.date);
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1;
  const day = date.getUTCDate();

  console.log(year, month, day);

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.amountText}>
          {item.amount}
        </Text>
      </View>
      <View>
        <Text>{date}/{month+1}/{year}</Text>
      </View>
    </View>
  );
}