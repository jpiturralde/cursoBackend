// LOGGER
//import { logger } from './logger.js'

// ARGS
import cluster from 'cluster'
import parseArgs from 'minimist'
import dotenv from 'dotenv'
import * as fs from 'fs'

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

const options = {
    default: {
        p: process.env.PORT || 8080,
        m: 'FORK',
        e: 'prod',
        dep: './config/prod/.env' 
    },
    alias: {
        p: 'PORT',
        m: 'MODE',
        e: 'ENV',
        dep: 'dotenvPath'
    }
}

export async function loadEnvArgs() {
    const { logger } = process.context
    const args = parseArgs(process.argv.slice(2), options)
    try {
        const result = dotenv.config({path: args.dotenvPath})
        
        if (result.error) {
            throw result.error
        }
    
        const { parsed: envs } = result
        
        if (cluster.isPrimary) {
            await verifyPaths(envs)
        }
    
        return {
            ...envs,
            ...args,
            isModeFork: () =>  args.MODE == 'FORK'
        }
        // if (envs.PORT) {
        //     context.PORT = parseInt(envs.PORT)
        //     context.p = context.PORT
        // }
    } catch (error) {
        logger.error('********************** Loading context error **********************')
        logger.error(`DOTENV_PATH = ${args.dotenvPath}`)
        logger.error(error)
        logger.error('********************** Process exit *******************************')
        process.exit(1)
    }       
}




