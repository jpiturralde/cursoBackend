export default class DefaultDao {

    constructor(entity) {
        this.entity = entity
    }

    async post(data) {
        console.log('DefaultDao.post data=', data) 
        const result =  await { msg: `DefaultDao(${this.entity}) - Crea instancia.`}
        console.log('DefaultDao.post result=', result)
        return result
    }

    async getAll() { return await { msg: `DefaultDao(${this.entity}) - Lista todas las instancias.` } }

    async getById(id) { return await { msg: `DefaultDao(${this.entity}) - Retorna instancia con id=${id}.`}}
    
    async put(id, data) { return await { msg: `DefaultDao(${this.entity}) - Actualiza instancia con id=${id}.`}}

    async deleteAll()  { return await { msg: `DefaultDao(${this.entity}) - Elimina instancias.`}}

    async deleteById(id)  { return await { msg: `DefaultDao(${this.entity}) - Elimina instancia con id=${id}.`}}
}
