import * as fs from 'fs'

import { logger } from './logger.js'

import { loadEnvArgs } from './context-env-args.js'
import { loadPersistence } from './context-persistence.js'
import { loadSessionManager } from './context-session.js'
import { createAthenticationManager as loadAuthenticationManager} from './context-authentication.js'
import { loadApiContext } from './context-api.js'
import { createEmailManager } from './lib/emailManager.js'
import { createMsgNotificationManager } from './lib/msgNotificationManager.js'

const loadConfig = async (configPath) => {
    logger.info(`Loading ${configPath}`)
    try {
        return JSON.parse(
            await new Promise((resolve, reject) => {
                fs.readFile(configPath, 'utf8', (err, data) => {
                    if (err) return reject(err)
                    resolve(data)
                })
            })
        )
    } catch (error) {
        logger.error('********************** Loading context error **********************')
        logger.error(`Path = ${configPath}`)
        logger.error(error)
        logger.error('********************** Process exit *******************************')
        process.exit(1)
    }
}

const baseContext = {
    ROOT_PATH: process.cwd(),
    logger    
}

process.context = baseContext

const envArgsContext = await loadEnvArgs()

process.context = { 
    ...baseContext,
    ...envArgsContext,
}

const commonConfig = await loadConfig(process.context.COMMON_CONFIG_PATH)

process.context = {
    ...process.context,
    ...commonConfig
}
process.context.emailManager = createEmailManager(process.context.emailManagerConf)
process.context.msgNotificationManager = createMsgNotificationManager(process.context.msgNotificationManagerConf)
process.context.persistence = await loadPersistence()
process.context.sessionMiddleware = await loadSessionManager()
process.context.api = await loadApiContext()
process.context.authenticationManager = await loadAuthenticationManager()

const context = process.context
export { context }



