import express from 'express'
import exphbs from 'express-handlebars'
import { webRouter } from './routers/web-router.js'
import { mockRouter } from "./routers/mock-router.js"
import { apiRouter } from './routers/api-router.js'
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
    const { rootPath, sessionMiddleware, logger, loggerMdw, authenticationManager } = config
    const VIEWS_PATH = rootPath + '/views'
    const IMAGES_PATH = rootPath + '/views/images'

    const expressApp = express()

    //Handlebars
    expressApp.engine('.hbs', exphbs({ extname: '.hbs', defaultLayout: 'main.hbs' }))
    expressApp.set('view engine', '.hbs')

    //Session
    expressApp.use(sessionMiddleware)

    expressApp.use(express.static(VIEWS_PATH))

    expressApp.use(express.json())

    expressApp.use(express.urlencoded({ extended: true }))

    //Logger
    expressApp.use(loggerMdw(logger))

    //Authentication
    authenticationManager.initApp(expressApp) //Con PassportLocalAuthentication

    //Routes
    expressApp.use('/', webRouter(rootPath, authenticationManager, logger, imageLoaderMdw(IMAGES_PATH)))
    expressApp.use('/', apiRouter())
    expressApp.use('/', processRouter(rootPath))
    // expressApp.use('/api/productos-test', mockRouter)
    expressApp.use(unkownRoute(logger))

    return expressApp
}

