export default class ShoppingCartsDao {
    #repo

    constructor(repo) {
        this.#repo = repo
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

    async post(data) { 
        this.schemaErrors(data)

        const items = { items: [] }

        if (!data.items) {
            return this.#repo.post(items)
        }

        return this.#repo.post(data)
    }

    async put(id, data) { 
        this.schemaErrors(data)

        return this.#repo.put(id, data)
    }

    async getAll() { return this.#repo.getAll() }

    async getById(id) { 
        console.log('ShoppingCartsDao.getById ', id)
        return this.#repo.getById(id) 
    }

    async deleteAll()  { return this.#repo.deleteAll() }

    async deleteById(id)  { return this.#repo.deleteById(id) }
}
