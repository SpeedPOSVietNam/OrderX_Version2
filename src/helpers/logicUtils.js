import { customGUID, deepEqualCompare, roundDecimal } from './utils';
import {
    JsonCompressDict,
    SaleChannelPriceMode,
    SaleItemType,
    SalePriceSetting,
    SaleItemPriceMode,
    OrderDetailCalcMode,
} from '../constants/global';

//#region compare bill items
export const isNormalBillItemEqual = (item1, item2, checkOptionSet = true) => {
    if (checkOptionSet && !deepEqualCompare(item1?.OptionSets, item2?.OptionSets)) {
        return false;
    }

    return true;
};

export const isComboBillItemEqual = (item1, item2) => {
    for (let i = 0; i < item1.Items.length; i++) {
        if (!isNormalBillItemEqual(item1.Items[i], item2.Items[i])) {
            return false;
        }
    }

    return true;
};

export const isBillItemEqual = (billItem1, billItem2, checkOptionSet = true) => {
    if (!billItem1 || !billItem2) {
        return false;
    }

    // check id
    if (
        billItem1.ItemID !== billItem2.ItemID ||
        billItem1.ItemComboID !== billItem2.ItemComboID ||
        billItem1.ItemComboLinkID !== billItem2.ItemComboLinkID
    ) {
        return false;
    }

    // is normal bill item
    if (billItem1.ItemID != null) {
        return isNormalBillItemEqual(billItem1, billItem2, checkOptionSet);
    }

    // is combo bill item
    if (billItem1.ItemComboID != null) {
        return isComboBillItemEqual(billItem1, billItem2);
    }
};
//#endregion

//#region order details utils
// Thực ra flat tại client chỉ để cho dễ tính NET,FINAL,TAXES hơn thôi, chỉ cần flat rồi lấy ra giá
// Chứ không cần lằng nhằng detailUniq rồi parentUniq làm gì :)))
// Lúc gửi orderDetails lên server thì server tự flat rồi tự thêm để validate và lưu db
export const flattenOrderDetails = (orderDetails) => {
    const flatWithGUID =
        orderDetails
            .map((_) =>
                _.ItemID != null
                    ? flattenOrderDetailItem(_)
                    : _.ItemComboID != null
                    ? flattenOrderDetailCombo(_)
                    : null,
            )
            .filter((_) => _ != null)
            .flat()
            .map((_, index) => ({ ..._, DetailUniq: index })) || []; // inject detailUniq

    // inject parent uniq
    const result = flatWithGUID.map((_) => {
        let foundIndex = flatWithGUID.findIndex((i) => i.DetailGUID === _.ParentGUID);
        return {
            ..._,
            ParentUniq: foundIndex === -1 ? null : foundIndex,
        };
    });

    return result;
};

const flattenOrderDetailItem = (item, multiplier = 1, parentGUID = null) => {
    let itemGUID = customGUID();
    return [
        // item itself
        {
            ParentGUID: parentGUID,
            DetailGUID: itemGUID,
            DetailID: item.ItemID,
            DetailType: SaleItemType.ITEM,
            ItemComboLinkID: item.ItemComboLinkID,
            OptionSetID: null,
            Name: item.DisplayName || item.Name,
            PriceType: item.SalePrice.PriceType,
            UnitPrice: item.SalePrice.UnitPrice,
            NetPrice: item.SalePrice.NetPrice,
            GrossPrice: item.SalePrice.GrossPrice,
            Count: item.Count * multiplier,
            CalcMode: item.CalcMode,
            Taxes: [
                item.SalePrice.TaxValue1,
                item.SalePrice.TaxValue2,
                item.SalePrice.TaxValue3,
                item.SalePrice.TaxValue4,
                item.SalePrice.TaxValue5,
            ],
        },
        // modifiers
        ...item.OptionSets.map((o) =>
            o.Modifiers.map((m) => {
                let modifierGUID = customGUID();
                return {
                    ParentGUID: itemGUID,
                    DetailGUID: modifierGUID,
                    DetailID: m.ModifierID,
                    DetailType: SaleItemType.MODIFIER,
                    ItemComboLinkID: null,
                    OptionSetID: o.OptionSetID,
                    Name: m.Name,
                    PriceType: m.SalePrice.PriceType,
                    UnitPrice: m.SalePrice.UnitPrice,
                    NetPrice: m.SalePrice.NetPrice,
                    GrossPrice: m.SalePrice.GrossPrice,
                    Count: m.Count * item.Count * multiplier,
                    CalcMode: m.CalcMode,
                    Taxes: [
                        m.SalePrice.TaxValue1,
                        m.SalePrice.TaxValue2,
                        m.SalePrice.TaxValue3,
                        m.SalePrice.TaxValue4,
                        m.SalePrice.TaxValue5,
                    ],
                };
            }),
        ).flat(),
    ];
};

