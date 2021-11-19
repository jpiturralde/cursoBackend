import * as fs from 'fs'
import express from 'express';
import { logger, errorHandler, authorization, unkownRoute} from "./lib/index.js"
import { ShoppingCartsController, DefaultController } from "./controllers/index.js"
import { ShoppingCartsService } from "./services/index.js"
import { ProductsDao, ShoppingCartsDao } from "./daos/index.js"
import { RepositoryFactory } from "./persistence/index.js"

RepositoryFactory.initialize(process.argv.slice(2)[0])
let productsModel
let shoppingCartsModel
try {
    productsModel = new ProductsDao(await RepositoryFactory.createProductsRepository())
} catch (error) {
    console.error(`Error al crear ProductsDao ${error}`) 
    throw Error(error)
}
try {
    shoppingCartsModel = new ShoppingCartsDao(await RepositoryFactory.createShoppingCartsRepository())
} catch (error) {
    console.error(`Error al crear ShoppingCartsDao ${error}`) 
    throw Error(error)
}


const db = {
    'products': productsModel,
    'shoppingCarts': shoppingCartsModel
}
const productsController = new DefaultController({ entity: 'products', db })
const shoppingCartsService = new ShoppingCartsService(db)
const shoppingCartsController = new ShoppingCartsController({entity: 'shoppingCarts', db, service: shoppingCartsService})

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
// app.use(express.static('public'));
app.use(logger)

//Configuro mdw para autorización
app.use(authorization(
    [{
        path:'/api/productos', 
        methods: ['POST', 'PUT', 'DELETE']
    }]
))

/* ------------------------------------------------------ */
/* Cargo los routers */
app.use('/api/productos', productsController.build())
app.use('/api/carrito', shoppingCartsController.build()) 

app.use(unkownRoute)
app.use(errorHandler)

/* ------------------------------------------------------ */
/* Server Listen */
const PORT = process.env.port || 8080
const server = app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${server.address().port}`)
})
server.on('error', error => console.log(`Error en servidor ${error}`))
