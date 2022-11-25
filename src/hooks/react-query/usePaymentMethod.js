import icons from '../../constants/icons';
import {apiQROrderGET} from '../../helpers/fetch';

export const HOOK_PAYMENT_METHOD = async () => {
  return await apiQROrderGET('/api/PaymentMethod');
};
