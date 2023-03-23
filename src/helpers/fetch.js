import moment from 'moment';
import hmacSHA256 from 'crypto-js/hmac-sha256';
import {addAlert, getClientGUID} from '../store';
import {
  APIResultCode,
  getAppModeConstantValue,
  isInApiResultCode,
} from '../constants/global';
import {COLORS} from '../constants/theme';
import {Alert} from 'react-native';
import axios from 'axios';
import {getServerHostIP} from '../store';
const SHOW_LOG = true;

//https://stackoverflow.com/a/49701878
export const createQueryString = params => {
  const queryString = new URLSearchParams(params).toString();
  if (queryString === '') {
    return '';
  }
  return `?${queryString}`;
};

export const createPostQueryString = params => {
  return `.${JSON.stringify(params)}`;
};

const createToken = (path, data = null) => {
  const currentUTC = moment().utc().format('YYYYMMDDHHmmss');
  const urlFetch = getAppModeConstantValue('SERVER_HOST_IP') + path;
  const {secretKey, guid: partnerGuid} = getAppModeConstantValue('APP_CLIENT');

  let token;
  // GET
  if (data == null) {
    token = hmacSHA256(`${path}.${currentUTC}`, secretKey).toString();
  }
  // POST/PUT with body data
  else {
    token = hmacSHA256(
      `${path}.${currentUTC}.${JSON.stringify(data)}`,
      secretKey,
    ).toString();
  }
  return {
    token,
    partnerGuid,
    urlFetch,
    currentUTC,
  };
};

//QR Order

const createOROrderToken = (path, data = null) => {
  // const urlFetch = getAppModeConstantValue('SERVER_HOST_IP') + path;
  const urlFetch = getServerHostIP() + path;
  const secretKey = '123654789';
  let token;
  if (data == null) {
    //console.log('fetch path', typeof path, typeof secretKey);
    token = hmacSHA256(path, secretKey);
  } else {
    token = hmacSHA256(data, secretKey);
  }
  return {
    urlFetch,
    token,
  };
};

//path
export const apiQROrderGET = async (path, queries) => {
  const pathQuery = path + createQueryString(queries);
  const {urlFetch, token} = createOROrderToken(pathQuery);
  SHOW_LOG && console.log('GET ', 'URL FETCH', urlFetch, 'TOKEN', token);

  const res = await fetch(urlFetch, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      PartnerKey: 'UGl4ZWxTUUxiYXNlX0RvbkRlbW9fMjM=',
      Token: token,
    },
  });

  const {Status, Data, Message} = await res.json();
  if (Status === 200) {
    return Data;
  }

  // // GET sẽ ko có chỗ nào try catch, nên alert ở đây luôn
  if (Status === APIResultCode.CoreAuth_Expired) {
    // ignore
  } else if (isInApiResultCode(Status)) {
    addAlert({
      color: COLORS.warning,
      title: `WARNING - code: ${Status}`,
      message: Message,
    });
  } else {
    addAlert({color: COLORS.danger, title: 'GET ERROR', message: Message});
  }
  return [];
};

export const apiQROrderPOST = async (path, body, willDisplayErr = true) => {
  const pathQuery = path + createPostQueryString(body);
  console.log('pathQuery ', pathQuery, 'path', path, 'body', body);
  const {urlFetch, token} = createOROrderToken(path, pathQuery);

  SHOW_LOG && console.log('POST ', urlFetch);

  const res = await fetch(urlFetch, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      PartnerKey: 'UGl4ZWxTcWxiYXNl',
      Token: token,
    },
    body: JSON.stringify(body),
  });

  // const url = 'http://qr-order.speedtech.vn/api/OrderPayment';
  // //path /api/OrderPayemt
  // const res = await axios.post(path, {
  //   headers: {
  //     Accept: 'application/json',
  //     'Content-Type': 'multipart/form-data',
  //     PartnerKey: 'UGl4ZWxTcWxiYXNl',
  //     Token: token,
  //   },
  //   body: JSON.stringify(body),
  // });

  const {Status, Data, Message} = await res.json();
  console.log('Status of POST', Status, Data, Message);
  if (Status === 200) {
    return Data;
  }

  if (willDisplayErr) {
    if (isInApiResultCode(Status)) {
      addAlert({
        color: COLORS.warning,
        title: `WARNING - code: ${Status}`,
        message: Message,
      });
    } else {
      addAlert({color: COLORS.danger, title: 'POST ERROR', message: Message});
      Alert.alert('POST ERROR', Message);
    }
  }

  throw customError(Message, {code: Status}); // POST đã có react query bắt lỗi, nên ở đây chỉ cần throw
};

