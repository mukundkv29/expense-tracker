import { Button } from 'react-native';

export default function UndoButton ({ visible, onUndo }) {
  if (!visible)
    return null;
  return (
    <Button
      title='Undo'
      onPress={onUndo}
    />
  );
};
