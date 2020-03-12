import { Component, ViewChild, ElementRef } from '@angular/core';
import { InAppPurchaseType } from 'nativescript-in-app-purchase';
import { ProductsService } from '../products.service';
import { ProductsComponentBase } from '../products/products.component-base';
import { ProductItem, PurchaseItem } from '../products/products.model';
import { BottomNavigation, TabStrip } from 'tns-core-modules/ui'
import * as utils from "tns-core-modules/utils/utils"

@Component({
  selector: 'ns-in-app-products',
  templateUrl: './in-app-products.component.html',
  styleUrls: ['./in-app-products.component.css'],
  providers: [ProductsService]
})
export class InAppProductsComponent extends ProductsComponentBase {

  selectedIndex: number
  productsItems_InAppPurchase: ProductItem[] = null
  productsItems_Subscription: ProductItem[] = null
  purchaseItems_Restored: PurchaseItem[] = null

  productsItems_InAppPurchaseMap: { [key: string]: ProductItem } = {}
  productsItems_SubscriptionMap: { [key: string]: ProductItem } = {}

  @ViewChild('buttomNavigation', { static: false })
  buttomNavigation: ElementRef<BottomNavigation>
  @ViewChild('tabStrip', { static: false })
  tabStrip: ElementRef<TabStrip>

  get purchasedProductsMap_keys() { return Object.keys(this.purchasedProductsMap || {}) }
  get purchasedProductsMap_values() { return Object['values'](this.purchasedProductsMap || {}) }

  openProductIDsUrlInBrowser() {
    utils.openUrl(this.productsService.productIDsUrl)
  }

  protected loadingRestoredProduct() {
    this.purchaseItems_Restored = []
  }

  protected loadingRestoredProductDone(purchaseItem: PurchaseItem) {
    console.log('loadingRestoredProductDone', purchaseItem)
    if (purchaseItem) {
      this.purchaseItems_Restored = this.purchaseItems_Restored || []
      this.purchaseItems_Restored.push(purchaseItem)
    }
  }

  protected loadingProductsDone(type: InAppPurchaseType, productItems: ProductItem[]) {
    console.log('loadingProductsDone', type, 'items:', productItems)
    if (InAppPurchaseType.Subscription === type) {
      this.productsItems_Subscription = [].concat(productItems || [])
      this.productsItems_Subscription.forEach(item => { this.productsItems_SubscriptionMap[item.id] = item })
    } else if (InAppPurchaseType.InAppPurchase === type) {
      this.productsItems_InAppPurchase = [].concat(productItems || [])
      this.productsItems_InAppPurchase.forEach(item => { this.productsItems_InAppPurchaseMap[item.id] = item })
    }
  }

  protected loadingProductsError(type: InAppPurchaseType, error: any) {
    console.error('loadingProductsError', type, 'error:', error)
    if (InAppPurchaseType.Subscription === type) {
      this.productsItems_Subscription = []
    } else if (InAppPurchaseType.InAppPurchase === type) {
      this.productsItems_InAppPurchase = []
    }
    alert('Error loading items:\n' + JSON.stringify(error, null, 2))
  }

  selectedIndexChanged(selectedIndex) {
    setTimeout(
      /** User timeout to prevent: ExpressionChangedAfterItHasBeenCheckedError: Expression has changed after it was checked. */
      () => {
        console.log('selectedIndexChanged', selectedIndex)
        if (0 === selectedIndex) {
          if (null == this.productsItems_InAppPurchase) {
            this.toggleLoadingProducts(InAppPurchaseType.InAppPurchase, true)
          }
        } else if (1 === selectedIndex) {
          if (null == this.productsItems_Subscription) {
            this.toggleLoadingProducts(InAppPurchaseType.Subscription, true)
          }
        } else if (2 === selectedIndex) {
          if (null == this.purchaseItems_Restored) {
            this.restoreProducts()
          }
        }
      })
  }

  doBuyProduct(productItem: ProductItem) {
    if (!productItem.options.consumable && productItem.purchased) {
      alert('Product already purchased.\nProduct is not consumable and cant\'t be bought a second time.')
      return
    }
    this.confirmBuy(productItem)
  }

  tappedOnRestoreEmptyScreen() {
    if (!this.restoring)
      if (this.purchaseItems_Restored) {
        /**
         * Already tried to load restored pruducts but none were returned.
         * So invite the user to buy something.
         */
        this.openShopTab()
      } else {
        /**
         * Load purchased products
         */
        this.restoreProducts()
      }
  }

  openShopTab() {
    /**
     * TODO:
     * On iOS this does only change the tab but not the
     * selected tab-strip-item.
     * This seems like a bug in nativescript's ui widget
     */
    this.buttomNavigation.nativeElement.selectedIndex = 0
  }

  showInfo() {
    alert(`In app purchase testing.
    
To reset values simply navigate back.
    `)
  }

  showInfoPurchased(item){
    alert(`
   ID : ${item.productId}
Price : ${item.product.price}
 Date : ${new Date(item.purchaseTime)}
Order : ${item.purchaseId}
  `)
  }
}
