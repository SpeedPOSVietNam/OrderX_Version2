import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
  Image,
  KeyboardAvoidingView,
} from 'react-native';
import {COLORS, FONTS, SIZES} from '../constants/theme';
import {
  MyButton,
  AppVersion,
  PasswordInputWithRevealButton,
} from '../components';
import icons from '../constants/icons';

export const EnterPassword = ({navigation}) => {
  const [ClinetName, setCilentName] = useState('OrderX');
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
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <TouchableOpacity onPress={() => navigation.push('LoginScreen')}>
          <Image
            source={icons.arrowLeft}
            style={{width: 20, height: 20}}
            resizeMode={'contain'}
          />
        </TouchableOpacity>
        <Text
          style={{
            color: COLORS.title,
            fontWeight: 'bold',
            fontSize: SIZES.body2,
          }}>
          Have a nice day, {ClinetName}!
        </Text>
        <Text />
      </View>

      <View
        style={{
          alignItems: 'center',
        }}>
        <Image
          source={require('../assets/images/speed-logo.png')}
          style={{
            width: 150,
            height: 150,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          resizeMode={'contain'}
        />
      </View>

      <View
        style={{
          flex: 0.5,
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text
          style={{
            ...FONTS.body4,
            color: COLORS.secondary,
            textAlign: 'center',
            marginBottom: 50,
          }}
        />
        <Text
          style={{
            ...FONTS.h3,
            color: COLORS.title,
            textAlign: 'center',
            fontWeight: 'bold',
          }}>
          Enter PASSWORD
        </Text>
        <PasswordInputWithRevealButton
          paramIsReveal={false}
          RighImageSrc1={icons.eye_close}
          RighImageSrc2={icons.eye_open}
          LeftImageSrc={icons.lock}
          textHolder={'Enter client GUID'}
          keyboardType={'number-pad'}
          value={waiterCode}
          // onChangeText={value => setWaiterCode(value)}
        />
        <MyButton
          iconStyle={{tintColor: COLORS.white}}
          title={'LOGIN'}
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
          onPress={() => navigation.navigate('Main')}
        />
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
