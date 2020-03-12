/// <reference path="billing-android-declarations.d.ts"/>

declare module com {
	export module android {
		export module billingclient {
			export class BuildConfig {
				public static class: java.lang.Class<com.android.billingclient.BuildConfig>;
				public static APPLICATION_ID: string;
				public static VERSION_NAME: string;
				public constructor();
			}
		}
	}
}

declare module com {
	export module android {
		export module billingclient {
			export module api {
				export class AcknowledgePurchaseParams {
					public static class: java.lang.Class<com.android.billingclient.api.AcknowledgePurchaseParams>;
					public static newBuilder(): com.android.billingclient.api.AcknowledgePurchaseParams.Builder;
					public getDeveloperPayload(): string;
					public getPurchaseToken(): string;
				}
				export module AcknowledgePurchaseParams {
					export class Builder {
						public static class: java.lang.Class<com.android.billingclient.api.AcknowledgePurchaseParams.Builder>;
						public setPurchaseToken(param0: string): com.android.billingclient.api.AcknowledgePurchaseParams.Builder;
						public setDeveloperPayload(param0: string): com.android.billingclient.api.AcknowledgePurchaseParams.Builder;
						public build(): com.android.billingclient.api.AcknowledgePurchaseParams;
					}
				}
			}
		}
	}
}

declare module com {
	export module android {
		export module billingclient {
			export module api {
				export class AcknowledgePurchaseResponseListener {
					public static class: java.lang.Class<com.android.billingclient.api.AcknowledgePurchaseResponseListener>;
					/**
					 * Constructs a new instance of the com.android.billingclient.api.AcknowledgePurchaseResponseListener interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
					 */
					public constructor(implementation: {
						onAcknowledgePurchaseResponse(param0: com.android.billingclient.api.BillingResult): void;
					});
					public constructor();
					public onAcknowledgePurchaseResponse(param0: com.android.billingclient.api.BillingResult): void;
				}
			}
		}
	}
}

declare module com {
	export module android {
		export module billingclient {
			export module api {
				export class BillingBroadcastManager {
					public static class: java.lang.Class<com.android.billingclient.api.BillingBroadcastManager>;
				}
				export module BillingBroadcastManager {
					export class BillingBroadcastReceiver {
						public static class: java.lang.Class<com.android.billingclient.api.BillingBroadcastManager.BillingBroadcastReceiver>;
						public onReceive(param0: globalAndroid.content.Context, param1: globalAndroid.content.Intent): void;
						public register(param0: globalAndroid.content.Context, param1: globalAndroid.content.IntentFilter): void;
						public unRegister(param0: globalAndroid.content.Context): void;
					}
				}
			}
		}
	}
}

