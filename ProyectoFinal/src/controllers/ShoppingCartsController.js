import { Router } from 'express'
import DefaultController from "./DefaultController.js"

export default class ShoppingCartsController extends DefaultController {
    #dependencies

    constructor(dependencies) {
        super(dependencies)
        this.#dependencies = dependencies
    }

    getItems = async (req, res) => {
        // res.json(await this.#dependencies.service.getItems(req.params.id))
        this.#dependencies.service.getItems(req.params.id)
            .then(items => {
                res.status(201).json(items)
            }).catch(error => {
                console.error(error.message)
                res.status(404).json(error.message)
            })

    }
    
    addItem = async (req, res) => {
        // res.status(201).json(await this.#dependencies.service.addItem(req.params.id, req.body))
        this.#dependencies.service.addItem(req.params.id, req.body)
            .then(result => {
                res.status(201).json(result)
            }).catch(error => {
                console.error(error.message)
                res.status(404).json(error.message)
            })
    }

    deleteItem = async (req, res) => {
        this.#dependencies.service.deleteItem(req.params.id, req.params.productId)
            .then(result => {
                res.status(201).json(result)
            }).catch(error => {
                console.error(error.message)
                res.status(404).json(error.message)
            })
    }

    createRouter() {
        const router = new Router()
        router.post('/', [this.modelValidator(this.#dependencies.model), this.post])
        router.get('/:id', [this.idValidator, this.getById])
        router.delete('/:id', [this.idValidator, this.delete])
        router.get('/:id/productos', [this.idValidator, this.getItems])
        router.post('/:id/productos', [this.idValidator, this.addItem])
        router.delete('/:id/productos/:productId', [this.idValidator, this.deleteItem])
        return router
    }
 
}