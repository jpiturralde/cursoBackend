import { MongoClient } from 'mongodb'

export default class MongoDbRepository {
    #client
    #db
    #collection
    #container

    static createPayload(id, object) {
        const payload = {
            id, 
            timestamp: Date.now(), 
            ...object
        }
        payload.timestamp = Date.now()
        return payload
    }

    static getPayload(data) { return data.payload }

    static uid() {
        const head = Date.now().toString(36);
        const tail = Math.random().toString(36).substr(2);
        return head + tail;
    }

    constructor(uri, db, collection) {
        this.#client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        this.#db = db
        this.#collection = collection
    }

    async init() {
        await this.#client.connect()
        this.#container = this.#client.db(this.#db).collection(this.#collection)
    }

    async post(object) {
        const payload = MongoDbRepository.createPayload(MongoDbRepository.uid(), object)
        await this.#container.insertOne(payload)
        return payload
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
