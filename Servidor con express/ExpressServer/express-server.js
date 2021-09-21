const express = require('express')
const Controller = require('./public/controller.js')
const DB = require('./public/products-fs-db.js')

const app = express()
const PORT = process.env.port || 8080

const server = app.listen(PORT, () => {
   console.log(`Servidor http escuchando en el puerto ${server.address().port}`)
})

server.on("error", error => console.log(`Error en servidor ${error}`))

app.get('/', (req, res) => {
    console.log(`Peticion recibida en puerto ${server.address().port} para ruta ${req.path}`)
    Controller.processRoot(res)
})

app.get('/productos', (req, res) => {
    console.log(`Peticion recibida en puerto ${server.address().port} para ruta ${req.path}`)
    Controller.processProducts(res, DB)
})

app.get('/productoRandom', (req, res) => {
    console.log(`Peticion recibida en puerto ${server.address().port} para ruta ${req.path}`)
    Controller.processProductRandom(res, DB)
})

