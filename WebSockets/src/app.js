import express from 'express'
import exphbs from 'express-handlebars'
import { webRouter } from './routers/web-router.js'
import { mockRouter } from "./routers/mock-router.js"
import { apiRouter, getInfo } from './routers/api-router.js'
import { processRouter } from './routers/process-router.js'
import { unkownRoute, imageLoaderMdw } from './lib/index.js'

/**
 * config {
 *  rootPath
 *  sessionMiddleware
 *  authenticationManager {authMdw, authFn}
 *  logger
 * }
 * */
export const ExpressApp = (config) => {
    const VIEWS_PATH = config.rootPath + '/views'
    const IMAGES_PATH = config.rootPath + '/views/images'

    const expressApp = express()

    //Handlebars
    expressApp.engine('.hbs', exphbs({ extname: '.hbs', defaultLayout: 'main.hbs' }))
    expressApp.set('view engine', '.hbs')

    //Session
    expressApp.use(config.sessionMiddleware)

    expressApp.use(express.static(VIEWS_PATH))

    expressApp.use(express.json())

    expressApp.use(express.urlencoded({ extended: true }))

    //Logger
    expressApp.use(config.loggerMdw(config.logger))

    //Authentication
    config.authenticationManager.initApp(expressApp) //Con PassportLocalAuthentication
//    expressApp.use(config.authenticationManager.authenticationMdw)



    //Routes
    expressApp.use('/', webRouter(config.rootPath, config.authenticationManager, config.logger, imageLoaderMdw(IMAGES_PATH)))
    // expressApp.use('/', webRouter(config.rootPath, config.authenticationManager, config.logger))
    expressApp.use('/', apiRouter())
    expressApp.use('/', processRouter(config.rootPath))
    expressApp.use('/api/productos-test', mockRouter)
    expressApp.use(unkownRoute(config.logger))

    return expressApp
}

