import Repository from "./Repository.js"
import FileSystemContainer from "./FileSystemContainer.js"

export default class Products extends Repository {
    constructor(repoURI) {
        if (repoURI) {
            super(new FileSystemContainer(repoURI))
        }
        else {
            super()
        }
    }

    #schemaValidations(data) {
        if (!data.title) {
            throw new Error('Producto: Falta campo title')
        }
        if (!data.code) {
            throw new Error('Producto: Falta campo code')
        }
        if (isNaN(data.price) || data.price < 0) {
            throw new Error('Producto: Campo price inválido')
        }
        if (isNaN(data.stock) || data.stock < 0) {
            throw new Error('Producto: Campo stock inválido')
        }
    }

    async post(data) { 
        this.#schemaValidations(data)

        const content = await super.getAll()
        const exists = content.filter(x => x.title == data.title)
        console.log('exists=', exists)
        if (exists.length > 0) {
            return exists[0]
        }

        return super.post(data)
    }

    put(id, data) { 
        this.#schemaValidations(data)

        return super.put(id, data)
    }

}