// const randomFrom1To1000 = () => Math.floor(Math.random() * (1000 - 1)) + 1

// const generateRandoms = (quantity) => {
//     console.log('generateRandoms', quantity)
//     let randoms = {}
//     let r
//     for (let i=0; i<quantity; i++) {
//         r = randomFrom1To1000()
//         randoms[r] = randoms[r] ? randoms[r]+1 : 1
//     }
//     return randoms
// }

import { GENERATE_RANDOMS, generateRandoms } from './generateRandoms.js'

process.on('message', msg => {
    console.log('on message', msg)
    switch (msg)
    {
        case GENERATE_RANDOMS:
            console.log(`Worker #${process.pid} started`)
            process.send(generateRandoms(parseInt(process.argv[2])))
            console.log(`Worker #${process.pid} finished`)
            process.exit()
            break;
        default: 
           throw Error(`Unknown process ${msg}`)
    }
})

process.send('readyToProcess')

process.on('exit', () => {
    console.log(`Worker #${process.pid} closed`)
})

