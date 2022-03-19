Handlebars.registerHelper("timestampToLocaleString", function(timestamp) {
    const date = new Date(timestamp)
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
})

Handlebars.registerHelper('ifIsAdmin', function(role, options) {
    if(role === 'admin') {
      return options.fn(this);
    }
    return options.inverse(this);
});

async function loadAndCompileTemplate(templatePath) {
    const template = await fetch(templatePath).then(response => response.text())
    return Handlebars.compile(template)
}
