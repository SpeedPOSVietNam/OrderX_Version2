package com.orderx_v2;

import android.util.Log;
import android.content.Intent;
import android.app.Activity;
import android.net.Uri;
import androidx.annotation.NonNull;

import com.facebook.react.bridge.NativeModule;//<-
import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;
import com.facebook.react.module.annotations.ReactModule;
import com.facebook.react.bridge.BaseActivityEventListener;
import com.facebook.react.bridge.ActivityEventListener;

import android.os.Bundle;
import android.os.RemoteException;

import com.pax.dal.IPrinter;
import com.pax.dal.entity.EFontTypeAscii;
import com.pax.dal.entity.EFontTypeExtCode;
import com.pax.dal.exceptions.PrinterDevException;
import com.pax.neptunelite.api.NeptuneLiteUser;


import java.util.Arrays;
import java.util.List;

@ReactModule(name = PaxModule.NAME)
public class PaxModule extends ReactContextBaseJavaModule {

    // region NativeModule Setup

    public static final String NAME = "PaxModule";

    public PaxModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    @NonNull
    public String getName() {
        return NAME;
    }

    // endregion

    // region React Methods

    @ReactMethod
    public void printerIsAvailable(Promise promise) {
        try {
            IPrinter printer = NeptuneLiteUser.getInstance().getDal(getReactApplicationContext()).getPrinter();
            int status = printer.getStatus();
            promise.resolve(status);
        } catch (Exception ex) {
            promise.reject(ex.getMessage(),ex);
        }
    }

    @ReactMethod
    public void printerPrint(String text, int grayLevel, Promise promise) {
        try {
            IPrinter printer = printerInit();
            printer.setGray(grayLevel); // bolder font

            // region Prepare Page to Print

            String[] lines = text.split(NEW_LINE);
            for (String line : lines) {
                String[] lineConfigs = line.split(SEPARATOR);

                String  type = lineConfigs[0],
                        size = lineConfigs[1],
                        align = lineConfigs[2],
                        value = String.join(SEPARATOR, Arrays.copyOfRange(lineConfigs, 3, lineConfigs.length));

                int printPixelWidth = 384;
                int pixelPerChar = 0;

                switch (type) {
                    case TEXT: {
                        // Size

                        switch (size) {

                            case SMALL: {
                                printer.fontSet(EFontTypeAscii.FONT_8_16, EFontTypeExtCode.FONT_24_24);
                                printer.doubleWidth(false, false);
                                printer.doubleHeight(false, false);
                                pixelPerChar = 8;
                                break;
                            }
                            case MEDIUM: {
                                printer.fontSet(EFontTypeAscii.FONT_12_24, EFontTypeExtCode.FONT_24_24);
                                printer.doubleWidth(false, false);
                                printer.doubleHeight(false, false);
                                pixelPerChar = 12;
                                break;
                            }
                            case LARGE: {
                                printer.fontSet(EFontTypeAscii.FONT_12_24, EFontTypeExtCode.FONT_24_24);
                                printer.doubleWidth(true, false);
                                printer.doubleHeight(true, false);
                                pixelPerChar = 24;
                                break;
                            }
                        }

                        // Alignment

                        switch (align) {
                            case LEFT: {
                                printer.leftIndent(0);
                                break;
                            }
                            case CENTER: {
                                if (pixelPerChar * value.length() >= printPixelWidth) {
                                    printer.leftIndent(0);
                                }
                                else {
                                    printer.leftIndent((printPixelWidth / 2) - (pixelPerChar * value.length() / 2));
                                }
                                break;
                            }
                            case RIGHT: {
                                printer.leftIndent(printPixelWidth - pixelPerChar * value.length());
                                break;
                            }
                        }

                        printer.printStr(value + "\n", null);
                        break;
                    }
                    case QRCODE:
                        promise.reject("Print QrCode is not implemented.");
                        return;
                    case BARCODE:
                        promise.reject("Print BarCode is not implemented.");
                        return;
                    default:
                        promise.reject("Invalid print type. Found " + type);
                        return;
                }
            }

            // Print 5 extra lines for footer
            printer.printStr("\n\n\n\n\n",null);

            // endregion

            int status = printerStartPrint(printer);
            promise.resolve(status);
        } catch (Exception ex) {
   
            promise.reject(ex.getMessage(), ex);
        }
    }

    // endregion

    // region Static

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

    // endregion

    // Private Methods

    private IPrinter printerInit() throws Exception {
        IPrinter printer = NeptuneLiteUser.getInstance().getDal(getReactApplicationContext()).getPrinter();
        printer.init();
        return printer;
    }

    private int printerStartPrint(IPrinter printer) throws Exception {
        int status = printer.start();
        return status;
    }

    private String addLeftPad(String text, int amount) {
        StringBuilder result = new StringBuilder();
        for (int i = 0; i < amount; i++) {
            result.insert(0, " ");
        }
        return result.toString();
    }
}
