import Dao from './Dao.js'
import ChatNormalizr from './ChatNormalizr.js'

export default class MessagesDao extends Dao {
    constructor(repo) {
        super(repo)
    }

    async get(normalized = true) {
        let messages = await this.getAll()
        if (normalized && messages.length > 0) {
            messages = ChatNormalizr.normalizeChat(messages) 
        }
        return messages
    }
    // async get() {
    //     const elements = await this.getAll()
    //     const values = elements.map(function (element) {
    //         return {value: element} 
    //       }) 
    //     return values
    // }

    async post(data) {
        if (!data.ts) {
            data.ts = Date.now()
        }
        return super.post({value: data})
    }    

}
