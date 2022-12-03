import React, {useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Modal,
  View,
  Pressable,
  Platform,
  Text,
} from 'react-native';
import {QueryClientProvider} from 'react-query';
import {AppNavigator} from './navigation/AppNavigator';
import {queryClient} from './hooks';
const App = ({}) => {
  return (
    <SafeAreaView style={styles.container}>
      <AppNavigator />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  container: {
    flex: 1,
  },
  iOSBackdrop: {
    backgroundColor: '#000000',
    opacity: 0.3,
  },
  androidBackdrop: {
    backgroundColor: '#232f34',
    opacity: 0.32,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});

export default App;
