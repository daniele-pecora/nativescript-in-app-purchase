export declare interface InAppPurchaseStateUpdateListener {
  /**
   * Listener to get notified when a purchase gets updated
   * @param purchaseTransactionState 
   */
  onUpdate(purchaseTransactionState: InAppPurchaseTransactionState): void
  /**
   * Listener to get notified when restoring the uses already purchased items
   * @param purchaseTransactionState 
   */
  onUpdateHistory(purchaseTransactionState: InAppPurchaseTransactionState): void
}

export declare interface InAppPurchaseUpdateNotifier {
  notifyOnUpdate(purchaseTransactionState: InAppPurchaseTransactionState): void
  notifyOnUpdateHistory(purchaseTransactionState: InAppPurchaseTransactionState): void
}

export declare class InAppPurchaseManager {
  /**
   * 
   * @param purchaseUpdateListener 
   */
  init(purchaseUpdateListener?: InAppPurchaseStateUpdateListener): Promise<InAppPurchaseManager>
  /**
   * 
   * @param productIds 
   * @param productType 
   */
  list(productIds: string[], productType?: InAppPurchaseType): Promise<InAppListProductsResult>
  /**
   * The intention to buy a product
   * @param product Must be an instance provided via <code>Purchage#list(...)</code>
   */
  order(product: InAppProduct): Promise<InAppOrderResult>
  /**
   * Every bought product must be confirmed/aknowledged
   * @param purchaseTransaction Must cons an instance provided via <code>Purchage#list(...)</code>
   * @param consumable Set to <code>true</code> if the product is consumable and can be bought more than once.<br/>
   *                    Set to <code>false</code> if the product can be bought only once.
   */
  orderConfirm(purchaseTransaction: InAppPurchaseTransactionState, consumable: boolean): Promise<InAppOrderConfirmResult>
  /**
   * Query already bought products
   */
  purchaseHistory(): Promise<InAppOrderHistoryResult>
  /**
   * 
   */
  canMakePayment(): boolean
  /**
   * Returns the application's Base64 encoded store receipt for the currently
   * logged in iOS App Store user. This is necessary for checking subscription
   * status under iOS when hitting the ["verifyReceipt" Web Service Endpoint][1]
   * in order to send a receipt to the App Store for verification.
   *
   * For Android, this function always returns `undefined`.
   *
   * [1]:https://developer.apple.com/documentation/appstorereceipts/verifyreceipt
   */
  getStoreReceipt(): string
  /**
   * On iOS, requests to refresh the store receipt, which represents the user's
   * transactions with your app. It refreshes the store receipt for the
   * currently logged in AppStore user. Use this API to request a new receipt if
   * the receipt is invalid or missing.  On iOS, it returns a completed promise
   * once the refresh is complete.
   *
   * On Android, the promise just always completes.
   */
  refreshStoreReceipt(): Promise<void>
  /**
   * 
   * @param purchaseStateUpdateListener Get notified every time an update on a purchas occures.<br/>
   *                                     This listener is mandatory to manually confirm/aknowledge/finish any buy via the method<br/>
   *                                     <code>InAppPurchaseManager#orderConfirm</code>.<br/>
   */
  static bootStrapInstance(purchaseStateUpdateListener?: InAppPurchaseStateUpdateListener): Promise<InAppPurchaseManager>
  /**
   * Shut down any connection to the underlying billing api.<br/>
   * Calling this method may make this instance unusable.
   */
  shutdown()
}

export declare class InAppProduct {
  productId: string
  title: string
  description?: string
  /** 
   * Returns formatted price of the item, including its currency sign. 
   */
  price?: string
  /** 
   * Returns price in micro-units, where 1,000,000 micro-units equal one unit of the currency.<br/>
   * For example, if price is "€7.99", price_amount_micros is "7990000"
   */
  priceMicro?: number
  /**
   * The price currency code ISO-4271
   */
  priceCurrencyCode: string
  type?: InAppPurchaseType
  /**
   * Android Only.<br/>
   * Get the url the the icon for this item.
   */
  android_iconUrl?: string

  /**
   * 
   * @param nativeValue The original OS specific product entity
   */
  constructor(public nativeValue: any)
}

export declare class InAppPurchaseTransactionState {
  resultCode: InAppPurchaseResultCode
  productIdentifier: any
  purchaseId: string
  purchaseTime: number
  /**
   * 
   * @param nativeValue The underlying OS specific purchase transaction.<br/>
   *                    May be <code>undefined</code>
   */
  constructor(public nativeValue: any)
}

export declare interface IInAppPurchaseResult {
  success: boolean
  message?: string
  nativeResult?: {
    code?: string
    codeText?: string
    response?: any
  }
}

export declare interface InAppListProductsResult extends IInAppPurchaseResult {
  products: InAppProduct[]
}

export declare interface InAppOrderResult extends IInAppPurchaseResult {
}

export declare interface InAppOrderConfirmResult extends IInAppPurchaseResult {
}

export declare interface InAppOrderHistoryResult extends IInAppPurchaseResult {
}

declare const enum InAppPurchaseType {
  InAppPurchase = 'InAppPurchase',
  Subscription = 'Subscription'
}

declare const enum InAppPurchaseResultCode {
  /**
   * A purchase transaction is ongoing
   */
  Purchasing = 'Purchasing',
  /**
   * Item has been purchased successfully
   */
  Purchased = 'Purchased',
  /**
   * An purchasin transaction has failed
   */
  Failed = 'Failed',
  /**
   * A already bought item has this state when it was queried from the api
   */
  Restored = 'Restored',
  /**
   * User does not have permissions to buy but requested parental approval (iOS only)
   */
  Deferred = 'Deferred'
}