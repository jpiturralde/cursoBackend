/* BEGIN PRODUCTS */
async function renderProducts() {
    const products = JSON.parse(await fetch("http://localhost:8080/api/productos-test").then(response => response.text()))
    const productsTpl = await loadAndCompileTemplate('products.hbs')
    const thereAreProducts = products.length > 0
    const html = productsTpl({ thereAreProducts, products })
    document.getElementById('products').innerHTML = html
}

