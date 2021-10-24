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
        const router = super.createRouter()
        router.put('/:id', [this.idValidator, this.put])
        return router
    }
 
}