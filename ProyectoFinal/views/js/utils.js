async function renderFail(msg) {
    const failTpl = await loadAndCompileTemplate('fail.hbs')
    const html = failTpl({ msg })
    document.getElementById('content').innerHTML = html
}

async function posAuthenticationProcess(authenticationResponse) {
    if (authenticationResponse.status == 200) {
        location.href = '/products'
    } else {
        const content = await authenticationResponse.json()
        renderFail(content.message)
        setTimeout((page) => {location.href = page}, 3000, '/')
    }
}