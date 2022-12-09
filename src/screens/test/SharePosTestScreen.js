import React, {useState, useRef, useEffect} from 'react';
import {Text, TextInput, TouchableOpacity, View} from 'react-native';
import {sharePosHelper, SHAREPOS_CONSTANTS} from '../../helpers/sharePosHelper';

export const SharePosTestScreen = () => {
  // const id = 'com.wdvn.sharepos.pax';
  // const result = await SendIntentAndroid.isAppInstalled(id);
  // const opened = SendIntentAndroid.openApp(id);
  // console.log('handleSendIntent', result);

  const [log, setLog] = useState('');

  const textInputRef = useRef(null);
  useEffect(() => {
    textInputRef?.current?.scrollToEnd && textInputRef.current.scrollToEnd();
  }, [log]);

  const addLog = newLog => {
    setLog(pre => `${pre}\n\n${newLog}`);
  };

  const payment = async () => {
    try {
      const result = await sharePosHelper.makePayment({amount: 1000});
      addLog(result);
      console.log(result);
    } catch (e) {
      addLog('[ERROR] ' + e);
    }
  };

  const settle = async () => {
    try {
      const result = await sharePosHelper.settle({bankCode: 'EIB'});
      addLog(result);
    } catch (e) {
      addLog('[ERROR] ' + e);
    }
  };

  const checkSettle = async () => {
    try {
      const result = await sharePosHelper.checkSettlement({bankCode: 'EIB'});
      addLog(result);
    } catch (e) {
      addLog('[ERROR] ' + e);
    }
  };

  const homeApp = async () => {
    try {
      const result = await sharePosHelper.homeApp({bankCode: 'EIB'});
      addLog(result);
    } catch (e) {
      addLog('[ERROR] ' + e);
    }
  };

  const setting = async () => {
    try {
      const result = await sharePosHelper.setting({bankCode: 'EIB'});
      addLog(result);
    } catch (e) {
      addLog('[ERROR] ' + e);
    }
  };

  const autoInitialize = async () => {
    try {
      const result = await sharePosHelper.autoInitialize({
        bankCode: 'EIB',
        refNo: '16001600',
        ip: '113.161.81.81',
        port: '11191',
        nii: '004',
        enableEncrypt: 'true',
        typeEncrypt: SHAREPOS_CONSTANTS.encryptType.HEXHL,
      });
      addLog(result);
    } catch (e) {
      addLog('[ERROR] ' + e);
    }
  };

  const printLastSettlement = async () => {
    try {
      let result = await sharePosHelper.executeEvent({
        bankCode: 'EIB',
        tranxType: SHAREPOS_CONSTANTS.tranxType.PRINT_LAST_SETTLEMENT,
      });
      addLog(result);
    } catch (e) {
      addLog('[ERROR] ' + e);
    }
  };

  const printLastTrans = async () => {
    try {
      let result = await sharePosHelper.executeEvent({
        bankCode: 'EIB',
        tranxType: SHAREPOS_CONSTANTS.tranxType.PRINT_LAST_TRANSACTION,
      });
      addLog(result);
    } catch (e) {
      addLog('[ERROR] ' + e);
    }
  };

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <TextInput
        ref={textInputRef}
        value={log}
        multiline={true}
        textAlignVertical="top"
        style={{width: '90%', height: 150, backgroundColor: '#ddd', margin: 5}}
      />
      <TouchableOpacity
        onPress={payment}
        style={{padding: 10, backgroundColor: '#ddd'}}>
        <Text>Payment</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={settle}
        style={{padding: 10, backgroundColor: '#ddd'}}>
        <Text>Settle</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={checkSettle}
        style={{padding: 10, backgroundColor: '#ddd'}}>
        <Text>CheckSettlement</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={homeApp}
        style={{padding: 10, backgroundColor: '#ddd'}}>
        <Text>HomeApp</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={setting}
        style={{padding: 10, backgroundColor: '#ddd'}}>
        <Text>Setting</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={autoInitialize}
        style={{padding: 10, backgroundColor: '#ddd'}}>
        <Text>Auto initialize</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={printLastSettlement}
        style={{padding: 10, backgroundColor: '#ddd'}}>
        <Text>Print last settlement</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={printLastTrans}
        style={{padding: 10, backgroundColor: '#ddd'}}>
        <Text>Print last transaction</Text>
      </TouchableOpacity>
    </View>
  );
};
