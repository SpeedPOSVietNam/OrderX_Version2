import React, {useEffect, useState, useMemo, useRef} from 'react';
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
import {LoadingFullScreen, MyButton} from '../components';
import {COLORS, FONTS, SIZES} from '../constants/theme';
import {PasswordInputWithRevealButton, AppVersion} from '../components';
import {SCREENS} from './SCREENS';
import {usePostHeader, useRelativeTableNo, useTable} from '../hooks';
import {getWaiterID} from '../store';
import {uiSelectors, useStore} from '../store';
export const TableListMain = ({navigation}) => {
  const [allTableData, setAllTableData] = useState();
  const [allPosHeader, setAllPosHeader] = useState();
  const [finalData, setFinalData] = useState();
  const [TableNo, setTableNo] = useState('');
  const allTable = useTable({});
  const posHeader = usePostHeader({});

  const selectedTable = useRelativeTableNo({
    queryTbNum: TableNo,
  });

  const FetchTableData = () => {
    allTable.then(res => setAllTableData(res)).catch(err => console.log(err));
    posHeader.then(res => setAllPosHeader(res)).catch(err => console.log(err));

    console.log('Check data status', allTableData, allPosHeader);
    if (allTableData !== undefined && allPosHeader !== undefined) {
      for (let i = 0; i < allTableData.length; i++) {
        for (let x = 0; x < allPosHeader.length; x++) {
          if (allTableData[i].TableNum === allPosHeader[x].TABLENUM) {
            (allTableData[i].WHOSTART = allPosHeader[x].WHOSTART),
              (allTableData[i].TRANSACT = allPosHeader[x].TRANSACT),
              setFinalData(allTableData);
          }
        }
      }
    }
  };

  // console.log('fetch pos header', finalData);
  // console.log('fetch waiter id ', getWaiterID());
  useEffect(() => {
    FetchTableData();
  }, [TableNo]);

  // console.log('Table No', TableNo);
  // console.log('all table data', allTableData);
  const checkTableValue = () => {
    if (TableNo !== '') {
      selectedTable
        .then(result => {
          setFinalData(result);
        })
        .catch(err => console.log(err));
    }
  };

  const TableStatusList = () => {
    const renderItem = ({item}) => (
      <TouchableOpacity
        onPress={() => {
          if (
            item.colorStatus === COLORS.TableStatusGreen ||
            item.WHOSTART == getWaiterID()
          ) {
            navigation.navigate(SCREENS.Payment, {
              TableNum: item.TableNum,
              TRANSACT: item.TRANSACT,
            });
          } else if (item.WHOSTART == null) {
            Alert.alert('ERROR', 'You can not pay for empty table.');
          } else if (item.WHOSTART && item.WHOSTART !== getWaiterID()) {
            Alert.alert('ERROR', 'It belongs to other waiter.');
          }
        }}
        style={{
          width: 300,
          height: 60,
          backgroundColor:
            item.WHOSTART == getWaiterID()
              ? COLORS.TableStatusRed
              : item.WHOSTART && item.WHOSTART !== getWaiterID()
              ? COLORS.TableStatusYellow
              : item.WHOSTART == null
              ? COLORS.TableStatusBlue
              : '',
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
            {item.TableNum}
          </Text>
          <Text
            style={{
              color: COLORS.white,
              fontWeight: 'bold',
              fontSize: SIZES.h4,
            }}>
            {item.WHOSTART == getWaiterID()
              ? 'Occupied'
              : item.WHOSTART && item.WHOSTART !== getWaiterID()
              ? 'Serving'
              : item.WHOSTART == null
              ? 'Empty'
              : ''}
          </Text>
        </View>
      </TouchableOpacity>
    );
    return (
      <FlatList
        data={finalData}
        renderItem={renderItem}
        keyExtractor={item => item.TableNum}
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
          source={require('../assets/images/speed-logo.png')}
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
            onPress={() => navigation.navigate(SCREENS.EnterWaiter)}>
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
          value={TableNo}
          onChangeText={value => setTableNo(value)}
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
          onPress={() => checkTableValue()}
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
