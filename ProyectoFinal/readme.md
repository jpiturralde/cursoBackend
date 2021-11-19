
# PROYECTO FINAL

  

## PRIMERA ENTREGA

Formato: link a un repositorio en Github con el proyecto cargado.

Sugerencia: no incluir los node_modules.

  

### Consigna

Deberás entregar el estado de avance de tu aplicación eCommerce Backend, que implemente un servidor de aplicación basado en la plataforma Node.js y el middleware express. El servidor implementará dos conjuntos de rutas agrupadas en routers, uno con la url base '**/productos**' y el otro con '**/carrito**'. El puerto de escucha será el 8080 para desarrollo y process.env.PORT para producción en glitch.com

  

#### Aspectos a incluir en el entregable

1. El **router base '/api/productos'** implementará cuatro funcionalidades:

a. GET: '/:id?' - Me permite listar todos los productos disponibles ó un producto por su id (disponible para usuarios y administradores)

b. POST: '/' - Para incorporar productos al listado (disponible para administradores)

c. PUT: '/:id' - Actualiza un producto por su id (disponible para administradores)

d. DELETE: '/:id' - Borra un producto por su id (disponible para administradores)

  

2. El **router base '/api/carrito'** implementará tres rutas disponibles para usuarios y administradores:

a. POST: '/' - Crea un carrito y devuelve su id.

b. DELETE: '/:id' - Vacía un carrito y lo elimina.

c. GET: '/:id/productos' - Me permite listar todos los productos guardados en el carrito

d. POST: '/:id/productos' - Para incorporar productos al carrito por su id de producto

e. DELETE: '/:id/productos/:id_prod' - Eliminar un producto del carrito por su id de carrito y de producto

  

3. Crear una variable booleana **administrador**, cuyo valor configuraremos más adelante con el sistema de login. Según su valor (true ó false) me permitirá alcanzar o no las rutas indicadas. En el caso de recibir un request a una ruta no permitida por el perfil, devolver un objeto de error. Ejemplo: { error : -1, descripcion: ruta 'x' método 'y' no autorizada}

4. Un **producto** dispondrá de los siguientes campos:

id, timestamp, nombre, descripcion, código, foto (url), precio, stock.

5. El carrito de compras tendrá la siguiente estructura:

id, timestamp(carrito), producto: { id, timestamp(producto), nombre, descripcion, código, foto (url), precio, stock }

6. El timestamp puede implementarse con Date.now()

7. Comenzar a trabajar con el listado de productos y el carrito de compras en memoria del servidor, luego persistirlos en el filesystem.

#### A tener en cuenta

  

1. Para realizar la **prueba de funcionalidad** hay dos opciones:

a. Probar con postman cada uno de los endpoints (productos y carrito) y su operación en conjunto.

b. Realizar una aplicación frontend sencilla, utilizando HTML/CSS/JS ó algún framework de preferencia, que represente el listado de productos en forma de cards. En cada card figuran los datos del producto, que, en el caso de ser administradores, podremos editar su información. Para este último caso incorporar los botones actualizar y eliminar. También tendremos un formulario de ingreso de productos nuevos con los campos correspondientes y un botón enviar. Asimismo, construir la vista del carrito donde se podrán ver los productos agregados e incorporar productos a comprar por su id de producto. Esta aplicación de frontend debe enviar los requests get, post, put y delete al servidor utilizando fetch y debe estar ofrecida en su espacio público.

2. En todos los casos, el diálogo entre el frontend y el backend debe ser en formato JSON. El servidor no debe generar ninguna vista.

3. En el caso de requerir una ruta no implementada en el servidor, este debe contestar un objeto de error: ej { error : -2, descripcion: ruta 'x' método 'y' no implementada}

4. La estructura de programación será ECMAScript, separada tres en módulos básicos (router, lógica de negocio/api y persistencia ). Más adelante implementaremos el desarrollo en capas. Utilizar preferentemente clases, constructores de variables let y const y arrow function.

5. Realizar la prueba de funcionalidad completa en el ámbito local (puerto 8080) y en glitch.com

  

#

## SEGUNDA ENTREGA
Formato: link a un repositorio en Github con el proyecto cargado.

Sugerencia: no incluir los node_modules.
 
### Consigna
Basándose en los contenedores ya desarrollados (memoria, archivos) desarrollar dos contenedores más (que cumplan con la misma interfaz) que permitan realizar las operaciones básicas de CRUD en MongoDb (ya sea local o remoto) y en Firebase. Luego, para cada contenedor, crear dos clases derivadas, una para trabajar con Productos, y otra para trabajar con Carritos.

#### Aspectos a incluir en el entregable

1. A las clases derivadas de los contenedores se las conoce como **DAOs (Data Access Objects)**, y pueden ir todas incluidas en una misma carpeta de ‘daos’.
2. En la carpeta de daos, incluir un archivo que importe todas las clases y exporte una instancia de dao de productos y una de dao de carritos, según corresponda. Esta decisión se tomará en base al valor de una variable de entorno cargada al momento de ejecutar el servidor (**opcional**: investigar el uso de imports dinámicos).
3. Incluir un archivo de configuración (config) que contenga los datos correspondientes para conectarse a las bases de datos o medio de persistencia que corresponda.
4. **Opcional**: Hacer lo mismo para bases de datos relacionales: MariaDB/SQLite3.

## Cómo ejecutar

### Configuración por default: InMemoryRepository
Por defecto se busca en archivo **./config/persistence-config.json** para establecer qué tipo de persistencia se utiliza y cuál es la configuración correspondiente. En caso de no encontrarse ese archivo, se inicia persistencia en memoria. A continuación, ejemplo de esta situación:

    npm start  
````
proyectofinal@1.0.0 start
node ./src/server.js ./config/persistence-config.json
RepositoryFactory - Not found ./config/persistence-config.json 
RepositoryFactory - Default configuration initialized 
RepositoryFactory {
  ProductsRepository: { type: 'InMemory' },
  ShoppingCartsRepository: { type: 'InMemory' }
}
RepositoryFactory - Create InMemoryRepository.
Dao InMemoryRepository {}
RepositoryFactory - Create InMemoryRepository.
Dao InMemoryRepository {}
Servidor escuchando en el puerto 8080
````
 
### ./config/[TYPE]-persistence-config.json
En la carpeta **config** se encuentran archivos de configuración para los diferentes tipos de persistencia soportados. Para utilizarlos, se puede cambiar el script de ejecución o simplemente se puede renombrar uno de los archivos de ejemplo, y ejecutar nuevamente npm start para iniciar el server.
A continuación, los archivos de configuración mencionados:

 - [firebase-persistence-config.json](https://github.com/jpiturralde/cursoBackend/blob/master/ProyectoFinal/config/firebase-persistence-config.json)
 - [fs-persistence-config.json](https://github.com/jpiturralde/cursoBackend/blob/master/ProyectoFinal/config/fs-persistence-config.json)
 - [inMemory-persistence-config.json](https://github.com/jpiturralde/cursoBackend/blob/master/ProyectoFinal/config/inMemory-persistence-config.json)
 - [mongodb-persistence-config.json](https://github.com/jpiturralde/cursoBackend/blob/master/ProyectoFinal/config/mongodb-persistence-config.json)

#
Autor: jpiturralde@gmail.com (U610166)