declare module com {
	export module android {
		export module billingclient {
			export module api {
				export abstract class BillingClient {
					public static class: java.lang.Class<com.android.billingclient.api.BillingClient>;
					public isReady(): boolean;
					public queryPurchases(param0: string): com.android.billingclient.api.Purchase.PurchasesResult;
					public launchBillingFlow(param0: globalAndroid.app.Activity, param1: com.android.billingclient.api.BillingFlowParams): com.android.billingclient.api.BillingResult;
					public endConnection(): void;
					public acknowledgePurchase(param0: com.android.billingclient.api.AcknowledgePurchaseParams, param1: com.android.billingclient.api.AcknowledgePurchaseResponseListener): void;
					public querySkuDetailsAsync(param0: com.android.billingclient.api.SkuDetailsParams, param1: com.android.billingclient.api.SkuDetailsResponseListener): void;
					public queryPurchaseHistoryAsync(param0: string, param1: com.android.billingclient.api.PurchaseHistoryResponseListener): void;
					public static newBuilder(param0: globalAndroid.content.Context): com.android.billingclient.api.BillingClient.Builder;
					public isFeatureSupported(param0: string): com.android.billingclient.api.BillingResult;
					public startConnection(param0: com.android.billingclient.api.BillingClientStateListener): void;
					public constructor();
					public loadRewardedSku(param0: com.android.billingclient.api.RewardLoadParams, param1: com.android.billingclient.api.RewardResponseListener): void;
					public launchPriceChangeConfirmationFlow(param0: globalAndroid.app.Activity, param1: com.android.billingclient.api.PriceChangeFlowParams, param2: com.android.billingclient.api.PriceChangeConfirmationListener): void;
					public consumeAsync(param0: com.android.billingclient.api.ConsumeParams, param1: com.android.billingclient.api.ConsumeResponseListener): void;
				}
				export module BillingClient {
					export class BillingResponseCode {
						public static class: java.lang.Class<com.android.billingclient.api.BillingClient.BillingResponseCode>;
						/**
						 * Constructs a new instance of the com.android.billingclient.api.BillingClient$BillingResponseCode interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
						 */
						public constructor(implementation: {
						});
						public constructor();
						public static ITEM_UNAVAILABLE: number;
						public static ITEM_ALREADY_OWNED: number;
						public static SERVICE_TIMEOUT: number;
						public static USER_CANCELED: number;
						public static SERVICE_UNAVAILABLE: number;
						public static ERROR: number;
						public static OK: number;
						public static BILLING_UNAVAILABLE: number;
						public static FEATURE_NOT_SUPPORTED: number;
						public static SERVICE_DISCONNECTED: number;
						public static DEVELOPER_ERROR: number;
						public static ITEM_NOT_OWNED: number;
					}
					export class Builder {
						public static class: java.lang.Class<com.android.billingclient.api.BillingClient.Builder>;
						public build(): com.android.billingclient.api.BillingClient;
						public setListener(param0: com.android.billingclient.api.PurchasesUpdatedListener): com.android.billingclient.api.BillingClient.Builder;
						public enablePendingPurchases(): com.android.billingclient.api.BillingClient.Builder;
						public setChildDirected(param0: number): com.android.billingclient.api.BillingClient.Builder;
						public setUnderAgeOfConsent(param0: number): com.android.billingclient.api.BillingClient.Builder;
					}
					export class ChildDirected {
						public static class: java.lang.Class<com.android.billingclient.api.BillingClient.ChildDirected>;
						/**
						 * Constructs a new instance of the com.android.billingclient.api.BillingClient$ChildDirected interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
						 */
						public constructor(implementation: {
						});
						public constructor();
						public static UNSPECIFIED: number;
						public static CHILD_DIRECTED: number;
						public static NOT_CHILD_DIRECTED: number;
					}
					export class FeatureType {
						public static class: java.lang.Class<com.android.billingclient.api.BillingClient.FeatureType>;
						/**
						 * Constructs a new instance of the com.android.billingclient.api.BillingClient$FeatureType interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
						 */
						public constructor(implementation: {
						});
						public constructor();
						public static SUBSCRIPTIONS_ON_VR: string;
						public static SUBSCRIPTIONS: string;
						public static IN_APP_ITEMS_ON_VR: string;
						public static SUBSCRIPTIONS_UPDATE: string;
						public static PRICE_CHANGE_CONFIRMATION: string;
					}
					export class SkuType {
						public static class: java.lang.Class<com.android.billingclient.api.BillingClient.SkuType>;
						/**
						 * Constructs a new instance of the com.android.billingclient.api.BillingClient$SkuType interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
						 */
						public constructor(implementation: {
						});
						public constructor();
						public static INAPP: string;
						public static SUBS: string;
					}
					export class UnderAgeOfConsent {
						public static class: java.lang.Class<com.android.billingclient.api.BillingClient.UnderAgeOfConsent>;
						/**
						 * Constructs a new instance of the com.android.billingclient.api.BillingClient$UnderAgeOfConsent interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
						 */
						public constructor(implementation: {
						});
						public constructor();
						public static NOT_UNDER_AGE_OF_CONSENT: number;
						public static UNSPECIFIED: number;
						public static UNDER_AGE_OF_CONSENT: number;
					}
				}
			}
		}
	}
}

declare module com {
	export module android {
		export module billingclient {
			export module api {
				export class BillingClientImpl extends com.android.billingclient.api.BillingClient {
					public static class: java.lang.Class<com.android.billingclient.api.BillingClientImpl>;
					public isReady(): boolean;
					public queryPurchases(param0: string): com.android.billingclient.api.Purchase.PurchasesResult;
					public launchBillingFlow(param0: globalAndroid.app.Activity, param1: com.android.billingclient.api.BillingFlowParams): com.android.billingclient.api.BillingResult;
					public isFeatureSupported(param0: string): com.android.billingclient.api.BillingResult;
					public startConnection(param0: com.android.billingclient.api.BillingClientStateListener): void;
					public endConnection(): void;
					public acknowledgePurchase(param0: com.android.billingclient.api.AcknowledgePurchaseParams, param1: com.android.billingclient.api.AcknowledgePurchaseResponseListener): void;
					public querySkuDetailsAsync(param0: com.android.billingclient.api.SkuDetailsParams, param1: com.android.billingclient.api.SkuDetailsResponseListener): void;
					public loadRewardedSku(param0: com.android.billingclient.api.RewardLoadParams, param1: com.android.billingclient.api.RewardResponseListener): void;
					public launchPriceChangeConfirmationFlow(param0: globalAndroid.app.Activity, param1: com.android.billingclient.api.PriceChangeFlowParams, param2: com.android.billingclient.api.PriceChangeConfirmationListener): void;
					public queryPurchaseHistoryAsync(param0: string, param1: com.android.billingclient.api.PurchaseHistoryResponseListener): void;
					public consumeAsync(param0: com.android.billingclient.api.ConsumeParams, param1: com.android.billingclient.api.ConsumeResponseListener): void;
				}
				export module BillingClientImpl {
					export class BillingServiceConnection {
						public static class: java.lang.Class<com.android.billingclient.api.BillingClientImpl.BillingServiceConnection>;
						public onServiceConnected(param0: globalAndroid.content.ComponentName, param1: globalAndroid.os.IBinder): void;
						public onServiceDisconnected(param0: globalAndroid.content.ComponentName): void;
					}
					export class ClientState {
						public static class: java.lang.Class<com.android.billingclient.api.BillingClientImpl.ClientState>;
						/**
						 * Constructs a new instance of the com.android.billingclient.api.BillingClientImpl$ClientState interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
						 */
						public constructor(implementation: {
						});
						public constructor();
						public static CONNECTED: number;
						public static DISCONNECTED: number;
						public static CLOSED: number;
						public static CONNECTING: number;
					}
					export class NativeUsage {
						public static class: java.lang.Class<com.android.billingclient.api.BillingClientImpl.NativeUsage>;
						/**
						 * Constructs a new instance of the com.android.billingclient.api.BillingClientImpl$NativeUsage interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
						 */
						public constructor(implementation: {
						});
						public constructor();
					}
					export class PurchaseHistoryResult {
						public static class: java.lang.Class<com.android.billingclient.api.BillingClientImpl.PurchaseHistoryResult>;
					}
				}
			}
		}
	}
}

