import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    padding: 20,
  },
  monthlyExpenseCard: {
    backgroundColor: '#f8f7de',
    borderRadius: 15,
    padding: 16,
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowColor: '#3a200c',
    elevation: 14,
    width: 350,
    height: 100,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center'
  },
  amountSection: {
    flex: 4,
    borderColor: '#d29d30',
    borderRightWidth: 2,
    width: '70%',
    justifyContent: 'flex-end'
  },
  amountText: {
    fontWeight: 'bold',
    fontSize: 40,
    width: '100%',
    paddingLeft: 5,
    color: '#3a200c',
  },
  monthSection: {
    flex: 1,
    paddingLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  monthText: {
    fontSize: 16,
    padding: 10,
    color: '#854d0d'
  },
});
