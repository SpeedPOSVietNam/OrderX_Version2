import {apiPOST, apiPUT} from '../helpers/fetch';
import {
  getClientID,
  getTableID,
  getVenueGUID,
  getVenueID,
  getWaiterID,
} from '../store';
import {getAppModeConstantValue} from '../constants/global';
import DeviceInfo from 'react-native-device-info';

export const deviceLogin = async () =>
  await apiPUT(
    '/api/ClientAppAuth',
    {
      VenueGUID: getVenueGUID(),
      TokenVal: DeviceInfo.getUniqueId(),
    },
    {Action: 'DeviceLogin'},
  );

export const clientLogin = async ({AccessCode}) =>
  await apiPOST('/api/ClientAppAuth', {
    AccessCode,
    PartnerGUID: getAppModeConstantValue('APP_CLIENT').guid,
  });
export const waiterLogin = async ({waiterID, VenueGUID = getVenueGUID()}) =>
  await apiPUT(
    '/api/ClientAppAuth',
    {
      VenueGUID,
      RefCode2: waiterID,
      TokenVal: DeviceInfo.getUniqueId(),
    },
    {Action: 'AccountLogin'},
  );
