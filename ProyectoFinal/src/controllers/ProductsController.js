import { Router } from 'express'
import DefaultController from "./DefaultController.js"

export default class ProductsController extends DefaultController {
    #dependencies

    constructor(dependencies) {
        super(dependencies)
        this.#dependencies = dependencies
    }
  
    createRouter() {
        console.log('ProductsController.createRouter')
        const router = new Router()
        router.get('/', this.getAll)
        router.post('/', [this.modelValidator(this.#dependencies.model), this.post])
        router.get('/:id', this.getById)
        router.put('/:id', [this.idValidator(), this.modelValidator(this.#dependencies.model), this.put])
        router.delete('/:id', [this.idValidator(), this.delete])
        return router
    }
 
}