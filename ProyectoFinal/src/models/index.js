export const productsModel = {
    get: () => { return { msg: 'Modelo de productos' } },
    post: () => { return { msg: `Producto creado`}},
    getById: (id) => { return { msg: `Producto con id=${id}`}},
    put: (id) => { return { msg: `Producto actualizado id=${id}`}},
    remove: (id) => { return { msg: `Producto eliminado id=${id}`}}
}

export const cartModel = {
    get: () => { return { msg: 'Modelo de carrito' } },
    post: () => { return { msg: `Carrito creado`}},
    getById: (id) => { return { msg: `Carrito con id=${id}`}},
    remove: (id) => { return { msg: `Carrito eliminado id=${id}`}}
}