const flattenOrderDetailCombo = (combo, parentGUID = null) => {
    let comboGUID = customGUID();
    return [
        // combo itself
        {
            ParentGUID: parentGUID,
            DetailGUID: comboGUID,
            DetailID: combo.ItemComboID,
            DetailType: SaleItemType.ITEM_COMBO,
            ItemComboLinkID: null,
            OptionSetID: null,
            Name: combo.DisplayName || combo.Name,
            PriceType: combo.SalePrice.PriceType,
            UnitPrice: combo.SalePrice.UnitPrice,
            NetPrice: combo.SalePrice.NetPrice,
            GrossPrice: combo.SalePrice.GrossPrice,
            Count: combo.Count,
            CalcMode: combo.CalcMode,
            Taxes: [
                combo.SalePrice.TaxValue1,
                combo.SalePrice.TaxValue2,
                combo.SalePrice.TaxValue3,
                combo.SalePrice.TaxValue4,
                combo.SalePrice.TaxValue5,
            ],
        },

        // items in combo
        ...combo.Items.map((item) => flattenOrderDetailItem(item, combo.Count, comboGUID)).flat(),
    ];
};
//#endregion

//#region unFlat
export const unFlatOrderDetails = (flattened) => {
    let waitQueue = flattened.map((_) => ({
        ..._,

        // inject data based on billItem structure
        ...(_.DetailType === SaleItemType.ITEM || _.DetailType === SaleItemType.DISCOUNT
            ? { ItemID: _.DetailID }
            : _.DetailType === SaleItemType.ITEM_COMBO
            ? { ItemComboID: _.DetailID }
            : _.DetailType === SaleItemType.MODIFIER
            ? { ModifierID: _.DetailID }
            : {}),
        OptionSets: [],
        SalePrice: {
            PriceType: _.PriceType,
            UnitPrice: _.UnitPrice,
            NetPrice: _.NetPrice,
            GrossPrice: _.GrossPrice,
            TaxRate2: _.TaxRate2,
            TaxValue2: _.TaxValue2,
            TaxRate1: _.TaxRate1,
            TaxRate3: _.TaxRate3,
            TaxRate4: _.TaxRate4,
            TaxRate5: _.TaxRate5,
            TaxValue1: _.TaxValue1,
            TaxValue3: _.TaxValue3,
            TaxValue4: _.TaxValue4,
            TaxValue5: _.TaxValue5,
        },
    }));
    let processedQueue = [];

    while (waitQueue.length) {
        let first = waitQueue.shift();

        // do not have parent
        if (first.ParentUniq == null) {
            processedQueue.push(first);
        }

        // have parent
        else {
            let parentIndex = processedQueue.findIndex((_) => _.DetailUniq === first.ParentUniq);
            let parentInnerIndex = -1;

            // get parent inner index (if needed)
            if (parentIndex < 0) {
                parentIndex = processedQueue.findIndex((_) => {
                    if (_.Items == null) {
                        return false;
                    }
                    parentInnerIndex = _.Items.findIndex((__) => __.DetailUniq === first.ParentUniq);
                    return parentInnerIndex >= 0;
                });
            }

            // parent not processed
            if (parentIndex < 0) {
                waitQueue.push(first); // move first to end of wait queue
            }

            // parent processed
            else {
                // correct count
                first.Count /= processedQueue[parentIndex].Count;
                if (parentInnerIndex >= 0) {
                    first.Count /= processedQueue[parentIndex].Items[parentInnerIndex].Count;
                }

                switch (first.DetailType) {
                    case SaleItemType.ITEM:
                        // TODO check itemComboLinkID
                        let items = processedQueue[parentIndex].Items || [];
                        items.push(first);
                        processedQueue[parentIndex].Items = items;
                        break;
                    case SaleItemType.MODIFIER:
                        // lay gia tri cu
                        let optionSets;
                        if (parentInnerIndex < 0) {
                            optionSets = processedQueue[parentIndex].OptionSets || [];
                        } else {
                            optionSets = processedQueue[parentIndex].Items[parentInnerIndex].OptionSets || [];
                        }

                        // cap nhat gia tri
                        let opIndex = optionSets.findIndex((_) => _.OptionSetID === first.OptionSetID);
                        if (opIndex >= 0) {
                            optionSets[opIndex].Modifiers.push(first);
                        } else {
                            optionSets.push({
                                OptionSetID: first.OptionSetID,
                                Modifiers: [first],
                            });
                        }

                        // luu gia tri moi
                        if (parentInnerIndex < 0) {
                            processedQueue[parentIndex].OptionSets = optionSets;
                        } else {
                            processedQueue[parentIndex].Items[parentInnerIndex].OptionSets = optionSets;
                        }

                        break;
                    default:
                        throw Error('Wrong item type. ' + first.DetailType);
                }
            }
        }
    }

    return processedQueue;
};
//#endregion

