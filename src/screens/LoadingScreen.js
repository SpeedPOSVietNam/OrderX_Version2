import React, {useEffect} from 'react';
import {Image} from 'react-native';
import * as Progress from 'react-native-progress';
import {SafeAreaView} from 'react-native-safe-area-context';
// import {GlobalLoading} from '../components';
import {addAlert, uiSelectors, useStore} from '../store';
import {useClient, usePaymentMethod, useTable, usePostHeader} from '../hooks';
import {useIsFetching} from 'react-query';
import images from '../constants/images';
import {SIZES, COLORS} from '../constants/theme';

export const LoadingScreen = ({navigation}) => {
  const setPreLoading = useStore(uiSelectors.setPreLoading);
  const allTable = useTable({});
  const posHeader = usePostHeader({});

  //#region optimize performance

  const totalFetch = 2; // NOTE: nhớ tăng biến này nếu có fetch thêm api
  //#endregion

  const isFetching = useIsFetching();
  const percent = (totalFetch - isFetching) / totalFetch;
  console.log('isFetching ne', isFetching);

  useEffect(() => {
    if (isFetching === 0) {
      if (false) {
        // addAlert({
        //   color: COLORS.danger,
        //   title: 'Missing config',
        //   message:
        //     'MobileOrder configuration for Venue is required, please contact your administrator',
        // });
      } else {
        setPreLoading(false);
      }
    }
  });

  return (
    <SafeAreaView
      style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Image
        source={images.orderx_en}
        style={{height: 65, marginBottom: SIZES.padding2}}
        resizeMode="contain"
      />
      <Progress.Bar progress={percent} width={200} color={COLORS.orderX} />
    </SafeAreaView>
  );
};
