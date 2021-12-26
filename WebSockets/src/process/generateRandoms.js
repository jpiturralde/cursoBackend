const randomFrom1To1000 = () => Math.floor(Math.random() * (1000 - 1)) + 1

const generateRandoms = (quantity) => {
    console.log('generateRandoms', quantity)
    let randoms = {}
    let r
    for (let i=0; i<quantity; i++) {
        r = randomFrom1To1000()
        randoms[r] = randoms[r] ? randoms[r]+1 : 1
    }
    return randoms
}

process.on('exit', () => {
    console.log(`Worker #${process.pid} closed`)
})

const randomCount = () => parseInt(process.argv[2])

process.on('message', msg => {
    console.log(`Worker #${process.pid} started`)
    process.send(generateRandoms(randomCount()))
    console.log(`Worker #${process.pid} finished`)
    process.exit()
})

process.send('readyToProcess')