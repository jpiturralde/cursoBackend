export default class ShoppingCartsService {
    #shoppingCarts
    #products

    constructor(shoppingCarts, products) {
        this.#shoppingCarts = shoppingCarts
        this.#products = products
    }

    async #getShoppingCart(id) {
        const shoppingCart = await this.#shoppingCarts.getById(id)
        if (!shoppingCart) {
            throw Error("Shopping Cart not found")
        }
        return shoppingCart
    }

    async getItems(id) {
        return await this.#getShoppingCart(id)
    }

    async addItem(id, item) {
        //TODO Validar si el producto existe en la colección de productos
        const shoppingCart = await this.#getShoppingCart(id)
        const index = shoppingCart.items.findIndex(x => x.productId == item.productId)
        let result = item
        if (index > -1) {
            shoppingCart.items[index].quantity += item.quantity
            result = shoppingCart.items[index]
        }
        else {
            shoppingCart.items.push(item)
        }
        await this.#shoppingCarts.put(id, shoppingCart)
        return result
    }

    async deleteItem(id, productId) {
        const shoppingCart = await this.#getShoppingCart(id)
        const newContent = shoppingCart.items.filter(x => x.productId!=productId)
        if (newContent.length < shoppingCart.items.length) {
            shoppingCart.items = newContent
            await this.#shoppingCarts.put(id, shoppingCart)
        }
    }

    async getById(id) {
        const shoppingCart = await this.#shoppingCarts.getById(id)
    }
}