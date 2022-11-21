import React, {useState, useCallback} from 'react';
import {
  Alert,
  Button,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableNativeFeedback,
  TouchableOpacity,
  View,
} from 'react-native';

const storeSet = new Set();

export const Counter = () => {
  const [count, setCount] = useState(0);
  const [countOther, setCountOther] = useState(0);

  const increase = useCallback(() => setCount(count + 1), [count]);
  const decrease = useCallback(() => setCount(count - 1), [count]);

  const increaseOther = useCallback(
    () => setCountOther(countOther + 1),
    [countOther],
  );
  const decreaseOther = useCallback(
    () => setCountOther(countOther + 1),
    [countOther],
  );

  storeSet.add(increase);
  storeSet.add(decrease);
  storeSet.add(increaseOther);
  storeSet.add(decreaseOther);

  console.log(storeSet);

  return (
    <View>
      <Text>Count: {count}</Text>
      <Button onPress={increase} title="+" />
      <Button onPress={decrease} title="-" />

      <Text>Count other: {countOther}</Text>
      <Button onPress={increaseOther} title="+" />
      <Button onPress={decreaseOther} title="-" />
    </View>
  );
};
