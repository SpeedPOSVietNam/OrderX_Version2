import {useQuery} from 'react-query';
import {apiQROrderGET} from '../../helpers/fetch';

export const getEmployee = async params => {
  return await apiQROrderGET('/api/Employee', params);
};
