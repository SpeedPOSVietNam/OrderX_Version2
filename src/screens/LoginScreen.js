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

export const LoginScreen = ({navigation}) => {
  const [clientID, setClientID] = useState(true);
  const [ClientCode, setClientCode] = useState(true);
  if (clientID) {
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
            onLongPress={() => Alert.alert('Why are u doing long press?')}>
            <Text
              style={{...FONTS.h1, color: COLORS.title, textAlign: 'center'}}>
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
            textHolder={'Enter PASSWORD'}
            // value={ClientCode}
            value={'password'}
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
            // onPress={checkAccessCode}
            onPress={() => navigation.navigate(SCREENS.EnterPassword)}
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
  }
};
