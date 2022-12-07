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
import {authSelectors, useStore, uiSelectors} from '../store';
import {SCREENS} from './SCREENS';
import {base64Icon} from '../helpers/utils';
import {SettingScreen} from './SettingScreen';
import {SharePosTestScreen} from './test/SharePosTestScreen';

export const EnterWaiter = ({navigation}) => {
  const clientGUID = useStore(authSelectors.clientGUID);
  const setClientGUID = useStore(authSelectors.setClientGUID);
  const venueGUID = useStore(authSelectors.venueGUID);
  const setVenueGUID = useStore(authSelectors.setVenueGUID);
  const setWaiterID = useStore(authSelectors.setWaiterID);
  const clientID = useStore(authSelectors.clientID);
  const setClientID = useStore(authSelectors.setClientID);
  const venueID = useStore(authSelectors.venueID);
  const setVenueID = useStore(authSelectors.setVenueID);
  const setPreLoading = useStore(uiSelectors.setPreLoading);
  // console.log(
  //   'CHECK DEVICE LOGIN',
  //   clientGUID != null &&
  //     clientID == null &&
  //     venueGUID != null &&
  //     venueID == null,
  // );
  // useEffect(() => {
  // if (
  //   clientGUID != null &&
  //   clientID == null &&
  //   venueGUID != null &&
  //   venueID == null
  // ) {
  // setGlobalLoading('Device logging in...');

  const checkPasswordAsync = async () => {
    const waiter = await getEmployee({
      Swipe: waiterCode,
    });
    console.log('WAITER INFO', waiter);

    if (waiter?.length === 0) {
      console.log(
        'result: failed',
        'reason: Incorrect waiter code',
        waiterCode,
      );
      Alert.alert('Login Failed', 'Incorrect waiter code');
    } else if (!waiter[0].IsActive) {
      Alert.alert(
        'Account deactived',
        'Contact your administrator for more detail.',
      );
    } else {
      // const result = await waiterLogin({waiterID: waiter[0].WaiterID});

      // const {
      //   ScenarioCode,
      //   UpdateCount,
      //   DateCreated,
      //   DateModified,
      //   DateExpired,
      // } = result;
      // console.log('result', 'success', {
      //   waiterCode,
      //   waiterID: waiter[0].WaiterID,
      // });

      // console.log('Check waiter device login: ', result);
      setWaiterID(waiter[0]);
      // setPreLoading(true);
      navigation.navigate(SCREENS.TableListMain);
    }
  };

  const checkPassword = () => {
    if (waiterCode === '') {
      Alert.alert('ERROR', 'Missing Waiter Code!');
      return;
    }
    Keyboard.dismiss();

    checkPasswordAsync()
      .then(() => {})
      .catch(e => Alert.alert('ERROR', e.message));
  };

  const [waiterCode, setWaiterCode] = useState('221278');
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
          Have a nice day!
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
            Enter PASSWORD
          </Text>
        </TouchableOpacity>
        <PasswordInputWithRevealButton
          paramIsReveal={false}
          RighImageSrc1={icons.eye_close}
          RighImageSrc2={icons.eye_open}
          LeftImageSrc={icons.lock}
          textHolder={'Enter client GUID'}
          keyboardType={'number-pad'}
          value={waiterCode}
          onChangeText={value => setWaiterCode(value)}
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
          onPress={checkPassword}
          //onPress={() => navigation.navigate(SCREENS.SharePosTestScreen)}
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
