import knexLib from 'knex'

export default class RepositoryDB {
    entity
    pk = 'id'
    knex

    
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

    constructor(entity, config, pk = 'id') {
        this.knex = knexLib(config)
        this.entity = entity
        if (pk) {
            this.pk = pk
        }
    }

    async post(object) {
        let data = object
        if (!Array.isArray(object)) {
            data = [ object ]
        }
        return await Promise.all(
            data.map(async (info) => {
                return (await this.insert(info))[0]
          }))
    }

    display(rec) { 
        return JSON.parse(JSON.stringify(rec))
    }
    
    async insert(object) {
        return this.knex(this.entity)
            .insert(object)
            .then(id => this.getById(id))
    }

    async getAll() {
        return this.knex(this.entity)
            .select('*')
            .then(rec => this.display(rec))
    }

    async getById(id) {
        return this.knex.from(this.entity)
            .where(this.pk, id)
            .then(rec => this.display(rec))
    }

    async put(id, data) {
        const updatableFields =(({ id, ...o }) => o)(data)
        return this.knex.from(this.entity)
            .where(this.pk, id)
            .update(updatableFields)
            .then(id => this.getById(id))  
    }

    async deleteAll() {
        return this.knex.from(this.entity)
            .del()
    }

    async deleteById(id) {
        return this.knex.from(this.entity)
            .where(this.pk, id)
            .del()
    }

}