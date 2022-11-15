import React, {useState, useMemo} from 'react';
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
import {AppVersion} from '../components';
import {useTableServePaid, useTableServeBill} from '../hooks';
import {BillStatusNum, OrderDisplayType} from '../constants/global';
import moment from 'moment';
import {roundDecimal, toCurrency} from '../helpers/utils';

export const OrderHistory = ({navigation}) => {
  const [selectedWaiter, setSelectedWaiter] = useState(null);
  const [statusNum, setStatusNum] = useState(BillStatusNum.IN_PROGRESS);
  const tableServeBillQry = useTableServeBill({
    StatusNum: statusNum,
    OrderDisplayType: OrderDisplayType.TableServeConfirm,
  });
  const tableServeBills = useMemo(
    () =>
      tableServeBillQry.data?.pages
        ?.flat()
        ?.filter(
          _ =>
            !selectedWaiter ||
            _.FirstWaiterID === selectedWaiter?.WaiterID ||
            _.LastWaiterID === selectedWaiter?.WaiterID,
        ) || [],
    [selectedWaiter, tableServeBillQry.data?.pages],
  );

  console.log('fetch tableServeBills1 orders1', tableServeBills[0].Orders[1]);

  const RenderOrderHistory = () => {
    const RenderItem = ({item}) => (
      <View
        style={{
          flexDirection: 'column',
          width: 320,
          height: 300,
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

          <Text>{item.TableServeBillID}</Text>
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
          <Text>{item.TableCode}</Text>
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
          <Text>{moment(item.DateCreated).format('L LT')}</Text>
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
              justifyContent: 'space-between',
            }}>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text>Card</Text>
              <Text />
            </View>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text>Cash</Text>
              <Text />
            </View>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text style={{fontWeight: 'bold'}}>
                Total (checks:{item.Orders.length})
              </Text>
              <Text>{toCurrency(item.Orders[0].FinalTotal)}</Text>
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
        showsVerticalScrollIndicator={false}
        data={tableServeBills}
        renderItem={RenderItem}
        keyExtractor={item => item.TableServeBillID}
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
          flex: 0.1,
          width: '100%',
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
          Order History
        </Text>
        <Text />
      </View>
      <View
        style={{
          flex: 0.8,
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
