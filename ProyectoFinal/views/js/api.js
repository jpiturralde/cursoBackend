const userUrl = window.location.origin + '/api/user'

const api = {
    user: {
        signup: async (body) => { 
            const response = await fetch(userUrl + '/signup', {
                method: 'POST',
                body
            })
            return await response.json()
        },
        signin: async (body) => { 
            const response = await fetch(userUrl + '/signin', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            })
            return await response.json()
        }
    }
}