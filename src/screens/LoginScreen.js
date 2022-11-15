import React, {useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Image,
  Keyboard,
  setGlobalLoading,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {COLORS, FONTS, SIZES} from '../constants/theme';
import icons from '../constants/icons';
import images from '../constants/images';
import {SCREENS} from './SCREENS';
import {
  PasswordInputWithRevealButton,
  MyButton,
  AppVersion,
} from '../components';
import {clientLogin} from '../hooks';
import {getAppModeConstantValue} from '../constants/global';
import {
  addAlert,
  authSelectors,
  uiSelectors,
  useStore,
  getVenueGUID,
} from '../store';

export const LoginScreen = ({navigation}) => {
  const [ClientCode, setClientCode] = useState('SpeedDemo');
  const setVenueGUID = useStore(authSelectors.setVenueGUID);
  const setClientGUID = useStore(authSelectors.setClientGUID);

  const checkAccessCode = () => {
    //Hành động: được thực thi khi chúng ta nhập mật khẩu
    Keyboard.dismiss();

    //setGlobalLoading('Checking access code...');

    // Param: client Code lấy từ TextInput
    clientLogin({AccessCode: ClientCode})
      .then(result => {
        const {ClientGUID, VenueGUID, PartnerGUID} = result;
        if (!ClientGUID) {
          throw new Error('Invalid data - ClientGUID not found.');
        }
        if (!VenueGUID) {
          throw new Error('Invalid data - VenueGUID not found.');
        }
        if (!PartnerGUID) {
          throw new Error('Invalid data - PartnerGUID not found.');
        }
        if (PartnerGUID !== getAppModeConstantValue('APP_CLIENT').guid) {
          throw new Error(
            'Invalid PartnerGUID - PartnerGUID not valid for this app.',
          );
        }
        console.log('RESULT', result);
        navigation.navigate(SCREENS.EnterPassword, result);
        setVenueGUID(VenueGUID);
        setClientGUID(ClientGUID);

        // trackEvent(TRACK_EVENT_NAME.CLIENT_LOGIN, {
        //   result: 'success',
        //   ClientGUID,
        //   VenueGUID,
        //   PartnerGUID,
        // });
      })
      .catch(err => {
        console.log('ERROR', err);
        Alert.alert('ERROR', err.message);
        // addAlert({ title: 'Client Login Failed', message: err.message, color: COLORS.danger });
      });
    // .finally(() => {
    //     setGlobalLoading(false);
    // });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignContent: 'center',
      }}>
      <View
        style={{
          flex: 0.3,
          justifyContent: 'center',
          alignSelf: 'center',
        }}>
        <Image
          source={images.orderx_en}
          style={{width: 300, height: 85}}
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
          <Text style={{...FONTS.h1, color: COLORS.title, textAlign: 'center'}}>
            Enter Access Code
          </Text>
          <Text
            style={{
              ...FONTS.body5,
              color: COLORS.black,
              textAlign: 'center',
            }}>
            Contact SpeedPOS to get Access Code
          </Text>
        </TouchableOpacity>

        <PasswordInputWithRevealButton
          paramIsReveal={false}
          RighImageSrc1={icons.eye_close}
          RighImageSrc2={icons.eye_open}
          textHolder={'Enter ACCESS CODE'}
          value={ClientCode}
          onChangeText={value => setClientCode(value)}
        />
        <MyButton
          iconStyle={{tintColor: COLORS.white}}
          title={'CHECK'}
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
          onPress={checkAccessCode}
          // onPress={() => navigation.navigate(SCREENS.EnterPassword)}
        />
      </View>
      <View
        style={{
          flex: 0.2,
          justifyContent: 'flex-end',
          alignSelf: 'center',
        }}>
        <AppVersion />
      </View>
    </KeyboardAvoidingView>
  );
};
