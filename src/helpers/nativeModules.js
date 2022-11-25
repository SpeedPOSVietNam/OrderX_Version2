import {NativeModules} from 'react-native';

const {SharePosModule, PaxModule, LauncherModule} = NativeModules;

const notFound = () => alert('Ingenico module not found.');

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
  // sharepos
  shareposCall,
  // pax
  paxPrinterPrint,
  paxPrinterIsAvailable,
  // launcher
  // getApps,
  // launchApplication,
};
