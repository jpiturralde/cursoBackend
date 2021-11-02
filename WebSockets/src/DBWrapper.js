class DBWrapper {
    #db

    constructor(db) {
        this.#db = db
    }

    #wrap(e) {
        if (e.msg) {
            e.text = e.msg
            delete e.msg
        }
        return {value: e}
    }

    async get() {
        return (await this.#db.getAll()).map(e => this.#wrap(e))
    }

    async post(data) {
        if (data.text) {
            data.msg = data.text
            delete data.text
        }
        return await this.#db.post(data)
    }
}

module.exports = DBWrapper

