
function chatSchema() {
    const user = new normalizr.schema.Entity('users')
    const message = new normalizr.schema.Entity('messages', {
        value: { author: user }
    })
    return new normalizr.schema.Entity('chat', {
        messages: [ message ]
    })
}

function normalizeChat(content) {
    const chat = { id: 1, messages: content }
    return normalizr.normalize(chat, chatSchema())
}
function denormalizeChat(normalizedChat) {
    return normalizr.denormalize(normalizedChat.result, chatSchema(), normalizedChat.entities)
}

