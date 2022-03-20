const userUrl = window.location.origin + '/api/user'
const productsUrl = window.location.origin + '/api/productos'
const shoppingCartUrl = window.location.origin + '/api/carrito'

const commonHeaders = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
}

function headers(token) {
    if (token) {
        return {
            ...commonHeaders,
            'Authorization': `Bearer ${token}`
        }
    }
    return commonHeaders
}

const api = {
    user: {
        signup: async (body) => { 
            const response = await fetch(userUrl + '/signup', {
                method: 'POST',
                body
            })
            if (response.status == 200) {
                const content = await response.json()
                const { user, token } = content
                saveUserInfo(user, token)
            }
            return response
        },
        signin: async (body) => { 
            const response = await fetch(userUrl + '/signin', {
                method: 'POST',
                headers: headers(),
                body: JSON.stringify(body)
            })
            if (response.status == 200) {
                const content = await response.json()
                const { user, token } = content
                saveUserInfo(user, token)
            }
            return response
        }
    },
    products: {
        get: async () => { 
            return JSON.parse(await fetch(productsUrl, {
                headers: headers(token())
            }).then(response => response.text()))
        },
        post: async (product) => { 
            return await fetch(productsUrl, {
                method: 'POST',
                headers: headers(token()),
                body: JSON.stringify(product)
            })
        }
    },
    shoppingCart: {
        current: async () => { 
            const response = await fetch(`${shoppingCartUrl}/${shoppingCartId()}`, {
                headers: headers(token()),
            })
            return response.json()
        },
        deleteItems: async () => { 
            const response = await fetch(`${shoppingCartUrl}/${shoppingCartId()}/productos`, {
                method: 'DELETE',
                headers: headers(token()),
            })
            return response.json()
        },
        addItem: async (item) => { 
            return JSON.parse(await fetch(`${shoppingCartUrl}/${shoppingCartId()}/productos`, {
                method: 'POST',
                headers: headers(token()),
                body: JSON.stringify(item)
            }))
        },
        checkout: async () => {
            return JSON.parse(await fetch(`${shoppingCartUrl}/${shoppingCartId()}/checkout`, {
                method: 'PATCH',
                headers: headers(token())
            }))
        }
    }
    
}

function saveUserInfo(user, token) {
    localStorage.setItem("user", JSON.stringify(user))
    localStorage.setItem("shoppingCartId", user.shoppingCartId)
    localStorage.setItem("access_token", token);
}

function token() {
    return localStorage.getItem('access_token')
}

function shoppingCartId() {
    return localStorage.getItem('shoppingCartId')
}

function user() {
    return JSON.parse(localStorage.getItem('user'))
}