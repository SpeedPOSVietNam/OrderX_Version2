import React from 'react';
import {View, Image, Text} from 'react-native';
import {COLORS, FONTS, SIZES} from '../constants/theme';
import icons from '../constants/icons';

export const Fail = ({navigation}) => {
  return (
    <View
      style={{
        backgroundColor: COLORS.fail,
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <View
        style={{
          backgroundColor: COLORS.fail,
        }}>
        <Image source={icons.fail} />
      </View>
      <View
        style={{
          backgroundColor: COLORS.fail,
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
          Payment Failed!
        </Text>
        <Text style={{fontSize: SIZES.body6, color: COLORS.white}}>Oops!</Text>
      </View>
    </View>
  );
};
