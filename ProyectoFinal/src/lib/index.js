export const logger = (req, res, next) => {
    const date = new Date()
    console.log(`${date.toLocaleString()} ${req.method} ${req.path}`)
    next();
}

const ERROR = { error: 'MESSAGE'}


export const errorHandler = (err, req, res, next) => {
  if (!err.httpStatusCode) {
        console.error(err.stack);
        res.status(500).send('Algo anduvo mal :(');
    }
    ERROR.error = err.message
    res.status(err.httpStatusCode).json(ERROR)
}
