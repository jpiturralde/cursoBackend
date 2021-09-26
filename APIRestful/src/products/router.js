const DB = require('./products-fs-db.js')
const { Router } = require('express')

const productsRouter = new Router()

productsRouter.get('/', async (req, res) => {
    res.json(await DB.get())
})

productsRouter.get('/:id', async (req, res) => {
    res.json(await DB.getById(req.params.id))
})

productsRouter.post('/', async (req, res) => {
    res.json(await DB.post(req.body))
})

productsRouter.put('/:id', (req, res) => {
    res.send('Actualiza producto')
})

productsRouter.delete('/:id', (req, res) => {
    DB.remove(req.params.id)
    res.send('Producto eliminado')
})

module.exports = { productsRouter }