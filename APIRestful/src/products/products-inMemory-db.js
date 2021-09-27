const content = []
let id = 1

function calculateId(content) {
    const ids = content.map(function (element) {
        return element.id
    })
    const max = ids.reduce((previous, current) => current > previous ? current : previous) 
    return max
}

/**
 * Retorna listado de productos.
 * @return {Array[Object]} Colección de productos existentes. 
 */
function get() {
    return content
}

/**
 * Recibe un id y devuelve el producto correspondiente, o null si no existe.
 * @param {Number} id del producto
 * @return {Object} producto asociado al id o null si no existe.
 */
function getById(id) {
    const result = content.filter(x => x.id==id) 
    if (result.length > 0) {
        return result[0].value
    }
    return null
}

/**
 * Recibe un producto y lo almacena en el repositorio.
 * @param {Object} producto a crear.
 * @return {Number} id del producto
 */
function post(product) {
    content.push({id, value: product})
    return id++
}

/**
 * Actualiza información del producto correspondiente al id recibido.
 * @param {Number} id del producto a actualizar
 * @return {Object} producto con nueva información.
 */
function put(id, product) {
    const index = content.findIndex(x => x.id === id)
    if (index == -1) {
        return false
    }
    content[index].value = product
    return true
}

/**
 * Elimina el producto correspondiente al id recibido.
 * @param {Number} id del producto a eliminar
 * @return {void}
 */
function remove(id) {
    const index = content.findIndex(x => x.id === id)
    if (index > -1) {
        content.splice(index, 1)
    }
}

module.exports = {get, getById, post, put, remove}