import {useQuery} from 'react-query';
import {apiGET} from '../../helpers/fetch';

export const HOOK_CLIENT = 'HOOK_CLIENT';

export const getClient = async params => {
  return await apiGET('/api/Client', params);
};

export const fetchClient = async ({queryKey}) => {
  return await getClient();
};

// this hook can only fetch data of client that logged-in
export const useClient = (enabled = true) =>
  useQuery([HOOK_CLIENT], fetchClient, {
    enabled: enabled,
    initialData: {},
  });
