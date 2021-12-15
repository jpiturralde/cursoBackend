export default class Dao {
    #repo
    
    static #uid() {
        const head = Date.now().toString(36);
        const tail = Math.random().toString(36).substr(2);
        return head + tail;
    }

    static createPayload(object) {
        const payload = {
            id: object.id || Dao.#uid(), 
            timestamp: Date.now(), 
            ...object
        }
        return payload
    }

    constructor(repo) {
        this.#repo = repo
        console.log('Dao', this.#repo)
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
        
        return this.#repo.post(Dao.createPayload(data)) 
    }

    async put(id, data) { 
        this.schemaErrors(data)

        return this.#repo.put(id, data)
    }

    async getAll() { return this.#repo.getAll() }

    async getById(id) {
        return this.#repo.getById(id) 
    }

    async deleteAll()  { return this.#repo.deleteAll() }

    async deleteById(id)  { return this.#repo.deleteById(id) }

}