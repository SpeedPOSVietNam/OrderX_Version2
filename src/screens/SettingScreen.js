import React, {useEffect, useState} from 'react';
import {Text, TouchableOpacity, View, TextInput, Image} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {APPMODE} from '../constants/global';
import {COLORS, FONTS, SIZES} from '../constants/theme';
import {settingSelectors, useStore} from '../store';
import {SharePosTestScreen} from './test/SharePosTestScreen';
import {MyButton} from '../components';
import icons from '../constants/icons';
import '../constants/translations/i18n';
import {useTranslation} from 'react-i18next';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

export const SettingScreen = ({navigation}) => {
  const {t, i18n} = useTranslation();
  const appMode = useStore(settingSelectors.appMode);
  const setAppMode = useStore(settingSelectors.setAppMode);
  const serverHostIP = useStore(settingSelectors.serverHostIP);
  const setServerHostIP = useStore(settingSelectors.setServerHostIP);
  const [IPTemp, setIPTemp] = useState(serverHostIP);
  const lang = useStore(settingSelectors.lang);
  const setlang = useStore(settingSelectors.setLang);
  const [currentLanguage, setLanguage] = useState(lang);

  useEffect(() => {
    i18n.changeLanguage(lang);
  }, [lang]);

  const SettingItem = ({icon, text, rightComponent, style}) => (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: SIZES.padding,
        ...style,
      }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Image
          source={icon}
          style={{
            width: 25,
            height: 25,
            marginRight: SIZES.padding,
            tintColor: COLORS.secondary,
          }}
        />
        <Text style={{...FONTS.body4, color: COLORS.black}}>{text}</Text>
      </View>
      {rightComponent}
    </View>
  );
  const switchAppMode = () => {
    const newAppMode = appMode === APPMODE.DEV ? APPMODE.PROD : APPMODE.DEV;
    setAppMode(newAppMode);
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
        {t('setting')}
      </Text>

      <View style={{flex: 1}}>
        <View
          style={{
            padding: SIZES.padding,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <Text style={{...FONTS.body4}}>{t('switchLanguage')}</Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <SettingButton
              text={t('english')}
              onPress={() => {
                setlang('en');
                setLanguage('en');
              }}
              Color={currentLanguage == 'en' ? COLORS.info : COLORS.black}
            />
            <SettingButton
              text={t('vietnam')}
              onPress={() => {
                setlang('vi');
                setLanguage('vi');
              }}
              Color={currentLanguage == 'vi' ? COLORS.info : COLORS.black}
            />
          </View>
        </View>

        <SettingButton
          title={t('switchAppMode')}
          text={appMode === APPMODE.DEV ? t('development') : t('production')}
          onPress={switchAppMode}
        />

        <View
          style={{
            padding: SIZES.padding,
            flexDirection: 'row',
          }}>
          <Text adjustsFontSizeToFit numberOfLines={1} style={{...FONTS.body4}}>
            Server Host IP
          </Text>

          <View
            style={{flex: 1, flexDirection: 'column', alignItems: 'center'}}>
            <TextInput
              value={IPTemp}
              onChangeText={text => {
                setIPTemp(text);
              }}
              style={{
                padding: SIZES.padding,
                marginLeft: 5,
                color: 'black',
                backgroundColor: 'white',
                borderRadius: 5,
                height: hp('5%'),
                width: wp('55%'),
                fontSize: 14,
                borderColor: 'black',
                borderWidth: 1,
              }}
            />
            {IPTemp !== serverHostIP && (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <MyButton
                  icon={icons.checked}
                  iconStyle={{
                    tintColor: COLORS.success,
                  }}
                  containerStyle={{}}
                  onPress={() => setServerHostIP(IPTemp)}
                />

                <MyButton
                  icon={icons.cancel}
                  iconStyle={{
                    tintColor: COLORS.danger,
                  }}
                  onPress={() => setIPTemp(serverHostIP)}
                />
              </View>
            )}
          </View>
        </View>

        {/* <SettingItem
          icon={icons.flash_on}
          text={t('serverHostIP')}
          rightComponent={
            <View style={{flex: 1, height: 100}}>
              <TextInput
                value={IPTemp}
                onChangeText={text => {
                  setIPTemp(text);
                }}
                style={{
                  flex: 1,
                  backgroundColor: COLORS.lightGray3,
                  borderRadius: SIZES.radius,
                }}
              />
              {IPTemp !== serverHostIP && (
                <View
                  style={{
                    flexDirection: 'row',
                    alignSelf: 'flex-end',
                  }}>
                  <TextInput
                    style={{
                      flex: 1,
                      backgroundColor: COLORS.lightGray3,
                      borderRadius: SIZES.radius,
                    }}
                  />
                  <MyButton
                    icon={icons.checked}
                    iconStyle={{
                      tintColor: COLORS.success,
                    }}
                    containerStyle={{}}
                    onPress={() => setServerHostIP(IPTemp)}
                  />
                  <MyButton
                    icon={icons.cancel}
                    iconStyle={{
                      tintColor: COLORS.danger,
                    }}
                    onPress={() => setIPTemp(serverHostIP)}
                  />
                </View>
              )}
            </View>
          }
        /> */}
        <SettingButton
          title={t('sharePosTestScreen')}
          text={t('open')}
          onPress={() => navigation.navigate(SharePosTestScreen)}
        />
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
          {t('back')}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const SettingButton = ({title, text, onPress, Color}) => (
  <TouchableOpacity
    onPress={onPress}
    style={{
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: SIZES.padding,
    }}>
    <Text style={{...FONTS.body4, color: Color}}>{title}</Text>
    <Text style={{...FONTS.body4, color: Color}}>{text}</Text>
  </TouchableOpacity>
);
