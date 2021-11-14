import * as fs from 'fs'
import express from 'express';
import { logger, errorHandler, authorization, unkownRoute} from "./lib/index.js"
import { ShoppingCartsController, DefaultController } from "./controllers/index.js"
import { ShoppingCartsService } from "./services/index.js"
import { Products, ShoppingCarts } from "./models/index.js"
import { ProductsDao, ShoppingCartsDao } from "./daos/index.js"
import RepositoryFactory from "./persistence/RepositoyFactory.js"

RepositoryFactory.initialize(process.argv.slice(2)[0])

const productsModel = new ProductsDao(await RepositoryFactory.createProductsRepository())
//const productsModel = new ProductsDao(await RepositoryFactory.createRepository())
//const productsModel = new ProductsDao(await RepositoryFactory.createRepository({type: 'FS', connectionString: './db/products.txt'}))
//Persistencia en archivos
//const shoppingCartsModel = new ShoppingCarts('./db/carts.txt')
const shoppingCartsModel = new ShoppingCartsDao(await RepositoryFactory.createShoppingCartsRepository())
//Persistencia en memoria
// const shoppingCartsModel = new ShoppingCarts()

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
