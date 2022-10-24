import { isBillItemEqual } from '../helpers/logicUtils';
import { deepClone } from '../helpers/utils';

export const createMenuStateSlice = (set, get) => ({
    menuState: {
        orderDetails: [],
        selectedPage: null,
        selectedBillItem: null,
        itemBeingModify: null,
        comboBeingModify: [],
        comboModifyCache: null,
        commentModal: {
            isOpen: false,
            comment: '',
        },
        isOpenMenuSelector: false,
        isOpenFunctionPopup: false,
        isFullScreenBill: false,
        isShowSummary: false,
    },
    menuStateActions: {
        resetMenuState: () =>
            set((state) => {
                state.menuState.orderDetails = [];
                state.menuState.selectedPage = null;
                state.menuState.selectedBillItem = null;
                state.menuState.itemBeingModify = null;
                state.menuState.comboBeingModify = [];
                state.menuState.comboModifyCache = null;
                state.menuState.commentModal = {
                    isOpen: false,
                    comment: '',
                };
                state.menuState.isOpenMenuSelector = false;
                state.menuState.isOpenFunctionPopup = false;
                state.menuState.isFullScreenBill = false;
                state.menuState.isShowSummary = false;
            }),
        setOrderDetails: (orderDetails) =>
            set((state) => {
                state.menuState.orderDetails = orderDetails;
            }),
        setSelectedPage: (selectedPage) =>
            set((state) => {
                state.menuState.selectedPage = selectedPage;
            }),
        setSelectedBillItem: (selectedBillItem) =>
            set((state) => {
                state.menuState.selectedBillItem = selectedBillItem;
            }),
        setItemBeingModify: (itemBeingModify) =>
            set((state) => {
                state.menuState.itemBeingModify = itemBeingModify;
            }),
        setComboBeingModify: (comboBeingModify) =>
            set((state) => {
                state.menuState.comboBeingModify = comboBeingModify;
            }),
        setComboModifyCache: (comboModifyCache) =>
            set((state) => {
                state.menuState.comboModifyCache = comboModifyCache;
            }),
        setCommentModal: ({ comment, isOpen = true }) =>
            set((state) => {
                state.menuState.commentModal = {
                    isOpen,
                    comment,
                };
            }),
        setIsOpenMenuSelector: (isOpenMenuSelector) =>
            set((state) => {
                state.menuState.isOpenMenuSelector = isOpenMenuSelector;
            }),
        setIsOpenFunctionPopup: (isOpenFunctionPopup) =>
            set((state) => {
                state.menuState.isOpenFunctionPopup = isOpenFunctionPopup;
            }),
        setIsFullScreenBill: (isFullScreenBill) =>
            set((state) => {
                state.menuState.isFullScreenBill = isFullScreenBill;
            }),
        setIsShowSummary: (isShowSummary) =>
            set((state) => {
                state.menuState.isShowSummary = isShowSummary;
            }),

        addBillItem: (billItem) =>
            set((state) => {
                let index = state.menuState.orderDetails.findIndex((_) =>
                    isBillItemEqual(_, billItem, billItem?.OptionSets != null),
                );

                // update existing one
                if (index >= 0) {
                    state.menuState.orderDetails[index].Count++;
                    state.menuState.selectedBillItem = state.menuState.orderDetails[index];
                }

                // add new one
                else {
                    state.menuState.orderDetails.push(deepClone(billItem)); // Nếu không dùng deepClone thì sẽ bị lỗi, kiểu con trỏ hay cmg đó ko biết nữa
                    // mất 3 tiếng đồng hồ, mò mãi ko ra
                    // Cụ thể: thêm coca vào bill, giá 110k, sau đó chọn Test Combo mod, trong đó có item coca giá 200đ
                    // Nhưng thằng coca trong bill lại bị đổi giá theo, mé éo hiểu
                    state.menuState.selectedBillItem = deepClone(billItem);
                }
            }),
        addComboBillItem: (item) => {
            // trong action này chưa action addBillItem, nên không biết dạng set(state => ...) bao cả hàm được
            // phải dùng get() để lấy state

            const comboBeingModify = get().menuState.comboBeingModify;
            if (comboBeingModify.length > 1) {
                // save to cache
                set((state) => {
                    state.menuState.comboModifyCache.Items.push(item);
                });
            } else {
                // this is the last item in combo
                const billItemCombo = deepClone(get().menuState.comboModifyCache);
                billItemCombo.Items.push(item);
                get().menuStateActions.addBillItem(billItemCombo); // add to bill

                // clear cache
                set((state) => {
                    state.menuState.comboModifyCache = null;
                });
            }
        },
        deleteBillItem: (billItem, removeAll = false, removeOnEqual0 = true) =>
            set((state) => {
                let index = state.menuState.orderDetails.findIndex((_) => isBillItemEqual(_, billItem, true));
                if (index >= 0) {
                    let newCount = state.menuState.orderDetails[index].Count - 1;

                    // delete if deleteAll OR count <= 0
                    if (removeAll || (removeOnEqual0 && newCount <= 0)) {
                        state.menuState.orderDetails.splice(index, 1);

                        let len = state.menuState.orderDetails.length;
                        if (len > 0) {
                            const nextSelectedIndex = Math.min(len - 1, Math.max(0, index));
                            state.menuState.selectedBillItem = state.menuState.orderDetails[nextSelectedIndex];
                        } else {
                            state.menuState.selectedBillItem = null;
                        }
                    }

                    // decrease count
                    else if (newCount > 0) {
                        state.menuState.orderDetails[index].Count = newCount;
                        state.menuState.selectedBillItem = state.menuState.orderDetails[index];
                    }
                }
            }),
        addCommentToBillItem: (billItem, comment) =>
            set((state) => {
                let index = state.menuState.orderDetails.findIndex((_) => isBillItemEqual(_, billItem, true));

                if (!comment) delete state.menuState.orderDetails[index].Comment;
                else state.menuState.orderDetails[index].Comment = comment;

                state.menuState.commentModal = {
                    comment: '',
                    isOpen: false,
                };
            }),
    },
});

