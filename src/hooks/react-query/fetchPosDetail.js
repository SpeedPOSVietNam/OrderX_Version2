import {apiQROrderGET} from '../../helpers/fetch';

export const fetchPosDetail = async params => {
  return await apiQROrderGET('/api/PosDetail', params);
};
