//import * as myProcess from './process/generateRandoms.js'
import path from 'path'
import { fork } from 'child_process'
import { GENERATE_RANDOMS, generateRandoms } from './process/generateRandoms.js'


const DEFAULT_RANDOM_COUNT = 1000

const getRandoms = (count) => {
    console.log(`getRandoms #${process.pid}`, count)
    const qty = count || DEFAULT_RANDOM_COUNT
    const computo = fork(path.resolve(process.cwd()+'/src/process', 'forkProcess.js'), [qty])
    
    computo.on('message', msg => {
        if ( msg == 'readyToProcess') {
            computo.send(GENERATE_RANDOMS)
        }
        else {
            console.log(msg)
        }
    })
}

// console.log(myProcess.generateRandoms(1000))
//console.log('EN TEST', getRandoms(10))

const count = 10
getRandoms(count)

console.log(`GENERATE RANDOMS #${process.pid}`, generateRandoms(count))