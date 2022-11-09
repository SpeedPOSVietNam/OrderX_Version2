import {useQuery} from 'react-query';
import {apiGET} from '../../helpers/fetch';
import {getClientID, getVenueID} from '../../store';

export const HOOK_MOBILE_ORDER_CONFIG = 'HOOK_MOBILE_ORDER_CONFIG';

export const getMobileOrderConfig = async params => {
  return await apiGET('/api/MobileOrderConfig', params);
};

export const fetchMobileOrderConfig = async ({queryKey}) => {
  const [_key, {VenueID, ClientID}] = queryKey;
  const params = {
    ClientID,
    VenueID,
  };
  const data = await getMobileOrderConfig(params);
  return data[0];
};

export const useMobileOrderConfig = ({
  ClientID = getClientID(),
  VenueID = getVenueID(),
}) =>
  useQuery(
    [HOOK_MOBILE_ORDER_CONFIG, {ClientID, VenueID}],
    fetchMobileOrderConfig,
    {
      initialData: {},
    },
  );
