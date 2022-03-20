async function createProduct(data) {
    return await api.products.post(data.value)
}

async function generateProducts(fakeData) {
    await Promise.all(fakeData.map((data) => createProduct(data)))
  }

async function generateFakeProducts(count) {
    const products = await getFakeData(count)
    await generateProducts(products)
    loadProducts()
    return false
}

async function getFakeData(count) {
    if (count) {
        return JSON.parse(await fetch("http://localhost:8080/api/productos-test?count="+count).then(response => response.text()))
    }
    else {
        return JSON.parse(await fetch("http://localhost:8080/api/productos-test").then(response => response.text()))
    }
}