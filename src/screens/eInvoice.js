import React, {useState} from 'react';
import {
  Text,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import icons from '../constants/icons';
import {COLORS, FONTS, SIZES, STYLES} from '../constants/theme';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {MyButton} from '../components';

export const eInvoice = ({navigation}) => {
  const [retailCus, setRetaiCus] = useState(false);
  const [detailBill, setDetailBill] = useState(false);

  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;
  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'white',
        width: windowWidth,
        height: windowHeight,
      }}>
      <View
        style={{
          paddingHorizontal: wp('2%'),
          paddingVertical: hp('1%'),
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: COLORS.lightGray,
        }}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}>
          <Image
            source={icons.arrowLeft}
            style={{width: 25, height: 25}}
            resizeMode={'contain'}
          />
        </TouchableOpacity>
        <Text
          style={{
            color: COLORS.title,
            fontWeight: 'bold',
            fontSize: SIZES.body2,
            fontFamily: 'Arial',
          }}>
          E - Invoice
        </Text>
        <Text />
      </View>
      <View>
        <ScrollView>
          <View
            style={{
              flex: 1,
              padding: SIZES.padding,
              flexDirection: 'column',
              backgroundColor: COLORS.white,
            }}>
            <View
              style={{
                padding: SIZES.padding,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Text style={{...FONTS.body4}}>Tax code</Text>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              />
              <TextInput
                style={{
                  padding: SIZES.padding,
                  marginLeft: 5,
                  color: 'black',
                  backgroundColor: 'white',
                  borderRadius: 5,
                  height: hp('5%'),
                  width: wp('60%'),
                  fontSize: 14,
                  borderColor: 'black',
                  borderWidth: 1,
                }}
                placeholder={'0305066541'}
              />
            </View>

            <View
              style={{
                padding: SIZES.padding,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Text style={{...FONTS.body4}}>Customer's name</Text>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              />
              <TextInput
                style={{
                  padding: SIZES.padding,
                  marginLeft: 5,
                  color: 'black',
                  backgroundColor: 'white',
                  borderRadius: 5,
                  height: hp('5%'),
                  width: wp('60%'),
                  fontSize: 14,
                  borderColor: 'black',
                  borderWidth: 1,
                }}
              />
            </View>
            <View
              style={{
                padding: SIZES.padding,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Text style={{...FONTS.body4}}>Company</Text>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              />
              <TextInput
                style={{
                  padding: SIZES.padding,
                  marginLeft: 5,
                  color: 'black',
                  backgroundColor: 'white',
                  borderRadius: 5,
                  height: hp('10%'),
                  width: wp('60%'),
                  fontSize: 14,
                  borderColor: 'black',
                  borderWidth: 1,
                }}
                multiline={true}
                placeholder={'CÔNG TY CỔ PHẦN THƯƠNG MẠI TRUYỀN THÔNG TỐC ĐỘ'}
              />
            </View>

            <View
              style={{
                padding: SIZES.padding,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Text style={{...FONTS.body4}}>Address</Text>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              />
              <TextInput
                style={{
                  padding: SIZES.padding,
                  marginLeft: 5,
                  color: 'black',
                  backgroundColor: 'white',
                  borderRadius: 5,
                  height: hp('10%'),
                  width: wp('60%'),
                  fontSize: 14,
                  borderColor: 'black',
                  borderWidth: 1,
                }}
                multiline={true}
                placeholder={
                  '728-730 Võ Văn Kiệt, Phường 01, Quận 5, Thành phố Hồ Chí Minh, Việt Nam'
                }
              />
            </View>

            <View
              style={{
                padding: SIZES.padding,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Text style={{...FONTS.body4}}>Email</Text>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              />
              <TextInput
                style={{
                  padding: SIZES.padding,
                  marginLeft: 5,
                  color: 'black',
                  backgroundColor: 'white',
                  borderRadius: 5,
                  height: hp('5%'),
                  width: wp('60%'),
                  fontSize: 14,
                  borderColor: 'black',
                  borderWidth: 1,
                }}
              />
            </View>

            <View
              style={{
                padding: SIZES.padding,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Text style={{...FONTS.body4}}>Description</Text>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              />
              <TextInput
                style={{
                  padding: SIZES.padding,
                  marginLeft: 5,
                  color: 'black',
                  backgroundColor: 'white',
                  borderRadius: 5,
                  height: hp('5%'),
                  width: wp('60%'),
                  fontSize: 14,
                  borderColor: 'black',
                  borderWidth: 1,
                }}
                placeholder={'F&B'}
              />
            </View>

            <View
              style={{
                padding: SIZES.padding,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Text style={{...FONTS.body4}}>Release date</Text>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              />
              <TextInput
                style={{
                  padding: SIZES.padding,
                  marginLeft: 5,
                  color: 'black',
                  backgroundColor: 'white',
                  borderRadius: 5,
                  height: hp('5%'),
                  width: wp('60%'),
                  fontSize: 14,
                  borderColor: 'black',
                  borderWidth: 1,
                }}
                placeholder={'27/03/2023'}
              />
            </View>

            <View
              style={{
                padding: SIZES.padding,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Text style={{...FONTS.body4}}>Phone number</Text>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              />
              <TextInput
                style={{
                  padding: SIZES.padding,
                  marginLeft: 5,
                  color: 'black',
                  backgroundColor: 'white',
                  borderRadius: 5,
                  height: hp('5%'),
                  width: wp('60%'),
                  fontSize: 14,
                  borderColor: 'black',
                  borderWidth: 1,
                }}
                placeholder={'0862862295'}
              />
            </View>

            <View
              style={{
                padding: SIZES.padding,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Text style={{...FONTS.body4}}>Note</Text>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              />
              <TextInput
                style={{
                  padding: SIZES.padding,
                  marginLeft: 5,
                  color: 'black',
                  backgroundColor: 'white',
                  borderRadius: 5,
                  height: hp('5%'),
                  width: wp('60%'),
                  fontSize: 14,
                  borderColor: 'black',
                  borderWidth: 1,
                }}
              />
            </View>

            <View
              style={{
                padding: SIZES.padding,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Text style={{...FONTS.body4}}>Payments</Text>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              />
              <TextInput
                style={{
                  padding: SIZES.padding,
                  marginLeft: 5,
                  color: 'black',
                  backgroundColor: 'white',
                  borderRadius: 5,
                  height: hp('5%'),
                  width: wp('60%'),
                  fontSize: 14,
                  borderColor: 'black',
                  borderWidth: 1,
                }}
                placeholder={'TM/CK'}
              />
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};
