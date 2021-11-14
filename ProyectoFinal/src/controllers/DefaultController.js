import { Router } from 'express'
import { INVALID_ENTITY_ERROR_MSG } from "../lib/index.js"

export default class DefaultController {
    #dependencies
    #router
    #model

    constructor(dependencies) {
        this.#dependencies = dependencies
        this.#model = this.#dependencies.db[this.#dependencies.entity]
    }

    idValidator (idKey)  {
        return (req, res, next) => {
            let paramKey = idKey 
            if (!paramKey) {
                paramKey = 'id'
            }
            const num = parseInt(req.params[paramKey])
        
            if (isNaN(num)) {
                return res.status(400).json(INVALID_ENTITY_ERROR_MSG('El parámetro ingresado no es numérico.'))
            }
            next();
        }
    }

    modelValidator (model) {
        return (req, res, next) => {
            const errors = model.schemaValidations(req.body)
            if (errors.length>0) {
                return res.status(400).json(INVALID_ENTITY_ERROR_MSG(errors))
            }
            next();
        }
    } 

    getAll = async (req, res) => {
        res.json(await this.#model.getAll())
    }

    getById = async (req, res, next) => {
        const data = await this.#model.getById(req.params.id)
        if (!data) {
            const error = new Error('No encontrado')
            error.httpStatusCode = 404
            return next(error)
        }
        res.json(data)
    }

    post = async (req, res) => {
        try {
            res.status(201).json(await this.#model.post(req.body))
        } catch (error) {
            console.error(error)
            res.status(400).json( { error: -3, description: error.name + ': ' + error.message})
        }
    }

    put = async (req, res) => {
        try {
            const response = await this.#model.put(parseInt(req.params.id), req.body)
            if (!response) {
                res.status(204).json()
            }
            else {
                res.json(response)
            }
        } catch (error) {
            console.error(error)
            res.status(400).json( { error: -3, description: error.name + ': ' + error.message})
        }
    }
    
    delete = async (req, res) => {
        this.#model.deleteById(parseInt(req.params.id))
        res.json()
    }

    static defaultProcessor = (controllerInstance, processorName) => {
        const processors = {
            'getAll': [controllerInstance.getAll],
            'post': [controllerInstance.modelValidator(controllerInstance.#model), controllerInstance.post],
            'getById': [controllerInstance.idValidator(), controllerInstance.getById],
            'put': [controllerInstance.idValidator(), controllerInstance.modelValidator(controllerInstance.#model), controllerInstance.put], 
            'delete': [controllerInstance.idValidator(), controllerInstance.delete]
        }
        const processor = processors[processorName]
        return processor
    }

    createRouter() {
        const router = new Router()
        router.get('/', DefaultController.defaultProcessor(this, 'getAll'))
        router.post('/', DefaultController.defaultProcessor(this, 'post'))
        router.get('/:id', DefaultController.defaultProcessor(this, 'getById'))
        router.put('/:id', DefaultController.defaultProcessor(this, 'put'))
        router.delete('/:id', DefaultController.defaultProcessor(this, 'delete'))
        return router
    }

    build() {
        if (!this.#router) {
            this.#router = this.createRouter()
        }
        return this.#router
    }
 
}