import { Router } from 'express'
import DefaultController from "./DefaultController.js"
import { INVALID_ENTITY_ERROR_MSG } from "../lib/index.js"

export default class ShoppingCartsController extends DefaultController {
    #dependencies
    #model

    constructor(dependencies) {
        super(dependencies)
        this.#dependencies = dependencies
        this.#model = this.#dependencies.db[this.#dependencies.entity]
    }

    modelValidator (model) {
        return (req, res, next) => {
            let errors
            if (req.path.indexOf('productos') > -1) {
                errors = model.validateItem(req.body)
            }
            else {
                errors = model.schemaValidations(req.body)
            }
            if (errors.length>0) {
                return res.status(400).json(INVALID_ENTITY_ERROR_MSG(errors))
            }
            next();
        }
    } 

    getItems = async (req, res) => {
        this.#dependencies.service.getItems(req.params.id)
            .then(items => {
                res.status(201).json(items)
            }).catch(error => {
                console.error(error)
                res.status(404).json(JSON.parse(error.message))
            })
    }
    
    addItem = async (req, res) => {
        this.#dependencies.service.addItem(req.params.id, req.body)
            .then(result => {
                res.status(201).json(result)
            }).catch(error => {
                console.error(error)
                res.status(404).json(JSON.parse(error.message))
            })
    }

    deleteItem = async (req, res) => {
        this.#dependencies.service.deleteItem(req.params.id, req.params.productId)
            .then(result => {
                res.status(201).json(result)
            }).catch(error => {
                console.error(error.message)
                res.status(404).json(JSON.parse(error.message))
            })
    }

    createRouter() {
        const router = new Router()
        router.post('/', DefaultController.defaultProcessor(this, 'post'))
        router.get('/:id', DefaultController.defaultProcessor(this, 'getById'))
        router.delete('/:id', DefaultController.defaultProcessor(this, 'delete'))
        router.get('/:id/productos', [this.getItems])
        router.post('/:id/productos', [this.modelValidator(this.#model), this.addItem])
        router.delete('/:id/productos/:productId', this.deleteItem)
        return router
    }
 
}