package com.orderx_v2;;

import android.util.Log;
import androidx.annotation.NonNull;

import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;
import com.facebook.react.module.annotations.ReactModule;

import android.os.Bundle;
import android.os.RemoteException;

import java.util.Arrays;
import java.util.ArrayList;
import java.util.List;

import com.usdk.apiservice.aidl.printer.ASCScale;
import com.usdk.apiservice.aidl.printer.ASCSize;
import com.usdk.apiservice.aidl.printer.AlignMode;
import com.usdk.apiservice.aidl.printer.ECLevel;
import com.usdk.apiservice.aidl.printer.FactorMode;
import com.usdk.apiservice.aidl.printer.HZScale;
import com.usdk.apiservice.aidl.printer.HZSize;
import com.usdk.apiservice.aidl.printer.OnPrintListener;
import com.usdk.apiservice.aidl.printer.PrintFormat;
import com.usdk.apiservice.aidl.printer.PrinterData;
import com.usdk.apiservice.aidl.printer.PrinterError;
import com.usdk.apiservice.aidl.printer.UPrinter;

import com.usdk.apiservice.aidl.data.StringValue;
import com.usdk.apiservice.aidl.emv.SearchCardListener;
import com.usdk.apiservice.aidl.emv.ActionFlag;
import com.usdk.apiservice.aidl.emv.CAPublicKey;
import com.usdk.apiservice.aidl.emv.CVMFlag;
import com.usdk.apiservice.aidl.emv.CVMMethod;
import com.usdk.apiservice.aidl.emv.CandidateAID;
import com.usdk.apiservice.aidl.emv.CardRecord;
import com.usdk.apiservice.aidl.emv.EMVError;
import com.usdk.apiservice.aidl.emv.EMVData;
import com.usdk.apiservice.aidl.emv.EMVEventHandler;
import com.usdk.apiservice.aidl.emv.EMVTag;
import com.usdk.apiservice.aidl.emv.FinalData;
import com.usdk.apiservice.aidl.emv.KernelID;
import com.usdk.apiservice.aidl.emv.KernelINS;
import com.usdk.apiservice.aidl.emv.MessageID;
import com.usdk.apiservice.aidl.emv.OfflinePinVerifyResult;
import com.usdk.apiservice.aidl.emv.TransData;
import com.usdk.apiservice.aidl.emv.UEMV;
import com.usdk.apiservice.aidl.emv.WaitCardFlag;

import com.usdk.apiservice.aidl.magreader.TrackID;

import com.usdk.apiservice.aidl.pinpad.KAPId;
import com.usdk.apiservice.aidl.pinpad.KeySystem;
import com.usdk.apiservice.aidl.pinpad.OfflinePinVerify;
import com.usdk.apiservice.aidl.pinpad.OnPinEntryListener;
import com.usdk.apiservice.aidl.pinpad.PinPublicKey;
import com.usdk.apiservice.aidl.pinpad.PinVerifyResult;
import com.usdk.apiservice.aidl.pinpad.PinpadData;
import com.usdk.apiservice.aidl.pinpad.UPinpad;

@ReactModule(name = IngenicoModule.NAME)
public class IngenicoModule extends ReactContextBaseJavaModule {
    public static final String NAME = "IngenicoModule";

    public IngenicoModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    @NonNull
    public String getName() {
        return NAME;
    }

    @ReactMethod
    public void canPrint(Callback successCallback, Callback failedCallback) {
        try {
            UPrinter printer = DeviceHelper.me().getPrinter();
            int status = printer.getStatus();
            if (status != PrinterError.SUCCESS) {
                failedCallback.invoke("Printer not ready");
            } else {
                int validWidth = printer.getValidWidth(); // return valid width if canPrint = true
                successCallback.invoke(validWidth);
            }
        } catch(Exception e) {
            failedCallback.invoke(e.getMessage());
        }
    }

    static final String NEW_LINE = "\n";
    static final String SEPARATOR = " ";

