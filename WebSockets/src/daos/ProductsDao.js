import Dao from './Dao.js'

export default class ProductsDao extends Dao {
    #repo

    constructor(repo) {
        super(repo)
        this.#repo = repo
    }

    #wrap(e) {
        if (e.msg) {
            e.text = e.msg
            delete e.msg
        }
        return {value: e}
    }

    async get() {
        return (await this.#repo.getAll()).map(e => this.#wrap(e))
    }

    async post(data) {
        if (data.text) {
            data.msg = data.text
            delete data.text
        }
        return await this.#repo.post(data)
    }
}
