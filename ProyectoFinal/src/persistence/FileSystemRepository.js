import FileSystemContainer from "./FileSystemContainer.js"

export default class FileSystemRepository {
    #container

    static getPayload(data) { return data.payload }

    constructor(filePath) {
        this.#container = new FileSystemContainer(filePath)
    }

    async post(object) {
        const content = await this.#container.read()
        content.push({ id: object.id, payload: object })
        await this.#container.write(content)
        return object
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