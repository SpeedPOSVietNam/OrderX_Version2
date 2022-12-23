import {Alert} from 'react-native';
import moment from 'moment';
import {Lang, languages} from '../constants/languages';
import {APPMODE} from '../constants/global';

export const createSettingSlice = (set, get) => ({
  setting: {
    lang: null,
    leftHandMode: false,
    numColumns: 4,
    numRows: 5,
    selectedMenu: null,
    appMode: APPMODE.PROD,
    serverHostIP: 'http://qr-order.speedtech.vn',
  },
  settingActions: {
    setNumColumns: numColumns =>
      set(state => {
        state.setting.numColumns = numColumns;
      }),
    setNumRows: numRows =>
      set(state => {
        state.setting.numRows = numRows;
      }),
    setLang: lang =>
      set(state => {
        if (Object.values(Lang).includes(lang)) {
          state.setting.lang = lang;
          moment.locale(lang);
        } else {
          Alert.alert('Language not found', 'Can not find language ' + lang);
        }
      }),
    setLeftHandMode: boolean =>
      set(state => {
        state.setting.leftHandMode = boolean;
      }),
    setSelectedMenu: menu =>
      set(state => {
        state.setting.selectedMenu = menu;
      }),
    setAppMode: mode =>
      set(state => {
        state.setting.appMode = mode;
      }),
    setServerHostIP: mode =>
      set(state => {
        state.setting.serverHostIP = mode;
      }),
  },
});

export const settingSelectors = {
  lang: state => state.setting.lang,
  language: state => languages[state.setting.lang],
  setLang: state => state.settingActions.setLang,
  numColumns: state => state.setting.numColumns,
  setNumColumns: state => state.settingActions.setNumColumns,
  numRows: state => state.setting.numRows,
  setNumRows: state => state.settingActions.setNumRows,
  leftHandMode: state => state.setting.leftHandMode,
  setLeftHandMode: state => state.settingActions.setLeftHandMode,
  selectedMenu: state => state.setting.selectedMenu,
  setSelectedMenu: state => state.settingActions.setSelectedMenu,
  appMode: state => state.setting.appMode,
  setAppMode: state => state.settingActions.setAppMode,
  serverHostIP: state => state.setting.serverHostIP,
  setServerHostIP: state => state.settingActions.setServerHostIP,
};
