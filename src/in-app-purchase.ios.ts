import { InAppPurchaseManagerBase, InAppPurchaseTransactionState, InAppProduct } from "./in-app-purchase.common"
import { InAppPurchaseStateUpdateListener, InAppPurchaseResultCode, InAppPurchaseType, InAppOrderResult, InAppOrderConfirmResult, InAppOrderHistoryResult, InAppListProductsResult } from "."
import { InAppPurchaseUpdateNotifier } from '.'

let refreshReceiptRequest: SKReceiptRefreshRequest;
let refreshReceiptRequestDelegate: SKReceiptRefreshRequestDelegateImpl;

export class InAppPurchaseManager extends InAppPurchaseManagerBase {
    isServiceConnected = false

    globalPurchasesTransactionObserverImpl: InAppPurchasesTransactionObserverImpl
    historyTransactionObserver: InAppPurchasesHistoryTransactionObserverImpl

    /**
     * 
     * @param purchaseStateUpdateListener Get notified every time an update on a purchas occures.<br/>
     *                                     This listener is mandatory to manually confirm/aknowledge/finish any buy via the method<br/>
     *                                     <code>InAppPurchaseManager#orderConfirm</code>.<br/>
     */
    static bootStrapInstance(purchaseStateUpdateListener?: InAppPurchaseStateUpdateListener): Promise<InAppPurchaseManager> {
        return new InAppPurchaseManager(purchaseStateUpdateListener).init()
    }

    init(): Promise<InAppPurchaseManager> {
        return new Promise<InAppPurchaseManager>((resolve, reject) => {
            try {
                if (!this.globalPurchasesTransactionObserverImpl) {
                    this.globalPurchasesTransactionObserverImpl = InAppPurchasesTransactionObserverImpl.initWithPurchaseUpdateNotifier(this)
                }
                SKPaymentQueue.defaultQueue().removeTransactionObserver(this.globalPurchasesTransactionObserverImpl)
                SKPaymentQueue.defaultQueue().addTransactionObserver(this.globalPurchasesTransactionObserverImpl)
                resolve(this)
            } catch (e) {
                reject(e)
            }
        })
    }

    shutdown() {
        if (this.globalPurchasesTransactionObserverImpl) {
            SKPaymentQueue.defaultQueue().removeTransactionObserver(this.globalPurchasesTransactionObserverImpl)
        }
        this.globalPurchasesTransactionObserverImpl = null
    }

    /**
     * 
     * @param productIds The product ids. <br/>
     * e.g.: <code>['premium_upgrade', 'car', 'item2']</code>
     * @param productType The type of purchase.<br/>
     * Leave empty to not specify the type of purchase.<br/>
     */
    list(productIds: string[], productType?: InAppPurchaseType): Promise<InAppListProductsResult> {
        return new Promise<InAppListProductsResult>((resolve, reject) => {
            try {
                if (!this.isSupportedFeatures(productType)) {
                    throw new Error(`Unsupported feature : ${productType}`)
                }
                const productIdsSet = NSMutableSet.alloc<string>().init()
                productIds.forEach((value) => productIdsSet.addObject(value))
                const productRequest: SKProductsRequest = SKProductsRequest.alloc().initWithProductIdentifiers(productIdsSet)
                productRequest.delegate = ListProductRequestDelegateImpl.initWithResolveRejectAndProductType(resolve, reject, productType)
                productRequest.start()
            } catch (e) {
                reject(e)
            }
        })
    }

    order(product: InAppProduct): Promise<InAppOrderResult> {
        return new Promise<InAppOrderResult>((resolve, reject) => {
            try {
                if (!product.nativeValue) {
                    throw new Error('Invalid InAppProducts! (Native value is missing)')
                }
                const payment = SKPayment.paymentWithProduct(product.nativeValue)
                /*
                using global observer instead of this
                const observer: InAppPurchasesTransactionObserverImpl = InAppPurchasesTransactionObserverImpl.initWithProductIdentifierPurchaseUpdateNotifier(product.productId, this)
                SKPaymentQueue.defaultQueue().addTransactionObserver(observer)
                */
                SKPaymentQueue.defaultQueue().addPayment(payment)
                resolve({ success: true })
            } catch (e) {
                reject(e)
            }
        })
    }

