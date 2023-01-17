import React, {useEffect, useState, useMemo, useRef} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import icons from '../constants/icons';
import {LoadingFullScreen, MyButton} from '../components';
import {COLORS, FONTS, SIZES} from '../constants/theme';
import {PasswordInputWithRevealButton, AppVersion} from '../components';
import {SCREENS} from './SCREENS';
import {fetchPostHeader, useRelativeTableNo, useTable} from '../hooks';
import {authSelectors, useStore, uiSelectors, getWaiterID} from '../store';
import {useTranslation} from 'react-i18next';

export const TableListMain = ({navigation}) => {
  const {t} = useTranslation();
  const [allTableData, setAllTableData] = useState();
  const [allPosHeader, setAllPosHeader] = useState();
  const [finalData, setFinalData] = useState();
  const [TableNo, setTableNo] = useState();
  const [duplicateTransact, setDuplicateTransact] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const setWaiterID = useStore(authSelectors.setWaiterID);
  const selectedTable = useRelativeTableNo({
    queryTbNum: TableNo,
  });

  const fetchallTable = useRelativeTableNo({});

  const allTable = async () => {
    const res = await fetchallTable;
    return setAllTableData(res);
  };
  const fetchposHeader = fetchPostHeader({});

  const posHeader = async () => {
    const res = await fetchposHeader;
    return setAllPosHeader(res);
  };
  const FetchTableData = () => {
    if (allTableData !== undefined && allPosHeader !== undefined) {
      for (let i = 0; i < allTableData.length; i++) {
        for (let x = 0; x < allPosHeader.length; x++) {
          if (allTableData[i].TableNum === allPosHeader[x].TABLENUM) {
            (allTableData[i].WHOSTART = allPosHeader[x].WHOSTART),
              (allTableData[i].TRANSACT = allPosHeader[x].TRANSACT),
              setDuplicateTransact(pre => [
                ...pre,
                [allPosHeader[x].TABLENUM, allPosHeader[x].TRANSACT],
              ]);
            setFinalData(allTableData);
          }
        }
      }
    }
    setRefreshing(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    allTable();
    posHeader();
    //setRefreshing(false);
    FetchTableData();
  };

  // get data
  useEffect(() => {
    setDuplicateTransact([]);
    allTable();
    posHeader();
    FetchTableData();
  }, [TableNo]);

  useEffect(() => {
    if (
      allPosHeader?.some(value => value.TABLENUM == TableNo) &&
      TableNo == null
    ) {
      setDuplicateTransact([]);
      posHeader();
      FetchTableData();
    }
    if (
      allPosHeader?.some(value => value.TABLENUM == TableNo) &&
      TableNo !== null
    ) {
      setDuplicateTransact([]);
      posHeader();
      FetchTableData();
    }
    if (
      !allPosHeader?.some(value => value.TABLENUM == TableNo) &&
      TableNo !== null
    ) {
      setFinalData(allTableData);
      // setDuplicateTransact([]);
      // posHeader();
      // FetchTableData();
    }
    if (!TableNo) {
      setDuplicateTransact([]);
      posHeader();
      FetchTableData();
    }
  }, [allTableData]);

  // console.log(
  //   ' allPosHeader?.some(value => value.TABLENUM) == TableNo',
  //   allPosHeader?.some(value => value.TABLENUM == TableNo) && TableNo !== null,
  // );
  // console.log(
  //   ' allPosHeader?.some(value => value.TABLENUM) == TableNo',
  //   allPosHeader?.some(value => value.TABLENUM == TableNo) && TableNo == null,
  // );

  console.log('TableNo', !TableNo);

  const checkTableValue = async () => {
    if (TableNo !== null) {
      setAllTableData('');
      const res = await selectedTable;
      return await setAllTableData(res);
    }
  };

  const TableStatusList = () => {
    let arr = [];
    let x = 0;
    const filterDulplicateTrans = tableNo => {
      while (x < duplicateTransact.length) {
        if (tableNo == duplicateTransact[x][0]) {
          arr.push(duplicateTransact[x][1]);
        }
        x++;
      }
      return arr;
    };
    const renderItem = ({item}) => (
      <TouchableOpacity
        onPress={() => {
          if (
            item.colorStatus === COLORS.TableStatusGreen ||
            item.WHOSTART == getWaiterID().EmpNum
          ) {
            navigation.navigate(SCREENS.Payment, {
              TableNum: item.TableNum,
              TRANSACT: item.TRANSACT,
              TransactArray: filterDulplicateTrans(item.TableNum),
            });
          } else if (item.WHOSTART == null) {
            Alert.alert(t('warning'), t('youCanNotPayForEmptyTable'));
          } else if (item.WHOSTART && item.WHOSTART !== getWaiterID().EmpNum) {
            Alert.alert(t('warning'), t('itBelongsToOtherWaiter'));
          }
        }}
        style={{
          width: 300,
          height: 60,
          backgroundColor:
            item.WHOSTART == getWaiterID().EmpNum
              ? COLORS.TableStatusRed
              : item.WHOSTART && item.WHOSTART !== getWaiterID().EmpNum
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
            {t('tableID')}
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
            {item.WHOSTART == getWaiterID().EmpNum
              ? t('occupied')
              : item.WHOSTART && item.WHOSTART !== getWaiterID().EmpNum
              ? t('serving')
              : item.WHOSTART == null
              ? t('empty')
              : ''}
          </Text>
        </View>
      </TouchableOpacity>
    );
    return (
      <View>
        {refreshing ? (
          <ActivityIndicator />
        ) : (
          <FlatList
            data={finalData}
            renderItem={renderItem}
            keyExtractor={(item, index) => index}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
        )}
      </View>
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
            onPress={() => {
              navigation.navigate(SCREENS.EnterWaiter), setWaiterID('');
            }}>
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
          textHolder={t('searchIDforpayment')}
          keyboardType={'number-pad'}
          value={TableNo}
          onChangeText={value => setTableNo(value)}
        />
        <MyButton
          iconStyle={{tintColor: COLORS.white}}
          title={t('search')}
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
