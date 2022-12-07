import {LayoutAnimation, Platform, ToastAndroid, Vibration} from 'react-native';
import {COLORS, SIZES} from '../constants/theme';
// import { addAlert } from '../store';

export const getShapesBoundary = shapes => {
  let top = Infinity,
    left = Infinity,
    right = -Infinity,
    bottom = -Infinity;
  for (let shape of [...shapes]) {
    if (shape.x + shape.w > right) {
      right = shape.x + shape.w;
    }
    if (shape.x < left) {
      left = shape.x;
    }
    if (shape.y + shape.h > bottom) {
      bottom = shape.y + shape.h;
    }
    if (shape.y < top) {
      top = shape.y;
    }
  }
  return {top, left, right, bottom};
};

export const calculateZoomToFit = ({top, left, bottom, right}) => {
  //#region add padding to expand edges
  let padding = 30;
  left -= padding;
  top -= padding;
  right += padding;
  bottom += padding;
  //#endregion

  //#region calculate the size of view make by 4 edges
  let viewWidth = right - left;
  let viewHeight = bottom - top;
  //#endregion

  //#region find center point of that view
  let _center = {
    x: (right + left) * 0.5,
    y: (top + bottom) * 0.5,
  };
  //#endregion

  //#region calculate scale values
  let newScaleWidth = SIZES.width / viewWidth;
  let newScaleHeight = SIZES.height / viewHeight;
  //#endregion

  //#region calculate translate/scale value to fit the view in device screen
  return newScaleWidth > newScaleHeight
    ? {
        x: (_center.x - SIZES.width * 0.5) * newScaleHeight,
        y: (_center.y - viewHeight * 0.5) * newScaleHeight,
        scale: newScaleHeight,
      }
    : {
        x: (_center.x - SIZES.width * 0.5) * newScaleWidth,
        y: _center.y * newScaleWidth - SIZES.height * 0.5,
        scale: newScaleWidth,
      };
  //#endregion
};

export const vibrate = (pattern, repeat) => {
  try {
    Vibration.vibrate(pattern, repeat);
  } catch (e) {
    notifyMessage(e.message);
  }
};

export const stopVibrate = () => Vibration.cancel();

export const notifyMessage = (message, duration = ToastAndroid.SHORT) => {
  if (Platform.OS === 'android') {
    ToastAndroid.show(message, duration);
  } else {
    addAlert({color: COLORS.info, title: 'Notify', message});
  }
};

