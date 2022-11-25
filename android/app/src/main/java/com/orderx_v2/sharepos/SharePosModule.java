package com.orderx_v2;

import android.util.Log;
import android.content.Intent;
import android.app.Activity;
import android.net.Uri;
import androidx.annotation.NonNull;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.module.annotations.ReactModule;
import com.facebook.react.bridge.BaseActivityEventListener;
import com.facebook.react.bridge.ActivityEventListener;

import android.os.Bundle;
import android.os.RemoteException;

import java.util.List;

@ReactModule(name = SharePosModule.NAME)
public class SharePosModule extends ReactContextBaseJavaModule {
    public static final String NAME = "SharePosModule";

    private static final String PACKAGE_NAME = "com.wdvn.sharepos.pax";

    private static final String ACTION_THIRD_PARTY = "android.wdvn.sharepos";
    private static final String CATEGORY_THIRD_PARTY = "com.wdvn.sharepos";
    // private static final String SECRET_KEY = "1111111111111111";//–For Testing
    private static final String KEY = "KEY";
    private static final String DATA = "DATA";
    private static final String RESULT = "RESULT";
    private static final String ERROR = "ERROR";
    private static final int REQUEST_CODE = 1;//–3rd App self modify

    private Promise mPaymentPromise;

    private final ActivityEventListener mActivityEventListener = new BaseActivityEventListener() {
        @Override
        public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent intent) {
            if (
                requestCode == REQUEST_CODE &&
                mPaymentPromise != null &&
                intent != null
            ) {
                String result = intent.getStringExtra(RESULT); //–Data response from App Manager
                mPaymentPromise.resolve(result);

                mPaymentPromise = null;
            }
        }
    };

    public SharePosModule(ReactApplicationContext reactContext) {
        super(reactContext);

        // Add the listener for `onActivityResult`
        reactContext.addActivityEventListener(mActivityEventListener);
    }

    @Override
    @NonNull
    public String getName() {
        return NAME;
    }

    @ReactMethod
    public void callSharePos(String secretKey, String jsonData, Promise promise) {
        Activity currentActivity = getCurrentActivity();
        if (currentActivity == null) {
            promise.reject(ERROR, "Activity doesn't exist");
            return;
        }

        // Store the promise to resolve/reject when sharepos returns data
        mPaymentPromise = promise;

        try {
            /// intent tường minh
            // final Intent intent = currentActivity.getPackageManager().getLaunchIntentForPackage(PACKAGE_NAME);

            /// intent không tường minh
            final Intent intent = new Intent(ACTION_THIRD_PARTY);
            intent.addCategory(CATEGORY_THIRD_PARTY);

            intent.putExtra(KEY, secretKey);
            intent.putExtra(DATA, jsonData);

            currentActivity.startActivityForResult(intent, REQUEST_CODE);
        } catch (Exception e) {
            mPaymentPromise.reject(ERROR, e);
            mPaymentPromise = null;
        }
    }

    // #region inner class
    public class AddInfo {
        public String Content;
    }

    public class PaxDataRequest {
        public String acqrID;
        public String currencyName;
        public Boolean isPrintReceipt;
        public Boolean isSignature;
        public String merchantTransId;
        public String thirdPartyType;
        public String transactionAmount;
        public String tranxType;
        public String bankCodeDefault;
        public List<AddInfo> AddInfo;
    }

    public class PaxDataResponse {
        public String Code;
        public String Desc;
        public PaxDataResponse_Response Response;
        public String appVer;
        public String tranxType;
    }

    public class PaxDataResponse_Response {
        public String currency;
        public String isoResponseCode;
        public String totalAmount;
        public String transDateTime;
        public String approveCode;
        public String batchNo;
        public String cardHolder;
        public String cardNumber;
        public String cardType;
        public String expDate;
        public String invoiceNo;
        public String merchantId;
        public String merchantTransId;
        public String refNo;
        public String swipeType;
        public String terminalId;
        public String traceNo;
    }
    // #endregion
}
