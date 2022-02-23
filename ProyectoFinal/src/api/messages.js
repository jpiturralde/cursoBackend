import * as os from 'os'
const numCores = os.cpus().length

const apiSpec = (ds) => {
    return {
        get: async (normalized = true) => { return await ds.get(normalized) },
        post: async (data) => { return await ds.post(data) }
    }
}

export const MessagesAPI = (ds) => apiSpec(ds)