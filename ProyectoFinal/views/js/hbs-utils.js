Handlebars.registerHelper("timestampToLocaleString", function(timestamp) {
    const date = new Date(timestamp)
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
})

async function loadAndCompileTemplate(templatePath) {
    const template = await fetch(templatePath).then(response => response.text())
    return Handlebars.compile(template)
}
