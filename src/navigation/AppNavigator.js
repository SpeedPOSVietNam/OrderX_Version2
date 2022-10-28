import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {COLORS} from '../constants/theme';
import {LoginScreen} from '../screens/LoginScreen';
import {EnterPassword} from '../screens/EnterPassword';
import {Main} from '../screens/Main';
import {SuccessFul} from '../screens/Successful';
import {Fail} from '../screens/Fail';
import {Payment} from '../screens/Payment';
import {OrderHistory} from '../screens/OrderHistory';
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
        <Stack.Screen name="Main" component={Main} />
        <Stack.Screen name="SuccessFul" component={SuccessFul} />
        <Stack.Screen name="Fail" component={Fail} />
        <Stack.Screen name="Payment" component={Payment} />
        <Stack.Screen name="OrderHistory" component={OrderHistory} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
