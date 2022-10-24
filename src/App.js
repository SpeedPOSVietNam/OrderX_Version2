import React from 'react';
import {
  SafeAreaView,
  StyleSheet
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppNavigator } from './navigation/AppNavigator'

const App = ({}) => {
  return (

      <SafeAreaView style={styles.container}>
        <AppNavigator />
       </SafeAreaView>
   
  );
};


const styles = StyleSheet.create({
  container:{
    flex:1
  }
})

export default App;
