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

module.exports = {processProducts, processProductRandom}