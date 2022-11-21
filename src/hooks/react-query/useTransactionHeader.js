import {apiQROrderGET} from '../../helpers/fetch';

export const useTransactionHeader = async params => {
  return await apiQROrderGET('/api/TransactionHeader', params);
};
