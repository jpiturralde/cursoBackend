import { Router } from "express"
import faker from 'faker'
faker.locale = 'es'

export const apiRouter = () => {
    const router = new Router()

    router.get('/api/sessionUser', sessionUser)

    //INFO
    router.get('/api/info', getInfo)

    //PRODUCTS
    router.get('/api/products', getMdw(process.context.api.products))
    router.post('/api/products', postMdw(process.context.api.products))

    router.get('/api/messages', getMdw(process.context.api.messages))
    router.post('/api/messages', postMdw(process.context.api.messages))

    //PRODUCTOS-TEST
    router.get('/api/productos-test', getProductsTest)

    return router
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
//INFO
const getInfo = async (req, res) => { res.json(await process.context.api.info.get()) }

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

