import { ENTITY_NOT_FOUND_ERROR_MSG } from "../lib/index.js"

const apiSpec = (ds) => {
    const { emailManager, sysadm } = process.context 
    const notifyFn = checkoutNotifier(emailManager, sysadm)
    return {
        getById: async (id) => { return await ds.getById(id) },
        post: async (data) => { return await ds.post(data) },
        deleteById: async (id) => { return await ds.deleteById(id) },
        getItems: async (id) => { 
            const shooppingCart = await find(ds, id)
            return shooppingCart.items
        },
        addItem: async (id, item) => {
            const shoppingCart = await find(ds, id)
            const index = shoppingCart.items.findIndex(x => x.productId == item.productId)
            let result = item
            if (index > -1) {
                shoppingCart.items[index].quantity += item.quantity
                result = shoppingCart.items[index]
            }
            else {
                const product = await process.context.api.products.getById(item.productId)
                if (!product) {
                    throw Error(JSON.stringify(ENTITY_NOT_FOUND_ERROR_MSG(`Producto ${item.productId} no encontrado.`)))
                }
                shoppingCart.items.push(item)
            }
            await ds.put(id, shoppingCart)
            return result
        },
        deleteItem: async (id, productId) => {
            const shoppingCart = await find(ds, id)
            const newContent = shoppingCart.items.filter(x => x.productId!=productId)
            if (newContent.length < shoppingCart.items.length) {
                shoppingCart.items = newContent
                await ds.put(id, shoppingCart)
            }
        },
        checkout: async (id, user) => {
            if (!user) {
                throw Error(JSON.stringify(ENTITY_NOT_FOUND_ERROR_MSG(`Usuario ${user}. No es posible hacer checkout.`)))
            }
            const shoppingCart = await find(ds, id)
            shoppingCart.checkout = true
            await ds.put(id, shoppingCart)
            notifyFn({user, shoppingCart})
        }
    }
}

const find = async (ds, id) => {
    const shoppingCart = await ds.getById(id)
    if (!shoppingCart) {
        throw Error(JSON.stringify(ENTITY_NOT_FOUND_ERROR_MSG(`Shopping Cart ${id} no encontrado.`)))
    }
    return shoppingCart
}

const shoppingCartToHtml = (shooppingCart) => {
    const itemsHtml = shooppingCart.items.map( (item) => {
        return `<p>Producto: ${item.productId}  -  Cantidad: ${item.quantity}</p>
        `
        }
    )
    
    return `<p><strong>Pedido Nro: <span style="font-size:20px">${shooppingCart.id}</span></strong></p> 

    <p><strong><span style="font-size:20px">Items</span></strong></p>

    ${itemsHtml}`
}

const checkoutNotifier = (emailManager, sysadm) => {
    return async (checkout) => {
        const mailOptions = {
            to: sysadm.email,
            subject: `Nuevo pedido de ${checkout.user.name} - ${checkout.user.username}`,
            html: shoppingCartToHtml(checkout.shoppingCart)
        }
        emailManager.sendMail(mailOptions)    
    }
}

export const ShoppingCartsAPI = (ds) => apiSpec(ds)