import express from 'express';
import { logger, errorHandler, authorization, unkownRoute} from "./lib/index.js"
import { CartController, ProductsController } from "./controllers/index.js"
import { Products, Carrito } from "./models/index.js"

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
// app.use(express.static('public'));
app.use(logger)
app.use(authorization(
    [{
        path:'/api/productos', 
        methods: ['POST', 'PUT', 'DELETE']
    }]
))

/* ------------------------------------------------------ */
/* Cargo los routers */
//app.use('/api/productos', (new ProductsController({model: Productos(new FileSystemContainer('./db/products.txt'))})).build())
app.use('/api/productos', (new ProductsController({model: new Products('./db/products.txt')})).build())
//Repo en memoria
//app.use('/api/productos', (new ProductsController({model: new Repository()})).build())
// app.use('/api/productos', (new ProductsController({model: Productos()})).build())

app.use('/api/carrito', (new CartController({model: Carrito('./db/carts.txt')})).build()) 

app.use(unkownRoute)
app.use(errorHandler)

/* ------------------------------------------------------ */
/* Server Listen */
const PORT = process.env.port || 8080
const server = app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${server.address().port}`)
})
server.on('error', error => console.log(`Error en servidor ${error}`))
