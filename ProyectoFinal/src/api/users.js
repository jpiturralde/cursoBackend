
import bcrypt from 'bcrypt'

export const UsersAPI = (dataSource) => {
    return {
        getById: async (id) => {
            return await dataSource.getById(id)
        },
        getByUserName: async (username) => {
            return await dataSource.getByUserName(username)
        },
        post: async (data) => {
            if (await dataSource.getByUserName(data.username)) {
                throw Error(`${data.username} already exists.`)
            }
            const { password, password2} = data
            if (password != password2) {
                throw Error(`Password fields have different values.`)
            }
            return userDto(await dataSource.post(createUser(data)))
        },
        validateHash: (data, hash) => {
            return bcrypt.compareSync(data, hash)
        },
        logout: async(user, session) => {
            return "FALTA IMPLEMENTAR. Si el usuario tiene carrito asociado se tiene que guardar. En dónde?"
        },
        login: async(username, password) => {
            const user = await dataSource.getByUserName(username)
            if (user) {
                if (bcrypt.compareSync(password, user.password)) {
                    return userDto(user)
                }
            }
            throw Error('Invalid credentials.')
        }
    }
}

const userDto = (user) => {
    const {id, username, name, address, phone, avatar, shoppingCartId, role} = user
    return {id, username, name, address, phone, avatar, shoppingCartId, role}
}

const createUser = (data) => {
    return {
        username: data.username,
        password: createHash(data.password),
        name: data.name,
        address: data.address,
        phone: data.phone,
        avatar: data.avatar,
        role: data.role
    }
}

const createHash = (value) => {
    return bcrypt.hashSync(value, bcrypt.genSaltSync(10), null)
}