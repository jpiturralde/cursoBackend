const express = require('express')
const { Server: HttpServer } = require('http')
const { Server: IOServer } = require('socket.io')

const app = express()
const http = new HttpServer(app)
const io = new IOServer(http)

const messages = [
    { author: "Juan", text: "¡Hola! ¿Que tal?", ts: 1634218734271},
    { author: "Pedro", text: "¡Muy bien! ¿Y vos?", ts: 1634219290446 },
    { author: "Ana", text: "¡Genial!", ts: 1634219329945 }
];

const products = [
    {
      id: 1,
      value: {
        title: "Escuadra",
        price: 122.45,
        thumbnail: "https://cdn3.iconfinder.com/data/icons/education-209/64/ruler-triangle-stationary-school-256.png"
      }
    },
    {
      id: 2,
      value: {
        title: "Calculadora",
        price: 234.56,
        thumbnail: "https://cdn3.iconfinder.com/data/icons/education-209/64/calculator-math-tool-school-256.png"
      }
    },
    {
      id: 3,
      value: {
        title: "Globo Terráqueo",
        price: 345.67,
        thumbnail: "https://cdn3.iconfinder.com/data/icons/education-209/64/globe-earth-geograhy-planet-school-256.png"
      }
    }
  ]

app.use(express.static('public'))

io.on('connection', socket => {
    console.log('Un cliente se ha conectado')

    /* Envio los mensajes al cliente que se conectó */
    socket.emit('messages', messages)

    /* Envio los productos al cliente que se conectó */
    socket.emit('products', products)
    
    socket.on('new-message',data => {
        data.ts = Date.now()
        messages.push(data);
        io.sockets.emit('messages', messages);
    });

    socket.on('new-product',data => {
        console.log(data)
        const p = { id: products.length, value: data}
        products.push(p);
        io.sockets.emit('products', products);
    });
})


/* ------------------------------------------------------ */
/* Server Listen */
const PORT = process.env.port || 8080
const httpServer = http.listen(PORT)
httpServer.on('listening', () => {
    console.log(`Servidor escuchando en el puerto ${httpServer.address().port}`)
})
httpServer.on('error', error => console.log(`Error en servidor ${error}`))