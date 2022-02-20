/* BEGIN PRODUCTS */
const url = window.location.origin + '/api/carrito'

const api = {
    current: async (id) => { 
        return JSON.parse(await fetch(`${url}/current`).then(response => response.text()))
    },
    // post: async () => { 
    //     const response = await fetch(url, {
    //         method: 'POST',
    //         headers: {
    //           'Accept': 'application/json',
    //           'Content-Type': 'application/json'
    //         }
    //     })
    //     return response.json()
    // },
    deleteItems: async (id) => { 
        const response = await fetch(`${url}/${id}/productos`, {
            method: 'DELETE',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
        })
        return response.json()
    },
    addItem: async (id, item) => { 
        return JSON.parse(await fetch(`${url}/${id}/productos`, {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(item)
        }))
    },
    checkout: async (id) => {
        return JSON.parse(await fetch(`${url}/${id}/checkout`, {
            method: 'PATCH',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
        }))
    }
}

async function loadData() {
    const shoppingCart = await api.current()
    setShoppingCartId(shoppingCart.id)
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
    setShoppingCartId(shoppingCart.id)
}

async function addProduct(e) {
    const product = {
        productId: document.getElementById('productId').value,
        quantity: document.getElementById('quantity').value
    };
    document.getElementById('productId').value = ''
    document.getElementById('quantity').value = ''
    await api.addItem(getShoppingCartId(), product)
    return false;
}

function setShoppingCartId(id) {
    document.getElementById('shoppingCartId').innerHTML = id
}

function getShoppingCartId() {
    return document.getElementById('shoppingCartId').innerHTML
}

async function deleteShoppingCartItems() {
    api.deleteItems(getShoppingCartId())
    await showInformation('Pedido Cancelado')
    setShoppingCartId('')
    setTimeout((page) => {location.href = page}, 2000, '/')
}

async function checkout() {
    await api.checkout(getShoppingCartId())
    await showInformation(`Se generó el pedido número: ${getShoppingCartId()}`)
    setShoppingCartId('')
    setTimeout((page) => {location.href = page}, 2000, '/')
}

async function showInformation(msg) {
    const tpl = await loadAndCompileTemplate('information.hbs')
    const html = tpl({ msg })
    if (document.getElementById('products') && html) {
        document.getElementById('products').innerHTML = html
    }
}