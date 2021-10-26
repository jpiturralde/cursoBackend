import * as fs from 'fs'
import * as path from 'path'
const encoding = 'utf8'

export default class Contenedor {
    #id = 1
    #filePath = './defaultStorage.txt'
    #content = new Array()

    constructor(filePath) {
        this.#filePath = filePath
        try {
            //Utilizo método sincrónico porque necesito asegurarme de haber leido el archivo para setear
            //el próximo id.
            const content = JSON.parse(fs.readFileSync(this.#filePath, encoding))
            const x = this.#calculateId(content)
            this.#id = x+1
        } catch (e) {
            console.log(`Contenedor no encontrado. ${filePath}`)
            Contenedor.#createFile(filePath)
         }
    }

    static #createFile(filePath) {
        const folderName = path.dirname(filePath)
        try {
            fs.accessSync(path)
        } catch {
            fs.mkdirSync(folderName, {recursive: true})
        }
        try {
            fs.openSync(filePath, 'w')
            console.log(`Contenedor creado. ${filePath}`)
        } catch (e) {
            console.error('No se pudo crear contenedor', e)
        }      
    }

    #calculateId(content) {
        const ids = content.map(function (element) {
            return element.id
          })
          const max = ids.reduce((previous, current) => current > previous ? current : previous) 
          return max
    }

    /**
     * Lee el contenido de un archivo.
     * @return {Array[Object]} Colección de objetos contenidos en el archivo. Si 
     * Si no encuentra el archivo returno una colección vacía.
     */
    async #readStorage() {
        try {
            const json = await fs.promises.readFile(this.#filePath, encoding)
            const content = JSON.parse(json)
            return content
        } catch(e) {
            return []
        }
    }

    /**
     * Escribe el contenido en un archivo.
     * @param {Array[Object]} Colección de objetos a persistir.
     * @return {void}
     */
    async #writeStorage(content) {
        try {  
            await fs.promises.writeFile(this.#filePath, JSON.stringify(content, null, 2))
        } catch (err) {
            throw new Error("Error al actualizar archivo. ", err)
        }
    }

    /**
     * Recibe un objeto, lo guarda en el archivo, devuelve el id asignado.
     * @param {Object} Recibe un objeto, lo guarda en el archivo 
     * @return {Number} Devuelve el id asignado
     */
    async save(object) {
        //this.#content.push({id: this.#id, payload: object})
        const content = await this.#readStorage()
        const payload = this.#createPayload(object)
        content.push({ id: this.#id, payload })
        await this.#writeStorage(content)
        this.#id++
        return payload
    }

    #createPayload(object) {
        return {
            id: this.#id, 
            timestamp: Date.now(), 
            ...object
        }
    }

    #getPayload(data) { return data.payload }

    /**
     * Recibe un id y devuelve el objeto con ese id, o null si no está
     * @param {Number} id del objeto
     * @return {Object} objeto asociado al id o null si no está
     */
    async getById(id) {
        const content = await this.#readStorage()
        const result = content.filter(x => x.id==id) 
        if (result.length > 0) {
            return this.#getPayload(result[0])
        }
        return null
    }

    /**
     * Devuelve un array con los objetos presentes en el archivo.
     * @return {Array<Object>}
     */
    async getAll() {
        const content = await this.#readStorage()
        const result = content.map(x => this.#getPayload(x))
        return result
    }

   /**
     * Elimina del archivo el objeto con el id buscado.
     * @param {Number} id del objeto a eliminar
     * @return {void}
     */
    async deleteById(id) {
        if (await this.getById(id) != null) {
            const content = await this.#readStorage()
            const newContent = content.filter(x => x.id!=id)
            await this.#writeStorage(newContent)
        }
    }

    //deleteAll(): void - Elimina todos los objetos presentes en el archivo.
    /**
     * Elimina todos los objetos presentes en el archivo.
     * @return {void}
     */
    async deleteAll() {
        try {
            await fs.promises.unlink(this.#filePath)
        } catch (error) {}
    }

}
