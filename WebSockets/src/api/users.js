
import bcrypt from 'bcrypt'

export const UsersAPI = (dataSource) => {
    return {
        getById: async (id) => {
            return await dataSource.getById(id)
        },
        getByUserName: async (username) => {
            return await dataSource.getByUserName(username)
        },
        post: async (data) => {
            return await dataSource.post(createUser(data))
        },
        validateHash: (data, hash) => {
            return bcrypt.compareSync(data, hash)
        }
    }
}

const createUser = (data) => {
    return {
        username: data.username,
        password: createHash(data.password),
        name: data.name,
        address: data.address,
        phone: data.phone,
        avatar: data.avatar
    }
}

const createHash = (value) => {
    return bcrypt.hashSync(value, bcrypt.genSaltSync(10), null)
}