    orderConfirm(purchaseOrder: InAppPurchaseTransactionState, consumable: boolean): Promise<InAppOrderConfirmResult> {
        return new Promise<InAppOrderConfirmResult>((resolve, reject) => {
            try {
                if (!purchaseOrder.nativeValue) {
                    throw new Error('Invalid InAppProducts! (Native value is missing)')
                }
                const purchase: SKPaymentTransaction = purchaseOrder.nativeValue as SKPaymentTransaction

                if (purchase.transactionState === SKPaymentTransactionState.Purchased) {
                    const transaction: SKPaymentTransaction = <SKPaymentTransaction>purchaseOrder.nativeValue
                    SKPaymentQueue.defaultQueue().finishTransaction(<SKPaymentTransaction>purchaseOrder.nativeValue)
                    console.log(`## confirmed transaction state: ${transaction.transactionState} - product: ${transaction.payment.productIdentifier}`)
                    resolve({ success: true })
                } else {
                    resolve({ success: false, message: 'Not purchased yet'  /** TODO additional state: 'not purchased yet' ? */ })
                }
            } catch (e) {
                reject(e)
            }
        })
    }

    purchaseHistory(): Promise<InAppOrderHistoryResult> {
        const clearHistoryListener = () => {
            if (this.historyTransactionObserver) {
                SKPaymentQueue.defaultQueue().removeTransactionObserver(this.historyTransactionObserver)
                this.historyTransactionObserver = null
            }
        }
        clearHistoryListener()
        return new Promise<InAppOrderHistoryResult>((resolve, reject) => {
            try {
                // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
                // Variant 1
                // this will require to make use of ngZone to update UI
                this.historyTransactionObserver = InAppPurchasesHistoryTransactionObserverImpl.initWithResolveReject(resolve, reject)
                SKPaymentQueue.defaultQueue().addTransactionObserver(this.historyTransactionObserver)
                SKPaymentQueue.defaultQueue().restoreCompletedTransactions()
                // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

                // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
                // Variant 2
                // this will immediately return `true` and items must be catched in observer
                // SKPaymentQueue.defaultQueue().restoreCompletedTransactions()
                // resolve({ success: true })
                // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
            } catch (e) {
                clearHistoryListener()
                reject(e)
            }
        })
    }

    canMakePayment(): boolean {
        return SKPaymentQueue.canMakePayments()
    }

    getStoreReceipt(): string {
        const receipt = NSData.dataWithContentsOfURL(
            NSBundle.mainBundle.appStoreReceiptURL
        );

        if (receipt) {
            return receipt.base64EncodedStringWithOptions(0);
        } else {
            return null;
        }
    }

    refreshStoreReceipt(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            refreshReceiptRequest = SKReceiptRefreshRequest.alloc().init();
            refreshReceiptRequestDelegate = SKReceiptRefreshRequestDelegateImpl.initWithResolveReject(resolve, reject);
            refreshReceiptRequest.delegate = refreshReceiptRequestDelegate;
            refreshReceiptRequest.start();
        });
    }

    private isSupportedFeatures(productType: InAppPurchaseType): boolean {
        return true
    }
}

@ObjCClass(SKProductsRequestDelegate)
class ListProductRequestDelegateImpl extends NSObject implements SKProductsRequestDelegate {

    private _resolve: Function
    private _reject: Function
    private _productType: InAppPurchaseType

