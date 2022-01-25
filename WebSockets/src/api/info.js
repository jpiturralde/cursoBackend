import * as os from 'os'
const numCores = os.cpus().length

const apiSpec = () => {
    return {
        get: async () => { 
            return {
                numCores,
                process: {
                    argv: process.argv,
                    cwd: process.cwd(), 
                    rss: process.memoryUsage.rss(),
                    platform: process.platform,
                    execPath: process.execPath,
                    pid: process.pid,
                    version: process.version
                }
            }
        }
    }
}

export const InfoAPI = apiSpec()