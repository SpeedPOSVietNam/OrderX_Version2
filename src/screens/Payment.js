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
import icons, {card} from '../constants/icons';
import {COLORS, FONTS, SIZES, STYLES} from '../constants/theme';
import {HOOK_PAYMENT_METHOD} from '../hooks/react-query/usePaymentMethod';
import {fetchPostHeader, fetchPosDetail, confirmCloseTable} from '../hooks';
import {notifyMessage, toCurrency} from '../helpers/utils';
import {getWaiterID} from '../store';
import {prepareBillForPrinter} from '../helpers/printFormat';
import {paxHelper} from '../helpers/paxHelper';
import {sharePosHelper} from '../helpers/sharePosHelper';
// import {ingenicoHelper} from '../helpers/ingenicoHelper';

import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {CustomAlert} from '../components';
import {useTranslation} from 'react-i18next';

export const Payment = ({navigation, route}) => {
  const {t} = useTranslation();
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;
  const {TableNum, TRANSACT, TransactArray} = route.params;

  const [allPosDetail, setAllPosDetail] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [selectedTrans, setSlectedTrans] = useState('');
  const [posHdrByTrans, setPosHdrByTrans] = useState();
  const [paymentType, setPaymentType] = useState();
  const [amountLeft, setAmountLeft] = useState();
  const [change, setChange] = useState([
    {
      trans: '',
      value: '',
    },
  ]);
  const [cardCheck, setCardCheck] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [printReceiptCount, setPrintReceiptCount] = useState(0);
  const [paidTrans, setPaidTrans] = useState([]);
  const [paidTransAmountLeft, setPaidTransAmountLeft] = useState([]);
  const getCloseTrancsaction = tender => {
    confirmCloseTable({
      Transact: selectedTrans,
      EmpNum: getWaiterID().EmpNum,
      Tender: tender,
      MethodNum: paymentType == 'CASH' ? 1001 : 1002,
    })
      .then(res => console.log('CLOSE TRANSACION', res))
      .catch(err => console.log('CLOSE TRANSACION ERROR', err));
  };
  const posDetail = fetchPosDetail({
    Transact: selectedTrans,
  });

  const posHeader = fetchPostHeader({
    Transact: selectedTrans ? selectedTrans : JSON.stringify(TRANSACT),
  });

  const getPosDetail = () => {
    posDetail.then(res => setAllPosDetail(res)).catch(err => console.log(err));
  };
  const getPosHeader = () => {
    posHeader
      .then(res => {
        setPosHdrByTrans(res), setAmountLeft(res[0].FINALTOTAL);
      })
      .catch(err => console.log(err));
  };

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

          fontFamily: 'Arial',
          width: wp('70%'),
          paddingTop: wp('1%'),
        }}>
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
            width: wp('12%'),
          }}>
          <Text style={{color: COLORS.black, fontFamily: 'Arial'}}>
            x{item.QUAN}
          </Text>
          <Text
            style={{
              paddingLeft: wp('4%'),
              paddingRight: wp('2%'),
            }}>
            -
          </Text>
        </View>
        <View
          style={{
            fontFamily: 'Arial',
            flexDirection: 'row',
            paddingLeft: wp('2%'),
            width: wp('30%'),
          }}>
          <Text
            style={{
              fontFamily: 'Arial',
              color: COLORS.black,
            }}>
            {item.Descript}
          </Text>
        </View>
        <View
          style={{
            fontFamily: 'Arial',
            justifyContent: 'center',
            width: hp('20%'),
            paddingLeft: wp('3%'),
          }}>
          <Text
            style={{
              fontFamily: 'Arial',
              color: COLORS.black,
            }}>
            {toCurrency(item.NetCostEach)}
          </Text>
        </View>
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
          width: wp('18%'),
          height: hp('6%'),
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: hp('1%'),
          backgroundColor: item == selectedTrans ? COLORS.title : '',
          borderColor: COLORS.title,
          borderWidth: 1,
          borderRadius: 4,
          marginRight: wp('1%'),
        }}
        onPress={() => {
          setSlectedTrans(item);
        }}>
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
              fontFamily: 'Arial',
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
      setInputValue(inputValue + b.toString());
    } else if (b == '<') {
      setInputValue('');
    }
  };

  const RenderKeyboard = () => {
    return (
      <View
        style={{
          // padding: SIZES.padding,
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
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
            }}>
            {row.map((b, _index) => (
              <TouchableOpacity
                key={'keyboard-btn' + _index}
                style={{
                  ...STYLES.cardShadow,
                  flex: 1,
                  // maxWidth: wp('20%'),
                  // maxHeight: hp('20%'),
                  aspectRatio: 16 / 11,
                  borderRadius: SIZES.radius3,
                  backgroundColor: COLORS.white,
                  margin: SIZES.padding / 2,
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
    const Item = ({item, onPress, backgroundColor, textColor, bordercolor}) => (
      <TouchableOpacity
        style={{
          paddingVertical: SIZES.padding / 2,
          backgroundColor: backgroundColor,
          justifyContent: 'center',
          alignItems: 'center',
          borderColor: COLORS.title,
          borderWidth: 1,
        }}
        onPress={onPress}>
        <Image source={item.icon} />
        <Text
          style={{color: textColor, fontWeight: 'bold', fontFamily: 'Arial'}}>
          {item.Descript == 'CASH' ? t('cash') : t('card')}
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
      if (paymentType !== undefined && selectedTrans !== undefined) {
        console.log('input value', Number(inputValue));
        if (paymentType == 'CASH') {
          //TH1: Thanh toán hết mà k cần nhập số tiền
          if (Number(inputValue) == 0) {
            setPaidTrans(pre => [...pre, selectedTrans]);
            setPaidTransAmountLeft(pre => [
              ...pre,
              {
                trans: selectedTrans,
                value:
                  posHdrByTrans[0].FINALTOTAL - posHdrByTrans[0].FINALTOTAL,
                cash: posHdrByTrans[0].FINALTOTAL,
              },
            ]);
            // setAmountLeft(
            //   posHdrByTrans[0].FINALTOTAL - posHdrByTrans[0].FINALTOTAL,
            // );
            notifyMessage(t('paymentSuccessful'));
            getCloseTrancsaction(posHdrByTrans[0].FINALTOTAL);
          }
          //TH2: Thanh toán dư
          if (Number(inputValue) >= posHdrByTrans[0].FINALTOTAL) {
            setPaidTrans(pre => [...pre, selectedTrans]);
            setChange(pre => [
              ...pre,
              {
                trans: selectedTrans,
                value: Number(inputValue) - posHdrByTrans[0].FINALTOTAL,
                cash: Number(inputValue),
              },
            ]);
            // setAmountLeft(Number(inputValue) - posHdrByTrans[0].FINALTOTAL);
            notifyMessage(t('paymentSuccessful'));
            getCloseTrancsaction(posHdrByTrans[0].FINALTOTAL);
          }
          //TH3: Thanh toán nhiều dạng khác nhau
          if (
            Number(inputValue) < posHdrByTrans[0].FINALTOTAL &&
            Number(inputValue) !== 0
          ) {
            // setPaidTrans(pre => [...pre, selectedTrans]);
            //
            // if (amountLeft == undefined) {
            //   setAmountLeft(posHdrByTrans[0].FINALTOTAL - Number(inputValue));
            // }
            // if (amountLeft !== undefined) {
            //   setAmountLeft(amountLeft - Number(inputValue));
            // }
            notifyMessage(t('inputValueMustBeEqualTotalOfTheBill'));
            //Alert.alert('Caution', 'Input value must be equal the total');
          }
          //TH4 Trường hợp đang thanh toán 1 phần của bill và muốn thanh toán số còn lại
        }

        if (paymentType == 'CARD') {
          if (
            (Number(inputValue) < posHdrByTrans[0].FINALTOTAL &&
              Number(inputValue) !== 0) ||
            Number(inputValue) > posHdrByTrans[0].FINALTOTAL
          ) {
            //setCardCheck(Number(inputValue));

            notifyMessage(t('inputValueMustBeEqualTotalOfTheBill'));
          }
          if (
            Number(inputValue) == 0 ||
            Number(inputValue) == posHdrByTrans[0].FINALTOTAL
          ) {
            setCardCheck(posHdrByTrans[0].FINALTOTAL);
          }
        }
      } else {
        if (paymentType == undefined) {
          Alert.alert(t('empty'), t('pleaseChooseYourPaymentMethod'));
        }
        if (selectedTrans == undefined) {
          Alert.alert(t('empty'), t('pleaseChooseSpecificTransaction'));
        }
      }
    };

    return (
      <View>
        <FlatList
          data={HOOK_PAYMENT_METHOD}
          renderItem={renderItem}
          keyExtractor={item => item.MethodNum}
        />
        {Array.from(paidTrans).includes(selectedTrans) ? (
          <MyButton
            // onPress={() => handlePayment()}
            disable={true}
            iconStyle={{tintColor: COLORS.white}}
            title={t('paid')}
            titleStyle={{
              ...FONTS.h4,
              color: COLORS.white,
              marginLeft: SIZES.padding,
              marginRight: SIZES.padding,
              fontWeight: 'bold',
            }}
            containerStyle={{
              backgroundColor: COLORS.secondary,
              height: 100,
            }}
          />
        ) : (
          <MyButton
            onPress={() => handlePayment()}
            iconStyle={{tintColor: COLORS.white}}
            title={t('apply')}
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
          />
        )}
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

    if (result.Code === '200' && result.Response.isoResponseCode == '00') {
      notifyMessage(t(result.Response.isoResponseCode));
      setPaidTrans(pre => [...pre, selectedTrans]);
      setPaidTransAmountLeft(pre => [
        ...pre,
        {
          trans: selectedTrans,
          value: posHdrByTrans[0].FINALTOTAL - posHdrByTrans[0].FINALTOTAL,
          card: posHdrByTrans[0].FINALTOTAL,
        },
      ]);
      setCardCheck('');
      getCloseTrancsaction(posHdrByTrans[0].FINALTOTAL);
    }
    if (result.Code === '200' && result.Response.isoResponseCode !== '00') {
      setCardCheck(''),
        setPaymentType(),
        Alert.alert(t('error'), t(result.Response.isoResponseCode));
    }
    if (result.Code !== '200') {
      setCardCheck(''), setPaymentType(), Alert.alert(t('error'), result.Desc);
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
      // venueName: 'VANGNAICON',
      // venueAddress:
      //   '135 Phan Đình Phùng, Phường 17, Phú Nhuận, Thành phố Hồ Chí Minh.',
      venueName: 'SPEEDPOS',
      venueAddress: '179EF CMT8, Phường 05, Q3, Thành phố Hồ Chí Minh.',
      tableName: JSON.stringify(TableNum),
      billId: selectedTrans,
      waiterName: getWaiterID().EmpName + getWaiterID().EmpLastName,
      // numOfCust: 0,
      items: items,
      netTotal: posHdrByTrans[0].NETTOTAL,
      finalTotal: posHdrByTrans[0].FINALTOTAL,
      taxes: [{name: 'VAT 10 %', amount: posHdrByTrans[0].TAX2}],
      payments: [
        {name: paymentType, amount: posHdrByTrans[0].FINALTOTAL},
        {
          name: 'Change',
          amount: change.some(val => val.trans == selectedTrans)
            ? toCurrency(
                change.filter(val => val.trans == selectedTrans)[0].value,
              )
            : 0,
        },
      ],
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

  // listener event to handle payment
  useEffect(() => {
    if (
      (Array.from(paidTrans).includes(selectedTrans) &&
        printReceiptCount < 2) ||
      (amountLeft == 0 && printReceiptCount < 2)
    ) {
      // loop in here ??
      // if (amountLeft == 0) {
      //   setPaidTrans(pre => [...pre, selectedTrans]);
      // }
      setModalVisible(true);
    }

    if (printReceiptCount == 2) {
      setPrintReceiptCount(0);
    }
  }, [amountLeft, printReceiptCount, change, paidTrans]);

  // console.log('paidTrans', paidTrans);
  // console.log('card check', cardCheck);
  // console.log('paidTransAmountLeft', paidTransAmountLeft);
  //handle Card Pay
  useEffect(() => {
    if (paymentType == 'CARD' && cardCheck) {
      handleMiniPosPay({
        amount: cardCheck,
        addInfo: [],
        // payMethodID: 1234,
        // payTransactionID: 1234,
      });
    }
  }, [cardCheck]);

  return (
    <View
      style={{
        flex: 1,
      }}>
      <CustomAlert
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        title={'Print Successfully'}
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
            func: () => {
              if (
                paidTrans.length == TransactArray.length &&
                paidTrans.includes(selectedTrans)
              ) {
                setPaidTrans([]);
                setSlectedTrans();
                setPaymentType();
                navigation.push('TableListMain');
              }
            },
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
          <TouchableOpacity
            onPress={() => {
              setSlectedTrans(),
                setPaymentType(),
                setInputValue(''),
                setAllPosDetail(''),
                navigation.push('TableListMain');
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
            {t('payment')} - {t('table')} {JSON.stringify(TableNum)}
            {/* {t('bill')} */}
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
              flexDirection: 'column',
              backgroundColor: COLORS.white,
            }}>
            <View
              style={{
                flex: 1,
                marginLeft: wp('2%'),
                marginRight: wp('2%'),
              }}>
              <RenderDulplicateTransact />
              <View
                style={{
                  height: hp('25%'),
                  flexDirection: 'row',
                  backgroundColor: COLORS.lightGray,
                  justifyContent: 'space-between',
                }}>
                {allPosDetail.length == 0 ? (
                  <View
                    style={{
                      flex: 1,
                      flexDirection: 'column',
                      alignContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Image source={icons.empty} />
                    <Text>{t('emptyBill')}</Text>
                  </View>
                ) : (
                  <BillPayment />
                )}
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <Text style={{color: COLORS.black, fontFamily: 'Arial'}}>
                  {t('net')}
                </Text>
                <Text style={{color: COLORS.black, fontFamily: 'Arial'}}>
                  {posHdrByTrans ? toCurrency(posHdrByTrans[0].NETTOTAL) : ''}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <Text style={{color: COLORS.black, fontFamily: 'Arial'}}>
                  {t('vat')}
                </Text>
                <Text style={{color: COLORS.black, fontFamily: 'Arial'}}>
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
                  margin: hp('1%'),
                }}
              />
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <Text
                  style={{
                    color: COLORS.black,
                    fontWeight: 'bold',
                    fontFamily: 'Arial',
                  }}>
                  {t('total')}
                </Text>
                <Text
                  style={{
                    color: COLORS.black,
                    fontWeight: 'bold',
                    fontFamily: 'Arial',
                  }}>
                  {posHdrByTrans ? toCurrency(posHdrByTrans[0].FINALTOTAL) : ''}
                </Text>
              </View>

              {/* Input Cash and Card money from customer */}

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <Text style={{color: COLORS.black, fontFamily: 'Arial'}}>
                  {t('cash')}
                </Text>
                <Text style={{color: COLORS.black, fontFamily: 'Arial'}}>
                  {change.some(val => val.trans == selectedTrans)
                    ? toCurrency(
                        change.filter(val => val.trans == selectedTrans)[0]
                          .cash,
                      )
                    : paidTransAmountLeft.some(
                        val => val.trans == selectedTrans,
                      )
                    ? toCurrency(
                        paidTransAmountLeft.filter(
                          val => val.trans == selectedTrans,
                        )[0].cash,
                      )
                    : toCurrency('')}
                </Text>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <Text style={{color: COLORS.black, fontFamily: 'Arial'}}>
                  {t('card')}
                </Text>
                <Text style={{color: COLORS.black}}>
                  {' '}
                  {paidTransAmountLeft.some(val => val.trans == selectedTrans)
                    ? toCurrency(
                        paidTransAmountLeft.filter(
                          val => val.trans == selectedTrans,
                        )[0].card,
                      )
                    : toCurrency('')}
                </Text>
              </View>
              {/* change[1].trans == selectedTrans  */}
              {/* show the amount value from the bill  */}

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  backgroundColor: change.some(
                    val => val.trans == selectedTrans,
                  )
                    ? COLORS.change
                    : COLORS.amountDue,
                }}>
                <Text
                  style={{
                    color: COLORS.white,
                    fontWeight: 'bold',
                    fontFamily: 'Arial',
                  }}>
                  {change.some(val => val.trans == selectedTrans)
                    ? t('change')
                    : t('amountDue')}
                </Text>
                <Text
                  style={{
                    color: COLORS.white,
                    fontWeight: 'bold',
                    fontFamily: 'Arial',
                  }}>
                  {change.some(val => val.trans == selectedTrans)
                    ? toCurrency(
                        change.filter(val => val.trans == selectedTrans)[0]
                          .value,
                      )
                    : Array.from(paidTrans).includes(selectedTrans)
                    ? paidTransAmountLeft.some(
                        val => val.trans == selectedTrans,
                      )
                      ? toCurrency(
                          paidTransAmountLeft.filter(
                            val => val.trans == selectedTrans,
                          )[0].value,
                        )
                      : 0
                    : posHdrByTrans
                    ? toCurrency(posHdrByTrans[0].FINALTOTAL)
                    : ''}
                </Text>
              </View>

              {/* show the amount value from the input keyboard  */}
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <Text
                  style={{
                    color: COLORS.white,
                    fontWeight: 'bold',
                    fontFamily: 'Arial',
                  }}
                />
                <Text
                  style={{
                    color: COLORS.inputValue,
                    fontWeight: 'bold',
                    fontFamily: 'Arial',
                    height: hp('3%'),
                  }}>
                  {toCurrency(inputValue)}
                </Text>
              </View>
              <View
                style={{
                  marginLeft: wp('8%'),
                  width: wp('54%'),
                }}>
                <RenderKeyboard />
              </View>
            </View>
            {/* <TouchableOpacity
              onPress={() => {
                setSlectedTrans(),
                  setPaymentType(),
                  setInputValue(''),
                  setAllPosDetail([]),
                  navigation.push('TableListMain');
              }}
              style={{
                backgroundColor: COLORS.lightGray,
                height: hp('6%'),
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  fontFamily: 'Arial',
                  fontWeight: 'bold',
                  fontSize: 20,
                  color: COLORS.back,
                  textAlign: 'center',
                }}>
                {t('back')}
              </Text>
            </TouchableOpacity> */}
            <TouchableOpacity
              onPress={() => navigation.navigate('eInvoice')}
              style={{
                backgroundColor: COLORS.lightGray,
                justifyContent: 'center',
                alignItems: 'center',
                borderColor: COLORS.title,
                borderWidth: 1,
                height: hp('6%'),
              }}>
              <View
                style={{
                  justifyContent: 'center',
                  flexDirection: 'row',
                  alignContent: 'center',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    fontFamily: 'Arial',
                    fontWeight: 'bold',
                    fontSize: 15,
                    color: COLORS.back,
                    textAlign: 'center',
                    padding: 10,
                  }}>
                  {t('E - Invoice')}
                </Text>
                <Image
                  style={{height: 35, width: 35}}
                  source={icons.eInvoice}
                />
              </View>
            </TouchableOpacity>
          </View>
          <View
            style={{
              flex: 0.4,
              alignItems: 'center',
              backgroundColor: COLORS.lightGray3,
            }}>
            <RenderPaymentMethodItem navigation={navigation} />
          </View>
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