    /**
     * 
     * @param resolve Promise's resolve
     * @param reject Promise's reject
     * @param productType The product type to apply as filter.<br/> Leave empty or `null` if no filter should be applied.
     */
    public static initWithResolveRejectAndProductType(resolve: Function, reject: Function, productType?: InAppPurchaseType): ListProductRequestDelegateImpl {
        const delegate: ListProductRequestDelegateImpl = ListProductRequestDelegateImpl.new() as ListProductRequestDelegateImpl
        delegate._resolve = resolve
        delegate._reject = reject
        delegate._productType = productType
        return delegate
    }

    public productsRequestDidReceiveResponse(request: SKProductsRequest, response: SKProductsResponse) {
        const _this: ListProductRequestDelegateImpl = this
        const products: InAppProduct[] = []
        if (response.products)
            for (let i = 0; i < response.products.count; i++) {
                const skuD: SKProduct = response.products.objectAtIndex(i)
                const type = !skuD.subscriptionPeriod ? InAppPurchaseType.InAppPurchase : InAppPurchaseType.Subscription
                if (this._productType && this._productType !== type) {
                    continue
                }
                const p: InAppProduct = new InAppProduct(skuD)
                p.title = skuD.localizedTitle
                p.description = skuD.localizedDescription
                p.price = this.convertToLocalCurrencyFormat(skuD.price, skuD.priceLocale)
                p.priceMicro = this.convertToMicro(skuD.price)
                p.priceCurrencyCode = skuD.priceLocale.currencyCode
                p.type = type
                p.productId = skuD.productIdentifier

                products.push(p)
            }
        _this._resolve({
            products: products
            , success: true
            , message: ''
            , nativeResult: {
                code: '',
                codeText: '',
                response: response
            }
        })
    }

    convertToMicro(decimalNumber: NSDecimalNumber) {
        /**
         * try it online: https://rextester.com/l/objectivec_online_compiler
         * <code>
         * NSDecimalNumber* dn = [[NSDecimalNumber alloc] initWithString:@"23.02"];
         * NSInteger micro = [dn floatValue] * 1000000;
         * NSLog(@"PRICE: %d %f %d", [dn integerValue], [dn floatValue], micro);
         * <code>
         */
        return decimalNumber.floatValue * 1000000
    }

    convertToLocalCurrencyFormat(decimalNumber: NSDecimalNumber, priceLocale: NSLocale): string {
        const formatter: NSNumberFormatter = NSNumberFormatter.alloc().init()//[[NSNumberFormatter alloc] init];
        formatter.numberStyle = NSNumberFormatterStyle.CurrencyStyle // NSNumberFormatterCurrencyStyle
        NSNumberFormatterStyle.CurrencyISOCodeStyle
        formatter.currencyCode = priceLocale.currencyCode
        formatter.currencySymbol = priceLocale.currencySymbol
        formatter.usesSignificantDigits = true
        formatter.minimumFractionDigits = 2
        formatter.maximumFractionDigits = 2
        return formatter.stringFromNumber(Number(String(decimalNumber)))
    }
    public requestDidFinish(request: SKRequest): void {

    }
    public requestDidFailWithError(request: SKRequest, error: NSError) {
        const _this: ListProductRequestDelegateImpl = this
        _this._reject({
            success: false,
            message: error.localizedDescription,
            nativeResponse: {
                code: `${error.code}`,
                codeText: `${error.localizedFailureReason}`,
                response: error
            }
        })
    }
}

@ObjCClass(SKPaymentTransactionObserver)
class InAppPurchasesTransactionObserverImpl extends NSObject implements SKPaymentTransactionObserver {
    private _purchaseUpdateNotifier: InAppPurchaseUpdateNotifier
    private _productIdentifier: string

