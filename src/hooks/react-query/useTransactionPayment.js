import {apiQROrderGET} from '../../helpers/fetch';

export const useTransactionPayment = async params => {
  return await apiQROrderGET('/api/TransactionPayment', params);
};
