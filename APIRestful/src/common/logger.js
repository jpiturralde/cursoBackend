const { Router } = require('express')

const loggerRouter = new Router()

loggerRouter.use((req, res, next) => {
    const date = new Date()
    console.log(`${date.toLocaleString()} ${req.method} ${req.path}`)
    next();
})

module.exports = { loggerRouter }