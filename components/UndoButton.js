import { Button } from 'react-native';

const UndoButton = ({ visible, onUndo }) => {
  if (!visible) return null;
  
  return (
    <Button
      title='Undo'
      onPress={onUndo}
    />
  );
};

export default UndoButton;
