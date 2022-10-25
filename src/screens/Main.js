import React from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import {TableStatusBox} from '../components/Commons/TableStatusBox';
import icons from '../constants/icons';
import {MyButton} from '../components';
import {COLORS, FONTS, SIZES} from '../constants/theme';
import {PasswordInputWithRevealButton} from '../components';

export const Main = ({navigation}) => {
  return (
    <View
      style={{
        flex: 1,
        paddingVertical: 10,
      }}>
      <View
        style={{
          flex: 0.2,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <Image
          source={require('../assets/images/speed-logo.png')}
          style={{
            width: 150,
            height: 150,
          }}
          resizeMode={'contain'}
        />
        <View
          style={{
            flex: 0.5,
            flexDirection: 'row',
            justifyContent: 'space-evenly',
          }}>
          <TouchableOpacity>
            <Image source={icons.history} style={{width: 39, height: 39}} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Image source={icons.logout} style={{width: 39, height: 39}} />
          </TouchableOpacity>
        </View>
      </View>

      <View
        style={{
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <PasswordInputWithRevealButton
          paramIsReveal={true}
          LeftImageSrc={icons.search}
          textHolder={'Search Table No. for Payment'}
          keyboardType={'number-pad'}
          // value={ClientCode}
          // onChangeText={value => setClientCode(value)}
        />
        <MyButton
          iconStyle={{tintColor: COLORS.white}}
          title={'Search'}
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
          flex: 2,
          alignItems: 'center',
        }}>
        <TableStatusBox />
      </View>
    </View>
  );
};
