import { Router } from 'express'
import DefaultController from "./DefaultController.js"

export default class CartController extends DefaultController {
    #dependencies

    constructor(dependencies) {
        super(dependencies)
        this.#dependencies = dependencies
    }

    getItems = async (req, res) => {
        res.json({msg: 'FALTA IMPLEMENTAR getItems!!!'})
    }
    
    addItem = async (req, res) => {
        res.status(201).json({msg: 'FALTA IMPLEMENTAR addItem!!!'})
    }

    deleteItem = async (req, res) => {
        res.json({msg: 'FALTA IMPLEMENTAR deleteItem!!!'})
    }

    createRouter() {
        const router = new Router()
        router.post('/', [this.modelValidator(this.#dependencies.model), this.post])
        router.get('/:id', [this.idValidator, this.getById])
        router.delete('/:id', [this.idValidator, this.delete])
        router.get('/:id/productos', [this.idValidator, this.getItems])
        router.post('/:id/productos', [this.idValidator, this.addItem])
        router.delete('/:id/productos/:id_prod', [this.idValidator, this.deleteItem])
        return router
    }
 
}