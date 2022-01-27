// AUTHENTICATION CONFIG
import { InfoAPI, ProductsAPI, MessagesAPI } from './api/index.js'

export async function loadApiContext() {
    return {
        info: InfoAPI,
        products: ProductsAPI(process.context.persistence.productsDS),
        messages: MessagesAPI(process.context.persistence.messagesDS)
    }
}
