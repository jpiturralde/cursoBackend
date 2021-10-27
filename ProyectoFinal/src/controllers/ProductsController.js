import { Router } from 'express'
import DefaultController from "./DefaultController.js"

export default class ProductsController extends DefaultController {
    #dependencies

    constructor(dependencies) {
        super(dependencies)
        this.#dependencies = dependencies
    }
  
    createRouter() {
        const router = new Router()
        router.get('/', this.getAll)
        router.post('/', [this.modelValidator(this.#dependencies.model), this.post])
        router.get('/:id', [this.idValidator, this.getById])
        router.put('/:id', [this.idValidator, this.modelValidator(this.#dependencies.model), this.put])
        router.delete('/:id', [this.idValidator, this.delete])
        return router
    }
 
}