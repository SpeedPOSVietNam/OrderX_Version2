import React, {useState} from 'react';
import {View, Text, Image, TouchableOpacity, FlatList} from 'react-native';
import {TableStatusBox} from '../components/Commons/TableStatusBox';
import icons from '../constants/icons';
import {MyButton} from '../components';
import {COLORS, FONTS, SIZES} from '../constants/theme';
import {PasswordInputWithRevealButton} from '../components';
import {SCREENS} from './SCREENS';
import {HOOK_TABLE} from '../hooks/react-query/useTable';

export const Main = ({navigation}) => {
  const [paidStatus, setPaidStatus] = useState(false);
  const TableStatusList = () => {
    const renderItem = ({item}) => (
      <TouchableOpacity
        onPress={() => {
          if (
            item.colorStatus == COLORS.TableStatusBlue ||
            item.colorStatus == COLORS.TableStatusGreen
          ) {
            navigation.navigate(SCREENS.Payment);
          }
          setPaidStatus(!paidStatus);
        }}
        style={{
          width: 300,
          height: 60,
          backgroundColor: item.colorStatus,
          borderRadius: SIZES.radius,
          marginVertical: 5,
        }}>
        <View
          style={{
            flex: 1,
            paddingHorizontal: 15,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <Text
            style={{
              color: COLORS.white,
              fontWeight: 'bold',
              fontSize: SIZES.h4,
            }}>
            Table ID:
          </Text>
          <Text
            style={{
              color: COLORS.white,
              fontWeight: 'bold',
              fontSize: SIZES.h4,
            }}>
            {item.tableID}
          </Text>
          <Text
            style={{
              color: COLORS.white,
              fontWeight: 'bold',
              fontSize: SIZES.h4,
            }}>
            {item.tableStatus}
          </Text>

          {paidStatus ? <Image source={icons.verify} /> : null}
        </View>
      </TouchableOpacity>
    );
    return (
      <FlatList
        data={HOOK_TABLE}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    );
  };
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
          <TouchableOpacity
            onPress={() => navigation.navigate(SCREENS.OrderHistory)}>
            <Image source={icons.history} style={{width: 39, height: 39}} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate(SCREENS.LoginScreen)}>
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
          textHolder={'Search ID for payment'}
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
        <TableStatusList />
      </View>
    </View>
  );
};
