import {apiQROrderGET} from '../../helpers/fetch';

export const usePostHeader = async () => {
  return await apiQROrderGET('/api/PosHeader');
};
