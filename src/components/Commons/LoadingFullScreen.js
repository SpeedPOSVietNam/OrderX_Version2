import React, {memo} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {COLORS, FONTS, SIZES} from '../../constants/theme';
import {ActivityIndicator, Text} from 'react-native';

export const LoadingFullScreen = memo(
  ({text = 'Loading..', containerStyle, textStyle, children}) => (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        ...containerStyle,
      }}>
      {children}
      <ActivityIndicator color={COLORS.primary} size={'large'} />
      <Text
        style={{
          ...FONTS.body4,
          marginTop: SIZES.padding,
          color: COLORS.black,
          textAlign: 'center',
          ...textStyle,
        }}>
        {text}
      </Text>
    </SafeAreaView>
  ),
);
