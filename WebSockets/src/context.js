// LOGGER
import { logger } from './logger.js'

import { loadEnvArgs } from './context-env-args.js'
import { loadPersistence } from './context-persistence.js'
import { loadSessionManager } from './context-session.js'
import { createAthenticationManager as loadAuthenticationManager} from './context-authentication.js'

const baseContext = {
    ROOT_PATH: process.cwd(),
    logger    
}

process.context = baseContext

const envArgsContext = await loadEnvArgs()

// let context = { 
//     ...baseContext,
//     ...envArgsContext
// }

process.context = { 
    ...baseContext,
    ...envArgsContext
}
process.context.persistence = await loadPersistence()
process.context.sessionMiddleware = await loadSessionManager()
process.context.authenticationManager = await loadAuthenticationManager()
const context = process.context
export { context }



