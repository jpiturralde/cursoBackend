import bcrypt from 'bcrypt'

import Dao from './Dao.js'

export default class UsersDao extends Dao {
    #repo

    static #createHash = (value) => {
        return bcrypt.hashSync(value, bcrypt.genSaltSync(10), null)
    }
    
    static #createUser(data) {
        return {
            username: data.username,
            password: UsersDao.#createHash(data.password),
            name: data.name,
            address: data.address,
            phone: data.phone,
            avatar: data.avatar
        }
    }

    static isEqualHash = (hash1, hash2) => {
        return bcrypt.compareSync(hash1, hash2);
    }

    constructor(repo) {
        super(repo)
        this.#repo = repo
    }

    schemaErrors(data) {
        const errors = this.schemaValidations(data)

        if (errors.length > 0) {
            throw new Error(errors)
        }
    }

    schemaValidations(data) {
        const errors = []
        if (!data.username) {
            errors.push('User: Falta campo username')
        }
        if (!data.password) {
            errors.push('Producto: Falta campo password')
        }
        return errors
    }

    validateHash(password, hash) {
        return UsersDao.isEqualHash(password, hash)
    }

    async getByUserName(username) {
        const result = await this.#repo.getBy( { username } )
        if (result && result.length > 0) {
            return result[0]
        }
        return null
    }

    async post(data) {
        return await super.post(UsersDao.#createUser(data))
    }

}