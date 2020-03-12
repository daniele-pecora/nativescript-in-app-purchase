import { Component, OnDestroy, OnInit, AfterViewInit, NgZone } from '@angular/core';
import { InAppOrderResult, InAppPurchaseManager, InAppPurchaseResultCode, InAppPurchaseStateUpdateListener, InAppPurchaseTransactionState, InAppPurchaseType, InAppProduct } from 'nativescript-in-app-purchase';
import { from, Subscription } from 'rxjs';
import { confirm, ConfirmOptions } from "tns-core-modules/ui/dialogs";
import { ProductItem, ProductItemMap, PurchaseItem, PurchasedProductsMap } from './products.model';
import { ProductsService } from '../products.service';
import { map, flatMap, concatMap } from 'rxjs/operators';

export abstract class ProductsComponentBase implements OnInit, AfterViewInit, OnDestroy {

  productItemsMap: ProductItemMap
  purchasedProductsMap: PurchasedProductsMap

  loading: boolean
  loadingMessage: string
  restoring: boolean

  sub_loading: Subscription
  sub_restoring: Subscription

  inAppPurchaseStateUpdateListener: InAppPurchaseStateUpdateListener

  constructor(private ngZone: NgZone, protected productsService: ProductsService) { }

  ngOnInit() {

  }

  ngAfterViewInit(): void {
    this._init()
  }

  private _init() {
    this.inAppPurchaseStateUpdateListener = {
      onUpdate: (purchaseTransactionState: InAppPurchaseTransactionState) => {
        console.log(purchaseTransactionState)
        alert('Purchase update:\n' + JSON.stringify(purchaseTransactionState, null, 2))
        from(InAppPurchaseManager.bootStrapInstance(this.inAppPurchaseStateUpdateListener))
          .subscribe((purchaseManager: InAppPurchaseManager) => {
            this.confirmPurchaseTransaction(purchaseTransactionState, purchaseManager)
            if (purchaseTransactionState.resultCode === InAppPurchaseResultCode.Purchased) {

            }
          })
      },
      onUpdateHistory: (purchaseTransactionState: InAppPurchaseTransactionState) => {
        console.log('Restored item:', purchaseTransactionState.productIdentifier, purchaseTransactionState)
        if (InAppPurchaseResultCode.Restored == purchaseTransactionState.resultCode
          || InAppPurchaseResultCode.Purchased == purchaseTransactionState.resultCode
        ) {
          // update product 'owned' state
          this.productItemsMap = this.productItemsMap || {} as ProductItemMap
          const product = this.productItemsMap[purchaseTransactionState.productIdentifier]
          // console.log('Find restored product from identifier', `this.productItemsMap[${purchaseTransactionState.productIdentifier}], found:`, product, 'in', this.productItemsMap)
          if (product) {
            product.purchased = (product.purchased || 0) + 1
          }
          const purchaseItem: PurchaseItem = {
            productId: purchaseTransactionState.productIdentifier,
            purchaseId: purchaseTransactionState.purchaseId,
            purchaseTime: purchaseTransactionState.purchaseTime,
            product: product ? product.product : null,
            options: product ? product.options : null
          }

          /** only if not already present */
          if (this.updatePurchasedMap(purchaseItem)) {
            /** notify listener */
            this.loadingRestoredProductDone(purchaseItem)
          }
        }
      }
    }
  }

  updatePurchasedMap(purchaseItem: PurchaseItem): PurchaseItem {
    this.purchasedProductsMap = this.purchasedProductsMap || {}
    this.purchasedProductsMap[purchaseItem.productId] = this.purchasedProductsMap[purchaseItem.productId] || []
    const found = this.purchasedProductsMap[purchaseItem.productId].filter(item => item.productId === purchaseItem.productId)
    if (!(found || []).length) {
      this.purchasedProductsMap[purchaseItem.productId].push(purchaseItem)
      return purchaseItem
    }
    return null
  }

  private __updateStateLoading(active: boolean) {
    this.loading = active
  }

