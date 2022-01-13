export const logger = (req, res, next) => {
    const date = new Date()
    console.log(`${date.toLocaleString()} ${process.ppid}-${process.pid} ${req.method} ${req.path}`)
    next();
}

export const loggerMdw = (logger) => (req, res, next) => {
    const date = new Date()
    logger.info(`${process.ppid}-${process.pid} ${req.method} ${req.path}`)
    next();
}