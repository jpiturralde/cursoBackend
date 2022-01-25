// AUTHENTICATION CONFIG
import { InfoAPI } from './api/index.js'

export async function loadApiContext() {
    return {
        info: InfoAPI
    }
}