    public static initWithPurchaseUpdateNotifier(purchaseUpdateNotifier?: InAppPurchaseUpdateNotifier): InAppPurchasesTransactionObserverImpl {
        const delegate: InAppPurchasesTransactionObserverImpl = InAppPurchasesTransactionObserverImpl.new() as InAppPurchasesTransactionObserverImpl
        delegate._purchaseUpdateNotifier = purchaseUpdateNotifier
        return delegate
    }
    /**
     * 
     * @param productIdentifier Will only consume the transaction if the product identifier matches with this one.<br/>
     *                          If not set any transaction will be consumed.
     * @param purchaseUpdateNotifier Will be passed the transactions.<br/>
     */
    public static initWithProductIdentifierPurchaseUpdateNotifier(productIdentifier: string, purchaseUpdateNotifier?: InAppPurchaseUpdateNotifier): InAppPurchasesTransactionObserverImpl {
        const delegate: InAppPurchasesTransactionObserverImpl = InAppPurchasesTransactionObserverImpl.new() as InAppPurchasesTransactionObserverImpl
        delegate._purchaseUpdateNotifier = purchaseUpdateNotifier
        delegate._productIdentifier = productIdentifier
        return delegate
    }

    public paymentQueueUpdatedTransactions(queue: SKPaymentQueue, transactions: NSArray<SKPaymentTransaction>) {
        for (let i = 0; i < transactions.count; i++) {
            const transaction = transactions.objectAtIndex(i)
            console.log('## Update transaction: ' + transaction.payment.productIdentifier + ':' +
                (['Purchasing', 'Purchased', 'Failed', 'Restored', 'Deferred'][transaction.transactionState]) + ' ' + transaction.transactionState)
        }
        for (let i = 0; i < transactions.count; i++) {
            const transaction = transactions.objectAtIndex(i)

            if (
                /** check wheter the observer is a global one or bound to a specific product identifier */
                !this._productIdentifier || this._productIdentifier === transaction.payment.productIdentifier) {

                const purchaseTransactionState: InAppPurchaseTransactionState = transaction ? new InAppPurchaseTransactionState(transaction) : null
                purchaseTransactionState.resultCode = this.getPurchaseResultCode(transaction.transactionState)
                purchaseTransactionState.productIdentifier = transaction.payment.productIdentifier
                purchaseTransactionState.purchaseId = transaction.transactionIdentifier
                purchaseTransactionState.purchaseTime = transaction.transactionDate ? transaction.transactionDate.getTime() : null

                if (this._purchaseUpdateNotifier) {
                    if (SKPaymentTransactionState.Restored === transaction.transactionState) {
                        this._purchaseUpdateNotifier.notifyOnUpdateHistory(purchaseTransactionState)
                    } else {
                        this._purchaseUpdateNotifier.notifyOnUpdate(purchaseTransactionState)
                    }
                }
            }
            if (transaction
                && -1 !== [
                    SKPaymentTransactionState.Failed,
                    SKPaymentTransactionState.Restored,
                    SKPaymentTransactionState.Purchased
                ].indexOf(transaction.transactionState)) {

                // SKPaymentTransactionState.Purchased should only be done in `#orderConfirm`
                if (SKPaymentTransactionState.Purchased !== transaction.transactionState) {
                    SKPaymentQueue.defaultQueue().finishTransaction(transaction)
                    console.log(`## finished transaction state: ${transaction.transactionState} - product: ${transaction.payment.productIdentifier}`)
                }
                if (
                    /** check wheter the observer is a global one or bound to a specific product identifier */
                    this._productIdentifier && this._productIdentifier === transaction.payment.productIdentifier) {
                    console.log(`remove transaction observer for ${transaction.payment.productIdentifier}`)
                    SKPaymentQueue.defaultQueue().removeTransactionObserver(this)
                }
            }
        }
    }

