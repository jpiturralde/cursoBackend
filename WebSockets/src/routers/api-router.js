import { Router } from "express"
import faker from 'faker'
faker.locale = 'es'

export const apiRouter = () => {
    const router = new Router()

    router.get('/api/info', getInfo)
    router.use('/api/productos-test', getProducts)

    return router
} 

const getInfo = async (req, res) => { res.json(await process.context.api.info.get()) }

const getProducts = async (req, res) => {
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

