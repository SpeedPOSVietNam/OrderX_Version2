import {apiQROrderGET} from '../../helpers/fetch';

export const usePosDetail = async params => {
  return await apiQROrderGET('/api/PosDetail', params);
};
