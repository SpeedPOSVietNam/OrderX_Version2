import {useQuery} from 'react-query';
import {apiGET} from '../../helpers/fetch';
import {getClientID, getVenueID} from '../../store';

export const HOOK_TABLE_SERVE_MAP_SECTION = 'HOOK_TABLE_SERVE_MAP_SECTION';

export const getTableServeMapSection = async params => {
  return await apiGET('/api/TableServeMapSection', params);
};

export const fetchTableServeMapSection = async ({queryKey}) => {
  const [_key, {VenueID, ClientID}] = queryKey;
  const params = {
    ClientID,
    VenueID,
    Version: 1,
    IsDelete: true,
    OrderBy: 'ASC',
  };
  console.log('fetchTableServeMapSection abc')
  return await getTableServeMapSection(params);

};

export const useTableServeMapSection = ({
  VenueID = getVenueID(),
  ClientID = getClientID(),
}) =>
  useQuery(
    [HOOK_TABLE_SERVE_MAP_SECTION, {VenueID, ClientID}],
    fetchTableServeMapSection,
    {
      initialData: [],
    },
  );
