import autocannon from 'autocannon'
import { PassThrough } from 'stream'

function run(connections, duration, url) {
  console.log(connections, duration, url)
  const buf = []
  const outputStream = new PassThrough()

  const inst = autocannon({
    url,
    connections,
    duration,
  })

  autocannon.track(inst, { outputStream })

  outputStream.on('data', data => buf.push(data))
  inst.on('done', () => {
    process.stdout.write(Buffer.concat(buf))
  })
}

console.log('Running all benchmarks in parallel ...')

run(parseInt(process.argv[2]), parseInt(process.argv[3]), process.argv[4])
