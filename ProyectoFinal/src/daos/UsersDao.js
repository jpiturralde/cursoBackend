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
        else if (!super.validateEmail(data.username)) {
            errors.push('El formato del campo username es invalido.')
        }
        if (!data.password) {
            errors.push('Falta campo password')
        }
        if (!data.phone) {
            errors.push('Falta campo phone')
        }
        else if (!super.validatePhone(data.phone)) {
            errors.push('El formato del campo phone es invalido.')
        }
        if (!data.name) {
            errors.push('Campo name inválido.')
        }
        if (!data.address) {
            errors.push('Campo address inválido.')
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