export const menuStateSelectors = {
    resetMenuState: (state) => state.menuStateActions.resetMenuState,
    orderDetails: (state) => state.menuState.orderDetails,
    selectedPage: (state) => state.menuState.selectedPage,
    selectedBillItem: (state) => state.menuState.selectedBillItem,
    itemBeingModify: (state) => state.menuState.itemBeingModify,
    comboBeingModify: (state) => state.menuState.comboBeingModify,
    comboModifyCache: (state) => state.menuState.comboModifyCache,
    commentModal: (state) => state.menuState.commentModal,
    isOpenMenuSelector: (state) => state.menuState.isOpenMenuSelector,
    isOpenFunctionPopup: (state) => state.menuState.isOpenFunctionPopup,
    isFullScreenBill: (state) => state.menuState.isFullScreenBill,
    isShowSummary: (state) => state.menuState.isShowSummary,

    setOrderDetails: (state) => state.menuStateActions.setOrderDetails,
    setSelectedPage: (state) => state.menuStateActions.setSelectedPage,
    setSelectedBillItem: (state) => state.menuStateActions.setSelectedBillItem,
    setItemBeingModify: (state) => state.menuStateActions.setItemBeingModify,
    setComboBeingModify: (state) => state.menuStateActions.setComboBeingModify,
    setComboModifyCache: (state) => state.menuStateActions.setComboModifyCache,
    setCommentModal: (state) => state.menuStateActions.setCommentModal,
    setIsOpenMenuSelector: (state) => state.menuStateActions.setIsOpenMenuSelector,
    setIsOpenFunctionPopup: (state) => state.menuStateActions.setIsOpenFunctionPopup,
    setIsFullScreenBill: (state) => state.menuStateActions.setIsFullScreenBill,
    setIsShowSummary: (state) => state.menuStateActions.setIsShowSummary,

    addBillItem: (state) => state.menuStateActions.addBillItem,
    addComboBillItem: (state) => state.menuStateActions.addComboBillItem,
    deleteBillItem: (state) => state.menuStateActions.deleteBillItem,
    addCommentToBillItem: (state) => state.menuStateActions.addCommentToBillItem,
};
