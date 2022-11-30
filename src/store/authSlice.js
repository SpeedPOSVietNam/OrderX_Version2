export const createAuthSlice = (set, get) => ({
  auth: {
    clientGUID: null,
    clientID: null,
    venueGUID: null,
    venueID: null,
    waiterID: null,
    tableData: null,
    posHeader: null,
  },
  authActions: {
    setClientGUID: clientGUID =>
      set(state => {
        state.auth.clientGUID = clientGUID;
      }),
    setClientID: clientID =>
      set(state => {
        state.auth.clientID = clientID;
      }),
    setVenueGUID: venueGUID =>
      set(state => {
        state.auth.venueGUID = venueGUID;
      }),
    setVenueID: venueID =>
      set(state => {
        state.auth.venueID = venueID;
      }),
    setWaiterID: waiterID =>
      set(state => {
        state.auth.waiterID = waiterID;
      }),
    logoutWaiter: () =>
      set(state => {
        state.auth.waiterID = null;
      }),
    leaveClient: () =>
      set(state => {
        state.auth.clientID = null;
        state.auth.clientGUID = null;
        state.auth.venueID = null;
        state.auth.venueGUID = null;
        state.auth.waiterID = null;
      }),
    setTableData: tableData =>
      set(state => {
        state.auth.tableData = tableData;
      }),
    setPosHeader: posHeader =>
      set(state => {
        state.auth.posHeader = posHeader;
      }),
  },
});

export const authSelectors = {
  clientGUID: state => state.auth.clientGUID,
  clientID: state => state.auth.clientID,
  venueGUID: state => state.auth.venueGUID,
  venueID: state => state.auth.venueID,
  waiterID: state => state.auth.waiterID,
  tableData: state => state.auth.tableData,
  posHeader: state => state.auth.posHeader,
  setClientGUID: state => state.authActions.setClientGUID,
  setClientID: state => state.authActions.setClientID,
  setVenueGUID: state => state.authActions.setVenueGUID,
  setVenueID: state => state.authActions.setVenueID,
  setWaiterID: state => state.authActions.setWaiterID,
  logoutWaiter: state => state.authActions.logoutWaiter,
  leaveClient: state => state.authActions.leaveClient,
  setTableData: state => state.authActions.setTableData,
  setPosHeader: state => state.authActions.setPosHeader,
};
