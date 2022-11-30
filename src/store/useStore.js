import create from 'zustand';
import {devtools, persist} from 'zustand/middleware';
import AsyncStorage from '@react-native-community/async-storage';
import {immer} from './middlewares';
import {createCacheSlice} from './cacheSlice';
import {createSettingSlice} from './settingSlice';
import {createAuthSlice} from './authSlice';
import {createUISlice} from './uiSlice';
import {createMenuStateSlice} from './menuStateSlice';

// Clear the storage - for development only
// AsyncStorage.clear();

const store = (set, get) => ({
  ...createUISlice(set, get),
  ...createAuthSlice(set, get),
  ...createCacheSlice(set, get),
  ...createSettingSlice(set, get),
  ...createMenuStateSlice(set, get),
});

export const useStore = create(
  devtools(
    immer(
      persist(
        (set, get) => ({
          hydrated: false,
          firstRun: true,
          clearFirstRun: () => set({firstRun: false}),
          setHydrated: () => set({hydrated: true}),
          ...store(set, get),
        }),
        {
          getStorage: () => AsyncStorage,
          name: 'orderX_V2',
          // whitelist: ['firstRun', 'setting'], // old zustand
          // new version of zustand: https://github.com/pmndrs/zustand/wiki/Persisting-the-store's-data
          partialize: state => ({
            firstRun: state.firstRun,
            setting: state.setting,
            auth: state.auth,
          }),
          onRehydrateStorage: () => (state, error) => {
            if (state) {
              state.setHydrated();
            }
          },
        },
      ),
    ),
  ),
);

//#region Util - Có thể dùng ngoài react component
export const setClientGUID = clientGUID =>
  useStore.getState().authActions.setClientGUID(clientGUID);
export const setClientID = clientID =>
  useStore.getState().authActions.setClientID(clientID);
export const getClientGUID = () => useStore.getState().auth.clientGUID;
export const getClientID = () => useStore.getState().auth.clientID;
export const getVenueGUID = () => useStore.getState().auth.venueGUID;
export const getVenueID = () => useStore.getState().auth.venueID;
export const getWaiterID = () => useStore.getState().auth.waiterID;
export const getPosHeader = () => useStore.getState().auth.posHeader;
export const getTableData = () => useStore.getState().auth.tableData;
export const getTableID = () => useStore.getState().cache.currentTableID;
export const setGlobalLoading = (o, i) =>
  useStore.getState().uiActions.setGlobalLoading(o, i);
export const getAppMode = () => useStore.getState().setting.appMode;
export const setAppMode = mode =>
  useStore.getState().settingActions.setAppMode(mode);
export const addAlert = alert => useStore.getState().uiActions.addAlert(alert);

//#endregion