//Hoang-Luu-old version
export const apiGET = async (path, queries) => {
  const pathQuery = path + createQueryString(queries);
  const {urlFetch, partnerGuid, currentUTC, token} = createToken(pathQuery);

  SHOW_LOG && console.log('GET ', urlFetch, 'PATH & QUERIES', path, queries);

  const res = await fetch(urlFetch, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      PartnerGuid: partnerGuid,
      CurrentUTC: currentUTC,
      Token: token,
      ClientGuid: getClientGUID(),
    },
  });
  const {Status, Data, Message} = await res.json();
  if (Status === 200) {
    return Data;
  }

  // // GET sẽ ko có chỗ nào try catch, nên alert ở đây luôn
  if (Status === APIResultCode.CoreAuth_Expired) {
    // ignore
  } else if (isInApiResultCode(Status)) {
    addAlert({
      color: COLORS.warning,
      title: `WARNING - code: ${Status}`,
      message: Message,
    });
  } else {
    addAlert({color: COLORS.danger, title: 'GET ERROR', message: Message});
  }
  return [];
};

export const apiPOST = async (path, body, queries, willDisplayErr = true) => {
  const pathQuery = path + createQueryString(queries);
  const {urlFetch, partnerGuid, currentUTC, token} = createToken(
    pathQuery,
    body,
  );

  SHOW_LOG &&
    console.log(
      'POST ',
      urlFetch,
      JSON.stringify(body),
      'PATH & QUERIES',
      path,
      queries,
    );

  const res = await fetch(urlFetch, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      PartnerGuid: partnerGuid,
      CurrentUTC: currentUTC,
      Token: token,
      ClientGuid: getClientGUID(),
    },
    body: JSON.stringify(body),
  });

  const {Status, Data, Message} = await res.json();
  if (Status === 200) {
    return Data;
  }

  if (willDisplayErr) {
    if (isInApiResultCode(Status)) {
      addAlert({
        color: COLORS.warning,
        title: `WARNING - code: ${Status}`,
        message: Message,
      });
    } else {
      addAlert({color: COLORS.danger, title: 'POST ERROR', message: Message});
    }
  }

  throw customError(Message, {code: Status}); // POST đã có react query bắt lỗi, nên ở đây chỉ cần throw
};

export const apiPUT = async (path, body, queries) => {
  const pathQuery = path + createQueryString(queries);
  const {urlFetch, partnerGuid, currentUTC, token} = createToken(
    pathQuery,
    body,
  );

  SHOW_LOG &&
    console.log(
      'PUT ',
      urlFetch,
      JSON.stringify(body),
      'PATH & QUERIES',
      path,
      queries,
    );

  const res = await fetch(urlFetch, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      PartnerGuid: partnerGuid,
      CurrentUTC: currentUTC,
      Token: token,
      ClientGuid: getClientGUID(),
    },
    body: JSON.stringify(body),
  });

  const {Status, Data, Message} = await res.json();
  if (Status === 200) {
    return Data;
  }

  if (isInApiResultCode(Status)) {
    addAlert({
      color: COLORS.warning,
      title: `WARNING - code: ${Status}`,
      message: Message,
    });
  } else {
    addAlert({color: COLORS.danger, title: 'PUT ERROR', message: Message});
  }
  throw customError(Message, {code: Status});
};

function customError(msg, params = {}) {
  const error = new Error(msg);
  for (let key in params) {
    error[key] = params[key];
  }
  return error;
}
