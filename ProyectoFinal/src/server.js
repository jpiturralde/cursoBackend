import express from 'express';
import { logger, errorHandler, authorization, unkownRoute} from "./lib/index.js"
import { ShoppingCartsController, ProductsController, DefaultController } from "./controllers/index.js"
import { ShoppingCartsService } from "./services/index.js"
import { Products, ShoppingCarts } from "./models/index.js"

const productsModel = new Products('./db/products.txt')
const shoppingCartsModel = new ShoppingCarts('./db/carts.txt')
const db = {
    'products': productsModel,
    'shoppingCarts': shoppingCartsModel
}
const productsController = new DefaultController({db, entity: 'products' })
const shoppingCartsService = new ShoppingCartsService(db)
const shoppingCartsController = new ShoppingCartsController({model: shoppingCartsModel, service: shoppingCartsService, db, entity: 'shoppingCarts'})

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
app.use('/api/productos', productsController.build())
//Repo en memoria
// app.use('/api/productos', (new ProductsController({model: Productos()})).build())

app.use('/api/carrito', shoppingCartsController.build()) 
//Repo en memoria
// app.use('/api/carrito', (new ShoppingCartsController({model: ShoppingCarts()})).build())

app.use(unkownRoute)
app.use(errorHandler)

/* ------------------------------------------------------ */
/* Server Listen */
const PORT = process.env.port || 8080
const server = app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${server.address().port}`)
})
server.on('error', error => console.log(`Error en servidor ${error}`))
