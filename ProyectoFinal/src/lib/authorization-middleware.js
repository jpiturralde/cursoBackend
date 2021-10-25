export const authorization = (scopes = []) => {
    return (req, res, next) => {
        if (isSecured(scopes, req) && !isAuthorized(req)) {
            return res.status(401).json(ACCESS_DENIED(req))
        }
        next();
    }
}

const ACCESS_DENIED = (req) => { 
    return {
        error : -1, 
        descripcion: `${req.method} ${req.path} acceso denegado.` 
    }
}

const isSecured = (scopes, req) => {
    const scope = securedScope(scopes, req.path)
    return  scope && securedMethod(scope, req.method)
}

const isAuthorized = (req) => {
    return req.headers['authorization'] == 'admin'
}

const securedScope = (scopes, path) => {
    if (scopes.length > 0) {
        const scope = scopes.filter(s => path.startsWith(s.path)) 
        if (scope.length > 0) {
            return scope[0]
        }
    }
    return false
}

const securedMethod = (scope, method) => {
    const secMethod = scope.methods.filter(m => method == m)
    return secMethod.length > 0
}