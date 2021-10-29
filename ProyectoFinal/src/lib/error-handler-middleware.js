const ERROR = { error: 'MESSAGE'}

export const errorHandler = (err, req, res, next) => {
  if (!err.httpStatusCode) {
        console.error(err.stack);
        res.status(500).send('Algo anduvo mal :(');
    }
    ERROR.error = err.message
    res.status(err.httpStatusCode).json(ERROR)
}

export const ACCESS_DENIED_ERROR_MSG = (req) => { 
  return {
      error : -1, 
      descripcion: `${req.method} ${req.path} acceso denegado.` 
  }
}

export const UNKNOWN_ROUTE_ERROR_MSG = (req) => { 
  return  {
      error : -2, 
      descripcion: `${req.method} ${req.path} no implementada`
  } 
}

export const INVALID_ENTITY_ERROR_MSG = (errors) => { 
  return  {
      error : -3, 
      descripcion: errors
  } 
}

export const ENTITY_NOT_FOUND_ERROR_MSG = (msg) => { 
  return  {
      error : -4, 
      descripcion: msg
  } 
}
