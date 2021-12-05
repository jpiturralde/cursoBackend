import Contenedor from './Contenedor.js'
const DB_PATH = './db/messages.txt'

const contenedor = new Contenedor(DB_PATH)

async function post(data) {
    return await contenedor.save(data)
}

async function get() {
    return await contenedor.getAll()
}

export {get, post}