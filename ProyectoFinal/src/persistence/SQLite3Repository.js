import knexLib from 'knex'

export default class SQLite3Repository {
    #knex
    #entity
    #pk = 'id'

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

    constructor(entity, filePath, pk = 'id') {
        const config = {
            client: 'sqlite3',
            connection: {
              filename: filePath
            },
            useNullAsDefault: true
        }
        this.#knex = knexLib(config)
        this.#entity = entity
        if (pk) {
            this.#pk = pk
        }
        this.initialize()
    }

    //TODO: Ver cómo saco esto de acá para hacerlo reutilizable
    initialize() {
        this.#knex.schema.hasTable('products')
            .then(exists => {
                if (!exists) {
                    return this.knex.schema.createTable('products', table => {
                        table.increments('id').primary();
                        table.string('title', 50).notNullable();
                        table.float('price').notNullable();
                        table.string('thumbnail', 250).notNullable();
                    })
                }
            })
    }

    schemaValidations(data) {
        return []
    }

    schemaErrors(data) {
        const errors = this.schemaValidations(data)

        if (errors.length > 0) {
            throw new Error(errors)
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
        return this.#knex(this.#entity)
            .insert(object)
            .then(id => this.getById(id))
    }

    async getAll() {
        return this.#knex(this.#entity)
            .select('*')
            .then(rec => this.display(rec))
    }

    async getById(id) {
        return this.#knex.from(this.#entity)
            .where(this.#pk, id)
            .then(rec => this.display(rec))
    }

    async put(id, data) {
        const updatableFields =(({ id, ...o }) => o)(data)
        return this.#knex.from(this.#entity)
            .where(this.#pk, id)
            .update(updatableFields)
            .then(id => this.getById(id))  
    }

    async deleteAll() {
        return this.#knex.from(this.#entity)
            .del()
    }

    async deleteById(id) {
        return this.#knex.from(this.#entity)
            .where(this.#pk, id)
            .del()
    }
}