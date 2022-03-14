import ShoppingCartsDao from './ShoppingCartsDao.js'

export default class OrdersDao extends ShoppingCartsDao {
    #repo

    constructor(repo) {
        super(repo)
        this.#repo = repo
    }

    schemaValidations(data) {
        let errors = []
        const { email, items, shippingAddress } = data
        
        if (!email) {
            errors.push('Falta campo email')
        }
        else if (!super.validateEmail(email)) {
            errors.push('El formato del campo email es invalido.')
        }
        if (!items) {
            errors.push('Falta campo items')
        }
        else if (!Array.isArray(items)) {
            errors.push('Campo items debe ser una colección.')
        }
        else if (items.lenght == 0) {
            errors.push('La orden debe tener al menos un item')
        } 
        else {
            errors = data.items.flatMap(x => super.validateItem(x))
        }
        if (!shippingAddress || shippingAddress == '') {
            errors.push('Falta campo shippingAddress')
        }
        return errors
    }

    async post(data) {
        if (!('status' in data)) {
            data.status = 'generada'
        }
        return super.post(data)
    }

    async getByEmail(email) {
        return await this.#repo.getBy( { email } )
    }
}
