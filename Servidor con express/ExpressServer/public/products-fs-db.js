const Contenedor = require('./Contenedor.js')
const DB_PATH = './db/productos.txt'

const contenedor = new Contenedor(DB_PATH)

async function getProducts() {
    return await contenedor.getAll()
}

async function getProduct(id) {
    return await contenedor.getById(id)
}

module.exports = {getProducts, getProduct}