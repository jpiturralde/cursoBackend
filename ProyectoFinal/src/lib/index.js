import { logger, loggerMdw } from "./logger-middleware.js"
import { 
    errorHandler, 
    ACCESS_DENIED_ERROR_MSG, 
    UNKNOWN_ROUTE_ERROR_MSG, 
    INVALID_ENTITY_ERROR_MSG,
    ENTITY_NOT_FOUND_ERROR_MSG 
} from "./error-handler-middleware.js"
import { authentication, isAuthenticated, isSecured, securedScope, securedMethod } from "./authentication-middleware.js"
import { authorization } from "./authorization-middleware.js"
import { unkownRoute } from "./unknown-route-middleware.js"
import { imageLoaderMdw } from "./image-loader-middleware.js"

export { 
    logger, loggerMdw,
    errorHandler, 
    authentication, isAuthenticated, isSecured, securedScope, securedMethod,
    authorization, ACCESS_DENIED_ERROR_MSG, 
    unkownRoute, UNKNOWN_ROUTE_ERROR_MSG, 
    INVALID_ENTITY_ERROR_MSG,
    ENTITY_NOT_FOUND_ERROR_MSG,
    imageLoaderMdw
}