declare module com {
	export module android {
		export module billingclient {
			export module api {
				export class BillingClientNativeCallback implements com.android.billingclient.api.AcknowledgePurchaseResponseListener, com.android.billingclient.api.BillingClientStateListener, com.android.billingclient.api.ConsumeResponseListener, com.android.billingclient.api.PriceChangeConfirmationListener, com.android.billingclient.api.PurchaseHistoryResponseListener, com.android.billingclient.api.PurchasesUpdatedListener, com.android.billingclient.api.RewardResponseListener, com.android.billingclient.api.SkuDetailsResponseListener {
					public static class: java.lang.Class<com.android.billingclient.api.BillingClientNativeCallback>;
					public onBillingSetupFinished(param0: com.android.billingclient.api.BillingResult): void;
					public static nativeOnAcknowledgePurchaseResponse(param0: number, param1: string, param2: number): void;
					public onSkuDetailsResponse(param0: com.android.billingclient.api.BillingResult, param1: java.util.List<com.android.billingclient.api.SkuDetails>): void;
					public static nativeOnPurchaseHistoryResponse(param0: number, param1: string, param2: native.Array<com.android.billingclient.api.PurchaseHistoryRecord>, param3: number): void;
					public static nativeOnBillingSetupFinished(param0: number, param1: string, param2: number): void;
					public static nativeOnPriceChangeConfirmationResult(param0: number, param1: string, param2: number): void;
					public static nativeOnPurchasesUpdated(param0: number, param1: string, param2: native.Array<com.android.billingclient.api.Purchase>): void;
					public onConsumeResponse(param0: com.android.billingclient.api.BillingResult, param1: string): void;
					public onRewardResponse(param0: com.android.billingclient.api.BillingResult): void;
					public static nativeOnConsumePurchaseResponse(param0: number, param1: string, param2: string, param3: number): void;
					public static nativeOnBillingServiceDisconnected(): void;
					public static nativeOnSkuDetailsResponse(param0: number, param1: string, param2: native.Array<com.android.billingclient.api.SkuDetails>, param3: number): void;
					public onPriceChangeConfirmationResult(param0: com.android.billingclient.api.BillingResult): void;
					public onPurchasesUpdated(param0: com.android.billingclient.api.BillingResult, param1: java.util.List<com.android.billingclient.api.Purchase>): void;
					public static nativeOnQueryPurchasesResponse(param0: number, param1: string, param2: native.Array<com.android.billingclient.api.Purchase>, param3: number): void;
					public onBillingServiceDisconnected(): void;
					public onAcknowledgePurchaseResponse(param0: com.android.billingclient.api.BillingResult): void;
					public onPurchaseHistoryResponse(param0: com.android.billingclient.api.BillingResult, param1: java.util.List<com.android.billingclient.api.PurchaseHistoryRecord>): void;
					public static nativeOnRewardResponse(param0: number, param1: string, param2: number): void;
				}
			}
		}
	}
}

declare module com {
	export module android {
		export module billingclient {
			export module api {
				export class BillingClientStateListener {
					public static class: java.lang.Class<com.android.billingclient.api.BillingClientStateListener>;
					/**
					 * Constructs a new instance of the com.android.billingclient.api.BillingClientStateListener interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
					 */
					public constructor(implementation: {
						onBillingSetupFinished(param0: com.android.billingclient.api.BillingResult): void;
						onBillingServiceDisconnected(): void;
					});
					public constructor();
					public onBillingSetupFinished(param0: com.android.billingclient.api.BillingResult): void;
					public onBillingServiceDisconnected(): void;
				}
			}
		}
	}
}

