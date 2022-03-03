async function renderFail(msg) {
    const failTpl = await loadAndCompileTemplate('fail.hbs')
    const html = failTpl({ msg })
    document.getElementById('content').innerHTML = html
}
