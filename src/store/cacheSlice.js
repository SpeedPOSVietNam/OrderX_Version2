export const createCacheSlice = (set, get) => ({
    cache: {
        currentTableID: null,
        isKickingWaiterOutToMap: false,
    },
    cacheActions: {
        closeTable: () =>
            set((state) => {
                state.cache.currentTableID = null;
            }),
        setCurrentTableID: (tableID) =>
            set((state) => {
                state.cache.currentTableID = tableID;
            }),
        setKickingWaiterOutToMap: (value) =>
            set((state) => {
                state.cache.isKickingWaiterOutToMap = value;
            }),
    },
});

export const cacheSelectors = {
    closeTable: (state) => state.cacheActions.closeTable,
    currentTableID: (state) => state.cache.currentTableID,
    setCurrentTableID: (state) => state.cacheActions.setCurrentTableID,
    isKickingWaiterOutToMap: (state) => state.cache.isKickingWaiterOutToMap,
    setKickingWaiterOutToMap: (state) => state.cacheActions.setKickingWaiterOutToMap,
};
