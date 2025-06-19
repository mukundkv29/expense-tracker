import { Pressable, Text, View, StyleSheet } from "react-native";

export default function Button({children}) {
  return (
    <View style={styles.buttonOuterContainer}>
      <Pressable style={styles.buttonInnerContainer} android_ripple={{color: '#701880'}}>
        <Text style={styles.textContainer}>{children}</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonOuterContainer: {
    margin: 4,
    overflow: 'hidden',
    width: 390,
  },
  buttonInnerContainer: {
    elevation: 2,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#301934',
  },
  textContainer: {
    color: 'white',
    height: '55%',
    textAlign: 'center',
  }
});