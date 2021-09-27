const express = require('express')
const { logger } = require("./common/common")
const { errorHandler } = require("./common/common")
const { productsRouter } = require("./products/router")

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'));
app.use(logger)

/* ------------------------------------------------------ */
/* Cargo los routers */
app.use('/api/productos', productsRouter)

app.use(errorHandler)

/* ------------------------------------------------------ */
/* Server Listen */
const PORT = process.env.port || 8080
const server = app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${server.address().port}`)
})
server.on('error', error => console.log(`Error en servidor ${error}`))