declare module com {
	export module android {
		export module billingclient {
			export module api {
				export class BillingFlowParams {
					public static class: java.lang.Class<com.android.billingclient.api.BillingFlowParams>;
					public static EXTRA_PARAM_KEY_ACCOUNT_ID: string;
					public static EXTRA_PARAM_KEY_REPLACE_SKUS_PRORATION_MODE: string;
					public static EXTRA_PARAM_KEY_VR: string;
					public static EXTRA_PARAM_KEY_RSKU: string;
					public static EXTRA_PARAM_CHILD_DIRECTED: string;
					public static EXTRA_PARAM_UNDER_AGE_OF_CONSENT: string;
					public static EXTRA_PARAM_KEY_OLD_SKUS: string;
					public static EXTRA_PARAM_KEY_OLD_SKU_PURCHASE_TOKEN: string;
					public static EXTRA_PARAM_KEY_DEVELOPER_ID: string;
					public getVrPurchaseFlow(): boolean;
					public constructor();
					public getSkuDetails(): com.android.billingclient.api.SkuDetails;
					public getReplaceSkusProrationMode(): number;
					public getSku(): string;
					public getOldSku(): string;
					public getAccountId(): string;
					public static newBuilder(): com.android.billingclient.api.BillingFlowParams.Builder;
					/** @deprecated */
					public getOldSkus(): java.util.ArrayList<string>;
					public getDeveloperId(): string;
					public getOldSkuPurchaseToken(): string;
					public getSkuType(): string;
				}
				export module BillingFlowParams {
					export class Builder {
						public static class: java.lang.Class<com.android.billingclient.api.BillingFlowParams.Builder>;
						/** @deprecated */
						public setOldSkus(param0: java.util.ArrayList<string>): com.android.billingclient.api.BillingFlowParams.Builder;
						public setVrPurchaseFlow(param0: boolean): com.android.billingclient.api.BillingFlowParams.Builder;
						public setSkuDetails(param0: com.android.billingclient.api.SkuDetails): com.android.billingclient.api.BillingFlowParams.Builder;
						/** @deprecated */
						public setOldSku(param0: string): com.android.billingclient.api.BillingFlowParams.Builder;
						public setAccountId(param0: string): com.android.billingclient.api.BillingFlowParams.Builder;
						/** @deprecated */
						public addOldSku(param0: string): com.android.billingclient.api.BillingFlowParams.Builder;
						public setReplaceSkusProrationMode(param0: number): com.android.billingclient.api.BillingFlowParams.Builder;
						public setDeveloperId(param0: string): com.android.billingclient.api.BillingFlowParams.Builder;
						public build(): com.android.billingclient.api.BillingFlowParams;
						public setOldSku(param0: string, param1: string): com.android.billingclient.api.BillingFlowParams.Builder;
					}
					export class ProrationMode {
						public static class: java.lang.Class<com.android.billingclient.api.BillingFlowParams.ProrationMode>;
						/**
						 * Constructs a new instance of the com.android.billingclient.api.BillingFlowParams$ProrationMode interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
						 */
						public constructor(implementation: {
						});
						public constructor();
						public static IMMEDIATE_WITH_TIME_PRORATION: number;
						public static DEFERRED: number;
						public static UNKNOWN_SUBSCRIPTION_UPGRADE_DOWNGRADE_POLICY: number;
						public static IMMEDIATE_AND_CHARGE_PRORATED_PRICE: number;
						public static IMMEDIATE_WITHOUT_PRORATION: number;
					}
				}
			}
		}
	}
}

declare module com {
	export module android {
		export module billingclient {
			export module api {
				export class BillingResult {
					public static class: java.lang.Class<com.android.billingclient.api.BillingResult>;
					public getResponseCode(): number;
					public constructor();
					public static newBuilder(): com.android.billingclient.api.BillingResult.Builder;
					public getDebugMessage(): string;
				}
				export module BillingResult {
					export class Builder {
						public static class: java.lang.Class<com.android.billingclient.api.BillingResult.Builder>;
						public build(): com.android.billingclient.api.BillingResult;
						public setDebugMessage(param0: string): com.android.billingclient.api.BillingResult.Builder;
						public setResponseCode(param0: number): com.android.billingclient.api.BillingResult.Builder;
					}
				}
			}
		}
	}
}

declare module com {
	export module android {
		export module billingclient {
			export module api {
				export class BillingResults {
					public static class: java.lang.Class<com.android.billingclient.api.BillingResults>;
				}
			}
		}
	}
}

