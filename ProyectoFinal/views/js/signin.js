const signinForm = document.getElementById("signinForm")
if (signinForm) {
    signinForm.addEventListener('submit', async e => {
        e.preventDefault()
    
        const body = {
            username: document.getElementById('username').value,
            password: document.getElementById('password').value
        }
        
        const content = await api.user.signin(body)
        const { token } = content;
    
        if (token) {
            localStorage.setItem("access_token", token);
            location.href = '/home'
        } else {
            renderFail(content.message)
            setTimeout((page) => {location.href = page}, 3000, '/')
        }
    })  
}
