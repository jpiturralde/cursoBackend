const logger = (req, res, next) => {
    const date = new Date()
    console.log(`${date.toLocaleString()} ${req.method} ${req.path}`)
    next();
}

const ERR_400_INVALID_ID = { error: 'El parámetro ingresado no es un número' }
const ERROR = { error: 'MESSAGE'}

const idValidator = (req, res, next) => {
    const num = parseInt(req.params.id)

    if (isNaN(num)) {
        return res.status(400).json(ERR_400_INVALID_ID)
    }
    next();
}

const errorHandler = (err, req, res, next) => {
   if (!err.httpStatusCode) {
        console.error(err.stack);
        res.status(500).send('Algo anduvo mal :(');
    }
    ERROR.error = err.message
    res.status(err.httpStatusCode).json(ERROR)
  }
  

module.exports = { logger, idValidator, errorHandler }