//#region calculate bill summary net/tax/total
export const calculateBillSummary = (orderDetails, saleTaxData) => {
    let net = 0,
        total = 0,
        taxes = [];

    if (!orderDetails) {
        return {
            NET: net,
            FINAL_TOTAL: total,
            TAXES: taxes,
        };
    }

    const flattended = flattenOrderDetails(orderDetails);

    flattended.forEach((_) => {
        net += _.CalcMode === OrderDetailCalcMode.Void ? 0 : _.Count * (_.NetPrice || 0);
        total += _.CalcMode === OrderDetailCalcMode.Void ? 0 : _.Count * (_.GrossPrice || 0);

        taxes = [1, 2, 3, 4, 5].map((i) => ({
            Name: saleTaxData['TaxName' + i],
            Rate: saleTaxData['TaxRate' + i],
            Amount: _.Count * (_.Taxes[i - 1] || 0) + (taxes[i - 1]?.Amount || 0),
        }));
    });

    // round 2 decimals
    net = roundDecimal(net);
    total = roundDecimal(total);
    taxes.forEach((_) => {
        _.Amount = roundDecimal(_.Amount);
    });

    return {
        NET: net,
        FINAL_TOTAL: total,
        TAXES: taxes,
    };
};
//#endregion

//#region json decompress
export const jsonDecompress = (_) => {
    if (Array.isArray(_)) {
        return jsonDecompressArr(_);
    }

    if (typeof _ === 'object') {
        return jsonDecompressObj(_);
    }

    return null;
};

const jsonDecompressArr = (arr) => {
    let result = [];
    arr.forEach((obj) => {
        result.push(jsonDecompressObj(obj));
    });
    return result;
};

const jsonDecompressObj = (obj) => {
    let result = {};
    Object.keys(obj).forEach((objK) => {
        let newValue = obj[objK];
        if (typeof newValue === 'object') {
            if (Array.isArray(newValue)) {
                newValue = jsonDecompressArr(newValue);
            } else {
                newValue = jsonDecompressObj(newValue);
            }
        }
        result[JsonCompressDict[objK] || objK] = newValue;
    });
    return result;
};
//#endregion

//#region calculate detail and salePrice
export const joinTableOrderComboDetail = (
    comboID,
    tableOrderItemDetailData,
    saleChannelData,
    configData,
    salePriceData,
) => {
    // get combo detail
    const detail = tableOrderItemDetailData.ItemCombos.find((d) => d.ItemComboID === comboID);

    if (!detail) {
        return null;
    }

    // inject salePrice to detail
    const saleChannel = saleChannelData.find((s) => s.SaleChannelID === configData.UseSaleChannel);
    detail.SalePrice = getSalePrice(detail, saleChannel, salePriceData, SaleItemType.ITEM_COMBO);

    // inject sale price for each item in combo
    detail.ItemComboLinks = detail.ItemComboLinks.filter((_) => _.IsActive).map((_) => ({
        ..._,
        ...joinTableOrderItemDetail(
            _.ItemID,
            tableOrderItemDetailData,
            saleChannelData,
            configData,
            salePriceData,
            _.ItemComboLinkID,
            _.PriceMode,
        ),
    }));

    return detail;
};

