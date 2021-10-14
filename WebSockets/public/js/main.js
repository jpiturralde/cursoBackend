const socket = io.connect();

Handlebars.registerHelper("timestampToLocaleString", function(timestamp) {
    const date = new Date(timestamp)
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
})

async function loadAndCompileTemplate(templatePath) {
    const template = await fetch(templatePath).then(response => response.text())
    return Handlebars.compile(template)
}

async function render(messages) {
    const messagesTpl = await loadAndCompileTemplate('/templates/messages.hbs')
    const html = messagesTpl({ messages })
    document.getElementById('messages').innerHTML = html
}

function addMessage(e) {
    const message = {
        author: document.getElementById('author').value,
        text: document.getElementById('text').value
    };
    document.getElementById('author').value = ''
    document.getElementById('text').value = ''
    socket.emit('new-message', message);
    return false;
}


socket.on('messages', function(messages) { render(messages); });