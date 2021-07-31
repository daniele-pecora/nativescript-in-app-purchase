Here some hints on how the **In App Purchase** systems works on the different platforms.

## iOS

### Restoring

Restoring will only provide the **non consumable** items.  
No subscriptions and no consumables.

### Purchased

When purchasing an item the **IAP API** will provide a notification for the transaction  
with the state **PURCHASING**.  
The final state **PURCHASED** will be provided after the app has been restarted only.

### Items / Subscriptions

There is no way to differentiate between *Items* and *Subscriptions* on iOS.  
Although there is `SKProduct#subscriptionPeriod` which could indicate that the item containing such a period would probably be a subscription unfortunately `SKProduct#subscriptionPeriod` is is not always set  nor does contain a value.  
I couldn't manage setting up a subscription that contains a subscription period value at the [https://appstoreconnect.apple.com](https://appstoreconnect.apple.com/WebObjects/iTunesConnect.woa/ra/ng/app/<your-app-id>/addons) .



## Android

### Purchased

A product is only purchased if it has been confirmed.