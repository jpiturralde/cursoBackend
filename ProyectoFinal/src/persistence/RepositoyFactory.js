export default class RepositoryFactory {
    static async createRepository(type, connectionString) {
        let repo
        switch (type) {
            case 'FS':
                console.log('RepositoryFactory.create -> FileSystemRepository.')
                const [FSContainer, FSRepository] =
                    await Promise.all([
                        import('./FileSystemContainer.js'),
                        import('./Repository.js')
                    ]);
                repo = new FSRepository.default(new FSContainer.default(connectionString))
                break;
            case 'MONGO':
                const { two } = await import('./myModule.js')
                repo = two
                break;
            default:
                console.log('RepositoryFactory.create -> InMemoryRepository.')
                const [ Container, Repository ] =
                    await Promise.all([
                        import('./Container.js'),
                        import('./Repository.js')
                    ]);
                repo = new Repository.default(new Container.default())
            }
        return repo
    }
}
