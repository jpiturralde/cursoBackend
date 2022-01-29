import { createTransport as nodemailerFactory } from 'nodemailer'

const DEFAULT_PORT = 587

export const createEmailManager = (emailManagerConf) => {
    const { logger } = process.context
    const transport = createTransport(emailManagerConf)
    logger.info('MailManager transport', transport)
    return emailManager(transport)
}

function createTransport(emailManagerConf) {
    if (emailManagerConf && emailManagerConf.type) {
        switch (emailManagerConf.type) {
            case 'ethereal': 
                return createEtherealTransport(emailManagerConf)
            case 'gmail':
                return createGmailTransport(emailManagerConf)
            default:
                throw Error(`Unkown mail manager type ${emailManagerConf.type}`)
        }
    }
    throw Error(`Invalid mailManagerConf = ${emailManagerConf}`)
}

function createEtherealTransport(emailManagerConf) {
    return nodemailerFactory({
        host: emailManagerConf.host,
        port: emailManagerConf.port || DEFAULT_PORT,
        auth: emailManagerConf.auth
    })
}

function createGmailTransport(emailManagerConf) {
    return nodemailerFactory({
        service: emailManagerConf.type,
        port: emailManagerConf.port || DEFAULT_PORT,
        auth: emailManagerConf.auth
    })
}

const DEFAULT_FROM = 'UNKNOWN_FROM'
const DEFAULT_SUBJECT = 'Server notification'
function emailManager(transport) {
    return {
        sendMail: async (mailOptions) => {
            if (!mailOptions.to) {
                throw Error(`Send mail error: Invalid to = ${to}`)
            }
            const options = {
                from: mailOptions.from || DEFAULT_FROM,
                to: mailOptions.to,
                subject: mailOptions.subject || DEFAULT_SUBJECT,
                html: mailOptions.html,
                attachments: mailOptions.attachments
            }
            return await transport.sendMail(options)
        }
    }
}