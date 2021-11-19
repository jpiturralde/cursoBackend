export default class FileSystemRepository {
    #container
    #id = 1
    
    static #calculateId(content) {
        if (content.length > 0) {
            const ids = content.map(function (element) {
                return element.id
            })
            const max = ids.reduce((previous, current) => current > previous ? current : previous) 
            return max+1
        }
        return 1
    }

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

    constructor(container) {
        this.#container = container
        this.#id = FileSystemRepository.#calculateId(this.#container.readSync())
    }

    async post(object) {
        const content = await this.#container.read()
        const payload = FileSystemRepository.createPayload(this.#id, object)
        this.#id = Math.max(this.#id, payload.id)+1
        content.push({ id: payload.id, payload })
        await this.#container.write(content)
        return payload
    }
    
    async getAll() {
        const content = await this.#container.read()
        const result = content.map(x => FileSystemRepository.getPayload(x))
        return result
    }

    async getById(id) {
        const content = await this.#container.read()
        const result = content.filter(x => x.id==id) 
        if (result.length > 0) {
            return FileSystemRepository.getPayload(result[0])
        }
        return null
    }

    async put(id, data) {
        const content = await this.#container.read()
        const index = content.findIndex(x => x.id==id) 
        if ( index > -1) {
            const originalTimestamp = content[index].payload.timestamp
            const mergedPayload = { ...content[index].payload, ...data }
            content[index].payload = mergedPayload
            mergedPayload.id = id
            mergedPayload.timestamp = originalTimestamp
            await this.#container.write(content)
            return mergedPayload
        }
        return null
    }

    async deleteAll() {
        await this.#container.clean()
    }

    async deleteById(id) {
        if (await this.getById(id) != null) {
            const content = await this.#container.read()
            const newContent = content.filter(x => x.id!=id)
            await this.#container.write(newContent)
        }
    }

}