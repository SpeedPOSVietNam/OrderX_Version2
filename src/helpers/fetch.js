import moment from 'moment';
import hmacSHA256 from 'crypto-js/hmac-sha256';
import {addAlert, getClientGUID} from '../store';
import {
  APIResultCode,
  getAppModeConstantValue,
  isInApiResultCode,
} from '../constants/global';
import {COLORS} from '../constants/theme';

const SHOW_LOG = true;

//https://stackoverflow.com/a/49701878
export const createQueryString = params => {
  const queryString = new URLSearchParams(params).toString();
  if (queryString === '') {
    return '';
  }
  return `?${queryString}`;
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

const createOROrderTọken = (path, data = null) => {
  const urlFetch = getAppModeConstantValue('SERVER_HOST_IP') + path;
  const secretKey = '123654789';
  let token;
  if (data == null) {
    //console.log('fetch path', typeof path, typeof secretKey);
    token = hmacSHA256(path, secretKey);
  }
  return {
    urlFetch,
    token,
  };
};

//path
export const apiQROrderGET = async (path, queries) => {
  const pathQuery = path + createQueryString(queries);
  console.log('pathQuery ne', pathQuery);
  const {urlFetch, token} = createOROrderTọken(pathQuery);
  SHOW_LOG && console.log('GET ', 'URL FETCH', urlFetch, 'TOKEN', token);

  const res = await fetch(urlFetch, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      PartnerKey: 'UGl4ZWxTcWxiYXNl',
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
