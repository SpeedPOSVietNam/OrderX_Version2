import React from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import {QueryClientProvider} from 'react-query';
import {AppNavigator} from './navigation/AppNavigator';
import {queryClient} from './hooks';
const App = ({}) => {
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaView style={styles.container}>
        <AppNavigator />
      </SafeAreaView>
    </QueryClientProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
