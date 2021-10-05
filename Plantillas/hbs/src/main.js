const express = require('express')
const { logger } = require("./common/common")
const { errorHandler } = require("./common/common")
const { webRouter } = require("./products/web-router")

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(logger)

/* ------------------------------------------------------ */
/* Configuro motor de plantillas */
const exphbs = require('express-handlebars')

app.engine('hbs', exphbs({
  extname: 'hbs',
  defaultLayout: 'index.hbs'
}))

app.set('views', './views');
app.set('view engine', 'hbs');


/* ------------------------------------------------------ */
/* Cargo los routers */
app.use('/', webRouter)

app.use(errorHandler)

/* ------------------------------------------------------ */
/* Server Listen */
const PORT = process.env.port || 8080
const server = app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${server.address().port}`)
})
server.on('error', error => console.log(`Error en servidor ${error}`))

