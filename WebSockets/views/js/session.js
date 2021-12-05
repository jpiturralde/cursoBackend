const socket = io.connect();

/* BEGIN PRODUCTS */
async function renderProducts(products) {
    const productsTpl = await loadAndCompileTemplate('products.hbs')
    const thereAreProducts = products.length > 0
    const html = productsTpl({ thereAreProducts, products })
    if (document.getElementById('products') && html) {
        document.getElementById('products').innerHTML = html
    }
}

function addProduct(e) {
    const product = {
        title: document.getElementById('title').value,
        price: document.getElementById('price').value,
        thumbnail: document.getElementById('thumbnail').value
    };
    document.getElementById('title').value = ''
    document.getElementById('price').value = ''
    document.getElementById('thumbnail').value = ''
    socket.emit('new-product', product);
    return false;
}
/* END PRODUCTS */

/* BEGIN MESSAGES */
// async function renderMessages(messages) {
//     const messagesTpl = await loadAndCompileTemplate('messages.hbs')
//     const html = messagesTpl({ messages })
//     if (document.getElementById('messages') && html) {
//         document.getElementById('messages').innerHTML = html
//     }
// }

// function addMessage(e) {
//     socket.emit('new-message', document.getElementById('message').value);
//     document.getElementById('message').value = ''
//     return false;
// }
function createMessage() {
    const message = {
        author: {
            id: document.getElementById('id').value,
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            age: document.getElementById('age').value,
            nickName: document.getElementById('nickName').value,
            avatar: document.getElementById('avatar').value
        },
        text: document.getElementById('text').value
    }
    cleanFields()
    return message
}

function cleanFields() {
    document.getElementById('id').value = ''
    document.getElementById('firstName').value = ''
    document.getElementById('lastName').value = ''
    document.getElementById('age').value = ''
    document.getElementById('nickName').value = ''
    document.getElementById('avatar').value = ''
    document.getElementById('text').value = ''
}

async function renderMessages(normalized) {
    const chat = denormalizeChat(normalized) 
    const messages = chat.messages
    const compressionRate = Math.round((1-JSON.stringify(normalized).length/JSON.stringify(messages).length)*100)
    const messagesTpl = await loadAndCompileTemplate('/messages.hbs')
    const html = messagesTpl({ messages, compressionRate })
    document.getElementById('messages').innerHTML = html
}

function addMessage(e) {
    socket.emit('new-message', createMessage());
    return false;
}
/* END MESSAGES */


/* BEGIN SESSION */

async function renderSession(userName, messages, products, visits) {
    console.log('renderSession')
    const sessionTpl = await loadAndCompileTemplate('session.hbs')
    const html = sessionTpl({ userName })
    document.getElementById('content').innerHTML = html
    renderProducts(products)
    renderMessages(messages)
}

async function onLogin() {
    location.href = '/login.html'
}
/* END MESSAGES */

socket.on('messages', function(messages) { renderMessages(messages); });
socket.on('products', function(products) { renderProducts(products); });
socket.on('session', function(userName, messages, products, visits) { 
    console.log('on session')
    renderSession(userName, messages, products, visits); });
// socket.on('visits', function(visits) { renderVisits(visits); });
socket.on('login', () => onLogin())
