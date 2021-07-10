import * as application from "tns-core-modules/application"
import { InAppPurchaseManagerBase, InAppPurchaseTransactionState, InAppProduct } from "./in-app-purchase.common"
import { InAppPurchaseStateUpdateListener, InAppPurchaseResultCode, InAppPurchaseType, InAppOrderResult, InAppOrderConfirmResult, InAppOrderHistoryResult, InAppListProductsResult } from "."

export class InAppPurchaseManager extends InAppPurchaseManagerBase {

    isServiceConnected = false
    billingClient: com.android.billingclient.api.BillingClient

    /**
     * 
     * @param purchaseStateUpdateListener Get notified every time an update on a purchase occures.<br/>
     *                                     This listener is mandatory to manually confirm/aknowledge/finish any buy via the method<br/>
     *                                     <code>InAppPurchaseManager#orderConfirm</code>.<br/>
     */
    static bootStrapInstance(purchaseStateUpdateListener?: InAppPurchaseStateUpdateListener): Promise<InAppPurchaseManager> {
        return new InAppPurchaseManager(purchaseStateUpdateListener).init()
    }

    init(): Promise<InAppPurchaseManager> {
        const this_inAppPurchaseManager: InAppPurchaseManager = this
        if (!this.billingClient) {
            this.billingClient = com.android.billingclient.api.BillingClient
                .newBuilder(application.android.context)
                .enablePendingPurchases()
                .setListener(new com.android.billingclient.api.PurchasesUpdatedListener({
                    onPurchasesUpdated(
                        billingResult: com.android.billingclient.api.BillingResult
                        , purchases: java.util.List<com.android.billingclient.api.Purchase>
                    ): void {
                        if (billingResult.getResponseCode() == com.android.billingclient.api.BillingClient.BillingResponseCode.OK) {
                            if (purchases) {
                                for (let i = 0; i < purchases.size(); i++) {
                                    const purchase: com.android.billingclient.api.Purchase = purchases.get(i)
                                    const purchaseTransactionState: InAppPurchaseTransactionState = this_inAppPurchaseManager.createInAppTransactionState(purchase)

                                    this_inAppPurchaseManager.notifyOnUpdate(purchaseTransactionState)
                                }
                            }
                        } else if (billingResult.getResponseCode() === com.android.billingclient.api.BillingClient.BillingResponseCode.USER_CANCELED) {
                            // Handle an error caused by a user cancelling the purchase flow.
                        } else {
                            // Handle any other error codes.
                        }
                    }
                }))
                .build()
        }
        return new Promise<InAppPurchaseManager>((resolve, reject) => {
            try {
                this.billingClient.startConnection(new com.android.billingclient.api.BillingClientStateListener({
                    onBillingSetupFinished: (param0: com.android.billingclient.api.BillingResult): void => {

                        // The BillingClient is ready. You can query purchases here.
                        this.isServiceConnected = true
                        resolve(this)
                    },
                    onBillingServiceDisconnected: (): void => {

                        // Try to restart the connection on the next request to
                        // Google Play by calling the startConnection() method.
                        this.isServiceConnected = false
                    }
                }));
            } catch (e) {
                reject(e)
            }
        })
        // TODO re-try connection establishment
        // Note: 
        // It's strongly recommended that you implement your own connection retry policy 
        // and override the onBillingServiceDisconnected() method. 
        // Make sure you maintain the BillingClient connection when executing any methods.
    }

