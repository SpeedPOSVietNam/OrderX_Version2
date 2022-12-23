import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {COLORS} from '../constants/theme';
import {LoginScreen} from '../screens/LoginScreen';
import {EnterPassword} from '../screens/EnterPassword';
import {TableListMain} from '../screens/TableListMain';
import {SuccessFul} from '../screens/Successful';
import {Fail} from '../screens/Fail';
import {Payment} from '../screens/Payment';
import {OrderHistory} from '../screens/OrderHistory';
import {SettingScreen} from '../screens/SettingScreen';
import {EnterWaiter} from '../screens/EnterWaiter';
import {LoadingScreen} from '../screens/LoadingScreen';
import {uiSelectors, useStore} from '../store';
import {Counter} from '../screens/Counter';
import {SharePosTestScreen} from '../screens/test/SharePosTestScreen';
import '../constants/translations/i18n';
import {useTranslation} from 'react-i18next';
import {addAlert, settingSelectors} from '../store';
export const AppNavigator = () => {
  const {t, i18n} = useTranslation();

  const lang = useStore(settingSelectors.lang);

  useEffect(() => {
    i18n.changeLanguage(lang);
  }, [lang]);
  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="EnterWaiter"
        screenOptions={{
          headerShown: false,
          backgroundColor: COLORS.secondary,
          animationEnabled: true,
        }}>
        <Stack.Screen name="TableListMain" component={TableListMain} />
        <Stack.Screen name="Counter" component={Counter} />
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="SettingScreen" component={SettingScreen} />
        <Stack.Screen name="EnterWaiter" component={EnterWaiter} />
        <Stack.Screen name="EnterPassword" component={EnterPassword} />
        <Stack.Screen
          name="SharePosTestScreen"
          component={SharePosTestScreen}
        />
        <Stack.Screen name="SuccessFul" component={SuccessFul} />
        <Stack.Screen name="Fail" component={Fail} />
        <Stack.Screen name="Payment" component={Payment} />
        <Stack.Screen name="OrderHistory" component={OrderHistory} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
