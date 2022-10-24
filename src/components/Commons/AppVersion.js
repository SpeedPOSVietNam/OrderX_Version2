import React from 'react';
import {Text, View} from 'react-native';
import {getAppModeConstantValue} from '../../constants/global';
import {COLORS, FONTS, SIZES} from '../../constants/theme';
import {settingSelectors, useStore} from '../../store';

export const AppVersion = ({containerStyle, textStyle}) => {
  const appMode = useStore(settingSelectors.appMode);
  const VERSION = getAppModeConstantValue('VERSION');

  return (
    <View style={{padding: SIZES.padding, ...containerStyle}}>
      <Text style={{...FONTS.body4, color: COLORS.secondary, ...textStyle}}>
        Version {appMode?.toLowerCase()}_{VERSION.NAME}_{VERSION.CODE}
      </Text>
    </View>
  );
};
