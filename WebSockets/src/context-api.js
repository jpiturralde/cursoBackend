// AUTHENTICATION CONFIG
import { InfoAPI, ProductsAPI, MessagesAPI, ShoppingCartsAPI } from './api/index.js'

export async function loadApiContext() {
    const { productsDS, messagesDS, shoppingCartsDS} = process.context.persistence
    return {
        info: InfoAPI,
        products: ProductsAPI(productsDS),
        messages: MessagesAPI(messagesDS),
        shoppingCarts: ShoppingCartsAPI(shoppingCartsDS, productsDS)
    }
}
