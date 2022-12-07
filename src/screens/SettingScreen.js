import React from 'react';
import {Alert, Text, TouchableOpacity, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {APPMODE} from '../constants/global';
import {COLORS, FONTS, SIZES} from '../constants/theme';
// import {trackEvent, TRACK_EVENT_NAME} from '../helpers/codepush';
import {addAlert, settingSelectors, useStore} from '../store';
import {SCREENS} from './SCREENS';
import {SharePosTestScreen} from './test/SharePosTestScreen';

export const SettingScreen = ({navigation}) => {
  const appMode = useStore(settingSelectors.appMode);
  const setAppMode = useStore(settingSelectors.setAppMode);

  const switchAppMode = () => {
    const newAppMode = appMode === APPMODE.DEV ? APPMODE.PROD : APPMODE.DEV;

    Alert.alert(
      'Switch app mode',
      `Are you sure to switch app mode to ${newAppMode}?`,
    );
    setAppMode(newAppMode);
    // addAlert({f
    //   title: 'Switch app mode',
    //   message: `Are you sure to switch app mode to ${newAppMode}?`,
    //   buttons: [
    //     {text: 'Cancel'},
    //     {
    //       text: 'Switch',
    //       onPress: () => {
    //         // trackEvent(TRACK_EVENT_NAME.SWITCH_APPMODE, {appMode: newAppMode});
    //         setAppMode(newAppMode);
    //       },
    //     },
    //   ],
    // });
  };
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: COLORS.white}}>
      <Text
        style={{
          ...FONTS.h2,
          color: COLORS.black,
          textAlign: 'center',
          margin: SIZES.padding,
        }}>
        Setting
      </Text>

      <View style={{flex: 1}}>
        <SettingButton
          title="Switch app mode"
          text={appMode === APPMODE.DEV ? 'Development' : 'Production'}
          onPress={switchAppMode}
        />
        {/* <SettingButton
          title="Ingenico Test Screen"
          text="Open"
          onPress={() => navigation.navigate(SCREENS.IngenicoTest)}
        /> */}
        <SettingButton
          title="SharePos Test Screen"
          text="Open"
          onPress={() => navigation.navigate(SharePosTestScreen)}
        />
        {/* <SettingButton
          title="Pax Test Screen"
          text="Open"
          onPress={() => navigation.navigate(SCREENS.PaxTest)}
        /> */}
        {/* <SettingButton
          title="Launcher Test Screen"
          text="Open"
          onPress={() => navigation.navigate(SCREENS.LauncherTestScreen)}
        /> */}
      </View>

      <TouchableOpacity
        onPress={navigation.goBack}
        style={{
          padding: SIZES.padding,
          backgroundColor: COLORS.info,
          margin: 5,
          borderRadius: SIZES.radius,
        }}>
        <Text
          style={{...FONTS.body3, color: COLORS.white, textAlign: 'center'}}>
          Back
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const SettingButton = ({title, text, onPress}) => (
  <TouchableOpacity
    onPress={onPress}
    style={{
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: SIZES.padding,
    }}>
    <Text style={{...FONTS.body4, color: COLORS.black}}>{title}</Text>
    <Text style={{...FONTS.body4, color: COLORS.info}}>{text}</Text>
  </TouchableOpacity>
);
