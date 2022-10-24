import { getAppMode } from '../store';
import { COLORS } from './theme';

export const APPMODE = {
    DEV: 'DEV',
    PROD: 'PROD',
};

export const APPMODE_CONSTANTS = {
    [APPMODE.DEV]: {
        APP_NAME: 'Speed_STA-DEV',
        CODEPUSH_KEY: 'LQrOSHZDEKPicJxy0fAOR0qZCs4jz7pEHFrM8', // staging
        SERVER_HOST_IP: 'http://orderx-dev.speedtech.vn',
        SOCKET_SERVER_URL: 'ws://orderx-io-dev.speedtech.vn:8070',
        SOCKET_APP_KEY: 2264808,
        SHAREPOS_PAYMENT_SECRETKEY: '1111111111111111', // for testing
        APP_CLIENT: {
            guid: '420ca2fa20ca4c079b67178891b97978',
            secretKey: '753159',
        },

        // Lưu ý: Cần cập nhật version trong folder android và ios luôn nhé. Sửa chỗ này chỉ tạo thay đổi trên giao diện thôi.
        VERSION: {
            NAME: '1.0.4',
            CODE: '202208261134',
        },
    },
    [APPMODE.PROD]: {
        APP_NAME: 'Speed_STA-PROD',
        CODEPUSH_KEY: 'M2uWIBe8id8cN8-mpHtOQHgw1Orq7QqkJXrK_', // production
        SERVER_HOST_IP: 'http://orderx-api.speedtech.vn',
        SOCKET_SERVER_URL: 'ws://orderx-io.speedtech.vn:8071',
        SOCKET_APP_KEY: 2264808,
        SHAREPOS_PAYMENT_SECRETKEY: '1111111111111111', // for testing TODO get production secretKey
        APP_CLIENT: {
            guid: '4af88b8074de46be93d630df3884a51c',
            secretKey: '753159',
        },

        // Lưu ý: Cần cập nhật version trong folder android và ios luôn nhé. Sửa chỗ này chỉ tạo thay đổi trên giao diện thôi.
        VERSION: {
            NAME: '1.0.4',
            CODE: '202208270730',
        },
    },
};

export const getAppModeConstantValue = (propertyName) => {
    const currentAppMode = getAppMode() || APPMODE.PROD;
    return APPMODE_CONSTANTS[currentAppMode][propertyName];
};

export const EDIT_MAP_PASSWORD = 'SpeedPOSMap';

export const SHAREPOS_PAYMENT_SECRETKEY = '1111111111111111'; // for testing

//#region ENUMS

// Map theo DefinedApiResult trên SpeedCoreWeb
export const isInApiResultCode = (code) => Object.values(APIResultCode).indexOf(code) >= 0;
export const APIResultCode = {
    // General
    Success: 200,
    Bad_Request: 400,

    // General Data
    NotFoundClient: 1001,
    NotFoundVenue: 1002,
    NotFoundUserCredentials: 1003,
    NotFoundUser: 1004,
    NotFoundUserGroup: 1005,

    // TableServe
    TableServe_TableNotAvailable: 301,
    TableServe_TableNoServing: 302,
    TableServe_ServingWaiterOnly: 303,
    TableServe_OneWaiterOneTableAtATime: 304,
    TableServe_TableAlreadyOpened: 305,
    TableServe_CantCloseReadyTable: 306,
    TableServe_SectionConfiguredIncorrectly: 307,
    TableServe_BillNotFound: 308,
    TableServe_BillAlreadyClosed: 309,
    TableServe_PayMethodNotFound: 310,
    TableServe_NoOrderToPay: 311,
    TableServe_PayMismatchAmountDue: 312,
    TableServe_PayMismatchChange: 313,
    TableServe_PayTotalGoesNegative: 314,
    TableServe_PayTotalExceedBillTotal: 315,
    TableServe_PayMethodNotActive: 316,
    TableServe_CannotCloseUnpaidBill: 317,
    TableServe_PaidNotFound: 318,
    TableServe_PaidAlreadyCommitted: 319,
    TableServe_PaidCannotCancel: 320,
    TableServe_BillSummaryInvalid: 321,
    TableServe_BillSummaryTaxInvalid: 322,
    TableServe_TaxNotFound: 323,
    TableServe_OrderDetailInvalid: 324,
    TableServe_OrderDetailItemNotFound: 325,
    TableServe_OrderDetailSalePriceInvalid: 326,
    TableServe_OrderDetailItemComboLinkNotFound: 327,
    TableServe_OrderDetailItemComboNotFound: 328,
    TableServe_OrderDetailModifierNotFound: 329,
    TableServe_OrderDetailParentInvalid: 330,
    TableServe_OrderDetailModifierInvalidCount: 331,
    TableServe_OrderDetailOptionSetNotFound: 332,
    TableServe_TscRefCodeAlreadyExists: 333,
    TableServe_ConfirmNotFound: 334,
    TableServe_BillHasInprogressChildrenBills: 335,
    TableServe_MergeSameConfirms: 336,
    TableServe_FuncRequiresSto: 337,
    TableServe_CannotMergePayingConfirm: 338,
    TableServe_CannotMergeEmptyConfirm: 339,

    // Payment
    Payment_PayTransactionNotFound: 401,
    Payment_BuilderArgumentException: 402,
    Payment_PayTransactionUpdateStatusInvalid: 403,

    // SyncState
    VenueDataSync_InvalidDbType: 501,

    // Core Authentication
    CoreAuth_Expired: 601,
};

