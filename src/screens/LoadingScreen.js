import React, {useEffect} from 'react';
import {Image, Text} from 'react-native';
import * as Progress from 'react-native-progress';
import {SafeAreaView} from 'react-native-safe-area-context';
// import {GlobalLoading} from '../components';
import {addAlert, uiSelectors, useStore, authSelectors} from '../store';
import {useTable, fetchPostHeader} from '../hooks';
import {useIsFetching} from 'react-query';
import images from '../constants/images';
import {SIZES, COLORS} from '../constants/theme';
import {SCREENS} from './SCREENS';

export const LoadingScreen = ({navigation}) => {
  const setPreLoading = useStore(uiSelectors.setPreLoading);
  const setPosHeader = useStore(authSelectors.setPosHeader);
  const setAllTable = useStore(authSelectors.setTableData);

  const allTable = useTable({});
  const posHeader = fetchPostHeader({});
  const setEditTableMap = useStore(uiSelectors.setEditTableMap);
  useEffect(() => {
    allTable.then(res => setAllTable(res)).catch(err => console.log(err));
    posHeader.then(res => setPosHeader(res)).catch(err => console.log(err));
  }, []);

  //#region optimize performance

  const totalFetch = 2; // NOTE: nhớ tăng biến này nếu có fetch thêm api
  //#endregion

  console.log('is Fetching', isFetching);
  const isFetching = useIsFetching();
  const percent = (totalFetch - isFetching) / totalFetch;

  setTimeout(() => {
    if (allTable != '' && posHeader != '') {
      navigation.navigate(SCREENS.TableListMain);
    }
  }, 1000);

  return (
    <SafeAreaView
      style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      {/* <Image
        source={images.orderx_en}
        style={{height: 65, marginBottom: SIZES.padding2}}
        resizeMode="contain"
      /> */}
      <Progress.Bar progress={percent} width={200} color={COLORS.orderX} />
      <Text>Loading</Text>
    </SafeAreaView>
  );
};
