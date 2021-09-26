const Contenedor = require('../libs/Contenedor.js')
const DB_PATH = './db/productos.txt'

const contenedor = new Contenedor(DB_PATH)

/**
 * Retorna listado de productos.
 * @return {Array[Object]} Colección de productos existentes. 
 */
async function get() {
    return contenedor.getAll()
}

/**
 * Recibe un id y devuelve el producto correspondiente, o null si no existe.
 * @param {Number} id del producto
 * @return {Object} producto asociado al id o null si no existe.
 */
async function getById(id) {
    return await contenedor.getById(id)
}

/**
 * Recibe un producto y lo almacena en el repositorio.
 * @param {Object} producto a crear.
 * @return {Number} id del producto
 */
async function post(product) {
    return await contenedor.save(product)
}

/**
 * Actualiza información del producto correspondiente al id recibido.
 * @param {Number} id del producto a actualizar
 * @return {Object} producto con nueva información.
 */
 async function put(id, product) {
    //TODO
    return 'producto actualizado'
}

/**
 * Elimina el producto correspondiente al id recibido.
 * @param {Number} id del producto a eliminar
 * @return {void}
 */
async function remove(id) {
    await contenedor.deleteById(id)
}

module.exports = {get, getById, post, put, remove}
// module.exports = {getProducts, getProduct, createProduct, updateProduct, deleteProduct}