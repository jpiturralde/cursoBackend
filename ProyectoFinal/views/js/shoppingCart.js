async function loadData() {
    const shoppingCart = await api.shoppingCart.current()
    render(shoppingCart)
}

async function render(shoppingCart) {
    const shoppingCartTpl = await loadAndCompileTemplate('shoppingCart.hbs')
    const thereAreProducts = shoppingCart.items.length > 0
    const products = shoppingCart.items
    const html = shoppingCartTpl({ thereAreProducts, products })
    if (document.getElementById('products') && html) {
        document.getElementById('products').innerHTML = html
    }
}

async function addProduct(e) {
    const product = {
        productId: document.getElementById('productId').value,
        quantity: document.getElementById('quantity').value
    };
    document.getElementById('productId').value = ''
    document.getElementById('quantity').value = ''
    await api.shoppingCart.addItem(product)
    return false;
}

async function deleteShoppingCartItems() {
    api.shoppingCart.deleteItems()
    await showInformation('Pedido Cancelado')
    setTimeout((page) => {location.href = page}, 2000, '/')
}

async function checkout() {
    await api.shoppingCart.checkout()
    await showInformation(`Se generó el pedido número: ${shoppingCartId()}`)
    setTimeout((page) => {location.href = page}, 2000, '/')
}

async function showInformation(msg) {
    const tpl = await loadAndCompileTemplate('information.hbs')
    const html = tpl({ msg })
    if (document.getElementById('products') && html) {
        document.getElementById('products').innerHTML = html
    }
}