export default class DummyRepo {

    constructor(entity) {
        this.entity = entity
    }

    getAll() { return { msg: `DummyRepo(${this.entity}) - Lista todas las instancias.` } }

    post(data) { return { msg: `DummyRepo(${this.entity}) - Crea instancia.`}}

    getById(id) { return { msg: `DummyRepo(${this.entity}) - Retorna instancia con id=${id}.`}}
    
    put(id, data) { return { msg: `DummyRepo(${this.entity}) - Actualiza instancia con id=${id}.`}}

    deleteById(id)  { return { msg: `DummyRepo(${this.entity}) - Elimina instancia con id=${id}.`}}
 
}