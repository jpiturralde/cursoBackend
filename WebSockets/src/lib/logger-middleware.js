export const logger = (req, res, next) => {
    const date = new Date()
    console.log(`${date.toLocaleString()} ${req?.session?.userName} ${req.method} ${req.path}`)
    next();
}
