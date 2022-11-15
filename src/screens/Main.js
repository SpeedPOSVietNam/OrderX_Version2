import React, {useEffect, useState, useMemo} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  Alert,
  RefreshControl,
} from 'react-native';
import icons from '../constants/icons';
import {MyButton} from '../components';
import {COLORS, FONTS, SIZES} from '../constants/theme';
import {PasswordInputWithRevealButton, AppVersion} from '../components';
import {SCREENS} from './SCREENS';
import {ObjectType, getTableColor} from '../constants/global';
import {
  useTableServeMap,
  useTableServeMapSection,
  useTableServeMapTable,
  useTable,
  useWaiter,
  getTable,
  useClient,
} from '../hooks';
import {authSelectors, useStore} from '../store';
import {base64Icon} from '../helpers/utils';

export const Main = ({navigation}) => {
  const client = useClient();
  const waiterID = useStore(authSelectors.waiterID);

  const allTable = useTable({});
  const waitersData = useWaiter({});
  const tableServeMap = useTableServeMap({});
  const tableServeMapTable = useTableServeMapTable({});
  const tableServeMapSection = useTableServeMapSection({});

  // console.log('FETCH allTable 1', allTable);
  // console.log('FETCH waitersData 1', waitersData);
  // console.log('FETCH tableServeMap 1', tableServeMap);
  // console.log('FETCH tableServeMapTable 1', tableServeMapTable);
  // console.log('FETCH tableServeMapSection 1', allTable);
  // const [refreshing, setRefreshing] = useState(false);
  // const onRefresh = React.useCallback(() => {
  //   setRefreshing(true);
  //   setTimeout(() => {
  //     dataOfTable
  //   }, 2000)
  //   .then(() => setRefreshing(false));
  // }, []);

  const dataOfTable = useMemo(() => {
    if (
      allTable.data == null ||
      tableServeMap.data == null ||
      tableServeMapSection.data == null ||
      tableServeMapTable.data == null ||
      waitersData.data == null
    ) {
      return [];
    }
    console.log('RUNNN1Q');
    return (
      tableServeMapSection.data?.map(section => {
        const tableServeMapOfThisSection = tableServeMap.data?.find(
          _ => _.TableServeMapSectionID === section.TableServeMapSectionID,
        );
        if (tableServeMapOfThisSection) {
          try {
            const shapesInSection = JSON.parse(
              tableServeMapOfThisSection.MapValue,
            );

            const tables = shapesInSection
              .filter(_ => _.objectType === ObjectType.TABLE)
              .map(_ => {
                const {
                  StatusNum,
                  LastWaiterID,
                  LastCustomerCount,
                  LastServeBill,
                } =
                  tableServeMapTable.data?.find(
                    __ => __.TableID === _.tableID,
                  ) || {};
                const firstWaiterID = LastServeBill?.FirstWaiterID;
                const tableCode = allTable.data?.find(
                  __ => __.TableID === _.tableID,
                )?.TableCode;
                const firstServedWaiter = waitersData.data?.find(
                  __ => __.WaiterID === firstWaiterID,
                );
                const lastServedWaiter = waitersData.data?.find(
                  __ => __.WaiterID === LastWaiterID,
                );
                const isOpenByLoggedInWaiter =
                  firstServedWaiter?.WaiterID === waiterID;
                return {
                  tableCode: tableCode,
                  firstServedWaiter: firstServedWaiter,
                  lastServedWaiter: lastServedWaiter,
                  lastCustomersCount: LastCustomerCount,
                  status: StatusNum,
                  color: getTableColor(StatusNum, isOpenByLoggedInWaiter),
                };
              });
            return {
              tableS: [...tables],
            };
          } catch (e) {
            console.log('ERROR PARSE MAP DATA: ' + e.message);
          }
        }
      }) || []
    );
  }, [
    waitersData.data,
    allTable.data,
    tableServeMap.data,
    tableServeMapSection.data,
    tableServeMapTable.data,
    waiterID,
  ]);

  // console.log('data Of Table', dataOfTable[0]);

  const TableStatusList = () => {
    const renderItem = ({item}) => (
      <TouchableOpacity
        onPress={() => {
          if (
            item.colorStatus === COLORS.TableStatusGreen ||
            item.color === getTableColor(2, true)
          ) {
            navigation.navigate(SCREENS.Payment);
          } else if (item.color === getTableColor(0, false)) {
            Alert.alert('ERROR', 'You can not pay for empty table.');
          } else if (item.color === getTableColor(1, false)) {
            Alert.alert('ERROR', 'It belongs to other waiter.');
          }
        }}
        style={{
          width: 300,
          height: 60,
          backgroundColor: item.color,
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
            {item.tableCode}
          </Text>
          <Text
            style={{
              color: COLORS.white,
              fontWeight: 'bold',
              fontSize: SIZES.h4,
            }}>
            {item.status == 0
              ? 'EMPTY'
              : item.status == 1
              ? 'SERVING'
              : item.status == 2
              ? 'OCCUPIED'
              : '...'}
          </Text>
        </View>
      </TouchableOpacity>
    );
    return (
      <FlatList
        data={dataOfTable[0]?.tableS || ''}
        renderItem={renderItem}
        keyExtractor={item => item.TableCode}
        // refreshControl={<RefreshControl
        //   refreshing={refreshing}
        //   onRefresh={onRefresh}
        // />}
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
          flex: 0.5,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <Image
          source={{uri: base64Icon(client.data?.ImageData)}}
          style={{width: 150, height: 150}}
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
          flex: 0.8,
          justifyContent: 'space-evenly',
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
            marginBottom: SIZES.padding2,
          }}
          onPress={() => Alert.alert('Searched Successfully!')}
        />
      </View>

      <View
        style={{
          flex: 2.5,
          alignItems: 'center',
        }}>
        <TableStatusList />
      </View>
      <View
        style={{
          flex: 0.5,
          justifyContent: 'flex-end',
          alignSelf: 'center',
        }}>
        <AppVersion />
      </View>
    </View>
  );
};
