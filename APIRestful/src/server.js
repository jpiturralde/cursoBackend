const express = require('express')
const { loggerRouter } = require("./common/logger")
const { productsRouter } = require("./products/router")

const app = express()
app.use(express.json())
app.use(express.static('public'));
app.use(loggerRouter)

/* ------------------------------------------------------ */
/* Cargo los routers */
app.use('/api/productos', productsRouter)

/* ------------------------------------------------------ */
/* Server Listen */
const PORT = process.env.port || 8080
const server = app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${server.address().port}`)
})
server.on('error', error => console.log(`Error en servidor ${error}`))




// const Controller = require('./controller.js')
// const DB = require('./products/products-fs-db.js')

// const app = express()
// const PORT = process.env.port || 8080

// const server = app.listen(PORT, () => {
//    console.log(`Servidor http escuchando en el puerto ${server.address().port}`)
// })

// server.on("error", error => console.log(`Error en servidor ${error}`))

// app.get('/', (req, res) => {
//     console.log(`Peticion recibida en puerto ${server.address().port} para ruta ${req.path}`)
//     Controller.processRoot(res)
// })

// app.get('/productos', (req, res) => {
//     console.log(`Peticion recibida en puerto ${server.address().port} para ruta ${req.path}`)
//     Controller.processProducts(res, DB)
// })

// app.get('/productoRandom', (req, res) => {
//     console.log(`Peticion recibida en puerto ${server.address().port} para ruta ${req.path}`)
//     Controller.processProductRandom(res, DB)
// })

