import {ingencoPrintBill, ingenicoCanPrint} from './nativeModules';

export const ingenicoHelper = {
  printBill: str =>
    new Promise((resolve, reject) => {
      ingencoPrintBill(
        str,
        () => {
          // Success
          resolve();
        },
        errorMsg => {
          // Failure
          reject(new Error(errorMsg));
        },
      );
    }),
  canPrint: () =>
    new Promise((resolve, reject) => {
      ingenicoCanPrint(
        validWidth => {
          // Success
          resolve(validWidth);
        },
        errorMsg => {
          // Failure
          if (errorMsg === 'Service unbound,please retry latter!') {
            reject(
              new Error(
                'Service unbound. This module only runs on Ingenico devices.',
              ),
            );
          }
          reject(new Error(errorMsg));
        },
      );
    }),
};