  private __updateStateRestore(active: boolean) {
    // ngZone is required for iOS only
    this.ngZone.run(() => {
      this.restoring = active
    })
  }

  /**
   * 
   * @param event 
   * @param type Either 'InAppPurchase' (default) or 'Subscription'.
   * @param force Force reloading even if a request is ongoing.<br/>
   *              Without `force` a running request would be stopped.<br/>
   */
  toggleLoadingProducts(type?: InAppPurchaseType, force?: boolean) {
    let _inAppPurchaseType = type === InAppPurchaseType.Subscription ? InAppPurchaseType.Subscription : InAppPurchaseType.InAppPurchase
    if (force && this.loading) {
      console.log('toggleLoadingProducts(event)', 'force stop loading...')
      this.unsubscribeLoadingProducts()
    }
    if (this.loading) {
      console.log('toggleLoadingProducts(event)', 'stop loading...')
      this.unsubscribeLoadingProducts()
    } else {
      console.log('toggleLoadingProducts(event)', 'loading products...')
      this.__updateStateLoading(true)
      this.loadingMessage = null

      this.sub_loading = this.productsService.loadingProductItems(_inAppPurchaseType, this.inAppPurchaseStateUpdateListener)
        .subscribe((products) => {
          this.addProducts(products)
          this.__updateStateLoading(false)
          this.loadingProductsDone(_inAppPurchaseType, products)
        },
          (error) => {
            console.error('toggleLoadingProducts - loadingProductsByProductIds', error)
            this.__updateStateLoading(false)
            this.loadingMessage = error
            /** notify listener */
            this.loadingProductsError(_inAppPurchaseType, error)
          },
          () => { this.__updateStateLoading(false) })
    }
  }

  private addProducts(productItems: ProductItem[]) {
    this.productItemsMap = this.productItemsMap || {} as ProductItemMap
    (productItems || []).map(item => this.productItemsMap[item.id] = item)
  }

  protected abstract loadingProductsDone(type: InAppPurchaseType, productItems: ProductItem[])
  protected abstract loadingProductsError(type: InAppPurchaseType, error: any)
  protected abstract loadingRestoredProduct()
  protected abstract loadingRestoredProductDone(purchaseItem: PurchaseItem)

  confirmBuy(productItem: ProductItem) {
    const options: ConfirmOptions = {
      title: 'Confirm buy',
      message: 'Are you sure you want to buy this product?',
      okButtonText: 'Yes',
      cancelButtonText: 'No',
      neutralButtonText: 'Cancel',
      cancelable: true
    } as ConfirmOptions

    confirm(options).then((confirmed) => {
      if (confirmed) {
        this.productsService.orderProduct(productItem, this.inAppPurchaseStateUpdateListener)
          .subscribe((result: InAppOrderResult) => {
            console.log('confirmBuy - order:', result)
            if (!result.success) {
              alert('Failed to buy\n' + JSON.stringify(result, null, 2))
            }
          }, (error) => {
            console.error('confirmBuy - order:', error)
            alert('Error buying:\n' + error)
          }, () => { })
      }
    })
  }

