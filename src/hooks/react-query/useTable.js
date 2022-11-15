// import {COLORS} from '../../constants/theme';
// import {apiGET} from '../../helpers/fetch';
// export const HOOK_TABLE = [
//   {
//     id: 1,
//     tableID: 3,
//     tableStatus: 'Occupied',
//     colorStatus: COLORS.TableStatusRed,
//     paidStatus: false,
//   },
//   {
//     id: 2,
//     tableID: 31,
//     tableStatus: 'Empty',
//     colorStatus: COLORS.TableStatusBlue,
//     paidStatus: false,
//   },
//   {
//     id: 3,
//     tableID: 33,
//     tableStatus: 'Done Soon',
//     colorStatus: COLORS.TableStatusGreen,
//     paidStatus: false,
//   },
//   {
//     id: 4,
//     tableID: 34,
//     tableStatus: 'Occupied',
//     colorStatus: COLORS.TableStatusRed,
//     paidStatus: true,
//   },
//   {
//     id: 5,
//     tableID: 35,
//     tableStatus: 'Open',
//     colorStatus: COLORS.TableStatusYellow,
//     paidStatus: false,
//   },
//   {
//     id: 6,
//     tableID: 36,
//     tableStatus: 'Open',
//     colorStatus: COLORS.TableStatusRed,
//     paidStatus: false,
//   },
// ];

// export const getTransactionHeader = async () => {
//   await apiGET('/api/TransactionHeader', {
//     GUID: '96176112134d4e88afe016b16909ad8d',
//     OpenDate: '20221111030131',
//   })
//     .then(res => {
//       console.log(res);
//     })
//     .catch(err => console.log(err));
// };

// export const getTransactionHeader = async () => {
//   return await apiGET('/api/TableServeBill');
// };

// export const getTableServeMapTable = async params => {
//   return await apiGET('/api/TableServeMapTable', params);
// };

import {useQuery} from 'react-query';
import {apiGET} from '../../helpers/fetch';
import {getClientID, getVenueID} from '../../store';
import {queryClient} from './queryClient';

export const HOOK_TABLE = 'HOOK_TABLE';

export const getTable = async params => {
  console.log('tables_abc');
  return await apiGET('/api/Table', params);
};

export const fetchTable = async ({queryKey}) => {
  const [_key, {TableID, VenueID, ClientID}] = queryKey;
  const params = {
    ClientID,
    VenueID,
    TableID,
    IsActive: true,
  };
  // return await getTable(params);

  const data = await getTable(params);
  return data;
};

export const useTable = ({
  TableID,
  VenueID = getVenueID(),
  ClientID = getClientID(),
}) =>
  useQuery([HOOK_TABLE, {TableID, VenueID, ClientID}], fetchTable, {
    initialData: () => {
      // get data from cache (if possible)
      if (TableID !== undefined && TableID != null) {
        const allTable = queryClient.getQueryData([
          HOOK_TABLE,
          {VenueID, ClientID},
        ]);
        return [allTable?.find(t => t.TableID === TableID)];
      }
      return [];
    },
  });
