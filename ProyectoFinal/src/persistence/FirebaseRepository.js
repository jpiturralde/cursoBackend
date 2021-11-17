import admin from "firebase-admin"
import fs from 'fs'

export default class FirebaseRepository {
    #container

    static createPayload(id, object) {
        const payload = {
            id, 
            timestamp: Date.now(), 
            ...object
        }
        payload.timestamp = Date.now()
        return payload
    }

    static uid() {
        const head = Date.now().toString(36);
        const tail = Math.random().toString(36).substr(2);
        return head + tail;
    }

    static merge(currentVersion, newVersion) {
        const originalTimestamp = currentVersion.timestamp
        const merged = { ...currentVersion, ...newVersion }
        merged.id = id
        merged.timestamp = originalTimestamp
        return merged
    } 

    static #asObj = doc => ({ id: doc.id, ...doc.data() })

    constructor(credential, collection) {
        const serviceAccount = JSON.parse(fs.readFileSync(credential, 'utf8'))

        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });

        const db = admin.firestore();
        this.#container = db.collection(collection)
    }

    async post(object) {
        const payload = FirebaseRepository.createPayload(FirebaseRepository.uid(), object)
        await this.#container.doc(payload.id).set(payload)
        return payload
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
            result.push(FirebaseRepository.#asObj(doc))
        })
        return result
    }

    async getById(id) {
        const result = await this.#container.doc(id).get()
        if (result.data()) {
            return FirebaseRepository.#asObj(result)
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
