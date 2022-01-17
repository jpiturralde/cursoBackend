const randomFrom1To1000 = () => Math.floor(Math.random() * (1000 - 1)) + 1
export const GENERATE_RANDOMS = 'generateRandoms'
export const generateRandoms = (quantity) => {
    console.log(`${process.ppid}-${process.pid} ${GENERATE_RANDOMS}`, quantity)
    let randoms = {}
    let r
    for (let i=0; i<quantity; i++) {
        r = randomFrom1To1000()
        randoms[r] = randoms[r] ? randoms[r]+1 : 1
    }
    return randoms
}