    private createInAppTransactionState(purchase: com.android.billingclient.api.Purchase): InAppPurchaseTransactionState {
        const productIdentifier = purchase.getSku() || JSON.parse(purchase.getOriginalJson())['productId']
        const purchaseTransactionState: InAppPurchaseTransactionState = new InAppPurchaseTransactionState(purchase)
        purchaseTransactionState.productIdentifier = productIdentifier
        purchaseTransactionState.purchaseId = purchase.getPurchaseToken()
        purchaseTransactionState.purchaseTime = purchase.getPurchaseTime()
        switch (purchase.getPurchaseState()) {
            case com.android.billingclient.api.Purchase.PurchaseState.PENDING:
                purchaseTransactionState.resultCode = InAppPurchaseResultCode.Purchasing
                break
            case com.android.billingclient.api.Purchase.PurchaseState.PURCHASED:
                purchaseTransactionState.resultCode = InAppPurchaseResultCode.Purchased
                break
            case com.android.billingclient.api.Purchase.PurchaseState.UNSPECIFIED_STATE:
                // TODO has UNSPECIFIED_STATE to be set to FAILED???
                purchaseTransactionState.resultCode = InAppPurchaseResultCode.Failed
                break
        }
        return purchaseTransactionState
    }

    shutdown() {
        if (this.billingClient) {
            this.billingClient.endConnection()
        }
        this.billingClient = null
    }

    /**
     * 
     * @param productIds The product ids. <br/>
     * e.g.: <code>['premium_upgrade', 'car', 'item2']</code>
     * @param productType The type of purchase.<br/>
     * Leave empty to no specify the type of purchase.<br/>
     */
    list(productIds: string[], productType?: InAppPurchaseType): Promise<InAppListProductsResult> {
        const this_purchaseManager: InAppPurchaseManager = this
        return new Promise<InAppListProductsResult>((resolve, reject) => {
            try {
                if (!this.isSupportedFeatures(productType)) {
                    throw `Unsupported feature : ${productType}`
                }
                const skuList: java.util.List<string> = java.util.Arrays.asList(productIds)
                const params = com.android.billingclient.api.SkuDetailsParams.newBuilder()
                const skuType = this.getSkuType(productType)
                if (skuList)
                    params.setSkusList(skuList)
                if (skuType)
                    params.setType(skuType)

                this.billingClient.querySkuDetailsAsync(params.build(),
                    new com.android.billingclient.api.SkuDetailsResponseListener({
                        onSkuDetailsResponse: (res: com.android.billingclient.api.BillingResult,
                            skuDetails: java.util.List<com.android.billingclient.api.SkuDetails>): void => {
                            const products: InAppProduct[] = []
                            if (skuDetails /* may be null*/) {
                                for (let i = 0; i < skuDetails.size(); i++) {
                                    const skuD: com.android.billingclient.api.SkuDetails = skuDetails.get(i)
                                    const p: InAppProduct = new InAppProduct(skuD)
                                    p.title = skuD.getTitle()
                                    p.description = skuD.getDescription()
                                    p.price = skuD.getPrice()
                                    p.priceMicro = skuD.getPriceAmountMicros()
                                    p.priceCurrencyCode = skuD.getPriceCurrencyCode()
                                    p.type = this.getPurchaseType(skuD.getType())
                                    p.productId = skuD.getSku()
                                    p.android_iconUrl = skuD.getIconUrl()

                                    products.push(p)
                                }
                            }
                            const success = res.getResponseCode() == com.android.billingclient.api.BillingClient.BillingResponseCode.OK
                            resolve({
                                products: products
                                , success: success
                                , message: res.getDebugMessage()
                                , nativeResult: {
                                    code: `${res.getResponseCode()}`,
                                    codeText: this_purchaseManager.getResponseCodeMsg(res.getResponseCode()),
                                    response: res
                                }
                            })
                        }
                    })
                )
            } catch (e) {
                reject(e)
            }
        })
    }

