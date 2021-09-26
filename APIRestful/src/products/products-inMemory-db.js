const content = []
const contenedor = new Contenedor(DB_PATH)

/**
 * Retorna listado de productos.
 * @return {Array[Object]} Colección de productos existentes. 
 */
async function get() {
    return content
}

/**
 * Recibe un id y devuelve el producto correspondiente, o null si no existe.
 * @param {Number} id del producto
 * @return {Object} producto asociado al id o null si no existe.
 */
async function getById(id) {
    //TODO
}

/**
 * Recibe un producto y lo almacena en el repositorio.
 * @param {Object} producto a crear.
 * @return {Number} id del producto
 */
async function post(product) {
    //TODO
}

/**
 * Actualiza información del producto correspondiente al id recibido.
 * @param {Number} id del producto a actualizar
 * @return {Object} producto con nueva información.
 */
async function put(id, product) {
    //TODO
}

/**
 * Elimina el producto correspondiente al id recibido.
 * @param {Number} id del producto a eliminar
 * @return {void}
 */
async function remove(id) {
    //TODO
}

module.exports = {get, getById, post, put, remove}
// module.exports = {getProducts, getProduct, createProduct, updateProduct, deleteProduct}