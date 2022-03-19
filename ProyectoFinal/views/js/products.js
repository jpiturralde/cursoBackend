async function loadProducts() {
    const data = await api.products.get()
    renderProducts(data)
}

async function renderProducts(products) {
    const productsTpl = await loadAndCompileTemplate('products.hbs')
    const thereAreProducts = products.length > 0
    const html = productsTpl({ thereAreProducts, products })
    if (document.getElementById('products') && html) {
        document.getElementById('products').innerHTML = html
    }
}

async function addProduct(e) {
    const product = {
        title: document.getElementById('title').value,
        price: document.getElementById('price').value,
        thumbnail: document.getElementById('thumbnail').value
    };
    document.getElementById('title').value = ''
    document.getElementById('price').value = ''
    document.getElementById('thumbnail').value = ''
    const response = await api.products.post(product)
    if (response.status == 401) {
        location.href = '/login'
    }
    return false;
}