    order(product: InAppProduct): Promise<InAppOrderResult> {
        const this_inAppPurchaseManager: InAppPurchaseManager = this
        return new Promise<InAppOrderResult>((resolve, reject) => {
            try {
                if (!product.nativeValue) {
                    throw 'Invalid InAppProduct! (Native value is missing)'
                }
                const purchaseTransactionState = new InAppPurchaseTransactionState(null)
                purchaseTransactionState.resultCode = InAppPurchaseResultCode.Purchasing
                purchaseTransactionState.productIdentifier = product.productId


                this.notifyOnUpdate(purchaseTransactionState)

                const params: com.android.billingclient.api.BillingFlowParams =
                    com.android.billingclient.api.BillingFlowParams.newBuilder()
                        .setSkuDetails(product.nativeValue)
                        .build()
                const res: com.android.billingclient.api.BillingResult = this.billingClient.launchBillingFlow(application.android.foregroundActivity, params)
                const success = com.android.billingclient.api.BillingClient.BillingResponseCode.OK === res.getResponseCode()
                resolve({
                    success: success
                    , message: res.getDebugMessage()
                    , nativeResult: {
                        code: `${res.getResponseCode()}`,
                        codeText: this_inAppPurchaseManager.getResponseCodeMsg(res.getResponseCode()),
                        response: res
                    }
                })
            } catch (e) {
                reject(e)
            }
        })
    }

    orderConfirm(purchaseOrder: InAppPurchaseTransactionState, consumable: boolean): Promise<InAppOrderConfirmResult> {
        const this_purchaseManager: InAppPurchaseManager = this
        return new Promise<InAppOrderConfirmResult>((resolve, reject) => {
            try {
                if (!purchaseOrder.nativeValue) {
                    throw new Error('Invalid InAppProducts! (Native value is missing)')
                }
                const purchase: com.android.billingclient.api.Purchase = purchaseOrder.nativeValue
                if (purchase.getPurchaseState() === com.android.billingclient.api.Purchase.PurchaseState.PURCHASED) {
                    // Grant entitlement to the user.
                    //...

                    const product_consumable = consumable // product.type !== InAppPurchaseType.Subscription
                    if (!purchase.isAcknowledged()) {
                        // Acknowledge/consume the purchase if it hasn't already been acknowledged.
                        if (product_consumable) {

                            const consumeAsyncParams: com.android.billingclient.api.ConsumeParams = com.android.billingclient.api.ConsumeParams
                                .newBuilder()
                                // .setDeveloperPayload(...) // TODO add developer payload?
                                .setPurchaseToken(purchase.getPurchaseToken())
                                .build()
                            const consumeResponseListener: com.android.billingclient.api.ConsumeResponseListener = new com.android.billingclient.api.ConsumeResponseListener({
                                onConsumeResponse(res: com.android.billingclient.api.BillingResult, purchaseToken: string): void {
                                    const success = com.android.billingclient.api.BillingClient.BillingResponseCode.OK === res.getResponseCode()
                                    resolve({
                                        success: success
                                        , message: res.getDebugMessage()
                                        , nativeResult: {
                                            code: `${res.getResponseCode()}`,
                                            codeText: this_purchaseManager.getResponseCodeMsg(res.getResponseCode()),
                                            response: res
                                        }
                                    })
                                }
                            })
                            this.billingClient.consumeAsync(consumeAsyncParams, consumeResponseListener)
                        } else {
                            const acknowledgePurchaseParams: com.android.billingclient.api.AcknowledgePurchaseParams = com.android.billingclient.api.AcknowledgePurchaseParams
                                .newBuilder()
                                // .setDeveloperPayload(...) // TODO add developer payload?
                                .setPurchaseToken(purchase.getPurchaseToken())
                                .build();
                            const acknowledgePurchaseResponseListener: com.android.billingclient.api.AcknowledgePurchaseResponseListener = new com.android.billingclient.api.AcknowledgePurchaseResponseListener({
                                onAcknowledgePurchaseResponse(res: com.android.billingclient.api.BillingResult): void {
                                    const success = com.android.billingclient.api.BillingClient.BillingResponseCode.OK === res.getResponseCode()
                                    resolve({
                                        success: success
                                        , message: res.getDebugMessage()
                                        , nativeResult: {
                                            code: `${res.getResponseCode()}`,
                                            codeText: this_purchaseManager.getResponseCodeMsg(res.getResponseCode()),
                                            response: res
                                        }
                                    })
                                }
                            })
                            this.billingClient.acknowledgePurchase(acknowledgePurchaseParams, acknowledgePurchaseResponseListener);
                        }
                    } else {
                        resolve({ success: false, message: 'Already aknowledged'  /** TODO additional state: 'already aknowledged' ? */ })
                    }
                } else {
                    resolve({ success: false, message: 'Not purchased yet'  /** TODO additional state: 'not purchased yet' ? */ })
                }
            } catch (e) {
                reject(e)
            }
        })
    }

