const DB = require('./products-inMemory-db.js')
const { Router } = require('express')
const { idValidator } = require('../common/common.js')

const productsRouter = new Router()

productsRouter.get('/', (req, res) => {
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

productsRouter.post('/', (req, res) => {
    res.status(201).json(DB.post(req.body))
})

productsRouter.put('/:id', 
    idValidator, 
    (req, res) => {
        const response = DB.put(parseInt(req.params.id), req.body)
        if (!response) {
            res.status(204).json()
        }
        res.json(req.body)
    }
)

productsRouter.delete('/:id', 
    idValidator, 
    (req, res) => {
        DB.remove(parseInt(req.params.id))
        res.json()
    }
)

module.exports = { productsRouter }