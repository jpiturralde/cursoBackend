const signupForm = document.getElementById("signupForm")
if (signupForm) {
    signupForm.addEventListener('submit', async e => {
        e.preventDefault()
    
        let body = new FormData()
        body.append('username', document.getElementById('username').value)
        body.append('password', document.getElementById('password').value)
        body.append('name', document.getElementById('name').value)
        body.append('address', document.getElementById('address').value)
        body.append('phone', document.getElementById('phone').value)
        body.append('avatar', document.getElementById('avatar').files[0])
        
        posAuthenticationProcess(await api.user.signup(body))
    })  
}
