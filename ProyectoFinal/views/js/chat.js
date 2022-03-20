const socket = io.connect();

function createMessage() {
    const message = {
        text: document.getElementById('text').value
    }
    cleanFields()
    return message
}

function cleanFields() {
    document.getElementById('text').value = ''
}

async function renderMessages(messages) {
    const messagesTpl = await loadAndCompileTemplate('/chat.hbs')
    const html = messagesTpl({ messages })
    document.getElementById('messages').innerHTML = html
}

function addMessage(e) {
    socket.emit('new-message', createMessage());
    return false;
}

function showMyMessages() {
    location.href = '/chat/'+user().username
}

async function onLogin() {
    location.href = '/login.html'
}

socket.on('messages', function(messages) { renderMessages(messages); });
socket.on('login', () => onLogin())
