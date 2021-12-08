import express from 'express'
import exphbs from 'express-handlebars'
import { webRouter } from './routers/web-router.js'
import { mockRouter } from "./routers/mock-router.js"
import { apiRouter, getInfo } from './routers/api-router.js'

/**
 * config {
 *  rootPath
 *  sessionMiddleware
 *  authenticationManager {authMdw, authFn}
 *  logger
 * }
 * */
export const ExpressApp = (config) => {

    const expressApp = express()

    //Handlebars
    expressApp.engine('.hbs', exphbs({ extname: '.hbs', defaultLayout: 'main.hbs' }))
    expressApp.set('view engine', '.hbs')

    //Session
    expressApp.use(config.sessionMiddleware)

    expressApp.use(express.static(config.rootPath + '/views'))

    expressApp.use(express.json())

    expressApp.use(express.urlencoded({ extended: true }))

    //Logger
    expressApp.use(config.logger)

    //Authentication
    expressApp.use(config.authenticationManager.authenticationMdw)

    //Routes
    expressApp.use('/', webRouter(config.rootPath, config.authenticationManager.authenticationFn))
    expressApp.use('/', apiRouter())
    expressApp.use('/api/productos-test', mockRouter)

    return expressApp
}

