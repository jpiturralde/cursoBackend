
import bcrypt from 'bcrypt'

export const UsersAPI = (dataSource) => {
    return {
        getById: async (id) => {
            return await dataSource.getById(id)
        },
        getByUserName: async (username) => {
            return await dataSource.getByUserName(username)
        },
        post: async ({username, password, name, address, phone, avatar}) => {
            // const hash = bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
            return await dataSource.post({username, password, name, address, phone, avatar})
        },
        validateHash: (data, hash) => {
            return bcrypt.compareSync(data, hash)
        }
    }
}
