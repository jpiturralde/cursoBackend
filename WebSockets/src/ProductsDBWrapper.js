import DBWrapper from './DBWrapper.js'
import RepositoryDB from './RepositoryDB.js'
import knexLib from 'knex'

export default class ProductsDBWrapper extends DBWrapper {
    #knex

    constructor(config) {
        super(new RepositoryDB('products', config))
        this.#knex = knexLib(config)
        this.initialize()
    }

    initialize() {
        this.#knex.schema.hasTable('products')
            .then(exists => {
                if (!exists) {
                    return this.#knex.schema.createTable('products', table => {
                        table.increments('id').primary();
                        table.string('title', 50).notNullable();
                        table.float('price').notNullable();
                        table.string('thumbnail', 250).notNullable();
                    })
                }
            })
    }
}
