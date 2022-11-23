import {apiQROrderGET} from '../../helpers/fetch';

export const fetchPostHeader = async params => {
  return await apiQROrderGET('/api/PosHeader', params);
};
