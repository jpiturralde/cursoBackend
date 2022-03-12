const signinForm = document.getElementById("signinForm")
if (signinForm) {
    signinForm.addEventListener('submit', async e => {
        e.preventDefault()
    
        const body = {
            username: document.getElementById('username').value,
            password: document.getElementById('password').value
        }

        posAuthenticationProcess(await api.user.signin(body))
    })  
}
