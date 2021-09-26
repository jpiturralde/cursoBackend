const loggerRouter = (req, res, next) => {
    const date = new Date()
    console.log(`${date.toLocaleString()} ${req.method} ${req.path}`)
    next();
}

const ERR_400_INVALID_ID = { error: 'El parámetro ingresado no es un número' }
const ERROR = { error: 'MESSAGE'}

const idValidatorRouter = (req, res, next) => {
    const num = parseInt(req.params.id)

    if (isNaN(num)) {
        return res.status(400).json(ERR_400_INVALID_ID)
    }
    next();
}

const errorHandler = (err, req, res, next) => {
    console.log('errorHandler ' + err.httpStatusCode)
    console.error(err.stack);
    if (!err.httpStatusCode) {
        res.status(500).send('Algo anduvo mal :(');
    }
    ERROR.error = err.message
    res.status(err.httpStatusCode).json(ERROR)
  }
  

module.exports = { loggerRouter, idValidatorRouter, errorHandler }