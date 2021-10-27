import * as fs from 'fs'
import * as path from 'path'
const encoding = 'utf8'

export default class FileSystemContainer {
    #filePath

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

    constructor(filePath) {
        this.#filePath = filePath
        try {
            //Utilizo método sincrónico porque necesito asegurarme de que si no existe el archivo, crearlo.
            JSON.parse(fs.readFileSync(this.#filePath, encoding))
        } catch (e) {
            console.log(`Contenedor no encontrado. ${filePath}`)
            FileSystemContainer.#createFile(filePath)
         }
    }

    /**
     * Escribe el contenido en un archivo.
     * @param {Array[Object]} Colección de objetos a persistir.
     * @return {void}
     */
     async write(content) {
        try {  
            await fs.promises.writeFile(this.#filePath, JSON.stringify(content, null, 2))
        } catch (err) {
            throw new Error("Error al actualizar archivo. ", err)
        }
    }

    /**
     * Lee el contenido de un archivo.
     * @return {Array[Object]} Colección de objetos contenidos en el archivo. Si 
     * Si no encuentra el archivo returno una colección vacía.
     */
     async read() {
        try {
            const json = await fs.promises.readFile(this.#filePath, encoding)
            const content = JSON.parse(json)
            return content
        } catch(e) {
            return []
        }
    }

    readSync() { return JSON.parse(fs.readFileSync(this.#filePath, encoding))  }

    async clean() {
        try {
            await fs.promises.unlink(this.#filePath)
        } catch (error) {}
    }

}
