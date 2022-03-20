import Dao from './Dao.js'

export default class MessagesDao extends Dao {
    #repo

    constructor(repo) {
        super(repo)
        this.#repo = repo
    }

    async getByEmail(email) {
        const result = await this.getAll()
        return result.filter(x => x.value.email == email)
    }
    
    async post(data) {
        if (!data.ts) {
            data.ts = Date.now()
        }
        return super.post({value: data})
    }    

}