    // Get purchases details for all the items bought within your app. This method uses a cache of Google Play Store app without initiating a network request.
    // https://developer.android.com/reference/com/android/billingclient/api/BillingClient.html#querypurchases
    private _purchaseHistoryFromCache(): Promise<InAppOrderHistoryResult> {
        const this_purchaseManager: InAppPurchaseManager = this
        return new Promise<InAppOrderHistoryResult>((resolve, reject) => {
            try {
                const result_InApp: com.android.billingclient.api.Purchase.PurchasesResult = this.billingClient.queryPurchases(com.android.billingclient.api.BillingClient.SkuType.INAPP)
                const result_Sub: com.android.billingclient.api.Purchase.PurchasesResult = this.billingClient.queryPurchases(com.android.billingclient.api.BillingClient.SkuType.SUBS)

                const allPurchases = new java.util.ArrayList<com.android.billingclient.api.Purchase>()

                if (result_InApp.getResponseCode() == com.android.billingclient.api.BillingClient.BillingResponseCode.OK) {
                    const list = result_InApp.getPurchasesList()
                    if (list && list.size()) {
                        allPurchases.addAll(list)
                    }
                }
                if (result_Sub.getResponseCode() == com.android.billingclient.api.BillingClient.BillingResponseCode.OK) {
                    const list = result_Sub.getPurchasesList()
                    if (list && list.size()) {
                        allPurchases.addAll(list)
                    }
                }

                for (let i = 0; i < allPurchases.size(); i++) {
                    const purchaseRecord: com.android.billingclient.api.Purchase = allPurchases.get(i)
                    const productIdentifier = purchaseRecord.getSku() || JSON.parse(purchaseRecord.getOriginalJson())['productId']
                    const purchaseTransactionState: InAppPurchaseTransactionState = new InAppPurchaseTransactionState(purchaseRecord)
                    purchaseTransactionState.productIdentifier = productIdentifier
                    purchaseTransactionState.resultCode = InAppPurchaseResultCode.Restored
                    purchaseTransactionState.purchaseId = purchaseRecord.getPurchaseToken()
                    purchaseTransactionState.purchaseTime = purchaseRecord.getPurchaseTime()
                    this_purchaseManager.notifyOnUpdateHistory(purchaseTransactionState)
                }

                if (result_InApp.getResponseCode() == com.android.billingclient.api.BillingClient.BillingResponseCode.OK
                    || result_Sub.getResponseCode() == com.android.billingclient.api.BillingClient.BillingResponseCode.OK) { }

                resolve({
                    success: false
                    , message: ''
                    , nativeResult: {
                        code: `${result_InApp.getResponseCode()}`,
                        codeText: this_purchaseManager.getResponseCodeMsg(result_InApp.getResponseCode()),
                        response: { inApp: result_InApp, sub: result_Sub }
                    }
                })
            } catch (e) {
                reject(e)
            }
        })
    }

