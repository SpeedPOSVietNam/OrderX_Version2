import {SHAREPOS_PAYMENT_SECRETKEY} from '../constants/global';
import {shareposCall} from './nativeModules';

export const SHAREPOS_CONSTANTS = {
  tranxType: {
    SALE: 'SALE',
    CHECK_TRANSACTION: 'CHECK_TRANSACTION',
    SETTLE: 'SETTLE',
    AUTO_INITIALIZE: 'AUTO_INITIALIZE',
    VOID: 'VOID',
    TOTAL_TRANX: 'TOTAL_TRANX',
    // Những type dưới đây dùng chung 1 cấu trúc paxCallSharePos để gửi request (hàm executeEvent)
    SETTING: 'SETTING', //Open Initialize screen of Bank
    PRINT_LAST_SETTLEMENT: 'PRNT_SETTLE',
    PRINT_LAST_TRANSACTION: 'PRNT_LAST_TRANX',
    PRNT_TRANX: 'PRNT_TRANX', //Open Transaction History of Bank, choose one and print
    VIEW_TOTAL_TRANSACTION: 'VIEW_TOTAL_TRANSACTION',
    HOME_APP: 'HOME_APP', //Open Main Screen of Bank
    CHECK_UPDATE_FIRMWARE: 'CHECK_UPDATE_FIRMWARE',
    CHECK_SETTLEMENT: 'CHECK_SETTLEMENT',
    LOADING_KEY: 'LOADING_KEY',
    LOGON: 'LOGON',
  },
  currency: {
    VND: 'VND',
    USD: 'USD',
  },
  acqrID: {
    SaleWithBankMerchant: 100, // default
    SaleWith3rdMerchant: 102,
  },
  language: {
    VI: 'vi',
    EN: 'en',
  },
  encryptType: {
    BCD: 'BCD',
    HEXHL: 'HEXHL',
    HEXLH: 'HEXLH',
  },
};

const genTransId = () => Date.now() + '';

