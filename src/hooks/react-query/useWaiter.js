import {useQuery} from 'react-query';
import {apiGET} from '../../helpers/fetch';
import {getClientID, getVenueID} from '../../store';
import {queryClient} from './queryClient';

export const HOOK_WAITER = 'HOOK_WAITER';

export const getWaiter = async params => {
  return await apiGET('/api/Waiter', params);
};

// export const fetchWaiter = async ({queryKey}) => {
//   const [_key, {WaiterID, VenueID, ClientID, isActive}] = queryKey;
//   const params = {
//     ClientID,
//     VenueID,
//     WaiterID,
//     isActive,
//   };
//   return await getWaiter(params);
// };

// export const useWaiter = ({
//   WaiterID,
//   enabled = true,
//   VenueID = getVenueID(),
//   ClientID = getClientID(),
//   isActive,
// }) =>
//   useQuery(
//     [HOOK_WAITER, {WaiterID, VenueID, ClientID, isActive}],
//     fetchWaiter,
//     {
//       enabled: enabled,
//       initialData: () => {
//         // get data from cache (if possible)
//         if (WaiterID !== undefined && WaiterID != null) {
//           const allWaiters = queryClient.getQueryData([
//             HOOK_WAITER,
//             {VenueID, ClientID},
//           ]);
//           return [allWaiters?.find(w => w.WaiterID === WaiterID)];
//         }
//         return [];
//       },
//     },
//   );