    // Returns the most recent purchase made by the user for each SKU, even if that purchase is expired, canceled, or consumed.
    // https://developer.android.com/reference/com/android/billingclient/api/BillingClient.html#queryPurchaseHistoryAsync(java.lang.String,%20com.android.billingclient.api.PurchaseHistoryResponseListener)
    purchaseHistory(): Promise<InAppOrderHistoryResult> {
        const this_purchaseManager: InAppPurchaseManager = this
        return new Promise<InAppOrderHistoryResult>((resolve, reject) => {
            try {
                const purchaseHistoryResponseListener = new com.android.billingclient.api.PurchaseHistoryResponseListener({
                    onPurchaseHistoryResponse(res: com.android.billingclient.api.BillingResult, historyRecords: java.util.List<com.android.billingclient.api.PurchaseHistoryRecord>) {
                        const success = res.getResponseCode() == com.android.billingclient.api.BillingClient.BillingResponseCode.OK
                        if (success) {
                            if (historyRecords) {
                                for (let i = 0; i < historyRecords.size(); i++) {
                                    const purchaseRecord: com.android.billingclient.api.PurchaseHistoryRecord = historyRecords.get(i)
                                    const productIdentifier = purchaseRecord.getSku() || JSON.parse(purchaseRecord.getOriginalJson())['productId']
                                    const purchaseTransactionState: InAppPurchaseTransactionState = new InAppPurchaseTransactionState(purchaseRecord)
                                    purchaseTransactionState.productIdentifier = productIdentifier
                                    purchaseTransactionState.resultCode = InAppPurchaseResultCode.Restored
                                    purchaseTransactionState.purchaseId = purchaseRecord.getPurchaseToken()
                                    purchaseTransactionState.purchaseTime = purchaseRecord.getPurchaseTime()
                                    this_purchaseManager.notifyOnUpdateHistory(purchaseTransactionState)
                                }
                            }
                        }
                        resolve({
                            success: success
                            , message: res.getDebugMessage()
                            , nativeResult: {
                                code: `${res.getResponseCode()}`,
                                codeText: this_purchaseManager.getResponseCodeMsg(res.getResponseCode()),
                                response: res
                            }
                        })
                    }
                })

                const listenerWithResolveReject = (resolve, reject) => {
                    const listener = new com.android.billingclient.api.PurchaseHistoryResponseListener({
                        onPurchaseHistoryResponse(res: com.android.billingclient.api.BillingResult,
                            historyRecords: java.util.List<com.android.billingclient.api.PurchaseHistoryRecord>) {
                            try {
                                const records = []
                                const success = res.getResponseCode() == com.android.billingclient.api.BillingClient.BillingResponseCode.OK
                                if (success) {
                                    if (historyRecords) {
                                        for (let i = 0; i < historyRecords.size(); i++) {
                                            records.push(historyRecords.get(i))
                                        }
                                    }
                                }
                                resolve({
                                    res: res,
                                    historyRecords: records
                                })
                            } catch (e) {
                                reject(e)
                            }
                        }
                    })
                    return listener
                }

                const promiseWithProductType = (skuType: string) => {
                    const promise_inAppPurchase = new Promise<{
                        res: com.android.billingclient.api.BillingResult,
                        historyRecords: com.android.billingclient.api.PurchaseHistoryRecord[]
                    }>((resolve, reject) => {
                        this_purchaseManager.billingClient
                            .queryPurchaseHistoryAsync(
                                skuType,
                                listenerWithResolveReject(resolve, reject))
                    })
                    return promise_inAppPurchase
                }

                const promise_InApp = promiseWithProductType(com.android.billingclient.api.BillingClient.SkuType.INAPP)
                const promise_Subs = promiseWithProductType(com.android.billingclient.api.BillingClient.SkuType.SUBS)
                Promise.all([promise_InApp, promise_Subs])
                    .then((results) => {
                        const result_InApp = results[0]
                        const result_Subs = results[1]

                        let bResult: com.android.billingclient.api.BillingResult = result_InApp ? result_InApp.res : null

                        const allHistoryRecords = new java.util.ArrayList<com.android.billingclient.api.PurchaseHistoryRecord>()
                        if (result_InApp && result_InApp.historyRecords) {
                            for (const record of result_InApp.historyRecords) {
                                allHistoryRecords.add(record)
                            }
                            bResult = result_InApp.res
                        }
                        if (result_Subs && result_Subs.historyRecords) {
                            for (const record of result_Subs.historyRecords) {
                                allHistoryRecords.add(record)
                            }
                            if (!bResult) {
                                bResult = result_Subs.res
                            }
                        }
                        purchaseHistoryResponseListener.onPurchaseHistoryResponse(bResult, allHistoryRecords)

                    })
            } catch (e) {
                reject(e)
            }
        })
    }

