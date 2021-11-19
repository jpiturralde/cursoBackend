export default class InMemoryRepository {
    #container = []
    #id = 1
    
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

    schemaValidations(data) {
        return []
    }

    schemaErrors(data) {
        const errors = this.schemaValidations(data)

        if (errors.length > 0) {
            throw new Error(errors)
        }
    }

    constructor() {
    }

    async post(object) {
        const payload = InMemoryRepository.createPayload(this.#id, object)
        this.#id = Math.max(this.#id, payload.id)+1
        this.#container.push({ id: payload.id, payload })
        return payload
    }
    
    async getAll() {
        const result = this.#container.map(x => InMemoryRepository.getPayload(x))
        return result
    }

    async getById(id) {
        const result = this.#container.filter(x => x.id==id) 
        if (result.length > 0) {
            return InMemoryRepository.getPayload(result[0])
        }
        return null
    }

    async put(id, data) {
        const index = this.#container.findIndex(x => x.id==id) 
        if ( index > -1) {
            const originalTimestamp = this.#container[index].payload.timestamp
            const mergedPayload = { ...this.#container[index].payload, ...data }
            mergedPayload.id = id
            mergedPayload.timestamp = originalTimestamp
            this.#container[index].payload = mergedPayload
            return mergedPayload
        }
        return null
    }

    async deleteAll() {
        this.#container = []
    }

    async deleteById(id) {
        if (await this.getById(id) != null) {
            const newContent = this.#container.filter(x => x.id!=id)
            this.#container = newContent
        }
    }

}