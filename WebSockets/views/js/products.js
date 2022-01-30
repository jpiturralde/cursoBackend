/* BEGIN PRODUCTS */
const url = window.location.origin + '/api/productos'

const api = {
    get: async () => { 
        return JSON.parse(await fetch(url).then(response => response.text()))
    },
    post: async (product) => { 
        return JSON.parse(await fetch(url, {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(product)
          }))
    }
}

async function loadData() {
    const data = await api.get()
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
    await api.post(product)
    return false;
}
