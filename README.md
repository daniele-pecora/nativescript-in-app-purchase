# nativescript-in-app-purchase

NativeScript plugin to handle in app purchases and subscriptions on Android and iOS.



## Compatibility

- Version _1.x_ build for _Google Billing Api 2.1.0_
- Version _2.x_ build for _Google Billing Api 4.x_

## (Optional) Prerequisites / Requirements

Refer to the mobile ecosystem provider on how to  
test in app purchases.

For [Apple](https://developer.apple.com/in-app-purchase/)
 head to [developer.apple.com](https://developer.apple.com/in-app-purchase/)

For Android [Google Play Store](https://developer.android.com/google/play/billing/billing_testing) head over to [developer.android.com](https://developer.android.com/google/play/billing/billing_testing)

## Installation

Installing the plugin

```javascript
tns plugin add nativescript-in-app-purchase
```

## Usage 

Use this typings definition for Typescript and adding _IntelliSense_ support.
```
    /// <reference path="./node_modules/nativescript-in-app-purchase/index.d.ts" />
```

#### Initialization	

First of all it is required to create an instance of `InAppPurchaseManager`.  

```typescript
    import { OnInit } from '@angular/core'
    import { InAppPurchaseManager, InAppPurchaseResultCode, InAppPurchaseStateUpdateListener, InAppPurchaseTransactionState, InAppPurchaseType } from 'nativescript-in-app-purchase'
    export class Test implements OnInit {
        private inAppPurchaseManager: InAppPurchaseManager
        constructor() { }
        ngOnInit(): void {
            const purchaseStateUpdateListener: InAppPurchaseStateUpdateListener = {
                onUpdate: (purchaseTransactionState: InAppPurchaseTransactionState): void => {
                    if (purchaseTransactionState.resultCode === InAppPurchaseResultCode.Purchased) {
                        // Item has been purchased, sync local items list ...
                    }
                },
                onUpdateHistory: (purchaseTransactionState: InAppPurchaseTransactionState): void => {
                    if (purchaseTransactionState.resultCode === InAppPurchaseResultCode.Restored) {
                        // Item has been  restored, sync local items list ...
                    }
                }
            }
            InAppPurchaseManager.bootStrapInstance(purchaseStateUpdateListener).then(inAppPurchaseManager => {
                this.inAppPurchaseManager = inAppPurchaseManager
            })
        }
    }
```

#### Product list	

Get the list of in app products.  
To retrieve the list of in app products you must query a known amount of product IDs.  

```typescript
    // additional imports required
    import { InAppPurchaseType, InAppListProductsResult, InAppProduct } from 'nativescript-in-app-purchase'

    // query products
    queryProducts() {
        const myProductIds = ['product_1', 'product_2']
        // For subscriptions change to `InAppPurchaseType.Subscription`
        const myProductType = InAppPurchaseType.InAppPurchase 

        this.inAppPurchaseManager.list(myProductIds, myProductType)
            .then((result: InAppListProductsResult) => {
                const products: InAppProduct[] = result.products
                for (const product of products) {
                    // get the products ...
                    console.log(product.title, product)
                }
            })
    }
```

#### Buy a product

When buying a product the result `InAppOrderResult` is only related to the order transaction it self.  
The purchase state of the product will be called on the `InAppPurchaseStateUpdateListener#onUpdate` method.  
This is where you have to **confirm the purchase** to finish the whole purchasing transaction.  
The App Store and Google Play Store **will automatically refund orders** that haven't been confirmed.

Buying a product   
```typescript
    // additional imports required
    import { InAppOrderResult } from 'nativescript-in-app-purchase'

    // by product
    buy() {
        const myProducts: InAppProduct[] = []//...

        const productToBuy: InAppProduct = myProducts[0]
        this.inAppPurchaseManager.order(productToBuy)
            .then((result: InAppOrderResult) => {
                if (result.success) {
                    // order has been processed
                    // ... expecting confirmation ...
                    // handle confirmation in `InAppPurchaseStateUpdateListener.onUpdate(...)`
                }
            })
    }
```

Confirming a product   
```typescript
    // additional imports required
    import { InAppOrderConfirmResult } from 'nativescript-in-app-purchase'

    ngOnInit(): void {
        const purchaseStateUpdateListener: InAppPurchaseStateUpdateListener = {
            onUpdate: (purchaseTransactionState: InAppPurchaseTransactionState): void => {
                if (purchaseTransactionState.resultCode === InAppPurchaseResultCode.Purchased) {
                    // Item has been purchased, sync local items list ...
                    this.confirmOrder(purchaseTransactionState)
                }
            },
            onUpdateHistory: (purchaseTransactionState: InAppPurchaseTransactionState): void => {
                if (purchaseTransactionState.resultCode === InAppPurchaseResultCode.Restored) {
                    // Item has been  restored, sync local items list ...
                }
            }
        }
        // ...
    }

    confirmOrder(purchaseTransactionState: InAppPurchaseTransactionState) {
        const isConsumable = (productId: string): boolean => { 
            /* determine if is consumable and can be purchased more then once */
            return false }

        // only purchased products can be confirmed
        if (purchaseTransactionState.resultCode === InAppPurchaseResultCode.Purchased) {
            const consumable: boolean = isConsumable(purchaseTransactionState.productIdentifier)
            this.inAppPurchaseManager.orderConfirm(purchaseTransactionState, consumable)
                .then((result: InAppOrderConfirmResult) => {
                    if (result.success) {
                        // order confirmation has been processed
                    }
                })

        }
    }

```

#### Restore purchases

Restore purchases will get you all items the user already purchased.   
The purchase state of the restored product will be called on the `InAppPurchaseStateUpdateListener#onUpdateHistory` method.  

```typescript
    // additional imports required
    import { InAppOrderHistoryResult } from 'nativescript-in-app-purchase'

    restoreProducts() {
        this.inAppPurchaseManager.purchaseHistory()
            .then((result: InAppOrderHistoryResult) => {
                if (result.success) {
                    // purchase history requested
                    // handle it in `InAppPurchaseStateUpdateListener.onUpdateHistory(...)`
                }
            })
    }
```

## API


- `list(productIds: string[], productType?: InAppPurchaseType): Promise<InAppListProductsResult>`  
List all products
- `order(product: InAppProduct): Promise<InAppOrderResult>`  
Order a product
- `orderConfirm(purchaseTransaction: InAppPurchaseTransactionState, consumable: boolean): Promise<InAppOrderConfirmResult>`  
Confirm the buy of a product to make it final
- `purchaseHistory(): Promise<InAppOrderHistoryResult>`  
Load user's owned products
- `canMakePayment(): boolean`  
Check wether billing is enabled or not
- `static bootStrapInstance(purchaseStateUpdateListener?: InAppPurchaseStateUpdateListener): Promise<InAppPurchaseManager>`  
Create a new instance of the in app purchase manager
- `getStoreReceipt(): string`  
Returns the application's Base64 encoded store receipt for the currently logged
in iOS App Store user. For Android, this function always returns `undefined`.
- `refreshStoreReceipt(): Promise<void>`  
On iOS, request a new receipt if the receipt is invalid or missing.  
On Android, the promise just completes.
- `shutdown()`  
Close connection to the underlying OS billing API

## DEMO App

There is a demo angular app project included.   
Checkout this repo and read the [DEMO Readme](./DEMO.md)

## License

Apache License Version 2.0, January 2020

## Donation

Donate with Bitcoin   
**[3GFxvCK4nnTvHcLpVtFDQhdjANzRGBV6G6](bitcoin:3GFxvCK4nnTvHcLpVtFDQhdjANzRGBV6G6)**  
[![Open in Wallet](https://chart.apis.google.com/chart?chs=200x200&cht=qr&chld=L&chl=bitcoin%3A3GFxvCK4nnTvHcLpVtFDQhdjANzRGBV6G6)](bitcoin:3GFxvCK4nnTvHcLpVtFDQhdjANzRGBV6G6)  
**[Open in Wallet](bitcoin:3GFxvCK4nnTvHcLpVtFDQhdjANzRGBV6G6)**   