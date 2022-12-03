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
import {prepareBillForPrinter} from '../helpers/printFormat';
import {paxHelper} from '../helpers/paxHelper';
import {getWaiterID} from '../store';
import {sharePosHelper} from '../helpers/sharePosHelper';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {CustomAlert} from '../components';

export const Payment = ({navigation, route}) => {
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;
  const {TableNum, TRANSACT, TransactArray} = route.params;
  const [allPosDetail, setAllPosDetail] = useState();
  const [inputValue, setInputValue] = useState('');
  const [selectedTrans, setSlectedTrans] = useState();
  const [posHdrByTrans, setPosHdrByTrans] = useState();
  const [paymentType, setPaymentType] = useState();
  // const [selectedId, setSelectedId] = useState(null);
  const [amountLeft, setAmountLeft] = useState();
  const [cashCheck, setCashCheck] = useState(0);
  const [cardCheck, setCardCheck] = useState(0);
  // const [allPaymentMethod, setAllPaymentMethod] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const [printReceiptCount, setPrintReceiptCount] = useState(0);

  // const printReceiptCount = useRef(1);

  const posDetail = fetchPosDetail({
    Transact: selectedTrans ? selectedTrans : JSON.stringify(TRANSACT),
  });

  const posHeader = fetchPostHeader({
    Transact: selectedTrans ? selectedTrans : JSON.stringify(TRANSACT),
  });

  //const posPaymentMethod = HOOK_PAYMENT_METHOD({});

  const getPosDetail = () => {
    posDetail.then(res => setAllPosDetail(res)).catch(err => console.log(err));
  };
  const getPosHeader = () => {
    posHeader.then(res => setPosHdrByTrans(res)).catch(err => console.log(err));
  };

  // const getPaymentMethod = () => {
  //   posPaymentMethod
  //     .then(res => setAllPaymentMethod(res))
  //     .catch(err => console.log(err));
  // };

  // useEffect(() => {
  //   if (paymentType == 'CASH') {
  //     setCashCheck(amountLeft);
  //   }
  //   if (paymentType == 'CARD') {
  //     setCardCheck(amountLeft);
  //   }
  // }, [amountLeft]);
  useEffect(() => {
    getPosDetail();
    getPosHeader();
    //getPaymentMethod();
  }, [selectedTrans]);

  const BillPayment = () => {
    const renderItem = ({item}) => (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: COLORS.lightGray,
          width: wp('67%'),
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
                  maxWidth: hp('20%'),
                  maxHeight: wp('20%'),
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
        <Text style={{color: textColor, fontWeight: 'bold'}}>
          {item.Descript}
        </Text>
      </TouchableOpacity>
    );

    const renderItem = ({item}) => {
      const backgroundColor =
        item.Descript == paymentType ? COLORS.title : COLORS.white;
      const color = item.Descript == paymentType ? COLORS.white : COLORS.title;

      return (
        <Item
          item={item}
          onPress={() => {
            setPaymentType(item.Descript);
          }}
          backgroundColor={backgroundColor}
          textColor={color}
        />
      );
    };

    const handlePayment = () => {
      if (paymentType !== undefined) {
        if (paymentType == 'CASH') {
          if (amountLeft == undefined) {
            setAmountLeft(posHdrByTrans[0].FINALTOTAL - Number(inputValue));
          }

          if (amountLeft !== undefined) {
            setAmountLeft(amountLeft - Number(inputValue));
          }
        } else {
          if (amountLeft == undefined) {
            setAmountLeft(posHdrByTrans[0].FINALTOTAL - Number(inputValue));
          }

          if (amountLeft !== undefined) {
            setAmountLeft(amountLeft - Number(inputValue));
          }
        }
      } else {
        Alert.alert('Empty', 'Please choose your payment method');
      }
    };

    return (
      <View>
        <FlatList
          data={HOOK_PAYMENT_METHOD}
          renderItem={renderItem}
          keyExtractor={item => item.MethodNum}
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

  const handleMiniPosPay = async ({amount, addInfo, payTransactionID}) => {
    let result = await sharePosHelper.makePayment({
      amount,
      addInfo,
      merchantTransId: payTransactionID,
    });
    result = JSON.parse(result);

    if (result.Code === '200') {
      console.log('Result of Card payment:', JSON.stringify(result));
      // const ipnResult = await tableServePayBillMiniPosIPN({
      //   clientGUID,
      //   payMethodID,
      //   bodyData: {
      //     // MerchantID: result.Response.merchantId,
      //     // TerminalID: result.Response.terminalId,
      //     // MerchantTransactionID: result.merchantTransId,
      //     // TransactionType,
      //     // Status, // - Pending/Success/Cancel
      //     // Currency,
      //     // Amount,
      //     // BankCode,
      //     // invoiceNo,
      //     // RefNo,
      //     PayTransactionID: payTransactionID,
      //     ResultContent: JSON.stringify(result),
      //   },
      // });
    }
  };

  const printReceipt = () => {
    let isSuccess = false;
    let printErrorMsg = '';

    //#region Print Content Preparation
    const items = allPosDetail
      // .filter((_) => _.UnitPrice > 0)
      .map(_ => ({
        qty: _.QUAN,
        name: _.Descript,
        unitPrice: _.OrigCostEach,
        totalPrice: _.QUAN * _.OrigCostEach,
        calcMode: amountLeft,
      }));
    const printContent = prepareBillForPrinter({
      venueName: 'SpeedDemo',
      venueAddress: 'SpeedDemo',
      tableName: JSON.stringify(TableNum),
      billId: selectedTrans,
      waiterName: getWaiterID().EmpName + getWaiterID().EmpLastName,
      numOfCust: 0,
      items: items,
      netTotal: posHdrByTrans[0].NETTOTAL,
      finalTotal: posHdrByTrans[0].FINALTOTAL,
      taxes: [{VAT: 0}],
      payments: paymentType,
      referenceCode: 0,
    });

    //#endregion

    //#region Perform Print

    const printModules = [
      // {
      //   name: 'INGENICO',
      //   printAvailabilityCheckFunc: ingenicoHelper.canPrint,
      //   printReadyCheckFunc: null,
      //   printFunc: ingenicoHelper.printBill,
      // },
      {
        name: 'PAX',
        printAvailabilityCheckFunc: paxHelper.printerIsAvailable,
        printReadyCheckFunc: paxHelper.printerIsReady,
        printFunc: paxHelper.printerPrint,
      },
    ];

    for (let i = 0; i < printModules.length; i++) {
      const printModule = printModules[i];

      try {
        // Validate 1: printAvailabilityCheckFunc
        const validateRes = printModule.printAvailabilityCheckFunc();
        printErrorMsg = ''; // passed => Is certain Printer is available

        // Validate 2: printReadyCheckFunc (if exists)
        if (printModule.printReadyCheckFunc) {
          try {
            printModule.printReadyCheckFunc(validateRes);
          } catch (e2) {
            printErrorMsg = e2.message;
            break;
          }
        }

        printModule.printFunc(printContent);
        setPrintReceiptCount(printReceiptCount + 1);
        isSuccess = true;
        break;
      } catch (e) {
        printErrorMsg += `<${printModule.name}>: ${e.message}\n`;
      }
    }

    //#endregion

    return {
      isSuccess,
      errorMsg: printErrorMsg,
    };
  };
  useEffect(() => {
    if (amountLeft == 0 && printReceiptCount < 3) {
      setModalVisible(true);
      // navigation.navigate(SCREENS.SuccessFul);
    }
    if (printReceiptCount == 2) {
      setPrintReceiptCount(0);
      // if (paymentType == 'CASH') {
      //   setCashCheck(amountLeft);
      // }
      // if (paymentType == 'CARD') {
      //   setCardCheck(amountLeft);
      // }
      setAmountLeft(0);
    }
  }, [amountLeft, printReceiptCount]);
  useEffect(() => {
    if (paymentType === 'CARD') {
      handleMiniPosPay({
        amount: inputValue,
        addInfo: [],
        payMethodID: 1234,
        payTransactionID: 1234,
      });
    }
  }, [paymentType]);

  return (
    <View
      style={{
        flex: 1,
      }}>
      <CustomAlert
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        title={'Print Succes'}
        message={''}
        android={{
          container: {
            backgroundColor: COLORS.white,
          },
          title: {
            color: COLORS.black,
            fontFamily: 'Roboto',
            fontSize: 26,
            fontWeight: 'bold',
          },
          message: {
            color: COLORS.lightGray,
            fontFamily: 'Roboto',
            fontSize: 16,
            fontWeight: 'regular',
          },
        }}
        buttons={[
          {
            text: 'Cancel',
          },
          {
            text: 'Print Next',
            func: () => {
              printReceipt();
            },
            styles: {
              color: COLORS.title,
              fontSize: 18,
              fontWeight: 'bold',
              fontFamily: 'Roboto',
              textTransform: 'none',
              backgroundColor: COLORS.lightGray2,
            },
          },
        ]}
      />
      <View
        style={{
          flex: 1,
          flexDirection: 'column',
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
              flex: 1,
            }}>
            <RenderDulplicateTransact />
            <View
              style={{
                height: hp('10%'),
                width: wp('100%'),
                paddingHorizontal: 20,
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <BillPayment />
            </View>
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
              <Text style={{color: COLORS.black, fontWeight: 'bold'}}>
                TOTAL
              </Text>
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
              <Text style={{color: COLORS.black}}>{toCurrency(cashCheck)}</Text>
            </View>

            <View
              style={{
                paddingHorizontal: 20,
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <Text style={{color: COLORS.black}}>Card</Text>
              <Text style={{color: COLORS.black}}>
                {' '}
                {toCurrency(cardCheck)}
              </Text>
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
            <View
              style={{
                paddingHorizontal: 20,
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <RenderKeyboard />
            </View>
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
