import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { InAppOrderResult, InAppProduct, InAppPurchaseManager, InAppPurchaseStateUpdateListener, InAppPurchaseType, InAppOrderHistoryResult, InAppListProductsResult } from 'nativescript-in-app-purchase';
import { from, Observable, Subscription } from 'rxjs';
import { flatMap, map } from 'rxjs/operators';
import { ProductID, ProductIDListings, ProductItem } from './products/products.model';
import { URL_PRODUCTS } from '~/settings/settings';

@Injectable()
export class ProductsService implements OnDestroy {
    productIDsUrl = URL_PRODUCTS

    _productDefinitions: ProductIDListings
    get productDefinitions(): ProductIDListings { return this._productDefinitions || {} }
    set productDefinitions(value: ProductIDListings) { this._productDefinitions = value }

    sub_loadProductIDs: Subscription

    constructor(private httpClient: HttpClient) { }

    loadingProductItems(selectedProductType: InAppPurchaseType, inAppPurchaseStateUpdateListener: InAppPurchaseStateUpdateListener): Observable<ProductItem[]> {
        console.log('loadingProductItems(...)', selectedProductType)
        return this.loadProductIDs()
            .pipe(map(productIds => productIds))
            .pipe(flatMap(productIds => this.loadingProductsByProductIds(productIds, selectedProductType, inAppPurchaseStateUpdateListener),
                (productIds, result) => {
                    if (!result.success) {
                        throw result
                    }
                    const products = result.products
                    const productItems: ProductItem[] = []
                    for (const inAppProduct of products) {
                        productItems.push({
                            id: inAppProduct.productId,
                            product: inAppProduct,
                            options: productIds[inAppProduct.productId]
                        })
                    }
                    return productItems
                }
            ))
    }

    orderProduct(productItem: ProductItem, inAppPurchaseStateUpdateListener: InAppPurchaseStateUpdateListener): Observable<InAppOrderResult> {
        return from(InAppPurchaseManager.bootStrapInstance(inAppPurchaseStateUpdateListener))
            .pipe(flatMap(purchaseManager => from(purchaseManager.order(productItem.product))))
    }

    loadingProductsByProductIds(productIds: ProductIDListings, productType: InAppPurchaseType, inAppPurchaseStateUpdateListener: InAppPurchaseStateUpdateListener): Observable<InAppListProductsResult> {
        console.log('loadingProductsByProductIds(...)', productIds)
        return new Observable<InAppListProductsResult>(observer => {
            InAppPurchaseManager.bootStrapInstance(inAppPurchaseStateUpdateListener)
                .then(purchaseManager => {
                    purchaseManager
                        .list(Object.keys(productIds), productType)
                        .then(result => {
                            console.log('loadingProductsByProductIds(...) - result', result, 'for ids', productIds)
                            observer.next(result)
                        }).catch(reason => {
                            observer.error(reason)
                        })
                }).catch(reason => {
                    observer.error(reason)
                })
        })
    }

    loadProductIDs(): Observable<ProductIDListings> {
        return new Observable<ProductIDListings>(observer => {
            this.sub_loadProductIDs = this.httpClient.get(this.productIDsUrl)
                .subscribe((result) => {
                    const productDefinitions = Array.isArray(result) ? convert_prod_ids_to_map(result as ProductID[]) : result as ProductIDListings
                    console.log('loadProducts(...) - httpClient.get result:', result)
                    observer.next(this.getDefaultProdIsIfNecessary(productDefinitions))
                }, (error) => {
                    console.error('loadProducts(...) - httpClient.get', error)
                    observer.next(this.getDefaultProdIsIfNecessary())
                })
        })
    }

    restoreProducts(inAppPurchaseStateUpdateListener: InAppPurchaseStateUpdateListener): Observable<InAppOrderHistoryResult> {
        return from(InAppPurchaseManager.bootStrapInstance(inAppPurchaseStateUpdateListener))
            .pipe(flatMap(purchaseManager => from(purchaseManager.purchaseHistory())))
    }

    private getDefaultProdIsIfNecessary(productDefinitions?: ProductIDListings): ProductIDListings {
        if (!productDefinitions) {
            return this._productDefinitions = defaultProductDefinitions
        }
        return this._productDefinitions = productDefinitions
    }

    ngOnDestroy(): void {
        if (this.sub_loadProductIDs) {
            this.sub_loadProductIDs.unsubscribe()
            this.sub_loadProductIDs = null
        }
    }

}

/* --- test --- */
const testProducts_google_play: ProductID[] = [{
    "id": "android.test.purchased",
    "consumable": false
}, {
    "id": "android.test.canceled",
    "consumable": false
}, {
    "id": "android.test.item_unavailable",
    "consumable": false
}]
const convert_prod_ids_to_map = (prod_ids: ProductID[]) => {
    const prod_ids_map: ProductIDListings = {}
    prod_ids.forEach(item => { prod_ids_map[item.id] = item })
    return prod_ids_map
}
const defaultProductDefinitions: ProductIDListings = convert_prod_ids_to_map(testProducts_google_play)