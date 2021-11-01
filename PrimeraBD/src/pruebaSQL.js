import ClienteSql from './sql.js'
import { options } from '../options/mariaDB.js'

const sql = new ClienteSql(options)
// sql.crearTabla()
//   .then(() => {
//     console.log("1) tabla creada")

//     /* ------------- */
//     /*    Punto 2    */
//     /* ------------- */
//     const articulos = [
//       { nombre: 'Leche', codigo: 'AB-12', precio: 23.60, stock: 24 },
//       { nombre: 'Harina', codigo: 'CD-34', precio: 12.80, stock: 45 },
//       { nombre: 'DDL', codigo: 'EF-56', precio: 32.30, stock: 16 },
//       { nombre: 'Fideos', codigo: 'FG-44', precio: 42.70, stock: 34 },
//       { nombre: 'Crema', codigo: 'CR-77', precio: 67.90, stock: 24 }
//     ]
//     return sql.insertarArticulos(articulos)
//   })
//   .then(() => {
//     console.log("2) articulos insertados")
//     /* ------------- */
//     /*    Punto 3    */
//     /* ------------- */
//     return sql.listarArticulos()
//   })
//   .then(articulos => {
//     console.log("3) articulos listado")
//     console.table(articulos)
//     /* ------------- */
//     /*    Punto 4    */
//     /* ------------- */
//     return sql.borrarArticuloPorId(3)
//   })
//   .then(() => {
//     console.log("4) articulo borrado")
//     /* ------------- */
//     /*    Punto 5    */
//     /* ------------- */
//     return sql.actualizarStockPorId(0, 2)
//   })
//   .then(() => {
//     console.log("5) stock actualizado")

//     /* --------------------- */
//     /*    resultado total    */
//     /* --------------------- */
//     return sql.listarArticulos()
//   })
//   .then(articulos => {
//     console.log("resultado total")
//     console.table(articulos)
//   })
//   .catch((err) => { console.log(err); throw err })
//   .finally(() => {
//     sql.close()
//   })



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
    console.log('EXEC ID = ', await sql.insertarArticulos1x1([art]))
}

exec()