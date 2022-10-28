import {Dimensions} from 'react-native';
import {getStatusBarHeight} from 'react-native-status-bar-height';

const {width, height} = Dimensions.get('window');
const statusBarHeight = getStatusBarHeight(true);

export const COLORS = {
  orderX: '#005FC6',

  primary: '#0072E3', //'#EC4424',
  secondary: '#6c757d',
  info: '#0072E3',

  //Payment Status
  success: '#4DAF50',
  fail: '#FF0000',

  warning: '#FFB830',
  danger: '#E01F3D',
  title: '#215DBF',

  // Table Status
  TableStatusRed: '#E80000',
  TableStatusGreen: '#54B842',
  TableStatusBlue: '#008EFF',

  white: '#FFFFFF',
  black: '#222831',

  amountDue: '#6B6B6B',
  inputValue: '#0386D0',

  lightGray: '#E7E7E7',
  lightGray2: '#D9D9D9',
};
export const SIZES = {
  // bottom tab
  bottomTabHeight: 65,

  // global sizes
  border: 1,
  base: 8,
  font: 14,
  radius3: 3,
  radius: 5,
  radius10: 10,
  radius20: 20,
  padding: 5,
  padding2: 15,

  // font sizes
  largeTitle: 40,
  h1: 28,
  h2: 21,
  h3: 17,
  h4: 15,
  h5: 13,
  body1: 30,
  body2: 22,
  body3: 17,
  body4: 14,
  body5: 12,
  body6: 15,
  body7: 25,

  // app dimensions
  width,
  height,
  statusBarHeight,
};

export const FONTS = {
  largeTitle: {fontFamily: 'Roboto-Black', fontSize: SIZES.largeTitle},
  h1: {
    fontFamily: 'Roboto-Black',
    fontSize: SIZES.h1,
    fontWeight: 'bold',
    lineHeight: 36,
  },
  h2: {
    fontFamily: 'Roboto-Bold',
    fontSize: SIZES.h2,
    fontWeight: 'bold',
    lineHeight: 30,
  },
  h3: {fontFamily: 'Roboto-Bold', fontSize: SIZES.h3, lineHeight: 22},
  h4: {fontFamily: 'Roboto-Bold', fontSize: SIZES.h4, lineHeight: 22},
  h5: {fontFamily: 'Roboto-Bold', fontSize: SIZES.h5, lineHeight: 18},
  body1: {
    fontFamily: 'Roboto-Regular',
    fontSize: SIZES.body1,
    lineHeight: 36,
  },
  body2: {
    fontFamily: 'Roboto-Regular',
    fontSize: SIZES.body2,
    lineHeight: 30,
  },
  body3: {
    fontFamily: 'Roboto-Regular',
    fontSize: SIZES.body3,
    lineHeight: 22,
  },
  body4: {
    fontFamily: 'Roboto-Regular',
    fontSize: SIZES.body4,
    lineHeight: 22,
  },
  body5: {
    fontFamily: 'Roboto-Regular',
    fontSize: SIZES.body5,
    lineHeight: 22,
  },
};

// Lưu những style dài, loằng ngoằng, mà lại còn dùng ở nhiều nơi, ví dụ như shadow =.=
export const STYLES = {
  cardShadow: {
    shadowColor: COLORS.black, // shadow color not working on android: https://stackoverflow.com/q/47843169
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,

    elevation: 8,
  },
};
