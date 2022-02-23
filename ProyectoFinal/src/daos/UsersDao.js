import Dao from './Dao.js'

export default class UsersDao extends Dao {
    #repo

    constructor(repo) {
        super(repo)
        this.#repo = repo
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

    async getByUserName(username) {
        const result = await this.#repo.getBy( { username } )
        if (result && result.length > 0) {
            return result[0]
        }
        return null
    }

}