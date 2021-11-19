import admin from "firebase-admin"
import fs from 'fs'

export default class FirebaseRepository {
    static #dbs = new Map()
    #container
    #fieldKey

    static merge(currentVersion, newVersion) {
        const originalTimestamp = currentVersion.timestamp
        const merged = { ...currentVersion, ...newVersion }
        merged.id = currentVersion.id
        merged.timestamp = originalTimestamp
        return merged
    } 

    static #getPayload = doc => ({ id: doc.id, ...doc.data() })

    constructor(credential, collection, fieldKey = 'id') {
        console.log('FirebaseRepository', credential, collection)
        let db = FirebaseRepository.#dbs.get(credential)
        if (!db) {
            const serviceAccount = JSON.parse(fs.readFileSync(credential, 'utf8'))

            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount)
            });
    
            db = admin.firestore()
            FirebaseRepository.#dbs.set(credential, db)
        }
        this.#container = db.collection(collection)
        this.#fieldKey = fieldKey        
    }

    async post(object) {
        await this.#container.doc(object[this.#fieldKey]).set(object)
        return object
    }

    async put(id, data) {
        const current = await this.getById(id)
        if (current) {
            const merged = FirebaseRepository.merge(current, data)
            await this.#container.doc(id).update(merged)
            return merged
        }
        return null
    }

    async getAll() {
        const snapshot = await this.#container.get()
        const result = []
        snapshot.forEach(doc => {
            result.push(FirebaseRepository.#getPayload(doc))
        })
        return result
    }

    async getById(id) {
        const result = await this.#container.doc(id).get()
        if (result.data()) {
            return FirebaseRepository.#getPayload(result)
        }
        return null
    }

    async deleteAll() {
        // version fea e ineficiente pero entendible para empezar
        try {
            const ids = []
            const snapshot = await this.#container.get()
            snapshot.forEach(doc => {
                ids.push(doc.id)
            })
            const promeses = ids.map(id => this.#container.doc(id).delete())
            const results = await Promise.allSettled(promeses)
            const errors = results.filter(r => r.status == 'rejected')
            if (errors.length > 0) {
                throw new Error('Error al borrar. Intentar de nuevo.')
            }
        } catch (error) {
            throw new Error(`Error al borrar: ${error}`)
        }
    }

    async deleteById(id) {
        await this.#container.doc(id).delete()
    }
}
