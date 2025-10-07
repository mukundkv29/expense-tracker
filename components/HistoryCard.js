import { View, Text } from "react-native";

import { styles } from "../styles/HistoryCard";

export default function HistoryCard({amount}) {
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.amountText}>
          {amount}
        </Text>
      </View>
    </View>
  );
}