import {apiQROrderGET} from '../../helpers/fetch';

export const useRelativeTableNo = async params => {
  return await apiQROrderGET('/api/TableSetup', params);
};
