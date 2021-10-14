const socket = io.connect();

function render(data) {
    const html = data.map((elem, index) => {
        const date = new Date(elem.ts)
        const dateStr = `[${date.toLocaleDateString()} ${date.toLocaleTimeString()}]`  
        return(`<div>
            <strong style="color:blue">${elem.author}</strong> 
            <font style="color:brown">${dateStr}</font>  
             <em style="color:green">${elem.text}</em> </div>`)
    }).join(" ");
    document.getElementById('messages').innerHTML = html;
}

function addMessage(e) {
    const mensaje = {
        author: document.getElementById('username').value,
        text: document.getElementById('texto').value
    };
    socket.emit('new-message', mensaje);
    return false;
}


socket.on('messages', function(data) { render(data); });