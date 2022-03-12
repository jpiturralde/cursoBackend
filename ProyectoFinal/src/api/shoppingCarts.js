import { ENTITY_NOT_FOUND_ERROR_MSG } from "../lib/index.js"

const apiSpec = (shoppingCartsDS, shoppingCartsByUserDS) => {
    const { msgNotificationManager, emailManager, sysadm } = process.context 
    const notifiyCheckout = checkoutNotifier(sysadm, emailManager, msgNotificationManager)
    return {
        getById: async (id) => { return await shoppingCartsDS.getById(id) },
        getByUser: async (id) => {
            const shoppingCartByUser = await shoppingCartsByUserDS.getByUser(id)
            return await shoppingCartsDS.getById(shoppingCartByUser.shoppingCartId) },
        post: async (userId, data) => { 
            const shoppingCart = await shoppingCartsDS.post(data)
            await shoppingCartsByUserDS.post({userId, shoppingCartId: shoppingCart.id })
            return shoppingCart
        },
        deleteById: async (id) => { return await shoppingCartsDS.deleteById(id) },
        getItems: async (id) => { 
            const shooppingCart = await find(shoppingCartsDS, id)
            return shooppingCart.items
        },
        addItem: async (id, item) => {
            const shoppingCart = await find(shoppingCartsDS, id)
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
            await shoppingCartsDS.put(id, shoppingCart)
            return result
        },
        deleteItems: async (id) => {
            const shoppingCart = await find(shoppingCartsDS, id)
            shoppingCart.items = []
            await shoppingCartsDS.put(id, shoppingCart)
    },
        deleteItem: async (id, productId) => {
            const shoppingCart = await find(shoppingCartsDS, id)
            const newContent = shoppingCart.items.filter(x => x.productId!=productId)
            if (newContent.length < shoppingCart.items.length) {
                shoppingCart.items = newContent
                await shoppingCartsDS.put(id, shoppingCart)
            }
        },
        checkout: async (id, user) => {
            if (!user) {
                throw Error(JSON.stringify(ENTITY_NOT_FOUND_ERROR_MSG(`Usuario ${user}. No es posible hacer checkout.`)))
            }
            const shoppingCart = await find(shoppingCartsDS, id)
            //shoppingCart.checkout = true
            shoppingCart.items = []
            await shoppingCartsDS.put(id, shoppingCart)
            notifiyCheckout({user, shoppingCart})
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

const checkoutNotifier = (sysadm, emailManager, msgNotificationManager) => {
    return async (checkout) => {
        const body = shoppingCartToHtml(checkout.shoppingCart)
        if (process.context.notifyCheckoutToSysadmByEmail) {
            const mailOptions = {
                to: sysadm.email,
                subject: `Nuevo pedido de ${checkout.user.name} - ${checkout.user.username}`,
                html: body
            }
            emailManager.sendMail(mailOptions)        
        }
        if (process.context.notifyCheckoutToSysadmByWhatsapp) {
            msgNotificationManager.sendWhatsApp(sysadm.phone, body)
        }
        if (process.context.notifyCheckoutToUserBySMS) {
            msgNotificationManager.sendSms(checkout.user.phone, `Pedido ${checkout.shoppingCart.id} se encuentra en proceso.`)
        }        
    }
}

export const ShoppingCartsAPI = (shoppingCartsDS, shoppingCartsByUserDS) => apiSpec(shoppingCartsDS, shoppingCartsByUserDS)