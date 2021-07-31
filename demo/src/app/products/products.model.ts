import { InAppProduct } from 'nativescript-in-app-purchase'
export interface ProductItemMap {
    [key: string]: ProductItem
}
export interface ProductItem {
    id: string
    product: InAppProduct
    options: ProductID
    /**
     * The amount how often this product has been purchased.<br/>
     * Will be and remain one if the product is not cosumable and has been bought once.<br/>
     * Will incread for consumable products that get bought.
     */
    purchased?: number
}
/**
 * The product listings
 */
export interface ProductIDListings {
    /** the product-id */
    [key: string]: ProductID
}
/**
 * Representation of on product
 */
export interface ProductID {
    /** the product-id */
    id: string
    /** set wheter the item is comsumable or one time buy */
    consumable: boolean
    /** any info about the product item */
    description?: string
}

export interface PurchaseItem {
    productId: string
    purchaseId: string
    purchaseTime: number
    product?: InAppProduct
    options?: ProductID
}

export interface PurchasedProductsMap {
    [key: string]: PurchaseItem[]
}