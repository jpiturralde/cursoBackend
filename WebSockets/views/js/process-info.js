/* BEGIN PRODUCTS */
async function renderData() {
    const data = JSON.parse(await fetch("http://localhost:8080/api/info").then(response => response.text()))
    const tpl = await loadAndCompileTemplate('process-info.hbs')
    const { numCores, process } = data
    const html = tpl({ numCores, process })
    document.getElementById('processInfo').innerHTML = html
}

