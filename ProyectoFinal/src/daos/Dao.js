export default class Dao {
    #repo
    
    constructor(repo) {
        this.#repo = repo
    }

    schemaValidations(data) {
        return []
    }

    schemaErrors(data) {
        const errors = this.schemaValidations(data)

        if (errors.length > 0) {
            throw new Error(errors)
        }
    }

    async post(data) { 
        this.schemaErrors(data)
        
        return this.#repo.post(data) 
    }

    async put(id, data) { 
        this.schemaErrors(data)

        return this.#repo.put(id, data)
    }

    async getAll() { return this.#repo.getAll() }

    async getById(id) { return this.#repo.getById(id) }

    async deleteAll()  { return this.#repo.deleteAll() }

    async deleteById(id)  { return this.#repo.deleteById(id) }

}