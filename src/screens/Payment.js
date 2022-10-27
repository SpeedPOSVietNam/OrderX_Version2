import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Image,
  useMemo,
  FlatList,
  useCallback,
} from 'react-native';
import {MyButton} from '../components';
import icons from '../constants/icons';
import {COLORS, FONTS, SIZES, STYLES} from '../constants/theme';
import {HOOK_PAYMENT_METHOD} from '../hooks/react-query/usePaymentMethod';
import {HOOK_SALE_PRICE} from '../hooks/react-query/useSalePrice';

const BillPayemnt = () => {
  const renderItem = ({item}) => (
    <View
      style={{
        paddingHorizontal: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: COLORS.lightGray,
        width: '99%',
      }}>
      <Text style={{color: COLORS.black}}>x{item.quantity}</Text>
      <Text style={{color: COLORS.black}}>{item.name}</Text>
      <Text style={{color: COLORS.black}}>
        {item.price} {item.priceUnit}
      </Text>
    </View>
  );
  return (
    <View>
      <FlatList
        data={HOOK_SALE_PRICE}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

const RenderPaymentMethodItem = () => {
  const [selectedId, setSelectedId] = useState(null);

  const Item = ({item, onPress, backgroundColor, textColor}) => (
    <TouchableOpacity
      style={{
        paddingVertical: SIZES.padding / 2,
        backgroundColor: backgroundColor,
        marginBottom: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
      onPress={onPress}>
      <Image source={item.icon} />
      <Text style={{color: textColor, fontWeight: 'bold'}}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderItem = ({item}) => {
    const backgroundColor = item.id == selectedId ? COLORS.title : COLORS.white;
    const color = item.id == selectedId ? COLORS.white : COLORS.title;

    return (
      <Item
        item={item}
        onPress={() => {
          setSelectedId(item.id), Alert.alert('You pressed');
        }}
        backgroundColor={backgroundColor}
        textColor={color}
      />
    );
  };

  return (
    <View>
      <FlatList
        data={HOOK_PAYMENT_METHOD}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        extraData={selectedId}
      />
      <MyButton
        iconStyle={{tintColor: COLORS.white}}
        title={'CHECK'}
        titleStyle={{
          ...FONTS.h3,
          color: COLORS.white,
          marginLeft: SIZES.padding,
          marginRight: SIZES.padding,
          fontWeight: 'bold',
        }}
        containerStyle={{
          backgroundColor: COLORS.title,
          height: 100,
        }}
        // onPress={checkAccessCode}
        // onPress={() => navigation.navigate(SCREENS.EnterPassword)}
      />
    </View>
  );
};

const RenderKeyboard = () => {
  return (
    <View
      style={{
        padding: SIZES.padding,
        flexGrow: 1,
      }}>
      {[
        [7, 8, 9],
        [4, 5, 6],
        [1, 2, 3],
        [0, '000', '<'],
      ].map((row, index) => (
        <View
          key={'keyboard-row' + index}
          style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
          {row.map((b, _index) => (
            <TouchableOpacity
              key={'keyboard-btn' + _index}
              style={{
                ...STYLES.cardShadow,
                flex: 1,
                maxWidth: 100,
                aspectRatio: 1,
                borderRadius: SIZES.radius3,
                backgroundColor: COLORS.white,
                margin: SIZES.padding / 4,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              // onLongPress={handleLongPressKeyboard(b)}
              // onPressIn={handlerPressKeyboard(b)}
            >
              <Text style={{...FONTS.h2, color: COLORS.black}}>{b}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ))}
    </View>
  );
};

export const Payment = ({navigation}) => {
  const [TableID, setTableID] = useState('33');
  const [BillID, setBillID] = useState('24');

  //   const tableServeBill = useMemo(
  //     () =>
  //       tableServeBillQry.data?.pages
  //         .flat()
  //         .find(_ => _.TableServeBillID === tableServeBillId) || null,
  //     [tableServeBillId, tableServeBillQry],
  //   );

  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'column',
      }}>
      <View
        style={{
          paddingHorizontal: 10,
          paddingVertical: 20,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: COLORS.white,
        }}>
        <TouchableOpacity onPress={() => navigation.push('Main')}>
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
          Payment - Table {TableID} - Bill {BillID}
        </Text>
        <Text />
      </View>
      {/* View phan duoi header  */}
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          backgroundColor: COLORS.white,
        }}>
        <View
          style={{
            flex: 0.8,
          }}>
          <BillPayemnt />
          <View
            style={{
              paddingHorizontal: 20,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <Text style={{color: COLORS.black}}>NET</Text>
            <Text style={{color: COLORS.black}}>123.000 VND</Text>
          </View>
          <View
            style={{
              paddingHorizontal: 20,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <Text style={{color: COLORS.black}}>VAT 10%</Text>
            <Text style={{color: COLORS.black}}>12.300 VND</Text>
          </View>
          <Text>
            -----------------------------------------------------------------
          </Text>
          <View
            style={{
              paddingHorizontal: 20,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <Text style={{color: COLORS.black, fontWeight: 'bold'}}>TOTAL</Text>
            <Text style={{color: COLORS.black, fontWeight: 'bold'}}>
              135.300 VND
            </Text>
          </View>

          {/* Input Cash and Card money from customer */}

          <View
            style={{
              paddingHorizontal: 20,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <Text style={{color: COLORS.black}}>Cash</Text>
            <Text style={{color: COLORS.black}}>135.300 VND</Text>
          </View>

          <View
            style={{
              paddingHorizontal: 20,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <Text style={{color: COLORS.black}}>Card</Text>
            <Text style={{color: COLORS.black}}>0 VND</Text>
          </View>

          {/* show the amount value from the bill  */}
          <View
            style={{
              paddingHorizontal: 20,
              flexDirection: 'row',
              justifyContent: 'space-between',
              backgroundColor: COLORS.amountDue,
            }}>
            <Text style={{color: COLORS.white, fontWeight: 'bold'}}>
              Amount Due
            </Text>
            <Text style={{color: COLORS.white, fontWeight: 'bold'}}>0 VND</Text>
          </View>

          {/* show the amount value from the input keyboard  */}
          <View
            style={{
              paddingHorizontal: 20,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <Text style={{color: COLORS.white, fontWeight: 'bold'}}>
              Input Value
            </Text>
            <Text style={{color: COLORS.inputValue, fontWeight: 'bold'}}>
              0 VND
            </Text>
          </View>

          <RenderKeyboard />
        </View>
        <View
          style={{
            flex: 0.3,
            alignItems: 'center',
            backgroundColor: COLORS.lightGray,
          }}>
          <RenderPaymentMethodItem />
        </View>

        <View />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
