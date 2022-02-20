import Dao from './Dao.js'

export default class ShoppingCartsByUserDao extends Dao {
    #repo

    constructor(repo) {
        super(repo)
        this.#repo = repo
    }

    schemaErrors(data) {
        const errors = this.schemaValidations(data)

        if (errors.length > 0) {
            throw new Error(errors)
        }
    }

    schemaValidations(data) {
        let errors = []

        if (!data.shoppingCartId) {
            errors.push('ShoppingCartByUser: Falta campo shoppingCartId')
        }
        if (!data.userId) {
            errors.push('ShoppingCartByUser: Falta campo userId')
        }

        return errors
    }

    async getByUser(userId) {
        const result = await this.#repo.getBy( { userId } )
        if (result && result.length > 0) {
            return result[0]
        }
        return null
    }
}
