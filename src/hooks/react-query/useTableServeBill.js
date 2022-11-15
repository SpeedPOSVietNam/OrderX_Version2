import {useInfiniteQuery} from 'react-query';
import {apiGET} from '../../helpers/fetch';
import {getClientID, getVenueID} from '../../store';
import {
  BillStatusNum,
  OrderDisplayType as _OrderDisplayType,
} from '../../constants/global';

export const HOOK_TABLE_SERVE_BILL = 'HOOK_TABLE_SERVE_BILL';

const PageSize = 10;

export const getTableServeBill = async params => {
  return await apiGET('/api/TableServeBill', params);
};

export const fetchTableServeBill = async ({queryKey, pageParam = 0}) => {
  const [
    _key,
    {
      TableServeBillID,
      TableID,
      StatusNum,
      VenueID,
      ClientID,
      OrderDisplayType,
      OrderBy,
    },
  ] = queryKey;
  const params = {
    ClientID,
    VenueID,
    TableServeBillID,
    TableID,
    StatusNum,
    PageSize,
    OrderDisplayType,
    PageNum: pageParam,
    OrderBy,
  };
  return await getTableServeBill(params);
};

export const useTableServeBill = ({
  TableServeBillID,
  TableID,
  OrderDisplayType = _OrderDisplayType.LogValue,
  StatusNum = BillStatusNum.IN_PROGRESS,
  VenueID = getVenueID(),
  ClientID = getClientID(),
  OrderBy = 'DESC',
}) =>
  useInfiniteQuery(
    [
      HOOK_TABLE_SERVE_BILL,
      {
        TableServeBillID,
        TableID,
        StatusNum,
        VenueID,
        ClientID,
        OrderDisplayType,
        OrderBy,
      },
    ],
    fetchTableServeBill,
    {
      getNextPageParam: (lastPage, pages) =>
        lastPage?.length === PageSize ? pages.length + 1 : undefined,
    },
  );
