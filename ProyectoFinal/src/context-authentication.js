// AUTHENTICATION CONFIG
import { AuthenticationManagerFactory } from './authentication/index.js'
import { UsersDao } from './daos/index.js'
import { UsersAPI } from './api/index.js'

export async function createAthenticationManager() {
    await AuthenticationManagerFactory.initialize(UsersDao, UsersAPI)
    return await AuthenticationManagerFactory.create()
}
