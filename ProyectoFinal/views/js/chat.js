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

async function renderMessages(normalized) {
    let messages = normalized
    let compressionRate = 0
    if (typeof normalized == 'object') {
        const chat = denormalizeChat(normalized) 
        if (chat) {
            messages = chat.messages
            compressionRate = Math.round((1-JSON.stringify(normalized).length/JSON.stringify(messages).length)*100)
        }
    }
    const messagesTpl = await loadAndCompileTemplate('/chat.hbs')
    const html = messagesTpl({ messages, compressionRate })
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
