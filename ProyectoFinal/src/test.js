async function prueba(p) {
	if (p) {
    	return 'RESOLVE'
    }
    throw Error('REJECT')
}

prueba(1)
.then(msg => console.log(msg))
.catch(error => console.log(error.message))

prueba()
.then(msg => console.log(msg))
.catch(error => console.log(error.message))


// import { context } from './context.js'

// const {logger, msgNotificationManager } = context
// logger.info(context)
// try {
//     const sms = await msgNotificationManager.sendWhatsApp(context.sysadm.phone, 'Hola soy un SMS desde Node.js!')
//     console.log(sms)
// } catch (error) {
//     console.log(error)
// }





// const emailManager = process.context.emailManager
// try {
//     const user = {
//         id: 1111111,
//         username: 'j@p',
//         name: 'Juan',
//         address: 'Gaona',
//         phone: '45353534',
//         avatar: 'dfsjskfjasljfds.png'
//     }
//     const USER_HTML = `<p><strong>ID: <span style="font-size:20px">${user.id}</span></strong></p>
    
//     <p><strong>Username: <span style="font-size:20px">${user.username}</span></strong></p>

//     <p><strong>Name: <span style="font-size:20px">${user.name}</span></strong></p>
    
//     <p><strong>Address: <span style="font-size:20px">${user.address}</span></strong></p>
    
//     <p><strong>Phone: <span style="font-size:20px">${user.phone}</span></strong></p>
    
//     <p><strong>Avatar: <span style="font-size:20px">${user.avatar}</span></strong></p>`

//     const mailOptions = {
//         to: process.context.sysadm.email,
//         subject: `Signup ${user.id}`,
//         html: USER_HTML
//         //html: '<h1 style="color: blue;">Contenido de prueba con archivo adjunto desde <span style="color: green;">Node.js con Nodemailer</span></h1>'
//     }
//     const info = await emailManager.sendMail(mailOptions)
//     logger.info(info)
// } catch (error) {
//     logger.error(error)
// }

