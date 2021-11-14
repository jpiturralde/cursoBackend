import Dao from './Dao.js'

export default class ShoppingCartsDao extends Dao {

    constructor(repo) {
        super(repo)
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

    schemaErrors(data) {
        const errors = this.schemaValidations(data)

        if (errors.length > 0) {
            throw new Error(errors)
        }
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

    // async post(data) { 
    //     this.schemaErrors(data)

    //     const items = { items: [] }

    //     if (!data.items) {
    //         return super.post(items)
    //     }

    //     return super.post(data)
    // }

    async post(data) {
        if (!('items' in data)) {
            data.items = []
        }
        return super.post(data)
    }

}
