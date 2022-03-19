import Dao from './Dao.js'
import ChatNormalizr from './ChatNormalizr.js'

export default class MessagesDao extends Dao {
    #repo

    constructor(repo) {
        super(repo)
        this.#repo = repo
    }

    async get(normalized = true) {
        let messages = await this.getAll()
        if (normalized && messages.length > 0) {
            messages = ChatNormalizr.normalizeChat(messages) 
        }
        return messages
    }

    async getByEmail(email) {
        const result = await this.getAll()
        return result.filter(x => x.value.author.id == email)
    }
    
    async post(data) {
        if (!data.ts) {
            data.ts = Date.now()
        }
        return super.post({value: data})
    }    

}
