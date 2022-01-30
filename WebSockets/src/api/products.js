const apiSpec = (ds) => {
    return {
        getById: async (id) => { return await ds.getById(id) },
        get: async () => { return await ds.get() },
        post: async (data) => { return await ds.post(data) },
        deleteById: async (id) => { return await ds.getById(id) }
    }
}

export const ProductsAPI = (ds) => apiSpec(ds)