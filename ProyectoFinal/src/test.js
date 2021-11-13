import * as fs from 'fs'


function main(param) {
    let t = typeof param
    switch (typeof param) {
        case 'string':
            console.log("STRING")
            break;
        case 'object':
            console.log("OBJECT")
            break;
        default: //InMemory
            console.log('UNDEFINED')
    }
    param = {msg: 'ASIGNADO'}
    console.log(param)
    console.log(typeof param)
}

function parseConfig(config) {
    console.log('ENTRA: ', config)
    switch (typeof config) {
        case 'undefined': //InMemory
            config = { type: 'InMemory' }
            break;
        case 'string':
            console.log("LEVANTAR JSON Y CONVERTLO A OBJECT")
            try {
                //Utilizo método sincrónico porque necesito asegurarme de que si no existe el archivo, crearlo.
                config = JSON.parse(fs.readFileSync(config, 'utf8'))
            } catch (e) {
                throw Error(`Not found ${config} `)
            }
            break;
        case 'object': 
            console.log("NO HAGO NADA")
            break;
        default: 
            throw Error('Invalid config type.')
    }
    if (!('type' in config)) {
        throw Error('Missing "type" field in config.')
    }
    console.log('SALE: ', config)
    return config
}


parseConfig({type:'FS', connectionString: './db/carts.txt'})