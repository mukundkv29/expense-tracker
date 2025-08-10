import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f7ea87',
    marginTop: 40,
    borderWidth: 3,
    borderColor: '#854d0d',
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
    color: '#3a200c',
    marginBottom: 4,
  },
  amountText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#3a200c',
  },
  input: {
    flex: 1,
    paddingHorizontal: 5,
    marginHorizontal: 10,
    fontSize: 16,
    minWidth: 15,
    borderColor: '#d29d30',
    borderWidth: 1,
    borderRadius: 7,
    textAlign: 'center'
  },
  calendarButton: {
    marginRight: 10,
    padding: 6,
    borderWidth: 1,
    borderColor: '#d29d30',
    borderRadius: 5,
    backgroundColor: '#fff3c4',
  },
  calendarText: {
    fontSize: 20,
  },
});
