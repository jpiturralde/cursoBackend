const DB = require('./products-inMemory-db.js')
const { Router } = require('express')

const productsRouter = new Router()

const ERR_400_INVALID_ID = { error: 'El parámetro ingresado no es un número' }
const idValidator = (req, res, next) => {
    const num = parseInt(req.params.id)

    if (isNaN(num)) {
        return res.status(400).json(ERR_400_INVALID_ID)
    }
    next();
}

productsRouter.get('/', async (req, res) => {
    res.json(DB.get())
})

productsRouter.get('/:id', 
    idValidator, 
    async (req, res, next) => {
        const product = DB.getById(req.params.id)
        if (!product) {
            const error = new Error('producto no encontrado')
            error.httpStatusCode = 404
            return next(error)
        }
        res.json(product)
    }
)

productsRouter.post('/', async (req, res) => {
    res.status(201).json(DB.post(req.body))
})

productsRouter.put('/:id', 
    idValidator, 
    async (req, res) => {
        const response = DB.put(parseInt(req.params.id), req.body)
        if (!response) {
            res.status(204).json()
        }
        res.json(req.body)
    }
)

productsRouter.delete('/:id', 
    idValidator, 
    async (req, res) => {
        DB.remove(parseInt(req.params.id))
        res.json()
    }
)

module.exports = { productsRouter }