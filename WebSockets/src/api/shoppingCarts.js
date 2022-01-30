const apiSpec = (ds) => {
    return {
        getById: async (id) => { return await ds.getById(id) },
        post: async (data) => { return await ds.post(data) },
        deleteById: async (id) => { return await ds.deleteById(id) },
        getItems: async (id) => { return 'FALTA IMPLEMENTAR' },
        addItem: async (id) => { return 'FALTA IMPLEMENTAR' },
        deleteItem: async (id, productId) => { return 'FALTA IMPLEMENTAR' }
    }
}

export const ShoppingCartsAPI = (ds) => apiSpec(ds)