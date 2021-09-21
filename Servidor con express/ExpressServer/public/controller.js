const fs = require('fs')
const index = fs.readFileSync('./index.html', 'utf8')
function processRoot(res) {
    res.send(index)
}

async function processProducts(res, db) {
    res.json(await db.getProducts())
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

async function processProductRandom(res, db) {
    const products = await db.getProducts()

    res.json(await db.getProduct(getRandomInt(1, products.length+1)))
}

module.exports = {processRoot, processProducts, processProductRandom}