import { ENTITY_NOT_FOUND_ERROR_MSG } from "../lib/index.js"

export default class ShoppingCartsService {
    #shoppingCarts
    #db

    constructor(db) {
        this.#db = db
        this.#shoppingCarts = db['shoppingCarts']
    }

    async #find(id) {
        const shoppingCart = await this.#db['shoppingCarts'].getById(id)
        if (!shoppingCart) {
            throw Error(JSON.stringify(ENTITY_NOT_FOUND_ERROR_MSG(`Shopping Cart ${id} no encontrado.`)))
        }
        return shoppingCart
    }

    async getItems(id) {
        return await this.#find(id)
    }

    async addItem(id, item) {
        const shoppingCart = await this.#find(id)
        const index = shoppingCart.items.findIndex(x => x.productId == item.productId)
        let result = item
        if (index > -1) {
            shoppingCart.items[index].quantity += item.quantity
            result = shoppingCart.items[index]
        }
        else {
            const product = await this.#db['products'].getById(item.productId)
            if (!product) {
                throw Error(JSON.stringify(ENTITY_NOT_FOUND_ERROR_MSG(`Producto ${item.productId} no encontrado.`)))
            }
            shoppingCart.items.push(item)
        }
        await this.#db['shoppingCarts'].put(id, shoppingCart)
        return result
    }

    async deleteItem(id, productId) {
        const shoppingCart = await this.#find(id)
        const newContent = shoppingCart.items.filter(x => x.productId!=productId)
        if (newContent.length < shoppingCart.items.length) {
            shoppingCart.items = newContent
            await this.#db['shoppingCarts'].put(id, shoppingCart)
        }
    }

    async getById(id) {
        const shoppingCart = await this.#db['shoppingCarts'].getById(id)
    }
}