declare module com {
	export module android {
		export module billingclient {
			export module api {
				export class ConsumeParams {
					public static class: java.lang.Class<com.android.billingclient.api.ConsumeParams>;
					public getDeveloperPayload(): string;
					public static newBuilder(): com.android.billingclient.api.ConsumeParams.Builder;
					public getPurchaseToken(): string;
				}
				export module ConsumeParams {
					export class Builder {
						public static class: java.lang.Class<com.android.billingclient.api.ConsumeParams.Builder>;
						public setDeveloperPayload(param0: string): com.android.billingclient.api.ConsumeParams.Builder;
						public setPurchaseToken(param0: string): com.android.billingclient.api.ConsumeParams.Builder;
						public build(): com.android.billingclient.api.ConsumeParams;
					}
				}
			}
		}
	}
}

declare module com {
	export module android {
		export module billingclient {
			export module api {
				export class ConsumeResponseListener {
					public static class: java.lang.Class<com.android.billingclient.api.ConsumeResponseListener>;
					/**
					 * Constructs a new instance of the com.android.billingclient.api.ConsumeResponseListener interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
					 */
					public constructor(implementation: {
						onConsumeResponse(param0: com.android.billingclient.api.BillingResult, param1: string): void;
					});
					public constructor();
					public onConsumeResponse(param0: com.android.billingclient.api.BillingResult, param1: string): void;
				}
			}
		}
	}
}

declare module com {
	export module android {
		export module billingclient {
			export module api {
				export class DebugMessages {
					public static class: java.lang.Class<com.android.billingclient.api.DebugMessages>;
				}
			}
		}
	}
}

declare module com {
	export module android {
		export module billingclient {
			export module api {
				export class PriceChangeConfirmationListener {
					public static class: java.lang.Class<com.android.billingclient.api.PriceChangeConfirmationListener>;
					/**
					 * Constructs a new instance of the com.android.billingclient.api.PriceChangeConfirmationListener interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
					 */
					public constructor(implementation: {
						onPriceChangeConfirmationResult(param0: com.android.billingclient.api.BillingResult): void;
					});
					public constructor();
					public onPriceChangeConfirmationResult(param0: com.android.billingclient.api.BillingResult): void;
				}
			}
		}
	}
}

declare module com {
	export module android {
		export module billingclient {
			export module api {
				export class PriceChangeFlowParams {
					public static class: java.lang.Class<com.android.billingclient.api.PriceChangeFlowParams>;
					public constructor();
					public getSkuDetails(): com.android.billingclient.api.SkuDetails;
					public static newBuilder(): com.android.billingclient.api.PriceChangeFlowParams.Builder;
				}
				export module PriceChangeFlowParams {
					export class Builder {
						public static class: java.lang.Class<com.android.billingclient.api.PriceChangeFlowParams.Builder>;
						public build(): com.android.billingclient.api.PriceChangeFlowParams;
						public constructor();
						public setSkuDetails(param0: com.android.billingclient.api.SkuDetails): com.android.billingclient.api.PriceChangeFlowParams.Builder;
					}
				}
			}
		}
	}
}

declare module com {
	export module android {
		export module billingclient {
			export module api {
				export class ProxyBillingActivity {
					public static class: java.lang.Class<com.android.billingclient.api.ProxyBillingActivity>;
					public onSaveInstanceState(param0: globalAndroid.os.Bundle): void;
					public onActivityResult(param0: number, param1: number, param2: globalAndroid.content.Intent): void;
					public onCreate(param0: globalAndroid.os.Bundle): void;
					public constructor();
				}
			}
		}
	}
}

declare module com {
	export module android {
		export module billingclient {
			export module api {
				export class Purchase {
					public static class: java.lang.Class<com.android.billingclient.api.Purchase>;
					public getOrderId(): string;
					public getPurchaseState(): number;
					public getPackageName(): string;
					public isAcknowledged(): boolean;
					public getPurchaseToken(): string;
					public constructor(param0: string, param1: string);
					public equals(param0: any): boolean;
					public toString(): string;
					public getSignature(): string;
					public getPurchaseTime(): number;
					public getOriginalJson(): string;
					public getSku(): string;
					public getDeveloperPayload(): string;
					public isAutoRenewing(): boolean;
					public hashCode(): number;
				}
				export module Purchase {
					export class PurchaseState {
						public static class: java.lang.Class<com.android.billingclient.api.Purchase.PurchaseState>;
						/**
						 * Constructs a new instance of the com.android.billingclient.api.Purchase$PurchaseState interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
						 */
						public constructor(implementation: {
						});
						public constructor();
						public static PENDING: number;
						public static PURCHASED: number;
						public static UNSPECIFIED_STATE: number;
					}
					export class PurchasesResult {
						public static class: java.lang.Class<com.android.billingclient.api.Purchase.PurchasesResult>;
						public constructor(param0: com.android.billingclient.api.BillingResult, param1: java.util.List<com.android.billingclient.api.Purchase>);
						public getResponseCode(): number;
						public getPurchasesList(): java.util.List<com.android.billingclient.api.Purchase>;
						public getBillingResult(): com.android.billingclient.api.BillingResult;
					}
				}
			}
		}
	}
}

