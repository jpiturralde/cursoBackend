export default class Dao {
    #repo
    
    constructor(repo) {
        this.#repo = repo
    }

    async post(data) { return this.#repo.post(data) }

    async put(id, data) { return this.#repo.put(id, data) }

    async getAll() { return this.#repo.getAll() }

    async getById(id) { return this.#repo.getById(id) }

    async deleteAll()  { return this.#repo.deleteAll() }

    async deleteById(id)  { return this.#repo.deleteById(id) }

}