    private getPurchaseResultCode(sKPaymentTransactionState: SKPaymentTransactionState): InAppPurchaseResultCode {
        switch (sKPaymentTransactionState) {
            case SKPaymentTransactionState.Purchasing:
                return InAppPurchaseResultCode.Purchasing
            case SKPaymentTransactionState.Purchased:
                return InAppPurchaseResultCode.Purchased
            case SKPaymentTransactionState.Failed:
                return InAppPurchaseResultCode.Failed
            case SKPaymentTransactionState.Deferred:
                return InAppPurchaseResultCode.Deferred
            case SKPaymentTransactionState.Restored:
                return InAppPurchaseResultCode.Restored
        }
    }

    paymentQueueRestoreCompletedTransactionsFailedWithError?(queue: SKPaymentQueue, error: NSError): void {
        // console.log('**** paymentQueueRestoreCompletedTransactionsFailedWithError', error, queue)
    }

    paymentQueueRestoreCompletedTransactionsFinished?(queue: SKPaymentQueue): void {
        // console.log('**** paymentQueueRestoreCompletedTransactionsFinished', queue)
    }
}


@ObjCClass(SKPaymentTransactionObserver)
class InAppPurchasesHistoryTransactionObserverImpl extends NSObject implements SKPaymentTransactionObserver {
    private _resolve: Function
    private _reject: Function

    paymentQueueUpdatedTransactions(queue: SKPaymentQueue, transactions: NSArray<SKPaymentTransaction> | SKPaymentTransaction[]): void {
        // do nothing, sice it listens only for the history request as a whole
    }

    /**
     * 
     * @param resolve 
     * @param reject 
     */
    public static initWithResolveReject(resolve: Function, reject: Function): InAppPurchasesHistoryTransactionObserverImpl {
        const delegate: InAppPurchasesHistoryTransactionObserverImpl = InAppPurchasesHistoryTransactionObserverImpl.new() as InAppPurchasesHistoryTransactionObserverImpl
        delegate._resolve = resolve
        delegate._reject = reject
        return delegate
    }

    paymentQueueRestoreCompletedTransactionsFailedWithError?(queue: SKPaymentQueue, error: NSError): void {
        // console.log('#### paymentQueueRestoreCompletedTransactionsFailedWithError', error, queue)

        // TODO : in some cases `this`, `this._resolve` and `this._reject` are undefiend, so this is a workaround to prevent raising an error
        const _this = this
        if (_this) {
            const _this_reject = _this._reject
            _this_reject({
                success: false,
                message: error.localizedDescription,
                nativeResponse: {
                    code: `${error.code}`,
                    codeText: `${error.localizedFailureReason}`,
                    response: error
                }
            })
        }
    }

    paymentQueueRestoreCompletedTransactionsFinished?(queue: SKPaymentQueue): void {
        // console.log('#### paymentQueueRestoreCompletedTransactionsFinished', queue)

        // TODO : in some cases `this`, `this._resolve` and `this._reject` are undefiend, so this is a workaround to prevent raising an error
        const _this = this
        if (_this) {
            const _this_resolve = _this._resolve
            if (_this_resolve)
                _this_resolve({ success: true })
        }
    }

}

@ObjCClass(SKRequestDelegate)
class SKReceiptRefreshRequestDelegateImpl extends NSObject implements SKRequestDelegate {
    private _resolve: Function;
    private _reject: Function;

    public static initWithResolveReject(resolve: Function, reject: Function): SKReceiptRefreshRequestDelegateImpl {
        const delegate: SKReceiptRefreshRequestDelegateImpl = SKReceiptRefreshRequestDelegateImpl.new() as SKReceiptRefreshRequestDelegateImpl;
        delegate._resolve = resolve;
        delegate._reject = reject;

        return delegate;
    }

    public requestDidFinish(request: SKRequest) {
        this._resolve();
        this._cleanup();
    }

    public requestDidFailWithError(request: SKRequest, error: NSError) {
        this._reject(new Error(error.localizedDescription));
        this._cleanup();
    }

    private _cleanup() {
        refreshReceiptRequestDelegate = null;
        refreshReceiptRequest = null;
    }
}
