import twilio from 'twilio'

export const createMsgNotificationManager = (msgNotificationManagerConf) => {
    const { accountSid, authToken, smsPhone, whatsappPhone } = msgNotificationManagerConf
    if (!accountSid || !authToken) {
        throw Error(`Invalid Twilio credentials ${{ accountSid, authToken }}`)
    }
    if (!smsPhone) {
        throw Error(`Invalid Twilio SMS configuration ${smsPhone}`)
    }
    if (!whatsappPhone) {
        throw Error(`Invalid Twilio WhasApp configuration ${whatsappPhone}`)
    }
    
    const client = twilio(accountSid, authToken)

    const send = async (to, body, type='SMS') => {
        if (!to || to == '') {
            throw Error(`Send message error: Invalid to = ${to}`)
        }
        const options = { body, to }
        if (type == 'SMS') {
            options.from = smsPhone
        }
        else {
            options.to = `whatsapp:${to}`
            options.from = `whatsapp:${whatsappPhone}`
        }
        return client.messages.create(options)
    }

    return {
        sendSms: async (to, body) => {
            return send(to, body)
        },
        sendWhatsApp: async (to, body) => {
            return send(to, body, 'WHATSAPP')
        }
    }
}
