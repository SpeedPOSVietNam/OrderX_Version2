// import {useQuery} from 'react-query';
// import {apiGET} from '../../helpers/fetch';
// import {getClientID, getVenueID} from '../../store';
// import {queryClient} from './queryClient';

// export const HOOK_TABLE = 'HOOK_TABLE';

// export const getTable = async params => {
//   console.log('tables_abc');
//   return await apiGET('/api/Table', params);
// };

// export const fetchTable = async ({queryKey}) => {
//   const [_key, {TableID, VenueID, ClientID}] = queryKey;
//   const params = {
//     ClientID,
//     VenueID,
//     TableID,
//     IsActive: true,
//   };
//   // return await getTable(params);

//   const data = await getTable(params);
//   return data;
// };

// export const useTable = ({
//   TableID,
//   VenueID = getVenueID(),
//   ClientID = getClientID(),
// }) =>
//   useQuery([HOOK_TABLE, {TableID, VenueID, ClientID}], fetchTable, {
//     initialData: () => {
//       // get data from cache (if possible)
//       if (TableID !== undefined && TableID != null) {
//         const allTable = queryClient.getQueryData([
//           HOOK_TABLE,
//           {VenueID, ClientID},
//         ]);
//         return [allTable?.find(t => t.TableID === TableID)];
//       }
//       return [];
//     },
//   });

//QR Order api

import {apiGET, apiQROrderGET} from '../../helpers/fetch';

export const useTable = async () => {
  return await apiQROrderGET('/api/TableSetup');
};
