import {useQuery} from 'react-query';
import {apiGET} from '../../helpers/fetch';
import {getClientID, getVenueID} from '../../store';

export const HOOK_TABLE_SERVE_PAID = 'HOOK_TABLE_SERVE_PAID';

export const getTableServePaid = async params => {
  return await apiGET('/api/TableServePaid', params);
};

export const fetchTableServePaid = async ({queryKey}) => {
  const [
    _key,
    {TableID, TableServeBillID, TableServeConfirmID, VenueID, ClientID},
  ] = queryKey;
  const params = {
    TableID,
    TableServeBillID,
    TableServeConfirmID,
    ClientID,
    VenueID,
    IsActive: true,
  };
  return await getTableServePaid(params);
};

export const useTableServePaid = ({
  TableID,
  TableServeBillID,
  TableServeConfirmID,
  VenueID = getVenueID(),
  ClientID = getClientID(),
}) =>
  useQuery(
    [
      HOOK_TABLE_SERVE_PAID,
      {TableID, TableServeBillID, TableServeConfirmID, ClientID, VenueID},
    ],
    fetchTableServePaid,
    {
      initialData: [],
    },
  );
