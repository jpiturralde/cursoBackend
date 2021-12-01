const socket = io.connect();

Handlebars.registerHelper("timestampToLocaleString", function(timestamp) {
    const date = new Date(timestamp)
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
})

async function loadAndCompileTemplate(templatePath) {
    const template = await fetch(templatePath).then(response => response.text())
    return Handlebars.compile(template)
}

/* BEGIN PRODUCTS */
async function renderProducts(products) {
    const productsTpl = await loadAndCompileTemplate('/templates/products.hbs')
    const html = productsTpl({ products })
    document.getElementById('products').innerHTML = html
}

function addProduct(e) {
    socket.emit('new-product', document.getElementById('product').value)
    document.getElementById('product').value = ''
    return false;
}
/* END PRODUCTS */

/* BEGIN MESSAGES */
async function renderMessages(messages) {
    const messagesTpl = await loadAndCompileTemplate('/templates/messages.hbs')
    const html = messagesTpl({ messages })
    document.getElementById('messages').innerHTML = html
}

function addMessage(e) {
    socket.emit('new-message', document.getElementById('message').value);
    document.getElementById('message').value = ''
    return false;
}

function goToLogin() {
    console.log('goToLogin')
    location.assign('/login.html')
    return false
}

async function login(e) {
    const URL = `${window.location.origin}/api/login?nombre=${document.getElementById('userName').value}`
    console.log('Login de ' + document.getElementById('userName').value, URL)
    let greeting ='NADA'
    try {
        greeting = JSON.parse(await fetch(URL).then(response => response.text()))
        console.log('DESPUES', greeting)
        console.log('emit new-session')
        socket.emit('new-session')
        return false
    } catch (error) {
        console.error('ERROOOOOOOR: ', error)  
        console.log('llamo de nuevo')
        await login(e)
    } finally {
        console.log('greeting', greeting)
    }
}

async function renderLogin() {
    console.log('renderLogin')
    const tpl = await loadAndCompileTemplate('/templates/login.hbs')
    if (tpl) {
        const html = tpl({msg:'login'})
        document.getElementById('content').innerHTML = html
    }
}

async function renderSession(userName, messages, products) {
    console.log('renderSession')
    const sessionTpl = await loadAndCompileTemplate('/templates/session.hbs')
    const html = sessionTpl({ userName })
    document.getElementById('content').innerHTML = html
    renderProducts(products)
    renderMessages(messages)
}

async function logout(e) {
    console.log('Logout')
    const URL = `${window.location.origin}/api/logout`
    const msg = JSON.parse(await fetch(URL).then(response => response.text()))
    console.log('Logout', msg)
    const tpl = await loadAndCompileTemplate('/templates/logout.hbs')
    if (tpl) {
        const html = tpl(msg)
        document.getElementById('content').innerHTML = html
    }
    load()
    return false
}

function load()
{
   // const URL = `${window.location.origin}
    console.log('load')
//    setTimeout("window.open('http://YourPage.com', '_self');", 5000);
    setTimeout("window.open('http://localhost:8080'_self');}", 2000);
}

/* END MESSAGES */

socket.on('messages', function(messages) { renderMessages(messages); });
socket.on('products', function(products) { renderProducts(products); });
socket.on('login', function() { 
    console.log('on login')
    renderLogin(); });
socket.on('session', function(userName, messages, products) { 
    console.log('on session')
    renderSession(userName, messages, products); });