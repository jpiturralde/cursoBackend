import Dao from './Dao.js'

export default class ProductsDao extends Dao {
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
        const errors = []
        if (!data.name) {
            errors.push('Producto: Falta campo name')
        }
        if (!data.code) {
            errors.push('Producto: Falta campo code')
        }
        if (isNaN(parseInt(data.price)) || data.price < 0) {
            errors.push('Producto: Campo price inválido')
        }
        if (isNaN(parseInt(data.stock)) || data.stock < 0) {
            errors.push('Producto: Campo stock inválido')
        }
        return errors
    }

    async post(data) { 
        this.schemaErrors(data)

        const content = await this.#repo.getAll()
        const exists = content.filter(x => x.code == data.code)
        if (exists.length > 0) {
            return exists[0]
        }

        return super.post(data)
    }

    async put(id, data) {
        this.schemaErrors(data)

        const response = await super.put(id, data)
        
        return response
    }

}
