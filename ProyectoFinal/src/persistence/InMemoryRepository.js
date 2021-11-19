export default class InMemoryRepository {
    #container = []
    #fieldKey
    
    static getPayload(data) { return data.payload }

    constructor(fieldKey = 'id') {
        this.#fieldKey = fieldKey
    }

    async post(object) {
        this.#container.push({ id: object[this.#fieldKey], payload: object })
        return object
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