// https://stackoverflow.com/a/1484514/11898496
export const getRandomColor = () => {
  let letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

// https://stackoverflow.com/a/6313008/11898496
export const toHHMMSS = function (sec_num) {
  let hours = Math.floor(sec_num / 3600);
  let minutes = Math.floor((sec_num - hours * 3600) / 60);
  let seconds = sec_num - hours * 3600 - minutes * 60;

  if (hours < 10) {
    hours = '0' + hours;
  }
  if (minutes < 10) {
    minutes = '0' + minutes;
  }
  if (seconds < 10) {
    seconds = '0' + seconds;
  }
  return (hours > 0 ? hours + ':' : '') + minutes + ':' + seconds;
};

export const smoothOn = () => {
  LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
};

// https://stackoverflow.com/a/44058434/11898496
export const getURLParams = url => {
  let regex = /[?&]([^=#]+)=([^&#]*)/g,
    params = {},
    match;
  while ((match = regex.exec(url))) {
    params[match[1]] = match[2];
  }
  return params;
};

// https://stackoverflow.com/a/39914235/11898496
export const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

// https://stackoverflow.com/a/28191966/11898496
export const getKeyByValue = (object, value) => {
  return Object.keys(object).find(key => object[key] === value);
};

// https://stackoverflow.com/a/33448478/11898496
export const base64Icon = base64Data => 'data:image/png;base64,' + base64Data;

//#region currency
// https://stackoverflow.com/a/14428340
export const toCurrency = (num = 0, separator = ',', withEnd = true) =>
  num?.toString()?.replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, '$1' + separator) +
  (withEnd ? ' VND' : '');

// https://stackoverflow.com/a/11832950/11898496
// export const round2Decimals = (num) => Math.round((num + Number.EPSILON) * 100) / 100;

// https://stackoverflow.com/a/18358056/11898496
export const roundDecimal = (num, places = 2) =>
  +(Math.round(num + 'e+' + places) + 'e-' + places);

// https://stackoverflow.com/a/16233919/11898496
// export const toCurrency = (num = 0) =>
//     num?.toLocaleString('en-US', {
//         style: 'currency',
//         currency: 'USD',
//     });

// export const CurrencyFormatter = {
//     en: new Intl.NumberFormat('en-US', {
//         style: 'currency',
//         currency: 'USD',
//     }),
//     vi: new Intl.NumberFormat('vi-VN', {
//         style: 'currency',
//         currency: 'VND',
//     }),
// };
// export const toCurrency = (num = 0, formatter = CurrencyFormatter.vi) => formatter.format(num);
//#endregion

export const customGUID = () => Math.random().toString(36).substring(2, 10);

// https://stackoverflow.com/a/45209889
export const withFunction = callback => {
  let inputRange = [],
    outputRange = [],
    steps = 50;
  /// input range 0-1
  for (let i = 0; i <= steps; ++i) {
    let key = i / steps;
    inputRange.push(key);
    outputRange.push(callback(key));
  }
  return {inputRange, outputRange};
};

//https://stackoverflow.com/a/11409944
export const clamp = (value, min, max) => {
  return Math.min(Math.max(value, min), max);
};

export const snapToGrid = (value, gridSize) => {
  return gridSize * Math.round(value / gridSize);
};

//https://stackoverflow.com/a/11832950
export const round = (num, dec = 2) => {
  return Math.round(num * Math.pow(10, dec)) / Math.pow(10, dec);
};

export const deepClone = obj => JSON.parse(JSON.stringify(obj));

export const deepEqualCompare = (obj1, obj2) =>
  JSON.stringify(obj1) === JSON.stringify(obj2);

//https://stackoverflow.com/a/50891029
export const addAlpha = (color: string, opacity: number) => {
  // coerce values so ti is between 0 and 1.
  const _opacity = Math.round(Math.min(Math.max(opacity || 1, 0), 1) * 255);
  return color + _opacity.toString(16).toUpperCase();
};

//https://stackoverflow.com/a/35970186
export const invertColor = (hex = '', bw, bwColor = ['#000000', '#FFFFFF']) => {
  if (hex?.indexOf('#') === 0) {
    hex = hex.slice(1);
  }
  // convert 3-digit hex to 6-digits.
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }
  if (hex.length !== 6) {
    // console.log(`Invalid HEX color: '${hex}'`);
    return '#FFFFFF';
  }
  let r = parseInt(hex.slice(0, 2), 16),
    g = parseInt(hex.slice(2, 4), 16),
    b = parseInt(hex.slice(4, 6), 16);
  if (bw) {
    // https://stackoverflow.com/a/3943023/112731
    const isLight = r * 0.299 + g * 0.587 + b * 0.114 > 186;
    return isLight ? bwColor[0] : bwColor[1];
  }
  // invert color components
  r = (255 - r).toString(16);
  g = (255 - g).toString(16);
  b = (255 - b).toString(16);
  // pad each with zeros and return
  return '#' + padZero(r) + padZero(g) + padZero(b);
};

export const padZero = (str, len) => {
  len = len || 2;
  let zeros = new Array(len).join('0');
  return (zeros + str).slice(-len);
};

export const getImgSource = _ => {
  if (typeof _ === 'string' && _.toLowerCase().indexOf('http') === 0) {
    return {uri: _};
  }

  return _;
};

// https://stackoverflow.com/a/6860916
export const guidGenerator = () => {
  var S4 = function () {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  };
  return (
    S4() +
    S4() +
    '-' +
    S4() +
    '-' +
    S4() +
    '-' +
    S4() +
    '-' +
    S4() +
    S4() +
    S4()
  );
};
