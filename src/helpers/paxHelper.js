import {paxPrinterIsAvailable, paxPrinterPrint} from './nativeModules';
import DeviceInfo from 'react-native-device-info';

export const paxHelper = {
  printerPrint: async (str, grayLevel = 300) =>
    await paxPrinterPrint(str, grayLevel),
  printerIsAvailable: async () => {
    const supportedAbis = await DeviceInfo.supportedAbis();
    if (!supportedAbis.includes('armeabi-v7a')) {
      throw new Error(
        'Device is not 32-bit. This module only runs on PAX devices.',
      );
    }
    return await paxPrinterIsAvailable();
  },
  printerIsReady: status =>
    new Promise((resolve, reject) => {
      if (status === 0) {
        resolve();
      } else {
        switch (status) {
          case 1:
            reject(new Error('Printer is busy'));
            break;
          case 2:
            reject(new Error('Out of paper'));
            break;
          case 3:
            reject(new Error('The format of print data packet error'));
            break;
          case 4:
            reject(new Error('Printer malfunctions'));
            break;
          case 8:
            reject(new Error('Printer over heats'));
            break;
          case 9:
            reject(new Error('Printer voltage is too low'));
            break;
          case -16:
            reject(new Error('Printing is unfinished'));
            break;
          case -6:
            reject(new Error('cut jam error(only support:E500,E800)'));
            break;
          case -5:
            reject(
              new Error('cover open error(only support:E500,E800,SK600,SK800)'),
            );
            break;
          case -4:
            reject(new Error('The printer has not installed font library'));
            break;
          case -2:
            reject(new Error('Data package is too long'));
            break;
          default:
            reject(new Error('Unknown error'));
            break;
        }
      }
    }),
};
