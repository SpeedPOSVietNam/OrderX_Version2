import {useQuery} from 'react-query';
import {apiGET} from '../../helpers/fetch';
import {getClientID, getVenueID} from '../../store';
import {queryClient} from './queryClient';
import {OrderDisplayType as _OrderDisplayType} from '../../constants/global';

export const HOOK_TABLE_SERVE_MAP_TABLE = 'HOOK_TABLE_SERVE_MAP_TABLE';

export const getTableServeMapTable = async params => {
  return await apiGET('/api/TableServeMapTable', params);
};

export const fetchTableServeMapTable = async ({queryKey}) => {
  const [_key, {TableID, VenueID, ClientID, OrderDisplayType}] = queryKey;
  const params = {
    VenueID,
    ClientID,
    TableID,
    OrderDisplayType,
    IsDelete: true,
    IsActive: true,
  };
  console.log('get TableS erve Map Table')
  return await getTableServeMapTable(params);
};

export const useTableServeMapTable = ({
  TableID,
  OrderDisplayType = _OrderDisplayType.TableServeConfirm,
  enabled = true,
  VenueID = getVenueID(),
  ClientID = getClientID(),
}) =>
  useQuery(
    [
      HOOK_TABLE_SERVE_MAP_TABLE,
      {TableID, OrderDisplayType, VenueID, ClientID},
    ],
    fetchTableServeMapTable,
    {
      enabled: enabled,
      initialData: () => {
        // get data from cache (if possible)
        if (TableID !== undefined && TableID != null) {
          const allTable = queryClient.getQueryData([
            HOOK_TABLE_SERVE_MAP_TABLE,
            {VenueID, ClientID},
          ]);
          return [allTable?.find(t => t.TableID === TableID)];
        }
        return [];
      },
    },
  );
