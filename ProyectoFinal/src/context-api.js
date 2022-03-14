// AUTHENTICATION CONFIG
import { InfoAPI, ProductsAPI, MessagesAPI, ShoppingCartsAPI, OrdersAPI } from './api/index.js'

export async function loadApiContext() {
    const { productsDS, messagesDS, shoppingCartsDS, shoppingCartsByUserDS, ordersDS} = process.context.persistence
    return {
        info: InfoAPI,
        products: ProductsAPI(productsDS),
        messages: MessagesAPI(messagesDS),
        shoppingCarts: ShoppingCartsAPI(shoppingCartsDS, shoppingCartsByUserDS),
        orders: OrdersAPI(ordersDS)
    }
}
