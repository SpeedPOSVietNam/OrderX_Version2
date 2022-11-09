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
  getWaiter,
  waiterLogin,
} from '../hooks';
import {authSelectors, useStore} from '../store';

export const EnterPassword = ({route, navigation}) => {
  const {ClientGUID, PartnerGUID, VenueGUID} = route.params;
  const [clientID, setClientID] = useState(null);
  const [venueID, setVenueID] = useState(null);
  const [clientGUID, setClientGUID] = useState(ClientGUID);
  const [venueGUID, setVenueGUID] = useState(VenueGUID);
  const setWaiterID = useStore(authSelectors.setWaiterID);

  useEffect(() => {
    if (
      clientGUID != null &&
      clientID == null &&
      venueGUID != null &&
      venueID == null
    ) {
      // setGlobalLoading('Device logging in...');
      deviceLogin()
        .then(async result => {
          const {
            ClientGUID,
            ClientID,
            VenueGUID,
            VenueID,
            DateCreated,
            DateExpired,
            DateModified,
          } = result;

          console.log('result', result);
          if (ClientID == null) {
            console.log('ClientID not found in server response.');
            // throw new Error('ClientID not found in server response.');
          } else if (VenueID == null) {
            console.log('VenueID not found in server response.');
            // throw new Error('VenueID not found in server response.');
          } else {
            // check for mobileorder config available
            const config = await getMobileOrderConfig({ClientID, VenueID});
            console.log('clientID', ClientID, 'venueID', VenueID);
            if (config[0]) {
              setClientID(ClientID);
              setVenueID(VenueID);
              // trackEvent(TRACK_EVENT_NAME.DEVICE_LOGIN, {
              //   result: 'success',
              //   ClientID,
              //   VenueID,
              // });
              console.log('Get data Success');
            } else {
              throw Error(
                `MobileOrder configuration for Venue ${venueID} is required.\n\nPlease contact your administrator.`,
              );
            }
          }
        })
        .catch(e => {
          setClientGUID(null); // remove clientGUID if device login failed
          setVenueGUID(null);
          console.log(e.message);

          // addAlert({ color: COLORS.danger, title: 'Device Login Failed', message: e.message });
        })
        .finally(() => {
          // setGlobalLoading(false);
        });
    }
  }, [clientGUID, clientID, venueGUID, venueID]);

  const checkPasswordAsync = async () => {
    const waiter = await getWaiter({
      ClientID: clientID,
      VenueID: venueID,
      PinCode: waiterCode,
    });

    if (waiter?.length === 0) {
      // trackEvent(TRACK_EVENT_NAME.WAITER_LOGIN, {
      //   result: 'failed',
      //   reason: 'Incorrect waiter code',
      //   waiterCode,
      // });
      // addAlert({
      //   title: 'Login Failed',
      //   message: 'Incorrect Waiter Code',
      //   color: COLORS.danger,
      // });
      console.log(
        'result: failed',
        'reason: Incorrect waiter code',
        waiterCode,
      );
      Alert.alert('Login Failed', 'Incorrect waiter code');
    } else if (!waiter[0].IsActive) {
      // trackEvent(TRACK_EVENT_NAME.WAITER_LOGIN, {
      //   result: 'failed',
      //   reason: 'Account deactivated',
      //   waiterCode,
      // });
      // addAlert({
      //   title: 'Account deactivated.',
      //   message: 'Contact your administrator for more detail.',
      //   color: COLORS.danger,
      // });
      Alert.alert(
        'Account deactived',
        'Contact your administrator for more detail.',
      );
    } else {
      const result = await waiterLogin({waiterID: waiter[0].WaiterID});

      const {
        ScenarioCode,
        UpdateCount,
        DateCreated,
        DateModified,
        DateExpired,
      } = result;
      // trackEvent(TRACK_EVENT_NAME.WAITER_LOGIN, {
      //   result: 'success',
      //   waiterCode,
      //   waiterID: waiter[0].WaiterID,
      // }
      console.log('result', 'success', {
        waiterCode,
        waiterID: waiter[0].WaiterID,
      });

      console.log('Check waiter device login: ', result);
      setWaiterID(waiter[0].WaiterID);
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
          justifyContent: 'space-evenly',
          alignItems: 'center',
        }}>
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
          paramIsReveal={true}
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
