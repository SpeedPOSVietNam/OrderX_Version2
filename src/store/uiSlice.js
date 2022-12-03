import {guidGenerator} from '../helpers/utils';

export const createUISlice = (set, get) => ({
  ui: {
    globalLoading: false,
    showGlobaloadingValueInstantly: false,
    editTableMap: false,
    openingTable: false,
    preLoading: true,
    modalAlert: false,
    alerts: [
      // {
      //     title: 'Alert 1',
      //     message: 'This is alert 1 message text',
      //     showCloseButton: true,
      //     color: COLORS.danger,
      //     buttons: [
      //         { text: 'OK', color: COLORS.success, onPress: () => {} },
      //         { text: 'Cancel', color: COLORS.danger, onPress: () => {} },
      //     ],
      // },
      // {
      //     title: 'Alert 1',
      //     message: 'This is alert 1 message text',
      //     color: COLORS.info,
      //     buttons: [
      //         { text: 'OK', color: COLORS.success, onPress: () => {} },
      //         { text: 'Cancel', color: COLORS.danger, onPress: () => {} },
      //     ],
      // },
      // {
      //     title: 'Alert 1',
      //     message: 'This is alert 1 message text',
      //     color: COLORS.success,
      //     buttons: [
      //         { text: 'OK', color: COLORS.success, onPress: () => {} },
      //         { text: 'Cancel', color: COLORS.danger, onPress: () => {} },
      //     ],
      // },
    ],
  },
  uiActions: {
    setGlobalLoading: (value, showValueInstantly = false) =>
      set(state => {
        state.ui.globalLoading = value;
        state.ui.showGlobaloadingValueInstantly = showValueInstantly;
      }),
    setEditTableMap: boolean =>
      set(state => {
        state.ui.editTableMap = boolean;
      }),
    setOpeningTable: boolean =>
      set(state => {
        state.ui.openingTable = boolean;
      }),
    setPreLoading: boolean =>
      set(state => {
        state.ui.preLoading = boolean;
      }),
    addAlert: alert =>
      set(state => {
        state.ui.alerts.push({
          guid: guidGenerator(), // inject guid
          ...alert,
        });
      }),
    removeAlert: alert =>
      set(state => {
        state.ui.alerts = state.ui.alerts.filter(a => a.guid !== alert.guid);
      }),
    addModalAlert: modalAlert =>
      set(state => {
        state.ui.modalAlert = modalAlert;
      }),
  },
});

export const uiSelectors = {
  globalLoading: state => state.ui.globalLoading,
  showGlobaloadingValueInstantly: state =>
    state.ui.showGlobaloadingValueInstantly,
  setGlobalLoading: state => state.uiActions.setGlobalLoading,
  editTableMap: state => state.ui.editTableMap,
  setEditTableMap: state => state.uiActions.setEditTableMap,
  openingTable: state => state.ui.openingTable,
  setOpeningTable: state => state.uiActions.setOpeningTable,
  preLoading: state => state.ui.preLoading,
  setPreLoading: state => state.uiActions.setPreLoading,
  alerts: state => state.ui.alerts,
  addAlert: state => state.uiActions.addAlert,
  removeAlert: state => state.uiActions.removeAlert,
  addModalAlert: state => state.uiActions.addModalAlert,
};