declare module com {
	export module android {
		export module billingclient {
			export module api {
				export class PurchaseApiResponseChecker {
					public static class: java.lang.Class<com.android.billingclient.api.PurchaseApiResponseChecker>;
				}
			}
		}
	}
}

declare module com {
	export module android {
		export module billingclient {
			export module api {
				export class PurchaseHistoryRecord {
					public static class: java.lang.Class<com.android.billingclient.api.PurchaseHistoryRecord>;
					public constructor(param0: string, param1: string);
					public equals(param0: any): boolean;
					public toString(): string;
					public getSignature(): string;
					public getPurchaseTime(): number;
					public getOriginalJson(): string;
					public getSku(): string;
					public getDeveloperPayload(): string;
					public hashCode(): number;
					public getPurchaseToken(): string;
				}
			}
		}
	}
}

declare module com {
	export module android {
		export module billingclient {
			export module api {
				export class PurchaseHistoryResponseListener {
					public static class: java.lang.Class<com.android.billingclient.api.PurchaseHistoryResponseListener>;
					/**
					 * Constructs a new instance of the com.android.billingclient.api.PurchaseHistoryResponseListener interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
					 */
					public constructor(implementation: {
						onPurchaseHistoryResponse(param0: com.android.billingclient.api.BillingResult, param1: java.util.List<com.android.billingclient.api.PurchaseHistoryRecord>): void;
					});
					public constructor();
					public onPurchaseHistoryResponse(param0: com.android.billingclient.api.BillingResult, param1: java.util.List<com.android.billingclient.api.PurchaseHistoryRecord>): void;
				}
			}
		}
	}
}

declare module com {
	export module android {
		export module billingclient {
			export module api {
				export class PurchasesUpdatedListener {
					public static class: java.lang.Class<com.android.billingclient.api.PurchasesUpdatedListener>;
					/**
					 * Constructs a new instance of the com.android.billingclient.api.PurchasesUpdatedListener interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
					 */
					public constructor(implementation: {
						onPurchasesUpdated(param0: com.android.billingclient.api.BillingResult, param1: java.util.List<com.android.billingclient.api.Purchase>): void;
					});
					public constructor();
					public onPurchasesUpdated(param0: com.android.billingclient.api.BillingResult, param1: java.util.List<com.android.billingclient.api.Purchase>): void;
				}
			}
		}
	}
}

declare module com {
	export module android {
		export module billingclient {
			export module api {
				export class RewardLoadParams {
					public static class: java.lang.Class<com.android.billingclient.api.RewardLoadParams>;
					public constructor();
					public getSkuDetails(): com.android.billingclient.api.SkuDetails;
					public static newBuilder(): com.android.billingclient.api.RewardLoadParams.Builder;
				}
				export module RewardLoadParams {
					export class Builder {
						public static class: java.lang.Class<com.android.billingclient.api.RewardLoadParams.Builder>;
						public constructor();
						public setSkuDetails(param0: com.android.billingclient.api.SkuDetails): com.android.billingclient.api.RewardLoadParams.Builder;
						public build(): com.android.billingclient.api.RewardLoadParams;
					}
				}
			}
		}
	}
}

declare module com {
	export module android {
		export module billingclient {
			export module api {
				export class RewardResponseListener {
					public static class: java.lang.Class<com.android.billingclient.api.RewardResponseListener>;
					/**
					 * Constructs a new instance of the com.android.billingclient.api.RewardResponseListener interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
					 */
					public constructor(implementation: {
						onRewardResponse(param0: com.android.billingclient.api.BillingResult): void;
					});
					public constructor();
					public onRewardResponse(param0: com.android.billingclient.api.BillingResult): void;
				}
			}
		}
	}
}

declare module com {
	export module android {
		export module billingclient {
			export module api {
				export class SkuDetails {
					public static class: java.lang.Class<com.android.billingclient.api.SkuDetails>;
					public getTitle(): string;
					public getIntroductoryPriceCycles(): string;
					public isRewarded(): boolean;
					public constructor(param0: string);
					public getPriceCurrencyCode(): string;
					public equals(param0: any): boolean;
					public toString(): string;
					public getSubscriptionPeriod(): string;
					public getIntroductoryPrice(): string;
					public getOriginalJson(): string;
					public getPriceAmountMicros(): number;
					public getSku(): string;
					public getIntroductoryPricePeriod(): string;
					public getIntroductoryPriceAmountMicros(): number;
					public getOriginalPriceAmountMicros(): number;
					public getType(): string;
					public getDescription(): string;
					public hashCode(): number;
					public getPrice(): string;
					public getOriginalPrice(): string;
					public getIconUrl(): string;
					public getFreeTrialPeriod(): string;
				}
				export module SkuDetails {
					export class SkuDetailsResult {
						public static class: java.lang.Class<com.android.billingclient.api.SkuDetails.SkuDetailsResult>;
						public getDebugMessage(): string;
						public constructor(param0: number, param1: string, param2: java.util.List<com.android.billingclient.api.SkuDetails>);
						public getSkuDetailsList(): java.util.List<com.android.billingclient.api.SkuDetails>;
						public getResponseCode(): number;
					}
				}
			}
		}
	}
}