export const joinTableOrderItemDetail = (
    itemID,
    tableOrderItemDetailData,
    saleChannelData,
    configData,
    salePriceData,
    itemComboLinkID = null,
    priceMode = null,
) => {
    // get item detail
    const detail = tableOrderItemDetailData.Items.find((d) => d.ItemID === itemID);

    if (!detail) {
        return null;
    }

    // inject salePrice to detail
    const saleChannel = saleChannelData.find((s) => s.SaleChannelID === configData.UseSaleChannel);
    detail.SalePrice = getSalePrice(detail, saleChannel, salePriceData, SaleItemType.ITEM, itemComboLinkID, priceMode);

    // inject sale price for each modifier in item
    detail.OptionSets = detail.OptionSets.map((o) => ({
        ...o,
        Modifiers: o.Modifiers.map((m) => ({
            ...m,
            SalePrice: getSalePrice(m, saleChannel, salePriceData, SaleItemType.MODIFIER),
        })),
    }));

    return detail;
};

export const getSalePrice = (item, saleChannel, salePriceData, saleItemType, itemComboLinkID, _priceMode) => {
    let _currentPriceType = SalePriceSetting.DEFAULT_PRICE;
    let saleItemID = item.ItemID || item.ItemComboID || item.ModifierID;
    let schedule = item.Schedule;
    let priceMode = _priceMode || item.PriceMode;

    // regular price OR item/item_combo
    if (priceMode === undefined || priceMode === SaleItemPriceMode.REGULAR_PRICE) {
        // force price by channel
        if (saleChannel.PriceMode === SaleChannelPriceMode.FORCE_PRICE) {
            _currentPriceType = saleChannel.ForcePriceType;
        }
        // schedule price
        else if (saleChannel.PriceMode === SaleChannelPriceMode.SCHEDULE_PRICING) {
            _currentPriceType = getPriceTypeBySchedule(schedule);
        }
    }
    // fixed price
    else if (priceMode === SaleItemPriceMode.FIXED_PRICE) {
        _currentPriceType = SalePriceSetting.FIXED_PRICE;
    }
    // force price
    else if (priceMode === SaleItemPriceMode.FORCE_PRICE) {
        _currentPriceType = item.ForcePriceType;
    }
    // schedule price
    else if (priceMode === SaleItemPriceMode.SCHEDULE_PRICING) {
        _currentPriceType = getPriceTypeBySchedule(schedule);
    }

    // Nếu giá = 0 thì sẽ ko có trong mảng salePriceData => return null
    let salePrice = salePriceData.find(
        (__) =>
            // __.SaleChannelID === saleChannel.SaleChannelID && // Lúc fetch đã filter theo channel id rồi, có thể bỏ filter này
            __.PriceType === _currentPriceType &&
            __.SaleItemType === saleItemType &&
            __.SaleItemID === saleItemID &&
            // ===== is combo or itemComboLink =====
            (priceMode === SaleItemPriceMode.FIXED_PRICE ? __.ItemComboLinkID === itemComboLinkID : true),
    );

    return autoFillSalePrice(salePrice, _currentPriceType);
};

const getPriceTypeBySchedule = (schedule = '') => {
    let index = new Date().getDay() * 24 + new Date().getHours();
    return schedule[index] || SalePriceSetting.DEFAULT_PRICE;
};

// auto fill 0 to null properties in salePrice
const autoFillSalePrice = (salePrice, priceType) => {
    return {
        ...salePrice,
        PriceType: salePrice?.PriceType || priceType,
        UnitPrice: salePrice?.UnitPrice || 0,
        NetPrice: salePrice?.NetPrice || 0,
        GrossPrice: salePrice?.GrossPrice || 0,

        TaxRate1: orNull(salePrice?.TaxRate1),
        TaxRate2: orNull(salePrice?.TaxRate2),
        TaxRate3: orNull(salePrice?.TaxRate3),
        TaxRate4: orNull(salePrice?.TaxRate4),
        TaxRate5: orNull(salePrice?.TaxRate5),

        TaxValue1: orNull(salePrice?.TaxValue1),
        TaxValue2: orNull(salePrice?.TaxValue2),
        TaxValue3: orNull(salePrice?.TaxValue3),
        TaxValue4: orNull(salePrice?.TaxValue4),
        TaxValue5: orNull(salePrice?.TaxValue5),
    };
};

const orNull = (_) => (_ === undefined ? null : _);
//#endregion
