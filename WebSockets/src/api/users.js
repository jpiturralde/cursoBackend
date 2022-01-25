
import bcrypt from 'bcrypt'

export const UsersAPI = (dao) => {

    getById = async (id) => {
        return await dao.getById(id)
    }

    getByUserName = async (username) => {
        return await dao.getByUserName(username)
    }
    
    post = async ({username, password, name, address, phone, avatar}) => {
        const hash = bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
        return await dao.post({username, hash, name, address, phone, avatar})
    }

    validateHash = (data, hash) => {
        return bcrypt.compareSync(data, hash)
    }

}
