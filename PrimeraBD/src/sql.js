import knexLib from 'knex'

class ClienteSql {
  constructor(config) {
    this.knex = knexLib(config)
  }

  crearTabla() {
    return this.knex.schema.dropTableIfExists('articulos')
      .finally(() => {
        return this.knex.schema.createTable('articulos', table => {
          table.increments('id').primary();
          table.string('nombre', 50).notNullable();
          table.string('codigo', 10).notNullable();
          table.float('precio');
          table.integer('stock');
        })
      })
  }

  async insertarArticulos1x1(articulos) {
    return await Promise.all(
      articulos.map(async (a) => {
        return (await this.insertarArticulo(a))[0]
    }))
  }
  

  insertarArticulo(articulo) {
    return this.knex('articulos')
      .insert(articulo)
      .then(id => this.knex.from('articulos').where('id', id[0]))
      .then(obj => JSON.parse(JSON.stringify(obj)))
  }

  insertarArticulos(articulos) {
    return this.knex('articulos').insert(articulos)
  }

  listarArticulos() {
    return this.knex('articulos').select('*')
  }

  borrarArticuloPorId(id) {
    return this.knex.from('articulos').where('id', id).del()
  }

  actualizarStockPorId(stock, id) {
    return this.knex.from('articulos').where('id', id).update({ stock: stock })
  }

  close() {
    this.knex.destroy();
  }
}

export default ClienteSql