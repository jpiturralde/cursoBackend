import { Router } from "express"
import faker from 'faker'
faker.locale = 'es'

export const apiRouter = () => {
    const { api } = process.context
    const router = new Router()

    router.get('/api/sessionUser', sessionUser)

    //INFO
    router.get('/api/info', getInfo)

    //PRODUCTS
    router.get('/api/productos', getMdw(api.products))
    router.post('/api/productos', postMdw(api.products))
    router.delete('/api/productos/:id', deleteMdw(api.products))

    router.get('/api/messages', getMdw(api.messages))
    router.post('/api/messages', postMdw(api.messages))

    router.post('/api/carrito', postMdw(api.shoppingCarts))
    router.get('/api/carrito/:id', getByIdMdw(api.shoppingCarts))
    router.delete('/api/carrito/:id', deleteMdw(api.shoppingCarts))
    router.get('/api/carrito/:id/productos', getItems(api.shoppingCarts))
    router.post('/api/carrito/:id/productos', addItem(api.shoppingCarts))
    router.delete('/api/carrito/:id/productos/:productId', deleteItem(api.shoppingCarts))


    //PRODUCTOS-TEST
    router.get('/api/productos-test', getProductsTest)

    return router
} 
const todoMdw = (api) => async (req, res) => { res.json('FALTA IMPLEMENTAR') }

const getByIdMdw = (api) => async (req, res, next) => { 
    const data = await api.getById(req.params.id)
    if (!data) {
        const error = new Error('No encontrado')
        error.httpStatusCode = 404
        return next(error)
    }
    res.json(data)
}
const getMdw = (api) => async (req, res) => { res.json(await api.get()) }
const postMdw = (api) => async (req, res) => {
    try {
        res.status(201).json(await api.post(req.body))
    } catch (error) {
        console.error(error)
        res.status(400).json( { error: -3, description: error.name + ': ' + error.message})
    }
}
const deleteMdw = (api) => async (req, res) => {
    api.deleteById(req.params.id)
    res.json()
}

const getItems = (api) => async (req, res) => {
    api.getItems(req.params.id)
        .then(items => {
            res.status(201).json(items)
        }).catch(error => {
            process.context.logger.error(error)
            res.status(404).json(JSON.parse(error.message))
        })
}

const addItem = (api) => async (req, res) => {
    api.addItem(req.params.id, req.body)
        .then(result => {
            res.status(201).json(result)
        }).catch(error => {
            process.context.logger.error(error)
            res.status(404).json(JSON.parse(error.message))
        })
}

const deleteItem = (api) => async (req, res) => {
    api.deleteItem(req.params.id, req.params.productId)
        .then(result => {
            res.status(201).json(result)
        }).catch(error => {
            console.error(error.message)
            res.status(404).json(JSON.parse(error.message))
        })
}

//INFO
const getInfo = async (req, res) => { res.json(await api.info.get()) }

const sessionUser = (req, res) => { res.json(req.user) }


//PRODUCTOS-TEST
const getProductsTest = async (req, res) => {
    const products = []
    for (let i = 0; i < 5; i++) {
        products.push(randomValue())
    }
    res.json(products)
}

function randomValue() {
    return { value: {
        title: faker.commerce.product(),
        price: faker.commerce.price(),
        thumbnail: `${faker.image.imageUrl()}?random=${Date.now()}`
        }
    }
}



// const getUserName = req => req.session.userName ? req.session.userName : ''

// const getLogout = async (req, res) => {
//     const userName = getUserName(req)
//     console.log('logout')
//     req.session.destroy(err => {
//         if (!err) {
//             const result = { msg: `Hasta luego ${userName}`}
//             console.log(result)
//             res.json(result)
//         }
//         else res.send({ error: 'logout', body: err })
//     })
// }