    canMakePayment(): boolean {
        return this.isSupportedFeatures(InAppPurchaseType.InAppPurchase) && this.isSupportedFeatures(InAppPurchaseType.Subscription)
    }

    getStoreReceipt(): string {
        return undefined;
    }

    isSupportedFeatures(productType: InAppPurchaseType): boolean {
        const featureValue = this.getFeatureType(productType)
        if (!featureValue) {
            /** 
             * since there is no specific FeatureType for in app purchases
             * <code>null</code> stands for in app purchases
             */
            return true
        }
        const res: com.android.billingclient.api.BillingResult = this.billingClient.isFeatureSupported(featureValue)
        return res &&
            com.android.billingclient.api.BillingClient.BillingResponseCode.OK === res.getResponseCode()
    }

    private getFeatureType(purchaseType: InAppPurchaseType): string {
        switch (purchaseType) {
            case InAppPurchaseType.InAppPurchase:
                /** since there is no specific FeatureType for in app purchases */
                return null
            case InAppPurchaseType.Subscription:
                return com.android.billingclient.api.BillingClient.FeatureType.SUBSCRIPTIONS
        }
    }

    private getPurchaseType(skuType: string): InAppPurchaseType {
        switch (skuType) {
            case com.android.billingclient.api.BillingClient.SkuType.INAPP:
                return InAppPurchaseType.InAppPurchase
            case com.android.billingclient.api.BillingClient.SkuType.SUBS:
                return InAppPurchaseType.Subscription
        }
        return null
    }

    private getSkuType(purchaseType: InAppPurchaseType): string {
        switch (purchaseType) {
            case InAppPurchaseType.InAppPurchase:
                return com.android.billingclient.api.BillingClient.SkuType.INAPP
            case InAppPurchaseType.Subscription:
                return com.android.billingclient.api.BillingClient.SkuType.SUBS
        }
    }

    private getResponseCodeMsg(code: number): string {
        switch (code) {
            case com.android.billingclient.api.BillingClient.BillingResponseCode.ITEM_UNAVAILABLE:
                return 'ITEM_UNAVAILABLE'
            case com.android.billingclient.api.BillingClient.BillingResponseCode.ITEM_ALREADY_OWNED:
                return 'ITEM_ALREADY_OWNED'
            case com.android.billingclient.api.BillingClient.BillingResponseCode.SERVICE_TIMEOUT:
                return 'SERVICE_TIMEOUT'
            case com.android.billingclient.api.BillingClient.BillingResponseCode.USER_CANCELED:
                return 'USER_CANCELED'
            case com.android.billingclient.api.BillingClient.BillingResponseCode.SERVICE_UNAVAILABLE:
                return 'SERVICE_UNAVAILABLE'
            case com.android.billingclient.api.BillingClient.BillingResponseCode.ERROR:
                return 'ERROR'
            case com.android.billingclient.api.BillingClient.BillingResponseCode.OK:
                return 'OK'
            case com.android.billingclient.api.BillingClient.BillingResponseCode.BILLING_UNAVAILABLE:
                return 'BILLING_UNAVAILABLE'
            case com.android.billingclient.api.BillingClient.BillingResponseCode.FEATURE_NOT_SUPPORTED:
                return 'FEATURE_NOT_SUPPORTED'
            case com.android.billingclient.api.BillingClient.BillingResponseCode.SERVICE_DISCONNECTED:
                return 'SERVICE_DISCONNECTED'
            case com.android.billingclient.api.BillingClient.BillingResponseCode.DEVELOPER_ERROR:
                return 'DEVELOPER_ERROR'
            case com.android.billingclient.api.BillingClient.BillingResponseCode.ITEM_NOT_OWNED:
                return 'ITEM_NOT_OWNED'
        }
        return ''
    }
}