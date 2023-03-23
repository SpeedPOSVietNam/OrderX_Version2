import {Alert, NativeModules} from 'react-native';

const {IngenicoModule, SharePosModule, PaxModule, LauncherModule} =
  NativeModules;

const notFound = () => Alert.alert('Ingenico module not found.');

// const {
//   canPrint: ingenicoCanPrint = (successCallback, failedCallback) =>
//     failedCallback(), // default to call failed callback => canPrint default value is false
//   printBill: ingencoPrintBill = notFound,
//   searchCard: ingenicoSearchCard = notFound,
//   startEMV: ingenicoStartEMV,
// } = IngenicoModule;

const {callSharePos: shareposCall} = SharePosModule;
console.log('PaxModule', PaxModule);

const {
  printerPrint: paxPrinterPrint,
  printerIsAvailable: paxPrinterIsAvailable,
} = PaxModule;

// const {getApps, launchApplication} = LauncherModule;

export {
  //igenico
  // ingenico
  // IngenicoModule,
  // ingenicoCanPrint,
  // ingencoPrintBill,
  // ingenicoSearchCard,
  // ingenicoStartEMV,
  // sharepos
  shareposCall,
  // pax
  paxPrinterPrint,
  paxPrinterIsAvailable,
  // launcher
  // getApps,
  // launchApplication,
};
