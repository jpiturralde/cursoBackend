import { Router } from "express"
import faker from 'faker'
faker.locale = 'es'

export const apiRouter = (authenticationManager, imageLoaderMdw) => {
    const { api } = process.context
    const router = new Router()

    router.post('/api/user/signup', imageLoaderMdw.single('avatar'), authenticationManager.authJwtMdw('signup'))
    router.post('/api/user/signin', authenticationManager.authJwtMdw('signin'))
    router.get('/api/user/profile', authenticationManager.jwtMdw(), userProfile)
    
    //INFO
    router.get('/api/info', getInfo(api.info))

    //PRODUCTS
    router.get('/api/productos', getMdw(api.products))
    router.post('/api/productos', postMdw(api.products))
    router.delete('/api/productos/:id', deleteMdw(api.products))

    router.get('/api/messages', getMdw(api.messages))
    router.post('/api/messages', postMdw(api.messages))

    router.get('/api/carrito/:id', authenticationManager.jwtMdw(), shoppingCartIdValidatorMdw(), getByIdMdw(api.shoppingCarts))
    router.delete('/api/carrito/:id', authenticationManager.jwtMdw(), shoppingCartIdValidatorMdw(), deleteShoppingCartMdw(api.shoppingCarts))
    router.get('/api/carrito/:id/productos', authenticationManager.jwtMdw(), shoppingCartIdValidatorMdw(), getItems(api.shoppingCarts))
    router.post('/api/carrito/:id/productos', authenticationManager.jwtMdw(), shoppingCartIdValidatorMdw(), addItem(api.shoppingCarts))
    router.delete('/api/carrito/:id/productos', authenticationManager.jwtMdw(), shoppingCartIdValidatorMdw(), deleteItems(api.shoppingCarts))
    router.delete('/api/carrito/:id/productos/:productId', authenticationManager.jwtMdw(), shoppingCartIdValidatorMdw(), deleteItem(api.shoppingCarts))
    router.patch('/api/carrito/:id/checkout', authenticationManager.jwtMdw(), shoppingCartIdValidatorMdw(), checkout(api.shoppingCarts))


    //PRODUCTOS-TEST
    router.get('/api/productos-test', getProductsTest)

    return router
}

const shoppingCartIdValidatorMdw = () => async (req, res, next) => { 
    if (req.user.shoppingCartId == req.params.id) {
        next()
    }
    else {
        res.status(401).json()
    }
}

const getByIdMdw = (api) => async (req, res, next) => { 
    const data = await api.getById(req.params.id)
    if (!data) {
        res.status(404).json()
    }
    else {
        res.json(data)
    }
}
const getMdw = (api) => async (req, res) => { res.json(await api.get()) }
const postMdw = (api) => async (req, res) => {
    try {
        const response = await api.post(req.body)
        res.status(201).json(response)
    } catch (error) {
        process.context.logger.error(error)
        res.status(400).json( { error: -3, description: error.name + ': ' + error.message})
    }
}
const deleteMdw = (api) => async (req, res) => {
    api.deleteById(req.params.id)
    res.json()
}

const deleteShoppingCartMdw = (api) => async (req, res) => {
    api.deleteById(req.params.id)
    res.json()
}
const getItems = (api) => async (req, res) => {
    api.getItems(req.params.id)
        .then(items => {
            res.status(201).json(items)
        }).catch(error => {
            process.context.logger.error(error.message)
            res.status(404).json(JSON.parse(error.message))
        })
}

const addItem = (api) => async (req, res) => {
    api.addItem(req.params.id, req.body)
        .then(result => {
            res.status(201).json(result)
        }).catch(error => {
            process.context.logger.error(error.message)
            res.status(404).json(JSON.parse(error.message))
        })
}

const deleteItems = (api) => async (req, res) => {
    api.deleteItems(req.params.id)
        .then(result => {
            res.status(201).json(result)
        }).catch(error => {
            process.context.logger.error(error.message)
            res.status(404).json(JSON.parse(error.message))
        })
}

const deleteItem = (api) => async (req, res) => {
    api.deleteItem(req.params.id, req.params.productId)
        .then(result => {
            res.status(201).json(result)
        }).catch(error => {
            process.context.logger.error(error.message)
            res.status(404).json(JSON.parse(error.message))
        })
}

const checkout = (api) => async (req, res) => {
    try {
        //Hardcodeo usuario para hacer pruebas hasta resolver la sesion en la API o implementar UI
        let user = req.user
        if (!user) {
            const { sysadm } = process.context
            user = {
                username: sysadm.email,
                name: sysadm.name,
                phone: sysadm.phone
            }
        }
        res.status(201).json(await api.checkout(req.params.id, user))
    } catch (error) {
        process.context.logger.error(error.message)
        res.status(400).json(JSON.parse(error.message))
    }
}

//INFO
const getInfo = (api) => async (req, res) => { res.json(await api.get()) }

const userProfile = (req, res) => { res.json(req.user) }

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

