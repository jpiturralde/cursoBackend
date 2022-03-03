// const url = window.location.origin + '/api/user'

// const api = {
//     signup: async (body) => { 
//         const response = await fetch(url + '/signup', {
//             method: 'POST',
//             body
//         })
//         return await response.json()
//     },
//     signin: async (body) => { 
//         const response = await fetch(url + '/signin', {
//             method: 'POST',
//             body
//         })
//         return await response.json()
//     }
// }

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
        
        const content = await api.user.signup(body)
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
