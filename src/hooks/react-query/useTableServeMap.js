import {useQuery} from 'react-query';
import {apiGET} from '../../helpers/fetch';
import {getClientID, getVenueID} from '../../store';

export const HOOK_TABLE_SERVE_MAP = 'HOOK_TABLE_SERVE_MAP';

export const getTableServeMap = async params => {
  return await apiGET('/api/TableServeMap', params);
};

export const fetchTableServeMap = async ({queryKey}) => {
  const [_key, {VenueID, ClientID}] = queryKey;
  const params = {
    ClientID,
    VenueID,
    Version: 1,
  };
  return await getTableServeMap(params);
};

export const useTableServeMap = ({
  VenueID = getVenueID(),
  ClientID = getClientID(),
}) =>
  useQuery([HOOK_TABLE_SERVE_MAP, {VenueID, ClientID}], fetchTableServeMap, {
    initialData: [],
  });
