import { InMemoryDB, FileSystemDB, RepositoryDB } from "./persistence/index.js";
import { options } from '../options/mariaDB.js'

// const db = InMemoryDB()
// const db = FileSystemDB('./db/messages.txt')
const db = new RepositoryDB('articulos', options)

// console.log('getAll = ', await db.getAll())
// console.log('post = ', await db.post({msg: 'HOLA'}))
// console.log('getAll = ', await db.getAll())
// console.log('getById = ', await db.getById(1))
// console.log('put = ', await db.put(1, {msg: 'HOLA MUNDO'}))
// console.log('delete = ', await db.deleteById(1))
// console.log('getAll = ', await db.getAll())


const art = { nombre: 'UNO', codigo: 'UNO-12', precio: 23.60, stock: 0 }
const articulos = [
      { nombre: 'DOS', codigo: 'FG-44', precio: 42.70, stock: 34 },
      { nombre: 'TRES', codigo: 'CR-77', precio: 67.90, stock: 24 }
    ]

// sql.insertarArticulo(art)
//     .then( (id) => {
//         console.log('INSERTA ID=', id)    
//     })

// sql.insertarArticulos(articulos)
// .then( (ids) => {
//     console.log('INSERTA ID=', ids)    
// })

async function exec() {
    // console.log('EXEC ID = ', await sql.insertarArticulos1x1(articulos))
    // console.log('EXEC = ', await sql.insertarArticulo(art))
    console.log('EXEC ID = ', await db.post(articulos))
}

// exec()

console.table(await db.post(articulos))

console.log(await db.post(art))

console.table( await db.getAll())

console.log(await db.getById(41))

console.log(await db.deleteById(41))

console.log(await db.getById(41))

//console.log(await db.deleteAll())