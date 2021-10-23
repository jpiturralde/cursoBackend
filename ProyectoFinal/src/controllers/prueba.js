import { Router } from 'express'

class ProductsController {
    constructor(dependencies) {
        this.dependencies = dependencies
    }
 
}

const getById = async (req, res, next) => {
    const product = dependencies.model.getById(req.params.id)
    if (!product) {
        const error = new Error('producto no encontrado')
        error.httpStatusCode = 404
        return next(error)
    }
    res.json(product)
}

const idValidator = (req, res, next) => {
    console.log('Pasó por idValidator')
    next();
}

export const controller = (dependencies) => {
    const router = new Router()

    router.get('/', async (req, res) => {
        res.json(dependencies.model.get())
    })
    
    router.get('/:id', idValidator, getById)
    // router.get('/:id', 
    //     // idValidator, 
    //     async (req, res, next) => {
    //         const product = dependencies.model.getById(req.params.id)
    //         if (!product) {
    //             const error = new Error('producto no encontrado')
    //             error.httpStatusCode = 404
    //             return next(error)
    //         }
    //         res.json(product)
    //     }
    // )

    return router
}



// const ERR_400_INVALID_ID = { error: 'El parámetro ingresado no es un número' }
// const idValidator = (req, res, next) => {
//     const num = parseInt(req.params.id)

//     if (isNaN(num)) {
//         return res.status(400).json(ERR_400_INVALID_ID)
//     }
//     next();
// }


// productsRouter.post('/', async (req, res) => {
//     res.status(201).json(DB.post(req.body))
// })

// productsRouter.put('/:id', 
//     idValidator, 
//     async (req, res) => {
//         const response = DB.put(parseInt(req.params.id), req.body)
//         if (!response) {
//             res.status(204).json()
//         }
//         res.json(req.body)
//     }
// )

// productsRouter.delete('/:id', 
//     idValidator, 
//     async (req, res) => {
//         DB.remove(parseInt(req.params.id))
//         res.json()
//     }
// )
