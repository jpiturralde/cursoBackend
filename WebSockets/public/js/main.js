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
    const thereAreProducts = products.length > 0
    const html = productsTpl({ thereAreProducts, products })
    document.getElementById('products').innerHTML = html
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

async function renderMessages(messages) {
    const messagesTpl = await loadAndCompileTemplate('/templates/messages.hbs')
    const html = messagesTpl({ messages })
    document.getElementById('messages').innerHTML = html
}

function addMessage(e) {
    socket.emit('new-message', createMessage());
    return false;
}

/* END MESSAGES */

socket.on('messages', function(messages) { renderMessages(messages); });
socket.on('products', function(products) { renderProducts(products); });