    // type
    static final String TEXT = "text";
    static final String QRCODE = "qrcode";
    static final String BARCODE = "barcode";

    // size
    static final String SMALL = "small";
    static final String MEDIUM = "medium";
    static final String LARGE = "large";

    // align
    static final String LEFT = "left";
    static final String CENTER = "center";
    static final String RIGHT = "right";

    @ReactMethod
    public void printBill(String text, Callback successCallback, Callback failedCallback) {
        try {
            UPrinter printer = DeviceHelper.me().getPrinter();

            // printer setting
            printer.setPrintFormat(PrintFormat.FORMAT_MOREDATAPROC, PrintFormat.VALUE_MOREDATAPROC_PRNTOEND); // word wrap
            printer.setPrintFormat(PrintFormat.FORMAT_ZEROSPECSET, PrintFormat.VALUE_ZEROSPECSET_DEFAULTZERO); // zero style
//             printer.setAscScale(ASCScale.SC1x1); // i don't know wtf this is
//             printer.setAscSize(ASCSize.DOT24x12);
//             printer.setHzScale(HZScale.SC1x1);
//             printer.setHzSize(HZSize.DOT24x24);
//             printer.autoCutPaper(); // chỉ dùng được trên terminal nào có function auto-cut

            // prepare page to print
            String[] lines = text.split(NEW_LINE);
            for (String line : lines) {
                String[] lineConfigs = line.split(SEPARATOR);

                String  type = lineConfigs[0],
                        size = lineConfigs[1],
                        align = lineConfigs[2],
                        value = String.join(SEPARATOR, Arrays.copyOfRange(lineConfigs, 3, lineConfigs.length));

                int _align = align.equals(LEFT) ? AlignMode.LEFT :
                             align.equals(CENTER) ? AlignMode.CENTER :
                             align.equals(RIGHT) ? AlignMode.RIGHT :
                             AlignMode.LEFT;

                if (type.equals(TEXT)) {
                    if (size.equals(SMALL)) {
                        printer.setAscSize(ASCSize.DOT24x8);
                        printer.setAscScale(ASCScale.SC1x1);
                    } else if (size.equals(MEDIUM)) {
                        printer.setAscSize(ASCSize.DOT24x12);
                        printer.setAscScale(ASCScale.SC1x1);
                    } else if (size.equals(LARGE)) {
                        printer.setAscSize(ASCSize.DOT24x8);
                        printer.setAscScale(ASCScale.SC2x2);
                    }

                    printer.addText(_align, value);
                } else if(type.equals(QRCODE)) {
                    failedCallback.invoke("Print QrCode is not implemented.");
                    return;
                } else if(type.equals(BARCODE)) {
                    failedCallback.invoke("Print BarCode is not implemented.");
                    return;
                } else {
                    failedCallback.invoke("Invalid print type. Found " + type + " " + TEXT + " " + text == TEXT);
                    return;
                }
            }

            printer.feedLine(5); // thêm ra 5 dòng trống vào làm footer

            // start print
            printer.startPrint(new OnPrintListener.Stub() {
                @Override
                public void onFinish() throws RemoteException {
                    successCallback.invoke("Success");
                }

                @Override
                public void onError(int errorCode) throws RemoteException {
                    failedCallback.invoke("Error on print. error code: " + errorCode);
                }
            });
        } catch (Exception e) {
            failedCallback.invoke(e.getMessage());
        }
    }

    @ReactMethod
    public void beep(int time, Callback successCallback, Callback failedCallback) {
        try {
            DeviceHelper.me().getBeeper().startBeep(time);
            successCallback.invoke("Success");
        } catch (Exception e) {
            failedCallback.invoke(e.getMessage());
        }
    }

