// ARGS
import parseArgs from 'minimist'
import dotenv from 'dotenv'
import * as fs from 'fs'

const options = {
    default: {
        p: 8080,
        e: 'prod',
        dep: './config/prod/.env' 
    },
    alias: {
        p: 'port',
        e: 'env',
        dep: 'dotenvPath'
    }
}

async function verifyPaths(envs) {
    const paths = Array.from(new Map(Object.entries(envs)), ([name, value]) => ({ name, value }))
    const results = await Promise.all(paths.map(invalidFilePath))
    const invalidFilePaths = results.filter(r =>r.err)
    if (invalidFilePaths.length > 0) {
        throw invalidFilePaths
    }
}

async function invalidFilePath(obj) {
    return new Promise((resolve) => {
        if (obj.name.includes('PATH')) {
            fs.access(obj.value, fs.constants.F_OK, (err) => {
                err ? resolve( { ...obj, err }) : resolve(obj)
            })
        }
        else {
            resolve(obj)
        }
    })
}

let context 
const args = parseArgs(process.argv.slice(2), options)
try {
    const result = dotenv.config({path: args.dotenvPath})

    if (result.error) {
        throw result.error
    }

    const { parsed: envs } = result
    
    await verifyPaths(envs)

    context = {
        ...envs,
        ROOT_PATH: process.cwd(),
        PORT: args.port,
        ENV: args.env
    }
} catch (error) {
    console.log('********************** Loading context error **********************')
    console.log(`DOTENV_PATH = ${args.dotenvPath}`)
    console.error(error)
    console.log('********************** Process exit *******************************')
    process.exit(1)
}

export { context }



