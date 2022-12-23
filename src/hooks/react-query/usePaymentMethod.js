import icons from '../../constants/icons';
import {apiQROrderGET} from '../../helpers/fetch';

// export const HOOK_PAYMENT_METHOD = async () => {
//   return await apiQROrderGET('/api/PaymentMethod');
// };

export const HOOK_PAYMENT_METHOD = [
  {
    MethodNum: 1001,
    Descript: 'CASH',
    icon: icons.cash,
  },
  {MethodNum: 1002, Descript: 'CARD', icon: icons.card},
];
