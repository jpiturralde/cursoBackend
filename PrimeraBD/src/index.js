import { InMemoryDB, FileSystemDB, RepositoryDB } from "./persistence/index.js";
import { options } from '../options/mariaDB.js'

// const db = InMemoryDB()
// const db = FileSystemDB('./db/messages.txt')
const db = new RepositoryDB('articulos', options)

console.table(await db.post(articulos))

console.log(await db.post(art))

console.table( await db.getAll())

console.log(await db.getById(41))

console.log(await db.deleteById(41))

console.log(await db.getById(41))
