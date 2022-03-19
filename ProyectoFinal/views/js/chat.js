const socket = io.connect();

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

async function onLogin() {
    location.href = '/login.html'
}

socket.on('messages', function(messages) { renderMessages(messages); });
socket.on('login', () => onLogin())
