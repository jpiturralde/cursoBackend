const apiSpec = (ds) => {
    return {
        get: async () => { return await ds.get() },
        post: async (data) => { return await ds.post(data) },
        deleteById: async (id) => { return await ds.getById(id) }
    }
}

export const ProductsAPI = (ds) => apiSpec(ds)