const DB = require('./products-fs-db.js')
const { Router } = require('express')
const { idValidatorRouter } = require('../common/logger.js')

const productsRouter = new Router()

productsRouter.get('/', async (req, res) => {
    res.json(await DB.get())
})

productsRouter.get('/:id', 
    idValidatorRouter, 
    async (req, res, next) => {
        const product = await DB.getById(req.params.id)
        if (!product) {
            const error = new Error('producto no encontrado')
            error.httpStatusCode = 404
            return next(error)
        }
        res.json(product)
    }
)

productsRouter.post('/', async (req, res) => {
    res.status(201).json(await DB.post(req.body))
})

productsRouter.put('/:id', 
    idValidatorRouter, 
    async (req, res) => {
        const response = await DB.put(parseInt(req.params.id), req.body)
        if (!response) {
            res.status(204).json()
        }
        res.json(req.body)
    }
)

productsRouter.delete('/:id', 
    idValidatorRouter, 
    async (req, res) => {
        DB.remove(req.params.id)
        res.send('Producto eliminado')
    }
)

module.exports = { productsRouter }