  private confirmPurchaseTransaction(purchaseTransactionState: InAppPurchaseTransactionState, purchaseManager: InAppPurchaseManager) {
    if (purchaseTransactionState.resultCode === InAppPurchaseResultCode.Purchased) {
      const _confirmOrder = (purchaseManager: InAppPurchaseManager, purchaseTransactionState: InAppPurchaseTransactionState, productItem: ProductItem) => {
        const consumable: boolean = productItem.options.consumable
        purchaseManager.orderConfirm(purchaseTransactionState, consumable)
          .then((result) => {
            if (!result.success) {
              console.log('Couldn\'t confirm product with id:', productItem.id, result)
              alert('Couldn\'t confirm product with id:' + productItem.id + '\n' + JSON.stringify(result, null, 2))
            }
          })
          .catch((error) => {
            console.error('Error confirming product with id:', productItem.id, error)
            alert('Error confirming product with id:\n' + productItem.id + '\n' + error)
          })
      }

      if (this.productItemsMap)
        if (this.productItemsMap[purchaseTransactionState.productIdentifier]) {
          _confirmOrder(purchaseManager, purchaseTransactionState, this.productItemsMap[purchaseTransactionState.productIdentifier])
        } else {
          console.log('Can\'t find product with id:', purchaseTransactionState.productIdentifier)
          console.log('Reload product with id:', purchaseTransactionState.productIdentifier)
          purchaseManager.list([purchaseTransactionState.productIdentifier])
            .then((result) => {
              const inAppProducts = result.products
              if ((inAppProducts || []).length) {
                // add into product item list
                const productItem: ProductItem = {
                  id: inAppProducts[0].productId,
                  product: inAppProducts[0],
                  options: this.productsService.productDefinitions[inAppProducts[0].productId]
                }
                this.addProducts([productItem])
                _confirmOrder(purchaseManager, purchaseTransactionState, productItem)
              } else {
                console.log('Can\'t find and load product with id:', purchaseTransactionState.productIdentifier)
                alert('Can\'t find and load product with id:\n' + purchaseTransactionState.productIdentifier)
              }
            })
            .catch((error) => {
              console.error('Error confirming product with id:', purchaseTransactionState.productIdentifier, error)
              alert('Error confirming product with id:\n' + purchaseTransactionState.productIdentifier + '\n' + error)
            });
        }
    }
  }

  restoreProducts() {
    /** notify listener */
    this.loadingRestoredProduct()
    if (this.restoring) {
      this.unsubscribeRestoringProducts()
    } else {
      this.__updateStateRestore(true)

      this.unsubscribeLoadingProducts()

      this.sub_loading =
        // 1. Load product IDs
        this.productsService.loadingProductItems(InAppPurchaseType.InAppPurchase, this.inAppPurchaseStateUpdateListener)
          // 2. Load products of type 'In App Purchase' and 'Subscription'
          .pipe(concatMap((productItems_inApp) => this.productsService.loadingProductItems(InAppPurchaseType.Subscription, this.inAppPurchaseStateUpdateListener),
            (productItems_inApp, productItems_sub) => {
              const all: ProductItem[] = []
                .concat(productItems_inApp)
                .concat(productItems_sub)

              this.addProducts(productItems_inApp)
              /** notify listener */
              this.loadingProductsDone(InAppPurchaseType.InAppPurchase, productItems_inApp)

              this.addProducts(productItems_sub)
              /** notify listener */
              this.loadingProductsDone(InAppPurchaseType.Subscription, productItems_sub)
              return all
            }))
          // 3. Notify listener for every product
          .subscribe(all => {
            this.sub_restoring = this.productsService.restoreProducts(this.inAppPurchaseStateUpdateListener)
              .subscribe((result) => {
                this.__updateStateRestore(false)
              }, (error) => {
                this.__updateStateRestore(false)
                console.error('restoreProducts - ERROR ', error)
                alert('Failed restoring products/n' + error)
              }, () => {
                this.__updateStateRestore(false)
              })
          }, (error) => {
            this.__updateStateRestore(false)
            console.error('loadingProductItems - ERROR ', error)
            alert('Failed loading products/n' + error)
          }, () => {
            this.__updateStateRestore(false)
          })
    }
  }

  getProductDefinitions() {
    return this.productsService.productDefinitions
  }

  unsubscribeRestoringProducts() {
    if (this.sub_restoring) {
      this.sub_restoring.unsubscribe()
      this.sub_restoring = null
    }
    this.restoring = false
    this.__updateStateRestore(false)
  }

  unsubscribeLoadingProducts() {
    if (this.sub_loading) {
      this.sub_loading.unsubscribe()
      this.sub_loading = null
    }
    this.loading = false
    this.loadingMessage = null
    this.__updateStateLoading(false)
  }

  ngOnDestroy(): void {
    this.unsubscribeLoadingProducts()
    this.unsubscribeRestoringProducts()
    this.productsService.ngOnDestroy()
  }

}