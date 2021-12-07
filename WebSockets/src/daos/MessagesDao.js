import Dao from './Dao.js'

export default class MessagesDao extends Dao {
    constructor(repo) {
        super(repo)
    }

    async get() {
        return await this.getAll()
    }
    // async get() {
    //     const elements = await this.getAll()
    //     const values = elements.map(function (element) {
    //         return {value: element} 
    //       }) 
    //     return values
    // }

    async post(data) {
        return super.post({value: data})
    }    

}
