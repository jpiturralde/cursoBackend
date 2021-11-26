
Handlebars.registerHelper("log", function(something) {
    console.log(something);
});

async function loadAndCompileTemplate(templatePath) {
    const template = await fetch(templatePath).then(response => response.text())
    return Handlebars.compile(template)
}

/* BEGIN PRODUCTS */
async function renderProducts() {
    const products = JSON.parse(await fetch("http://localhost:8080/api/productos-test").then(response => response.text()))
    const productsTpl = await loadAndCompileTemplate('/templates/products.hbs')
    const thereAreProducts = products.length > 0
    const html = productsTpl({ thereAreProducts, products })
    document.getElementById('products').innerHTML = html
}

