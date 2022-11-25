import React, {useEffect} from 'react';
import {View, Image, Text} from 'react-native';
import {COLORS, FONTS, SIZES} from '../constants/theme';
import icons from '../constants/icons';
import {SCREENS} from './SCREENS';

export const SuccessFul = ({navigation}) => {
  setTimeout(() => {
    navigation.navigate(SCREENS.TableListMain);
  }, 5000);

  return (
    <View
      style={{
        backgroundColor: COLORS.success,
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <View
        style={{
          backgroundColor: COLORS.success,
        }}>
        <Image source={icons.success} />
      </View>
      <View
        style={{
          backgroundColor: COLORS.success,
          justifyContent: 'center',
          alignItems: 'center',
          flex: 0.4,
        }}>
        <Text
          style={{
            fontSize: SIZES.body7,
            fontWeight: 'bold',
            color: COLORS.white,
            padding: 30,
          }}>
          Payment Successful !
        </Text>
        <Text style={{fontSize: SIZES.body6, color: COLORS.white}}>
          Hooray! You have completed your payment.
        </Text>
      </View>
    </View>
  );
};
