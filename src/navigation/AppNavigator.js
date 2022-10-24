import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {COLORS} from '../constants/theme';
import {LoginScreen} from '../screens/LoginScreen';
import {EnterPassword} from '../screens/EnterPassword';

const Stack = createNativeStackNavigator();

export const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="LoginScreen"
        screenOptions={{
          headerShown: false,
          backgroundColor: COLORS.secondary,
          animationEnabled: true,
        }}>
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="EnterPassword" component={EnterPassword} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
