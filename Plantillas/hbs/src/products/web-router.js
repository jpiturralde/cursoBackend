const DB = require('./products-inMemory-db.js')
const { Router } = require('express')

const webRouter = new Router()

webRouter.get('/', (req, res) => {
    res.render('form')
})

webRouter.get('/productos', async (req, res) => {
    const products = DB.get()
    const thereAreProducts = products.length > 0
    res.render('history', { products, thereAreProducts})
})

webRouter.post('/productos', async (req, res) => {
    DB.post(req.body)
    console.log(DB.get())
    res.redirect('/')
})

module.exports = { webRouter }