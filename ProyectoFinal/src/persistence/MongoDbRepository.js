import { MongoClient } from 'mongodb'

export default class MongoDbRepository {
    #client
    #db
    #collection
    #container

    constructor(uri, db, collection) {
        try {
            this.#client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        }
        catch (error) {
            console.error(error)
            throw(error)
        }
        this.#db = db
        this.#collection = collection
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
            merged.id = id
            merged.timestamp = originalTimestamp
            await this.#container.updateOne({id}, {"$set": merged})
            return merged
        }
        return null
    }

    async getAll() {
        return await this.#container.find().toArray()
    }

    async getById(id) {
        const result = await this.#container.find({id}).toArray()
        return result[0]
    }

    async deleteAll() {
        await this.#container.deleteMany({})
    }

    async deleteById(id) {
        await this.#container.deleteOne({id})
    }
}
