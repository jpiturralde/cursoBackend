const apiSpec = (ds) => {
    return {
        get: async () => { return await ds.getAll() },
        getByEmail: async (email) => { return await ds.getByEmail(email) },
        post: async (data) => { 
            const msgDto = {
                email: data.email,
                type: data.role == 'admin' ? 'respuesta' : 'pregunta',
                text: data.text
            }
            return await ds.post(msgDto) 
        }
    }
}

export const MessagesAPI = (ds) => apiSpec(ds)