declare module com {
	export module android {
		export module billingclient {
			export module api {
				export class SkuDetailsParams {
					public static class: java.lang.Class<com.android.billingclient.api.SkuDetailsParams>;
					public getSkusList(): java.util.List<string>;
					public constructor();
					public static newBuilder(): com.android.billingclient.api.SkuDetailsParams.Builder;
					public getSkuType(): string;
				}
				export module SkuDetailsParams {
					export class Builder {
						public static class: java.lang.Class<com.android.billingclient.api.SkuDetailsParams.Builder>;
						public setType(param0: string): com.android.billingclient.api.SkuDetailsParams.Builder;
						public setSkusList(param0: java.util.List<string>): com.android.billingclient.api.SkuDetailsParams.Builder;
						public build(): com.android.billingclient.api.SkuDetailsParams;
					}
				}
			}
		}
	}
}

declare module com {
	export module android {
		export module billingclient {
			export module api {
				export class SkuDetailsResponseListener {
					public static class: java.lang.Class<com.android.billingclient.api.SkuDetailsResponseListener>;
					/**
					 * Constructs a new instance of the com.android.billingclient.api.SkuDetailsResponseListener interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
					 */
					public constructor(implementation: {
						onSkuDetailsResponse(param0: com.android.billingclient.api.BillingResult, param1: java.util.List<com.android.billingclient.api.SkuDetails>): void;
					});
					public constructor();
					public onSkuDetailsResponse(param0: com.android.billingclient.api.BillingResult, param1: java.util.List<com.android.billingclient.api.SkuDetails>): void;
				}
			}
		}
	}
}

declare module com {
	export module android {
		export module billingclient {
			export module util {
				export class BillingHelper {
					public static class: java.lang.Class<com.android.billingclient.util.BillingHelper>;
					public static RESPONSE_CODE: string;
					public static DEBUG_MESSAGE: string;
					public static RESPONSE_GET_SKU_DETAILS_LIST: string;
					public static RESPONSE_BUY_INTENT_KEY: string;
					public static RESPONSE_SUBS_MANAGEMENT_INTENT_KEY: string;
					public static RESPONSE_INAPP_ITEM_LIST: string;
					public static RESPONSE_INAPP_PURCHASE_DATA_LIST: string;
					public static RESPONSE_INAPP_SIGNATURE_LIST: string;
					public static INAPP_CONTINUATION_TOKEN: string;
					public static EXTRA_PARAM_KEY_SUBS_PRICE_CHANGE: string;
					public static EXTRA_PARAMS_ENABLE_PENDING_PURCHASES: string;
					public static EXTRA_PARAMS_DEVELOPER_PAYLOAD: string;
					public static EXTRA_PARAM_KEY_SKU_DETAILS_TOKEN: string;
					public static LIBRARY_VERSION_KEY: string;
					public static NUMBER_OF_CORES: number;
					public static constructExtraParamsForGetSkuDetails(param0: boolean, param1: boolean, param2: string): globalAndroid.os.Bundle;
					public static getResponseCodeFromIntent(param0: globalAndroid.content.Intent, param1: string): number;
					public static logWarn(param0: string, param1: string): void;
					public static extractPurchases(param0: globalAndroid.os.Bundle): java.util.List<com.android.billingclient.api.Purchase>;
					public static constructExtraParamsForQueryPurchases(param0: boolean, param1: boolean, param2: string): globalAndroid.os.Bundle;
					public static constructExtraParamsForLaunchBillingFlow(param0: com.android.billingclient.api.BillingFlowParams, param1: boolean, param2: boolean, param3: string): globalAndroid.os.Bundle;
					public static constructExtraParamsForConsume(param0: com.android.billingclient.api.ConsumeParams, param1: boolean, param2: string): globalAndroid.os.Bundle;
					public static getResponseCodeFromBundle(param0: globalAndroid.os.Bundle, param1: string): number;
					public static getDebugMessageFromBundle(param0: globalAndroid.os.Bundle, param1: string): string;
					public constructor();
					public static constructExtraParamsForAcknowledgePurchase(param0: com.android.billingclient.api.AcknowledgePurchaseParams, param1: string): globalAndroid.os.Bundle;
					public static logVerbose(param0: string, param1: string): void;
					public static constructExtraParamsForLoadRewardedSku(param0: string, param1: number, param2: number, param3: string): globalAndroid.os.Bundle;
					public static getBillingResultFromIntent(param0: globalAndroid.content.Intent, param1: string): com.android.billingclient.api.BillingResult;
				}
			}
		}
	}
}

