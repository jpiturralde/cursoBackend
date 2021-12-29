export const logger = (req, res, next) => {
    const date = new Date()
    console.log(`${date.toLocaleString()} ${process.ppid}-${process.pid} ${req.method} ${req.path}`)
    next();
}
