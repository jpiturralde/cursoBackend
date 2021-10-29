/*
 4. Un PRODUCTO dispondrá de los siguientes campos: 
	id, timestamp, nombre, descripcion, código, foto (url), precio, stock.
*/
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

        const content = await super.getAll()
        const exists = content.filter(x => x.code == data.code)
        if (exists.length > 0) {
            return exists[0]
        }

        return super.post(data)
    }

    put(id, data) { 
        this.schemaErrors(data)

        return super.put(id, data)
    }

}