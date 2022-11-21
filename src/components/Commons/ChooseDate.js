import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Alert} from 'react-native';

// Pre-step, call this before any NFC operations

export const ChooseDate = () => {
  return (
    <View style={styles.wrapper}>
      <TouchableOpacity onPress={() => Alert.alert('You Pressed')}>
        <Text>Scan a Tag</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 100,
    width: 100,
  },
});
