import { Router } from 'express'
import DefaultController from "./DefaultController.js"

export default class ProductsController extends DefaultController {
    #dependencies

    constructor(dependencies) {
        super(dependencies)
        this.#dependencies = dependencies
    }

    put = async (req, res) => {
        const response = this.#dependencies.model.put(parseInt(req.params.id), req.body)
        if (!response) {
            res.status(204).json()
        }
        res.json(req.body)
    }
    
    createRouter() {
        const router = new Router()
        router.get('/', this.getAll)
        router.post('/', this.post)
        router.get('/:id', [this.idValidator, this.getById])
        router.put('/:id', [this.idValidator, this.put])
        router.delete('/:id', [this.idValidator, this.delete])
        return router
    }
 
}