declare module com {
	export module google {
		export module android {
			export module gms {
				export module internal {
					export module play_billing {
						export class zza {
							public static class: java.lang.Class<com.google.android.gms.internal.play_billing.zza>;
							/**
							 * Constructs a new instance of the com.google.android.gms.internal.play_billing.zza interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
							 */
							public constructor(implementation: {
								zza(param0: number, param1: string, param2: string): number;
								zza(param0: number, param1: string, param2: string, param3: globalAndroid.os.Bundle): globalAndroid.os.Bundle;
								zza(param0: number, param1: string, param2: string, param3: string, param4: string): globalAndroid.os.Bundle;
								zza(param0: number, param1: string, param2: string, param3: string): globalAndroid.os.Bundle;
								zzb(param0: number, param1: string, param2: string): number;
								zza(param0: number, param1: string, param2: java.util.List<string>, param3: string, param4: string, param5: string): globalAndroid.os.Bundle;
								zza(param0: number, param1: string, param2: string, param3: string, param4: string, param5: globalAndroid.os.Bundle): globalAndroid.os.Bundle;
								zza(param0: number, param1: string, param2: string, param3: string, param4: globalAndroid.os.Bundle): globalAndroid.os.Bundle;
								zzb(param0: number, param1: string, param2: string, param3: globalAndroid.os.Bundle): number;
								zzb(param0: number, param1: string, param2: string, param3: string, param4: globalAndroid.os.Bundle): globalAndroid.os.Bundle;
								zzc(param0: number, param1: string, param2: string, param3: string, param4: globalAndroid.os.Bundle): globalAndroid.os.Bundle;
								zzc(param0: number, param1: string, param2: string, param3: globalAndroid.os.Bundle): globalAndroid.os.Bundle;
								zza(param0: number, param1: string, param2: string, param3: globalAndroid.os.Bundle, param4: globalAndroid.os.Bundle): globalAndroid.os.Bundle;
								zzd(param0: number, param1: string, param2: string, param3: globalAndroid.os.Bundle): globalAndroid.os.Bundle;
							});
							public constructor();
						}
					}
				}
			}
		}
	}
}

declare module com {
	export module google {
		export module android {
			export module gms {
				export module internal {
					export module play_billing {
						export class zzb extends com.google.android.gms.internal.play_billing.zze implements com.google.android.gms.internal.play_billing.zza {
							public static class: java.lang.Class<com.google.android.gms.internal.play_billing.zzb>;
						}
					}
				}
			}
		}
	}
}

declare module com {
	export module google {
		export module android {
			export module gms {
				export module internal {
					export module play_billing {
						export abstract class zzc extends com.google.android.gms.internal.play_billing.zzd implements com.google.android.gms.internal.play_billing.zza {
							public static class: java.lang.Class<com.google.android.gms.internal.play_billing.zzc>;
						}
					}
				}
			}
		}
	}
}

declare module com {
	export module google {
		export module android {
			export module gms {
				export module internal {
					export module play_billing {
						export abstract class zzd {
							public static class: java.lang.Class<com.google.android.gms.internal.play_billing.zzd>;
							public onTransact(param0: number, param1: globalAndroid.os.Parcel, param2: globalAndroid.os.Parcel, param3: number): boolean;
						}
					}
				}
			}
		}
	}
}

declare module com {
	export module google {
		export module android {
			export module gms {
				export module internal {
					export module play_billing {
						export class zze {
							public static class: java.lang.Class<com.google.android.gms.internal.play_billing.zze>;
							public constructor(param0: globalAndroid.os.IBinder, param1: string);
							public asBinder(): globalAndroid.os.IBinder;
						}
					}
				}
			}
		}
	}
}

declare module com {
	export module google {
		export module android {
			export module gms {
				export module internal {
					export module play_billing {
						export class zzf {
							public static class: java.lang.Class<com.google.android.gms.internal.play_billing.zzf>;
							/**
							 * Constructs a new instance of the com.google.android.gms.internal.play_billing.zzf interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
							 */
							public constructor(implementation: {
							});
							public constructor();
						}
					}
				}
			}
		}
	}
}

declare module com {
	export module google {
		export module android {
			export module gms {
				export module internal {
					export module play_billing {
						export class zzg {
							public static class: java.lang.Class<com.google.android.gms.internal.play_billing.zzg>;
						}
					}
				}
			}
		}
	}
}

//Generics information:

