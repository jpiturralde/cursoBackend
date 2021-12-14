export const authentication = (scopes = [], loginURI = '/login') => {
    return (req, res, next) => {
        if (isSecured(scopes, req) && !isAuthenticated(req)) {
            res.redirect(loginURI)
        } else {
            next()
        }
    }
}

export const isAuthenticated = (req) => { return req.session.userName != undefined }

export const isSecured = (scopes, req) => {
    const scope = securedScope(scopes, req.path)
    return  scope && securedMethod(scope, req.method)
}

export const securedScope = (scopes, path) => {
    if (scopes.length > 0) {
        const scope = scopes.filter(s => path.startsWith(s.path)) 
        if (scope.length > 0) {
            return scope[0]
        }
    }
    return false
}

export const securedMethod = (scope, method) => {
    const secMethod = scope.methods.filter(m => method == m)
    return secMethod.length > 0
}