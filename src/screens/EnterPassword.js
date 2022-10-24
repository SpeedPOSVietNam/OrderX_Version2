import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
  Image,
} from 'react-native';
import {COLORS, FONTS, SIZES} from '../constants/theme';
import {
  MyButton,
  AppVersion,
  PasswordInputWithRevealButton,
} from '../components';
import icons from '../constants/icons';

export const EnterPassword = ({navigarion}) => {
  const [waiterCode, setWaiterCode] = useState('');
  const client = {data: {ClientName: 'BanhMi'}};
  const venue = {data: {VenueName: 'BanhMiVang'}};
  return (
    <SafeAreaView style={{flex: 1, alignItems: 'center'}}>
      {/* Client/Venue information */}
      <Image
        source={{
          uri: 'https://speedup.vn/wp-content/themes/onda/images/logo.svg',
        }}
        style={{width: 150, height: 150}}
        resizeMode={'contain'}
      />
      <Text
        style={{
          ...FONTS.body4,
          color: COLORS.secondary,
          textAlign: 'center',
          marginBottom: 50,
        }}>
        {`Client: ${client.data?.ClientName}\n`}
        {`Venue: ${venue.data?.VenueName}`}
      </Text>
      {/* Enter Waiter Code */}
      <Text style={{...FONTS.h3, color: COLORS.black, textAlign: 'center'}}>
        Enter Waiter Code
      </Text>
      <PasswordInputWithRevealButton
        keyboardType={'number-pad'}
        value={waiterCode}
        onChangeText={value => setWaiterCode(value)}
      />
      <MyButton
        icon={icons.login}
        iconStyle={{tintColor: COLORS.white}}
        title={'LOGIN'}
        titleStyle={{
          ...FONTS.h4,
          color: COLORS.white,
          marginLeft: SIZES.padding,
        }}
        containerStyle={{
          backgroundColor: COLORS.info,
          borderRadius: SIZES.radius,
          marginBottom: SIZES.padding,
        }}
        onPress={() => Alert.alert('hello')}
      />
      <AppVersion containerStyle={{position: 'absolute', bottom: 0}} />
    </SafeAreaView>
  );
};
