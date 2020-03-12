export class InAppPurchaseManagerBase implements InAppPurchaseUpdateNotifier {
  protected constructor(protected purchaseStateUpdateListener: InAppPurchaseStateUpdateListener) { }

  notifyOnUpdate(purchaseTransactionState: InAppPurchaseTransactionState) {
    this.purchaseStateUpdateListener.onUpdate(purchaseTransactionState)
  }

  notifyOnUpdateHistory(purchaseTransactionState: InAppPurchaseTransactionState) {
    this.purchaseStateUpdateListener.onUpdateHistory(purchaseTransactionState)
  }

}



import { InAppPurchaseStateUpdateListener, InAppPurchaseUpdateNotifier, InAppPurchaseType, InAppPurchaseResultCode } from "."
export class InAppProduct {
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
   * @param nativeValue The original OS specific product entity.<br/>
   *                    On Android it is type <code>com.android.billingclient.api.SkuDetails</code><br/>
   *                    On IOS it is type <code>SKProduct</code>
   */
  constructor(public nativeValue: any) { }
}

export class InAppPurchaseTransactionState {
  resultCode: InAppPurchaseResultCode
  productIdentifier: string
  purchaseId: string
  purchaseTime: number
  /**
   * 
   * @param nativeValue The underlying OS specific purchase transaction.<br/>
   *                    May be <code>undefined</code>.<br/>
   *                    On Android it is type <code>com.android.billingclient.api.Purchase</code><br/>
   *                    On IOS it is type <code>SKPaymentTransaction</code>
   */
  constructor(public nativeValue: any) { }
}