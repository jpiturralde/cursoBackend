import DummyRepo from "./DummyRepo.js"
import Repository from "./Repository.js"
import Products from "./Products.js"

const Carrito = (filePath) => {
    if (filePath) {
        return new DummyRepo('CART')
    }
    return new Repository()
}

export { Products, Carrito }

