import Contenedor from './Contenedor.js'

export default class FileSystemRepo {

    constructor(repoPath) {
        this.repo = new Contenedor(repoPath)
    }

    async post(data) {
        return await this.repo.save(data)
    }
    
    async getAll() {
        return await this.repo.getAll()
    }

    async getById(id) {
        return await this.repo.getById(id)
    }

    async put(id, data) {
        console.log('FileSystemRepo.put(id) PENDIENTE !!!!! ')
    }

    async deleteAll() {
        return await this.repo.deleteAll()
    }

    async deleteById(id) {
        return await this.repo.deleteById(id)
    }

}