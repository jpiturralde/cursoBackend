import { MongoClient } from 'mongodb'

export default class MongoDbRepository {
    #client
    #db
    #collection
    #container
    #fieldKey

    static #index(key, value) {
        let index = {}
        index[key] = value
        return index
    }

    constructor(uri, db, collection, fieldKey = 'id') {
        try {
            this.#client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        }
        catch (error) {
            console.error(error)
            throw(error)
        }
        this.#db = db
        this.#collection = collection
        this.#fieldKey = fieldKey
    }

    async init() {
        try {
            await this.#client.connect()
        }
        catch (error) {
            console.error(error)
            throw(error)
        }
        this.#container = this.#client.db(this.#db).collection(this.#collection)
    }

    async post(object) {
        await this.#container.insertOne(object)
        return object
    }

    async put(id, data) {
        const current = await this.getById(id)
        if (current) {
            const originalTimestamp = current.timestamp
            const merged = { ...current, ...data }
            merged[this.#fieldKey] = id
            merged.timestamp = originalTimestamp
            await this.#container.updateOne(MongoDbRepository.#index(this.#fieldKey, id), {"$set": merged})
            return merged
        }
        return null
    }

    async getAll() {
        return await this.#container.find().toArray()
    }

    async getById(id) {
        const result = await this.#container.find(MongoDbRepository.#index(this.#fieldKey, id)).toArray()
        return result[0]
    }

    async getBy(query, options = {}) {
        const result = await this.#container.find(query, options)
        if (await result.count === 0) {
            return []
        }
        return await result.toArray()
    }

    async deleteAll() {
        await this.#container.deleteMany({})
    }

    async deleteById(id) {
        await this.#container.deleteOne(MongoDbRepository.#index(this.#fieldKey, id))
    }
}
