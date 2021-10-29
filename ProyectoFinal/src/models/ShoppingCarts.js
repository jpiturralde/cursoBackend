/*
 5. El CARRITO de compras tendrá la siguiente estructura:
    id, timestamp(carrito), producto: { id, timestamp(producto), nombre, descripcion, código, foto (url), precio, stock }
*/
import Repository from "./Repository.js"
import FileSystemContainer from "./FileSystemContainer.js"

export default class ShoppingCarts extends Repository {
    constructor(repoURI) {
        if (repoURI) {
            super(new FileSystemContainer(repoURI))
        }
        else {
            super()
        }
    }

    validateItem(item) {
        const errors = []
        if (!item.productId) {
            errors.push('ShoppingCartItem: Falta campo productId')
        }
        else if (isNaN(parseInt(item.productId))) {
            errors.push('ShoppingCartItem: Campo productId invalido.')
        }
        if (!item.quantity) {
            errors.push('ShoppingCartItem: Falta campo quantity')
        }
        else if (isNaN(parseInt(item.quantity))) {
            errors.push('ShoppingCartItem: Campo quantity invalido.')
        }
        return errors
    }

    schemaValidations(data) {
        let errors = []

        if (data.items) {
            if (!Array.isArray(data.items)) {
                errors.push('ShoppingCart: Campo items debe ser una colección.')
            }
            else {
                errors = data.items.flatMap(x => this.validateItem(x))
            }
        }
        return errors
    }

    async post(data) { 
        this.schemaErrors(data)

        const items = { items: [] }

        if (!data.items) {
            return super.post(items)
        }

        return super.post(data)
    }

    put(id, data) { 
        this.schemaErrors(data)

        return super.put(id, data)
    }

}