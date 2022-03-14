import { ENTITY_NOT_FOUND_ERROR_MSG } from "../lib/index.js"

const apiSpec = (ordersDS) => {
    const { msgNotificationManager, emailManager, sysadm } = process.context 
    const notifiy = orderNotifier(sysadm, emailManager, msgNotificationManager)
    
    return {
        getById: async (id) => { return await ordersDS.getById(id) },
        getByEmail: async (email) => { return await ordersDS.getByEmail(email) },
        post: async (user, shoppingcart) => { 
            const { users } = process.context.api
            const userInRepo = users.getByUserName(user.username)
            if (!userInRepo) {
                throw Error(JSON.stringify(ENTITY_NOT_FOUND_ERROR_MSG(`User ${user.username} no encontrado.`)))
            }
            const data = {
                email: user.username,
                items: shoppingcart.items
            }
            const order = await ordersDS.post(data)
            notifiy(user, order)
            return order
        }
    }
}

const orderToHtml = (order) => {
    const itemsHtml = order.items.map( (item) => {
        return `<p>Producto: ${item.productId}  -  Cantidad: ${item.quantity}</p>
        `
        }
    )
    
    return `<p><strong>Pedido Nro: <span style="font-size:20px">${order.id}</span></strong></p> 

    <p><strong><span style="font-size:20px">Items</span></strong></p>

    ${itemsHtml}`
}

const orderNotifier = (sysadm, emailManager, msgNotificationManager) => {
    return async (user, order) => {
        const body = orderToHtml(order)
        if (process.context.notifyCheckoutToSysadmByEmail) {
            const mailOptions = {
                to: sysadm.email,
                subject: `Nuevo pedido de ${user.name} - ${user.username}`,
                html: body
            }
            emailManager.sendMail(mailOptions)        
        }
        if (process.context.notifyCheckoutToSysadmByWhatsapp) {
            msgNotificationManager.sendWhatsApp(sysadm.phone, body)
        }
        if (process.context.notifyCheckoutToUserBySMS) {
            msgNotificationManager.sendSms(user.phone, `Pedido ${order.id} se encuentra en proceso.`)
        }        
    }
}

export const OrdersAPI = (ordersDS) => apiSpec(ordersDS)