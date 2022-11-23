import React, {useEffect, useRef, useState} from 'react';
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
  Dimensions,
} from 'react-native';
import {MyButton} from '../components';
import icons from '../constants/icons';
import {COLORS, FONTS, SIZES, STYLES} from '../constants/theme';
import {HOOK_PAYMENT_METHOD} from '../hooks/react-query/usePaymentMethod';
import {fetchPostHeader, fetchPosDetail} from '../hooks';
import {SCREENS} from './SCREENS';
import {roundDecimal, toCurrency} from '../helpers/utils';

export const Payment = ({navigation, route}) => {
  const {TableNum, TRANSACT, TransactArray} = route.params;
  const [allPosDetail, setAllPosDetail] = useState();
  const [inputValue, setInputValue] = useState('');
  const [selectedTrans, setSlectedTrans] = useState();
  const [posHdrByTrans, setPosHdrByTrans] = useState();
  const [paymentType, setPaymentType] = useState();
  const [amountLeft, setAmountLeft] = useState();

  const posDetail = fetchPosDetail({
    Transact: selectedTrans ? selectedTrans : JSON.stringify(TRANSACT),
  });

  const posHeader = fetchPostHeader({
    Transact: selectedTrans ? selectedTrans : JSON.stringify(TRANSACT),
  });

  const getPosDetail = () => {
    posDetail.then(res => setAllPosDetail(res)).catch(err => console.log(err));
  };
  const getPosHeader = () => {
    posHeader.then(res => setPosHdrByTrans(res)).catch(err => console.log(err));
  };

  useEffect(() => {
    getPosDetail();
    getPosHeader();
  }, [selectedTrans, TRANSACT]);

  const BillPayment = () => {
    const renderItem = ({item}) => (
      <View
        style={{
          paddingHorizontal: 20,
          flexDirection: 'row',
          justifyContent: 'space-between',
          backgroundColor: COLORS.lightGray,
          width: '99%',
        }}>
        <Text style={{color: COLORS.black}}>x{item.QUAN}</Text>
        <Text style={{color: COLORS.black}}>{item.Descript}</Text>
        <Text style={{color: COLORS.black}}>
          {toCurrency(item.NetCostEach)}
        </Text>
      </View>
    );
    return (
      <View>
        <FlatList
          data={allPosDetail}
          renderItem={renderItem}
          keyExtractor={item => item.UNIQUEID}
        />
      </View>
    );
  };

  const RenderDulplicateTransact = () => {
    const renderItem = ({item, index}) => (
      <TouchableOpacity
        style={{
          width: SIZES.padding2 * 4.5,
          height: 42,
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 2,
          backgroundColor: item == selectedTrans ? COLORS.title : '',
          borderColor: COLORS.title,
          borderWidth: 1,
          borderRadius: 3,
          marginLeft: 5,
        }}
        onPress={() => setSlectedTrans(item)}>
        <Text
          style={{
            ...FONTS.h2,
            color: item == selectedTrans ? COLORS.white : COLORS.title,
          }}>
          {index + 1}
        </Text>
        <View
          style={{
            width: '100%',
            paddingHorizontal: SIZES.padding,
          }}>
          <Text
            style={{
              textAlign: 'center',
              lineHeight: 15,
              marginBottom: 5,
              color: item == selectedTrans ? COLORS.white : COLORS.title,
            }}>
            {item}
          </Text>
        </View>
      </TouchableOpacity>
    );
    return (
      <View>
        <FlatList
          data={TransactArray}
          renderItem={renderItem}
          horizontal={true}
          keyExtractor={(item, index) => index}
        />
      </View>
    );
  };
  const handlerPressKeyboard = b => {
    if (b !== '<') {
      if (inputValue !== null) {
        setInputValue();
      }
      setInputValue(inputValue + b.toString());
    } else if (b == '<') {
      setInputValue(0);
    }
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
                  maxWidth: '100%',
                  aspectRatio: 1,
                  borderRadius: SIZES.radius3,
                  backgroundColor: COLORS.white,
                  margin: SIZES.padding / 3,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onPress={() => handlerPressKeyboard(b)}>
                <Text style={{...FONTS.h2, color: COLORS.black}}>{b}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
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
      const backgroundColor =
        item.id == selectedId ? COLORS.title : COLORS.white;
      const color = item.id == selectedId ? COLORS.white : COLORS.title;

      return (
        <Item
          item={item}
          onPress={() => {
            setSelectedId(item.id),
              Alert.alert('Confirm your choice?'),
              setPaymentType(item.name);
          }}
          backgroundColor={backgroundColor}
          textColor={color}
        />
      );
    };

    const handlePayment = () => {
      console.log('amountLeft', amountLeft);
      if (amountLeft == undefined) {
        setAmountLeft(posHdrByTrans[0].FINALTOTAL - Number(inputValue));
      }
      if (amountLeft !== undefined) {
        setAmountLeft(amountLeft - Number(inputValue));
      }
    };
    useEffect(() => {
      if (amountLeft == 0) {
        console.log('SUCCESSFUL');
        navigation.navigate(SCREENS.SuccessFul);
      }
    }, [amountLeft]);
    return (
      <View>
        <FlatList
          data={HOOK_PAYMENT_METHOD}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          extraData={selectedId}
        />

        <MyButton
          onPress={() => handlePayment()}
          iconStyle={{tintColor: COLORS.white}}
          title={'CHECK'}
          titleStyle={{
            ...FONTS.h4,
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

  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;

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
        width: windowWidth,
        height: windowHeight,
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
        <TouchableOpacity onPress={() => navigation.push('TableListMain')}>
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
          Payment - Table {JSON.stringify(TableNum)}
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
            height: 100,
          }}>
          <RenderDulplicateTransact />

          <BillPayment />
          <View
            style={{
              paddingHorizontal: 20,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <Text style={{color: COLORS.black}}>NET</Text>
            <Text style={{color: COLORS.black}}>
              {posHdrByTrans ? toCurrency(posHdrByTrans[0].NETTOTAL) : ''}
            </Text>
          </View>
          <View
            style={{
              paddingHorizontal: 20,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <Text style={{color: COLORS.black}}>VAT</Text>
            <Text style={{color: COLORS.black}}>
              {posHdrByTrans
                ? posHdrByTrans[0].TAX1 !== 0
                  ? toCurrency(posHdrByTrans[0].TAX1)
                  : posHdrByTrans[0].TAX2 !== 0
                  ? toCurrency(posHdrByTrans[0].TAX2)
                  : posHdrByTrans[0].TAX3 !== 0
                  ? toCurrency(posHdrByTrans[0].TAX3)
                  : posHdrByTrans[0].TAX4 !== 0
                  ? toCurrency(posHdrByTrans[0].TAX4)
                  : posHdrByTrans[0].TAX5 !== 0
                  ? toCurrency(posHdrByTrans[0].TAX5)
                  : ''
                : ''}
            </Text>
          </View>
          <View
            style={{
              borderStyle: 'dotted',
              borderWidth: 1,
              borderRadius: 1,
              margin: 10,
            }}
          />
          <View
            style={{
              paddingHorizontal: 20,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <Text style={{color: COLORS.black, fontWeight: 'bold'}}>TOTAL</Text>
            <Text style={{color: COLORS.black, fontWeight: 'bold'}}>
              {posHdrByTrans ? toCurrency(posHdrByTrans[0].FINALTOTAL) : ''}
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
            <Text style={{color: COLORS.black}}>{toCurrency(inputValue)}</Text>
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
            <Text style={{color: COLORS.white, fontWeight: 'bold'}}>
              {toCurrency(amountLeft)}
            </Text>
          </View>

          {/* show the amount value from the input keyboard  */}
          <View
            style={{
              paddingHorizontal: 20,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <Text style={{color: COLORS.white, fontWeight: 'bold'}} />
            <Text style={{color: COLORS.inputValue, fontWeight: 'bold'}}>
              {toCurrency(inputValue)}
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
          <RenderPaymentMethodItem navigation={navigation} />
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
