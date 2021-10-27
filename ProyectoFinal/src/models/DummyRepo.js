import Repository from "./Repository.js"

export default class DummyRepo extends Repository {

    constructor(entity) {
        super()
        this.entity = entity
    }

    async getAll() { return await { msg: `DummyRepo(${this.entity}) - Lista todas las instancias.` } }

    async post(data) {
        console.log('DummyRepo.post data=', data) 
        const result =  await { msg: `DummyRepo(${this.entity}) - Crea instancia.`}
        console.log('DummyRepo.post result=', result)
        return result
    }

    async getById(id) { return await { msg: `DummyRepo(${this.entity}) - Retorna instancia con id=${id}.`}}
    
    async put(id, data) { return await { msg: `DummyRepo(${this.entity}) - Actualiza instancia con id=${id}.`}}

    async deleteById(id)  { return await { msg: `DummyRepo(${this.entity}) - Elimina instancia con id=${id}.`}}

}