    @ReactMethod
    public void searchCard(
        boolean supportMagCard,
        boolean supportICCard,
        boolean supportRFCard,
        String rfDeviceName,
        Callback successCallback,
        Callback failedCallback
    ) {
        try  {
            Bundle param = new Bundle();
            param.putBoolean(EMVData.SUPPORT_MAG_CARD, supportMagCard);
            param.putBoolean(EMVData.SUPPORT_IC_CARD, supportICCard);
            param.putBoolean(EMVData.SUPPORT_RF_CARD, supportRFCard);
            param.putString(EMVData.RF_DEVICE_NAME, rfDeviceName);
            DeviceHelper.me().getEMV().searchCard(param, 30, new SearchCardListener.Stub() {
                @Override
                public void onCardSwiped(Bundle track) throws RemoteException {
                    WritableMap map = new WritableNativeMap();
                    map.putString("Message", "A magnetic stripe card is detected");
                    map.putString("CardNo", track.getString(EMVData.PAN));
                    map.putString("Track1", track.getString(EMVData.TRACK1));
                    map.putString("Track2", track.getString(EMVData.TRACK2));
                    map.putString("Track3", track.getString(EMVData.TRACK3));
                    map.putString("ServiceCode", track.getString(EMVData.SERVICE_CODE));
                    map.putString("CardExpired", track.getString(EMVData.EXPIRED_DATE));
                    successCallback.invoke(map);
                }

                @Override
                public void onCardPass(int cardType) throws RemoteException {
                    WritableMap map = new WritableNativeMap();
                    map.putString("Message", "A contactless card is detected");
                    map.putString("CardType", cardType + "");
                    successCallback.invoke(map);

                    // TODO Start EMV process
                }

                @Override
                public void onCardInsert() throws RemoteException {
                    WritableMap map = new WritableNativeMap();
                    map.putString("Message", "A contact card is detected");
                    successCallback.invoke(map);

                    // TODO Start EMV process
                }

                @Override
                public void onTimeout() throws RemoteException {
                    failedCallback.invoke("=> Card search timeout");
                }

                @Override
                public void onError(int code, String message) throws RemoteException {
                    failedCallback.invoke("=> Card search fail: " + message + " - code (" + code + ")");
                }
            });
        } catch (Exception e) {
            e.printStackTrace();
            failedCallback.invoke(e.getMessage());
        }
    }

