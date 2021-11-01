export default class Container {
    #content

    constructor() { this.#content = [] }

    async write(content) { this.#content = content }

    async read() { return this.#content }

    readSync() { return this.#content }

    async clean() { this.#content = [] }

}
