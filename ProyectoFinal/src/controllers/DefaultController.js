import { Router } from 'express'

export default class DefaultController {
    #dependencies
    #router

    constructor(dependencies) {
        this.#dependencies = dependencies
    }

    #ERR_400_INVALID_ID = { error: 'El parámetro ingresado no es numérico.' }
    idValidator = (req, res, next) => {
        const num = parseInt(req.params.id)
    
        if (isNaN(num)) {
            return res.status(400).json(this.#ERR_400_INVALID_ID)
        }
        next();
    }

    getAll = async (req, res) => {
        res.json(await this.#dependencies.model.getAll())
    }

    getById = async (req, res, next) => {
        const data = await this.#dependencies.model.getById(req.params.id)
        if (!data) {
            const error = new Error('No encontrado')
            error.httpStatusCode = 404
            return next(error)
        }
        res.json(data)
    }

    post = async (req, res) => {
        res.status(201).json(await this.#dependencies.model.post(req.body))
    }

    put = async (req, res) => {
        const response = this.#dependencies.model.put(parseInt(req.params.id), req.body)
        if (!response) {
            res.status(204).json()
        }
        res.json(req.body)
    }
    
    delete = async (req, res) => {
        this.#dependencies.model.deleteById(parseInt(req.params.id))
        res.json()
    }

    createRouter() {
        const router = new Router()
        router.get('/', this.getAll)
        router.post('/', this.post)
        router.get('/:id', [this.idValidator, this.getById])
        router.delete('/:id', [this.idValidator, this.delete])
        return router
    }

    build() {
        if (!this.#router) {
            this.#router = this.createRouter()
        }
        return this.#router
    }
 
}