    @ReactMethod
    public void startEMV(Callback successCallback, Callback failedCallback) {
        try {
            Bundle param = new Bundle();
            UEMV emv = DeviceHelper.me().getEMV();

            emv.startEMV(param, new EMVEventHandler.Stub() {
                // EMV initialization complete (no response required)
                @Override
                public void onInitEMV() throws RemoteException {}

                // The kernel requests the card to perform the corresponding processing according to the flag meaning
                @Override
                public void onWaitCard(int flag) throws RemoteException {
                    switch (flag) {
                        case WaitCardFlag.ISS_SCRIPT_UPDATE:
                        case WaitCardFlag.SHOW_CARD_AGAIN:
                            // TODO 1. The interface prompts the user to re-present the card;
                            // 2. Call the searchCard to re-search the contactless card;
                            // 3. When the contactless card is detected, call the respondCard to notify the SDK.
                            break;
                        case WaitCardFlag.EXECUTE_CDCVM:
                            // TODO 1. The interface prompts the user to re-present the card;
                            // 2. Call halt to close contactless module;
                            // 3. Wait 1000ms - 1200ms,then call the searchCard to re-search the contactless card;
                            // 4. When the contactless card is detected, call the respondCard to notify the SDK.
                            break;
                    }
                }

                @Override
                public void onCardChecked(int cardType) throws RemoteException {
                    // Only happen when use startProcess()
                }

                // Application select
                @Override
                public void onAppSelect(boolean reSelected, List <CandidateAID> candList) throws RemoteException {
                    if (candList.size() > 1) {
                        // TODO Multi-application: in the UI thread pop-up dialog box for the user to select, and the selected AID response to the SDK
                    } else {
                        // Single application: AID response directly to the SDK
//                         byte[] aid = candList.get(0).getAID();
//                         TLVData tmAid = TLVData.fromData(EMVTag.EMV_TAG_TM_AID, aid);
//                         emv.respondEvent(tmAid.toString());
                    }
                }

                // Final application select
                @Override
                public void onFinalSelect(FinalData finalData) throws RemoteException {
                    // TODO 1. Call setTLVList set EMV transaction parameters;
                    // 2. Call respondEvent to wake up the kernel
                }

                // Kernel output (no response required)
                @Override
                public void onSendOut(int ins, byte[] data) throws RemoteException {
                    // In order to improve the user experience, EMV standard borrowing process, you can get the card number here
                }

                // Read application record
                @Override
                public void onReadRecord(CardRecord record) throws RemoteException {
                    // Received this event on behalf of the card record has been completed, according to the main account number, public key index and other information to do the relevant operations.
                    emv.respondEvent(null);
                }

                // Card holder verify request
                @Override
                public void onCardHolderVerify(CVMMethod cvm) throws RemoteException {
                    // TODO 1. According to cvm.getCVM() for the corresponding cardholder authentication;
                    // 2. Call respondEvent will verify the results to respond to the kernel
                }

                // Offline pin verify request
                @Override
                public void onVerifyOfflinePin(int flag, byte[] random, CAPublicKey publicKey, OfflinePinVerifyResult result) throws RemoteException {
// ver 1
                    // Be sure to call the Pinpad module to complete the offline PIN verification and set the result to "result"
//                     DeviceHelper.me().getPinpad().verifyOfflinePin(offlinePinVerify, pinPublicKey, pinVerifyResult);
//
//                     int apduRet = pinVerifyResult.getAPDURet();
//                     int sw1 = pinVerifyResult.getSW1();
//                     int sw2 = pinVerifyResult.getSW2();
//                     result.setSW(sw1, sw2);
//                     result.setResult(apduRet);

// ver 2
//                     try {
//                         /** 内置插卡- 0；内置挥卡 – 6；外置设备接USB - 7；外置设备接COM口 -8 */
//                         /** inside insert card - 0；inside swing card – 6；External device is connected to the USB port - 7；External device is connected to the COM port -8 */
//                         int icToken = 0;
//                         //Specify the type of "PIN check APDU message" that will be sent to the IC card.Currently only support VCF_DEFAULT.
//                         byte cmdFmt = OfflinePinVerify.VCF_DEFAULT;
//                         OfflinePinVerify offlinePinVerify = new OfflinePinVerify((byte)flag, icToken, cmdFmt, random);
//                         PinVerifyResult pinVerifyResult = new PinVerifyResult();
//                         boolean ret = pinpad.verifyOfflinePin(offlinePinVerify, getPinPublicKey(capKey), pinVerifyResult);
//                         if (!ret) {
//                             outputRedText("verifyOfflinePin fail: " + pinpad.getLastError());
//                             stopEMV();
//                             return;
//                         }
//
//                         byte apduRet = pinVerifyResult.getAPDURet() ;
//                         byte sw1 = pinVerifyResult.getSW1() ;
//                         byte sw2 = pinVerifyResult.getSW2() ;
//                         result.setSW(sw1, sw2);
//                         result.setResult(apduRet);
//                     } catch (Exception e) {
//                         handleException(e);
//                     }
                }

                // Online process request
                @Override
                public void onOnlineProcess(TransData transData) throws RemoteException {
                    // TODO 1. Initiate an online process;
                    // 2. Call respondEvent to respond to the kernel results online
                }

                // EMV process end notification
                @Override
                public void onEndProcess(int result, TransData transData) throws RemoteException {
                    // TODO Process end processing, refer to the Light EMV Application Programming Guide
                    // 5.13 end of the transaction processing
                    successCallback.invoke("success");
                }

                // Kernel input request (wait for the upper layer response, and call respondEvent interface to wake up the kernel)
                @Override
                public void onObtainData(int ins, byte[] data) throws RemoteException {}
            });
        } catch(Exception e) {
            failedCallback.invoke("Start EMV failed " + e.getMessage());
        }
    }
}