export const VenueDBType = {
    NONE: 0,
    PIXELPOINT: 100,
};

export const PaymentStatus = {
    UNCOMMITTED: 0,
    COMMITTED: 1,
};

export const ObjectType = {
    TABLE: 'Table',
    SECTION: 'Section',
    NOTATION: 'Notation',
    IMAGE: 'Image',
};

export const ShapeType = {
    RECT: 'rect',
    OVAL: 'oval',
};

export const TableOrderItemType = {
    BLANK: 0,
    ITEM: 1,
    ITEM_COMBO: 2,
    COMMENT: 3,
};

export const TableStatusNum = {
    READY: 0,
    SERVING: 1,
    OCCUPIED: 2,
};

export const BillStatusNum = {
    IN_PROGRESS: 0,
    CLOSED: 1,
};

export const TableServeLogAction = {
    OPEN_TABLE: 0,
    CONFIRM_ORDER: 1,
    CLOSE_TABLE: 2,
};

export const TaxType = {
    PERCENTAGE: 0,
    AMOUNT: 1,
};

export const SaleItemType = {
    ITEM: 0,
    ITEM_COMBO: 1,
    MODIFIER: 2,
    COMMENT: 10,
    DISCOUNT: 11,
};

export const SaleChannelPriceMode = {
    SCHEDULE_PRICING: 0,
    FORCE_PRICE: 1,
};

export const SaleItemPriceMode = {
    SCHEDULE_PRICING: SaleChannelPriceMode.SCHEDULE_PRICING,
    FORCE_PRICE: SaleChannelPriceMode.FORCE_PRICE,
    FIXED_PRICE: 2,
    REGULAR_PRICE: 10,
};

export const SalePriceSetting = {
    DEFAULT_PRICE: 'A',
    FIXED_PRICE: '@',
};

export const OrderDisplayType = {
    TableServeConfirm: 0,
    LogValue: 1,
};

export const OrderDetailCalcMode = {
    Normal: 0,
    Void: 1,
};

export const PaymentClientVendor = {
    // Internal
    MiniPOS: 1,

    // Third-party
    PayME: 100,
    VNPay: 101,
    MoMo: 102,
    ZaloPay: 103,
    GrabPay: 104,
    Gotit: 105,
    Urbox: 106,
};

// JsonCompressDict
export const JsonCompressDict = {
    ac: 'IsActive',
    cc: 'ColorCode',
    clI: 'ClientID',
    co: 'Count',
    de: 'Description',
    dl: 'IsDelete',
    dn: 'DisplayName',
    fp: 'ForcePriceType',
    gp: 'GrossPrice',
    icI: 'ItemComboID',
    icO: 'ItemCombo',
    iclI: 'ItemComboLinkID',
    iclS: 'ItemComboLinks',
    itI: 'ItemID',
    itO: 'Item',
    itn: 'ItemName',
    ma: 'Max',
    mgI: 'ModifierGroupID',
    mgO: 'ModifierGroup',
    mi: 'Min',
    moI: 'ModifierID',
    moL: 'Modifiers',
    na: 'Name',
    np: 'NetPrice',
    osI: 'OptionSetID',
    osS: 'OptionSets',
    pm: 'PriceMode',
    pt: 'PriceType',
    re: 'IsRequired',
    sc: 'Schedule',
    scI: 'SaleChannelID',
    sd: 'SizeDown',
    seI: 'SectionID',
    siI: 'SaleItemID',
    sit: 'SaleItemType',
    sm: 'IsStackModifier',
    spI: 'SalePriceID',
    su: 'SizeUp',
    t: 'Type',
    toiI: 'TableOrderItemID',
    topI: 'TableOrderPageID',
    tr1: 'TaxRate1',
    tr2: 'TaxRate2',
    tr3: 'TaxRate3',
    tr4: 'TaxRate4',
    tr5: 'TaxRate5',
    tv1: 'TaxValue1',
    tv2: 'TaxValue2',
    tv3: 'TaxValue3',
    tv4: 'TaxValue4',
    tv5: 'TaxValue5',
    up: 'UnitPrice',
    vnI: 'VenueID',
};

//#endregion

export const getTableStatusColor = (status) => {
    switch (status) {
        case TableStatusNum.READY:
            return '#0072E3';
        case TableStatusNum.SERVING:
            return '#d09a13';
        case TableStatusNum.OCCUPIED:
            return '#E01F3D';
        default:
            return COLORS.black;
    }
};

export const getTableColor = (status, isOpenByLoggedInWaiter) => {
    if (status === TableStatusNum.READY) {
        return '#0072E3';
    } else if (isOpenByLoggedInWaiter) {
        return '#E01F3D';
    } else {
        return '#d09a13';
    }
};

export const getBillItemColor = (isOld = true, isSelected = false, isOdd = false, isDiscount = false) => {
    if (isDiscount) {
        return {
            textColor: COLORS.white,
            backgroundColor: '#008001',
        };
    }
    if (isOld) {
        return {
            textColor: COLORS.secondary,
            backgroundColor: isOdd ? '#fefefe' : '#f0f0f0',
        };
    }
    if (isSelected) {
        return {
            textColor: COLORS.white,
            backgroundColor: '#F44336',
        };
    }
    if (isOdd) {
        return {
            textColor: COLORS.black,
            backgroundColor: '#12EDEE',
        };
    }

    return {
        textColor: COLORS.black,
        backgroundColor: '#14feff',
    };
};