export const sharePosHelper = {
  makePayment: async ({amount, addInfo = [], merchantTransId = genTransId()}) =>
    await shareposCall(
      SHAREPOS_PAYMENT_SECRETKEY,
      JSON.stringify({
        thirdPartyId: 'SPD',
        merchantTransId: merchantTransId,
        tranxType: SHAREPOS_CONSTANTS.tranxType.SALE,
        acqrID: SHAREPOS_CONSTANTS.acqrID.SaleWithBankMerchant,
        transactionAmount: amount + '',

        /// optional
        currencyName: SHAREPOS_CONSTANTS.currency.VND, // optional nhưng không có là lỗi Share POS No pointer exception???
        // isPrintReceipt: false,
        // isSignature: false,
        // thirdPartyType: 'THIRD_PARTY',
        // bankCodeDefault: 'EIB',
        AddInfo: addInfo, // [{ Content: 'Abc: test' }],
      }),
    ),
  voidTrans: async ({bankCode, invoiceNo, merchantTransId = genTransId()}) => {
    await shareposCall(
      SHAREPOS_PAYMENT_SECRETKEY,
      JSON.stringify({
        thirdPartyId: 'SPD',
        merchantTransId: merchantTransId,
        tranxType: SHAREPOS_CONSTANTS.tranxType.VOID,
        invoiceNo: invoiceNo,
        bankCode: bankCode,
      }),
    );
  },
  checkTransaction: async ({merchantTransId = genTransId()}) =>
    await shareposCall(
      SHAREPOS_PAYMENT_SECRETKEY,
      JSON.stringify({
        thirdPartyId: 'SPD',
        merchantTransId: merchantTransId,
        tranxType: SHAREPOS_CONSTANTS.tranxType.CHECK_TRANSACTION,
      }),
    ),

  specialTrans: async ({bankCode, merchantTransId = genTransId()}) =>
    await shareposCall(
      SHAREPOS_PAYMENT_SECRETKEY,
      JSON.stringify({
        thirdPartyId: 'SPD',
        merchantTransId: merchantTransId,
        tranxType: SHAREPOS_CONSTANTS.tranxType.PRNT_TRANX,
        bankCode: bankCode,
        invoiceNo: '',
      }),
    ),
  settle: async ({bankCode, merchantTransId = genTransId()}) => {
    await shareposCall(
      SHAREPOS_PAYMENT_SECRETKEY,
      JSON.stringify({
        thirdPartyId: 'SPD',
        //merchantTransId: merchantTransId,
        merchant_transID: merchantTransId,
        tranxType: SHAREPOS_CONSTANTS.tranxType.SETTLE,
        bankCode: bankCode,
      }),
    );
  },
  checkSettlement: async ({bankCode, merchantTransId = genTransId()}) =>
    await shareposCall(
      SHAREPOS_PAYMENT_SECRETKEY,
      JSON.stringify({
        thirdPartyId: 'SPD',
        merchantTransId: merchantTransId,
        tranxType: SHAREPOS_CONSTANTS.tranxType.CHECK_SETTLEMENT,
        bankCode: bankCode,
      }),
    ),
  homeApp: async ({bankCode, merchantTransId = genTransId()}) =>
    await shareposCall(
      SHAREPOS_PAYMENT_SECRETKEY,
      JSON.stringify({
        thirdPartyId: 'SPD',
        merchantTransId: merchantTransId,
        tranxType: SHAREPOS_CONSTANTS.tranxType.HOME_APP,
        bankCode: bankCode,
      }),
    ),
  setting: async ({bankCode, merchantTransId = genTransId()}) =>
    await shareposCall(
      SHAREPOS_PAYMENT_SECRETKEY,
      JSON.stringify({
        thirdPartyId: 'SPD',
        merchantTransId: merchantTransId,
        tranxType: SHAREPOS_CONSTANTS.tranxType.SETTING,
        bankCode: bankCode,
      }),
    ),
  autoInitialize: async ({
    thirdPartyId,
    merchantTransId = genTransId(),
    bankCode, // VCB/EIB/BIDV/VTB/STB/ACB/ABB…
    refNo, // 8 digits (XXXXXXXX)
    ip, // With format xxx.xxx.xxx.xxx
    port, // Only number (0-9)
    enableEncrypt = enableEncrypt, // true/false
    nii, // (optional) Available when enableEncrypt = true , only number (0-9)
    typeEncrypt /* (optional) -Available when enableEncrypt = true
                                    - Value = BCD/HEXHL/HEXLH
                                        - BIDV : HEXHL (encrypt)
                                        - VTB : BCD (no encrypt)
                                        - EIB : HEXHL (encrypt)
                                        - VCB : HEXHL (encrypt)
        */,
  }) =>
    await shareposCall(
      SHAREPOS_PAYMENT_SECRETKEY,
      JSON.stringify({
        bankCode,
        currencyName: 'VND',
        hideScreen: 0,
        thirdPartyId: thirdPartyId,
        merchantTransId: merchantTransId,
        tranxType: SHAREPOS_CONSTANTS.tranxType.AUTO_INITIALIZE,
        initParams: {
          refNo: refNo,
          ip: ip,
          port: port,
          enableEncrypt: enableEncrypt,
          nii: nii,
          typeEncrypt: typeEncrypt,
        },
      }),
    ),
  executeEvent: async ({bankCode, tranxType, merchantTransId = genTransId()}) =>
    await shareposCall(
      SHAREPOS_PAYMENT_SECRETKEY,
      JSON.stringify({
        merchantTransId: merchantTransId,
        tranxType,
        bankCode,
      }),
    ),
  checkUpdate: async ({bankCode, merchantTransId = genTransId()}) =>
    await shareposCall(
      SHAREPOS_PAYMENT_SECRETKEY,
      JSON.stringify({
        thirdPartyId: 'SPD',
        merchantTransId: merchantTransId,
        tranxType: SHAREPOS_CONSTANTS.tranxType.CHECK_UPDATE,
        bankCode: bankCode,
      }),
    ),
};

// #region ================================== UNUSED ==================================

/// SALE_MOTO
const saleMotoRequestData = {
  merchantTransId: Date.now() + '',
  tranxType: 'SALE_MOTO',
  acqrID: '100',
  transactionAmount: '355000',
  currencyName: 'VND',
  bankCode: 'EIB',
};

/// VOID
const voidRequestData = {
  merchantTransId: Date.now() + '',
  tranxType: 'VOID',
  invoiceNo: '000026', // wtf is this??
  bankCode: 'EIB',
};

/// PRE-AUTH COMPLETE
const preAuthCompleteRequestData = {
  merchantTransId: Date.now() + '',
  tranxType: 'PRE_AUTH_COMP',
  invoiceNo: '000026', // BIDV: Send RefNo value; EIB: Send InvoiceNo value
  bankCode: 'EIB',
};

/// UPDATE RULE CONFIG
const updateRuleConfigRequestData = {
  merchantTransId: Date.now() + '',
  tranxType: 'UPDATE_RULE_CONFIG',
  ruleContent: '', // Rule Content need to updating (JSON FORMAT)
};

/// CHANGE LANGUAGE
const changeLanguageRequestData = {
  merchantTransId: Date.now() + '',
  tranxType: 'CHANGE_LANGUAGE',
  bankCode: 'EIB',
  language: 'en', // en / vi
  languageSharePOS: 'en', // en / vi
};
// #endregion ================================== UNUSED ==================================
