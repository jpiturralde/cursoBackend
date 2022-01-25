const url = window.location.origin + '/api/info'

async function renderData() {
    const data = JSON.parse(await fetch(url).then(response => response.text()))
    const tpl = await loadAndCompileTemplate('process-info.hbs')
    const { numCores, process } = data
    const html = tpl({ numCores, process })
    document.getElementById('processInfo').innerHTML = html
}

