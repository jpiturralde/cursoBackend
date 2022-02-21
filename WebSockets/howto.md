
  

# WebSockets

## Autenticación

### PassportLocal

Los usuarios son persistidos en MongoDB. A continuación se muestra ejemplo de configuración.

````

{

"type": "PassportLocal",

"repoConfig": {

"type": "MongoDb",

"uri": "//mongodb+srv://[USER]:[PASSWORD]@cluster0.xjgs3.mongodb.net/[DB]?retryWrites=true&w=majority",

"db": "[DB]",

"collection": "[COLLECTION]"

}

}

````

Si no se especifica repositorio de usuarios, por defecto se utiliza repositorio en memoria.

  

Ejemplos en [./config/authentication/examples](https://github.com/jpiturralde/cursoBackend/tree/dotenv/WebSockets/config/authentication/examples)

  

## Persistencia

Se necesitan repositorios para productos y mensajes. En ambos casos, por defecto se utiliza repositorio en memoria.

También en ambos casos es posible utilizar repositorio en file system.

Sólo para productos es posible utilizar SQLite3.

En [./config/persistence/examples](https://github.com/jpiturralde/cursoBackend/tree/dotenv/WebSockets/config/persistence/examples) se pueden ver alternativas de configuración.

  

## Sesión
El manejo de sesiones soporta 3 mecanismos diferentes de persistencia para las mismas:

 1. En memoria (por defecto)
 2. En file system
 3. En MongoDB

En [./config/session/examples](https://github.com/jpiturralde/cursoBackend/tree/dotenv/WebSockets/config/session/examples) se pueden ver archivos de ejemplo para cada una de estas variantes.

## Argumentos
Se soportan 3 argumentos:

 - ***-p*** ó ***--port***: Puerto en el cual se levanta el servidor. Valor por defecto: 8080
 -    ***-e*** ó ***--env***: Ambiente en el cual se ejecuta la aplicación. Valor por defecto: 'prod'
 -    ***--dep*** ó  ***--dotenvPath***: Path al archivo ***.env*** para tomar configuración de autenticación, persistencia y sesión. Valor por defecto ***./config/prod/.env***

### Archivo .env
Para setear las diferentes configuraciones, se debe proveer un archiv .env con las siguientes claves:
 - *AUTHENTICATION_CONFIG_PATH*: Path al archivo de configuración de autenticación.
 - *PERSISTENCE_CONFIG_PATH*: Path al archivo de configuración de persistencia.
 - *SESSION_CONFIG_PATH*: Path al archivo de configuración de sesión.

**Ejemplo de archivo .env**
````
AUTHENTICATION_CONFIG_PATH=./config/dev/authentication-conf.json
PERSISTENCE_CONFIG_PATH=./config/dev/persistence-conf.json
SESSION_CONFIG_PATH=./config/dev/session-conf.json
````

## Cómo ejecutar
Ejecutando ***npm run dev*** se busca el archiv ***./config/dev/.env***. A continuación se muestra la salida en la cual,
authentica

 - authentication-conf.json: Almacena los usuarios en MongoDB.
 - persistence-conf.json: Persiste productos en SQLite3 y Mensajes en FileSystem.
 - session-cong.json: Mantiene sesiones en MongoDB.
````
PS C:\Users\u610166\Documents\curso\cursoBackend\WebSockets> npm run dev

> websockets@1.0.0 dev
> nodemon src/server.js --dep ./config/dev/.env

[nodemon] 2.0.15
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): *.*
[nodemon] watching extensions: js,mjs,json
[nodemon] starting `node src/server.js --dep ./config/dev/.env`
Server context {
  AUTHENTICATION_CONFIG_PATH: './config/dev/authentication-conf.json',        
  PERSISTENCE_CONFIG_PATH: './config/dev/persistence-conf.json',
  SESSION_CONFIG_PATH: './config/dev/session-conf.json',
  ROOT_PATH: 'C:\\Users\\u610166\\Documents\\curso\\cursoBackend\\WebSockets',
  PORT: 8080,
  ENV: 'prod'
}
RepositoryFactory - Field "ShoppingCartsRepository" not found.
RepositoryFactory - Default "ShoppingCartsRepository" initialized.
RepositoryFactory {
  ProductsRepository: {
    type: 'SQLite3',
    entity: 'products',
    connectionString: './db/ecommerce.sqlite',
    useNullAsDefault: true
  },
  MessagesRepository: { type: 'FS', connectionString: './db/messages.txt' },
  ShoppingCartsRepository: { type: 'InMemory' }
}
RepositoryFactory - Create SQLite3Repository.
Dao SQLite3Repository {}
RepositoryFactory - Create FileSystemRepository.
Dao FileSystemRepository {}
SessionManagerFactory {
  type: 'MongoStore',
  session: { secret: '*****', resave: false, saveUninitialized: false },
  store: {
    uri: 'mongodb+srv://******:******@cluster0.xjgs3.mongodb.net/*****?retryWrites=true&w=majority',
    options: { useNewUrlParser: true, useUnifiedTopology: true }
  }
}
SessionManagerFactory - Create MongoStore.
AuthenticationManagerFactory {
  type: 'PassportLocal',
  repoConfig: {
    type: 'MongoDb',
    uri: '//mongodb+srv://******:******@cluster0.xjgs3.mongodb.net/*****?retryWrites=true&w=majority',
    db: '*****',
    collection: 'users'
  }
}
AuthenticationManagerFactory - Create PassportLocal.
RepositoryFactory - Create MongoDbRepository.
Dao MongoDbRepository {}
Servidor escuchando en el puerto 8080

````

#

  

Autor: jpiturralde@gmail.com (U610166)