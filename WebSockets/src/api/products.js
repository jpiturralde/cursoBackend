import * as os from 'os'
const numCores = os.cpus().length

const apiSpec = (ds) => {
    return {
        get: async () => { return await ds.get() },
        post: async (data) => { return await ds.post(data) }
    }
}

export const ProductsAPI = (ds) => apiSpec(ds)