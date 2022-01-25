// LOGGER
import { logger } from './logger.js'

import { loadEnvArgs } from './context-env-args.js'
import { loadPersistence } from './context-persistence.js'
import { loadSessionManager } from './context-session.js'
import { createAthenticationManager as loadAuthenticationManager} from './context-authentication.js'
import { loadApiContext } from './context-api.js'

const baseContext = {
    ROOT_PATH: process.cwd(),
    logger    
}

process.context = baseContext

const envArgsContext = await loadEnvArgs()

process.context = { 
    ...baseContext,
    ...envArgsContext
}
process.context.persistence = await loadPersistence()
process.context.sessionMiddleware = await loadSessionManager()
process.context.authenticationManager = await loadAuthenticationManager()
process.context.api = await loadApiContext()

const context = process.context
export { context }



