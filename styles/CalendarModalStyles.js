import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: 300,
    height: 280,
  },
  scrollContainer: {
    flexDirection: 'row',
    flex: 1,
    width: '100%',
    position: 'relative',
  },
  columnContainer: {
    flex: 1,
    position: 'relative',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 80,
  },
  itemContainer: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  selectedText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 18,
  },
  selectionStrip: {
    position: 'absolute',
    top: '50%',
    left: 20,
    right: 20,
    height: 40,
    backgroundColor: 'rgba(33, 150, 243, 0.1)',
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderColor: '#2196F3',
    zIndex: 2,
    marginTop: -20,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 20,
    width: '100%',
    justifyContent: 'space-between',
  },
  button: {
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    elevation: 2,
    flex: 1,
    marginHorizontal: 5,
  },
  buttonOpen: {
    backgroundColor: '#2196F3',
  },
  buttonCancel: {
    backgroundColor: '#666',
  },
  buttonContinue: {
    backgroundColor: '#2196F3',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 14,
  },
  topFade: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 60,
    zIndex: 1,
  },
  bottomFade: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    zIndex: 1,
  },
});
