import React, {useState, useMemo, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Alert,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import icons from '../constants/icons';
import {COLORS, FONTS, SIZES, STYLES} from '../constants/theme';
import {HOOK_ORDER_CONFIRM_HISTORY} from '../hooks/react-query/useOrderConfirmHistory';
import {
  PasswordInputWithRevealButton,
  AppVersion,
  ChooseDate,
} from '../components';
import {
  useTableServePaid,
  useTableServeBill,
  useTransactionPayment,
  useTransactionHeader,
} from '../hooks';
import moment from 'moment';
import {roundDecimal, toCurrency} from '../helpers/utils';
import {SCREENS} from './SCREENS';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
{
  /* moment.lang('en', {
    longDateFormat : {
        LT: "hh:mm A",
        L: "MM/DD/YYYY",
        l: "M/D/YYYY",
        LL: "MMMM Do YYYY",
        ll: "MMM D YYYY",
        LLL: "MMMM Do YYYY LT",
        lll: "MMM D YYYY LT",
        LLLL: "dddd, MMMM Do YYYY LT",
        llll: "ddd, MMM D YYYY LT"
    }
}); */
}
export const OrderHistory = ({navigation}) => {
  const [isFromDatePickerVisible, setFromDatePickerVisibility] =
    useState(false);
  const [isToDatePickerVisible, setToDatePickerVisibility] = useState(false);
  const [finalFromDate, setFromDate] = useState();
  const [finalToDate, setToDate] = useState();
  const [transPayData, setTransPayData] = useState();
  const [transHeaderData, setTransHeaderData] = useState();
  const [finalData, setFinalData] = useState();
  const useTransaction = useTransactionPayment({
    FromDate: finalFromDate,
    EndDate: finalToDate,
  });

  const useTransactionHdr = useTransactionHeader({
    FromDate: finalFromDate,
    EndDate: finalToDate,
  });

  const fetchTransPay = () => {
    useTransaction
      .then(res => {
        setTransPayData(res);
      })
      .catch(err => console.log(err));
  };
  const fetchTransHeader = () => {
    useTransactionHdr
      .then(res => {
        setTransHeaderData(res);
      })
      .catch(err => console.log(err));
  };

  useEffect(() => {
    fetchTransPay();
    fetchTransHeader();
    if (transHeaderData !== undefined && transPayData !== undefined) {
      console.log('hello');
      for (let i = 0; i < transHeaderData.length; i++) {
        for (let x = 0; x < transPayData.length; x++) {
          if (transHeaderData[i].Transact === transPayData[x].Transact) {
            if (transHeaderData[i].Descript == null) {
              transHeaderData[i].Descript = transPayData[x].Descript;
              transHeaderData[i].Tender = transPayData[x].Tender;
              setFinalData(transHeaderData);
            } else if (transHeaderData[i].Descript1 == null) {
              transHeaderData[i].Descript1 = transPayData[x].Descript;
              transHeaderData[i].Tender1 = transPayData[x].Tender;
              setFinalData(transHeaderData);
            } else if (transHeaderData[i].Descript2 == null) {
              transHeaderData[i].Descript2 = transPayData[x].Descript;
              transHeaderData[i].Tender2 = transPayData[x].Tender;
              setFinalData(transHeaderData);
            }
          }
        }
      }
    }
  }, [finalFromDate, finalToDate]);

  const showFromDatePicker = () => {
    setFromDatePickerVisibility(true);
  };
  const showToDatePicker = () => {
    setToDatePickerVisibility(true);
  };
  const hideDatePicker = () => {
    setFromDatePickerVisibility(false);
    setToDatePickerVisibility(false);
  };
  const handleFromDateConfirm = date => {
    const format = 'YYYY-MM-DD';
    date = moment(date).format(format);
    setFromDate(date);
    hideDatePicker();
  };
  const handleToDateConfirm = date => {
    const format = 'YYYY-MM-DD';
    date = moment(date).format(format);
    setToDate(date);
    hideDatePicker();
  };
  const RenderOrderHistory = () => {
    const RenderItem = ({item}) => (
      <View
        style={{
          flexDirection: 'column',
          width: 320,
          height: 320,
          backgroundColor: COLORS.lightGray,
        }}>
        <View
          style={{
            flexDirection: 'row',
            paddingHorizontal: 10,
            paddingVertical: 10,
            justifyContent: 'space-between',
          }}>
          <View
            style={{
              flexDirection: 'row',
            }}>
            <Image source={icons.paidBill} />
            <Text style={{fontWeight: 'bold', left: 10}}>Bill ID</Text>
          </View>

          <Text>{item.Transact}</Text>
        </View>
        {/* Create a line to seperate the data */}
        <View style={{height: 1, backgroundColor: COLORS.lightGray2}} />

        <View
          style={{
            flexDirection: 'row',
            paddingHorizontal: 10,
            paddingVertical: 10,
            justifyContent: 'space-between',
          }}>
          <View
            style={{
              flexDirection: 'row',
            }}>
            <Image source={icons.coffeeTable} />
            <Text style={{fontWeight: 'bold', left: 10}}>Table No.</Text>
          </View>
          <Text>{item.TableNum}</Text>
        </View>

        {/* Create a line to seperate the data */}
        <View style={{height: 1, backgroundColor: COLORS.lightGray2}} />

        <View
          style={{
            flexDirection: 'row',
            paddingHorizontal: 10,
            paddingVertical: 10,
            justifyContent: 'space-between',
          }}>
          <View style={{flexDirection: 'row'}}>
            <Image source={icons.clock} />
            <Text style={{fontWeight: 'bold', left: 10}}>Close time</Text>
          </View>
          <Text>{moment(item.TimeEnd).format('YYYY-MM-DD')}</Text>
        </View>
        {/* Create a line to seperate the data */}
        <View style={{height: 1, backgroundColor: COLORS.lightGray2}} />
        <View
          style={{
            flexDirection: 'column',
            paddingHorizontal: 10,
            paddingVertical: 10,
          }}>
          <View
            style={{
              flexDirection: 'row',
            }}>
            <Image source={icons.paymentMethod} />
            <Text style={{fontWeight: 'bold', left: 10}}>Payment Method</Text>
          </View>

          <View
            style={{
              paddingHorizontal: 35,
              flexDirection: 'column',
            }}>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text>
                {item.Descript == 'CREDIT CARD'
                  ? 'Card'
                  : item.Descript == 'CASH'
                  ? 'Cash'
                  : ''}
              </Text>
              <Text>
                {item.Descript == 'CREDIT CARD'
                  ? toCurrency(item.Tender)
                  : item.Descript == 'CASH'
                  ? toCurrency(item.Tender)
                  : ''}
              </Text>
            </View>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text>
                {item.Descript1 == 'CREDIT CARD'
                  ? 'Card'
                  : item.Descript1 == 'CASH'
                  ? 'Cash'
                  : ''}
              </Text>
              <Text>
                {item.Tender1 == 'CREDIT CARD'
                  ? toCurrency(item.Tender1)
                  : item.Tender1 == 'CASH'
                  ? toCurrency(item.Tender1)
                  : ''}
              </Text>
            </View>

            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text style={{fontWeight: 'bold'}}>Total</Text>
              <Text>{toCurrency(item.FinalTotal)}</Text>
            </View>
          </View>
        </View>
        {/* Create a line to seperate the data */}
        <View style={{height: 1, backgroundColor: COLORS.lightGray2}} />

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingHorizontal: 10,
            paddingVertical: 10,
          }}>
          <View style={{flexDirection: 'row'}}>
            <Image source={icons.query} />
            <Text style={{fontWeight: 'bold', left: 10}}>Payment Status</Text>
          </View>

          <Image source={icons.success20px} />
        </View>
        {/* Create a line to seperate the data */}
        <View style={{flex: 1, height: 1, backgroundColor: COLORS.white}} />
      </View>
    );
    return (
      <FlatList
        showsVerticalScrollIndicator={true}
        data={finalData}
        renderItem={RenderItem}
        keyExtractor={(item, index) => index}
      />
    );
  };
  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: COLORS.white,
      }}>
      <View
        style={{
          width: '100%',
          paddingHorizontal: 10,
          paddingVertical: 20,
          flexDirection: 'column',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: COLORS.white,
        }}>
        <View
          style={{
            width: '100%',
            paddingHorizontal: 10,
            paddingVertical: 20,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: COLORS.white,
          }}>
          <TouchableOpacity
            onPress={() => navigation.push(SCREENS.TableListMain)}>
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
            Order History
          </Text>
          <Text />
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignSelf: 'center',
          }}>
          <TouchableOpacity onPress={showFromDatePicker}>
            <PasswordInputWithRevealButton
              paramIsReveal={true}
              RighImageSrc1={icons.arrowDown}
              textHolder={finalFromDate ? finalFromDate : 'From Date'}
              value={''}
              onChangeText={''}
              disable={true}
              editable={false}
              width={150}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={showToDatePicker}>
            <PasswordInputWithRevealButton
              paramIsReveal={true}
              RighImageSrc1={icons.arrowDown}
              textHolder={finalToDate ? finalToDate : 'To Date'}
              value={''}
              onChangeText={''}
              disable={true}
              editable={false}
              width={150}
            />
          </TouchableOpacity>
          <DateTimePickerModal
            isVisible={isFromDatePickerVisible || isToDatePickerVisible}
            mode="date"
            onConfirm={
              isFromDatePickerVisible
                ? handleFromDateConfirm
                : handleToDateConfirm
            }
            onCancel={hideDatePicker}
          />
        </View>
      </View>

      <View
        style={{
          flex: 0.9,
          justifyContent: 'flex-end',
          alignSelf: 'center',
        }}>
        <RenderOrderHistory />
      </View>

      <View
        style={{
          flex: 0.1,
          justifyContent: 'flex-end',
          alignSelf: 'center',
        }}>
        <AppVersion />
      </View>
    </View>
  );
};
