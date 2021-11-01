import Repository from "./Repository.js"
import FileSystemContainer from "./FileSystemContainer.js"
import RepositoryDB from "./RepositoryDB.js"

const InMemoryDB = () => { return new Repository() }
const FileSystemDB = (filePath) => { return new Repository(new FileSystemContainer(filePath)) }

export { RepositoryDB, InMemoryDB, FileSystemDB}


