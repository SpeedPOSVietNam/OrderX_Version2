import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
  Image,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
} from 'react-native';
import {COLORS, FONTS, SIZES} from '../constants/theme';
import {
  MyButton,
  AppVersion,
  PasswordInputWithRevealButton,
} from '../components';
import icons from '../constants/icons';
import {
  deviceLogin,
  getMobileOrderConfig,
  getEmployee,
  waiterLogin,
} from '../hooks';
import {
  authSelectors,
  useStore,
  uiSelectors,
  getWaiterID,
  getServerHostIP,
} from '../store';
import {SCREENS} from './SCREENS';
import {useTranslation} from 'react-i18next';

export const EnterWaiter = ({navigation}) => {
  const {t} = useTranslation();
  const [checkLoading, setCheckLoading] = useState(false);
  const setWaiterID = useStore(authSelectors.setWaiterID);

  const checkPasswordAsync = async () => {
    const waiter = await getEmployee({
      Swipe: waiterCode,
    });
    // console.log('WAITER INFO', waiter);

    if (waiter?.length === 0) {
      console.log(
        'result: failed',
        'reason: Incorrect waiter code',
        waiterCode,
      );
      setCheckLoading(false);
      Alert.alert(t('loginFailed'), t('incorrectWaiterCode'));
    } else if (waiter[0].IsActive == 0) {
      setCheckLoading(false);
      Alert.alert(
        t('accountDeactived'),
        t('contactYourAdministratorForMoreDetail'),
      );
    } else {
      setCheckLoading(false);
      setWaiterID(waiter[0]);
      navigation.navigate(SCREENS.TableListMain);
    }
  };

  const checkPassword = () => {
    setCheckLoading(true);
    if (waiterCode === '') {
      Alert.alert(t('warning'), t('missingWaiterCode!'));
      return;
    }
    Keyboard.dismiss();

    checkPasswordAsync()
      .then(() => {})
      .catch(e => {
        Alert.alert(t('error'), e.message), setCheckLoading(false);
      });
  };

  const [waiterCode, setWaiterCode] = useState('');
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{
        flex: 1,
      }}>
      <View
        style={{
          paddingHorizontal: 10,
          paddingVertical: 20,
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text
          style={{
            color: COLORS.title,
            fontWeight: 'bold',
            fontSize: SIZES.body3,
          }}>
          {t('haveaNiceDay')}
        </Text>
        <Text />
      </View>

      <View
        style={{
          alignItems: 'center',
        }}>
        <Image
          source={require('../assets/images/speed-logo.png')}
          style={{width: 150, height: 150}}
          resizeMode={'contain'}
        />
      </View>

      <View
        style={{
          flex: 0.5,
          flexDirection: 'column',
          justifyContent: 'space-evenly',
          alignItems: 'center',
        }}>
        <TouchableOpacity
          onLongPress={() => navigation.navigate(SCREENS.SettingScreen)}>
          <Text
            style={{
              ...FONTS.h3,
              color: COLORS.title,
              textAlign: 'center',
              fontWeight: 'bold',
            }}>
            {t('enterPassword')}
          </Text>
        </TouchableOpacity>
        <PasswordInputWithRevealButton
          paramIsReveal={false}
          RighImageSrc1={icons.eye_close}
          RighImageSrc2={icons.eye_open}
          LeftImageSrc={icons.lock}
          textHolder={t('waiterCode')}
          keyboardType={'number-pad'}
          value={waiterCode}
          onChangeText={value => setWaiterCode(value)}
        />
        {!checkLoading ? (
          <MyButton
            iconStyle={{tintColor: COLORS.white}}
            disable={!checkLoading ? false : true}
            title={t('login')}
            titleStyle={{
              ...FONTS.h4,
              color: COLORS.white,
              marginLeft: SIZES.padding,
              marginRight: SIZES.padding,
            }}
            containerStyle={{
              backgroundColor: COLORS.title,
              borderRadius: SIZES.radius,
              marginBottom: SIZES.padding,
            }}
            onPress={checkPassword}
          />
        ) : (
          <MyButton
            iconStyle={{tintColor: COLORS.white}}
            disable={!checkLoading ? false : true}
            title={t('loading')}
            titleStyle={{
              ...FONTS.h4,
              color: COLORS.white,
              marginLeft: SIZES.padding,
              marginRight: SIZES.padding,
            }}
            containerStyle={{
              backgroundColor: COLORS.title,
              borderRadius: SIZES.radius,
              marginBottom: SIZES.padding,
            }}
            onPress={checkPassword}
          />
        )}
      </View>

      <View
        style={{
          flex: 0.5,
          justifyContent: 'flex-end',
          alignSelf: 'center',
        }}>
        <AppVersion />
      </View>
    </KeyboardAvoidingView>
  );
};
