
  

# Proyecto Final - ecommerce

[Consigna](https://github.com/jpiturralde/cursoBackend/blob/master/ProyectoFinal/Consigna%20Proyecto%20Final%20Curso%20Backend.pdf)

## Resolución

### Características generales
 - El carrito se crea como parte de la creación de un usuario.
 - El usuario siempre tiene asociado el mismo ID de carrito.
 - El carrito se llena durante una compra.
 - Para confirmar la compra se implementó como PATCH /api/carrito/:id/checkout representando un cambio en el estado.
 - El checkout genera la orden.
 - La consulta de las ordenes se realiza por GET /api/orden.
 - Se provee información del proceso por API GET /api/info que se expone desde el front end en la opción Proceso (API). Además también se provee la misma información generando una vista desde el backend en /info. 

### Configuración general
La configuración general incluye información sysadm para recibir notificaciones por email y además, configuración del cliente de emails para realizar las notificaciones.

Dado que durante las pruebas se producían errores al enviar mails con ethereal, en la configuración general se permite habilitar/deshabilitar las notificaciones.

Ejemplos en [common-examples](https://github.com/jpiturralde/cursoBackend/tree/master/ProyectoFinal/config/examples/common-examples)


### Autenticación

El sistema soporta autenticación de usuarios locales. El repositorio de usuarios utiliza MongoDB, pero si no se configura, por defecto se utilizar repositorio en memoria.

Para un manejo muy básico de autorización se soportan 2 roles diferentes: admin y default. El rol admin, tiene privilegios adicionales al default para poder gestionar productos realizando altas y bajas. 

En el archivo de configuración se condigurar una colección de usernames para los cuales, en el momento de la registración se les asigna el rol admin. MEJORA: Usar estos usuarios para enviar notificación cuando se registran usuarios y se crean las órdenes.

Adicionalmente, y para simplificar las pruebas, el usuario con rol admin, también tiene disponible en la página del perfil, la posibilidad de cargar productos fake en tandas de a 5.
  

Ejemplos en [authentication-examples](https://github.com/jpiturralde/cursoBackend/tree/master/ProyectoFinal/config/examples/authentication-examples)
  

### Persistencia

Se necesitan repositorios para las diferentes entidades de datos necesarias para el sistema. Es requerido condigurar cada repositorio por separado. Si bien esto implica mayor esfuerzo de configuración, brinda la flexibilidad de poder alojar las entidades en diferentes bases de datos. MEJORA: Soportar configuración de repositorio por defecto para todas las entidades y tomar configuración particular sólo en los casos que se configure explícitamente.

En caso de no configurar tipo de persistencia para alguna entidad, se utilizar por defecto repositorio en memoria.

En [persistence-examples](https://github.com/jpiturralde/cursoBackend/tree/master/ProyectoFinal/config/examples/persistence-examples) se pueden ver alternativas de configuración.
  

### Sesión
El manejo de sesiones soporta 3 mecanismos diferentes de persistencia para las mismas:

 1. En memoria (por defecto)
 2. En file system
 3. En MongoDB

En [session-examples](https://github.com/jpiturralde/cursoBackend/tree/master/ProyectoFinal/config/examples/session-examples) se pueden ver archivos de ejemplo para cada una de estas variantes.

### Argumentos
Se soportan 3 argumentos:

 - ***-p*** ó ***--port***: Puerto en el cual se levanta el servidor. Valor por defecto: 8080
 -    ***-e*** ó ***--env***: Ambiente en el cual se ejecuta la aplicación. Valor por defecto: 'prod'
 -    ***--dep*** ó  ***--dotenvPath***: Path al archivo ***.env*** para tomar configuración de autenticación, persistencia y sesión. Valor por defecto ***./config/prod/.env***

#### Archivo .env
Para setear las diferentes configuraciones, se debe proveer un archivo .env con las siguientes claves:
 - *AUTHENTICATION_CONFIG_PATH*: Path al archivo de configuración de autenticación.
 - *COMMON_CONFIG_PATH*: Path al archivo de configuración general.
 - *PERSISTENCE_CONFIG_PATH*: Path al archivo de configuración de persistencia.
 - *SESSION_CONFIG_PATH*: Path al archivo de configuración de sesión.

**Ejemplo de archivo .env**
````
AUTHENTICATION_CONFIG_PATH=./config/prod/authentication-conf.json
COMMON_CONFIG_PATH=./config/prod/common-conf.json
PERSISTENCE_CONFIG_PATH=./config/prod/persistence-conf.json
SESSION_CONFIG_PATH=./config/prod/session-conf.json
````

### Cómo ejecutar
Ejecutando ***npm start*** se busca el archiv ***./config/prod/.env***. A continuación se muestra la salida a modo de ejemplo:
````
PS C:\Users\u610166\Documents\curso\cursoBackend\ProyectoFinal> npm start

> websockets@1.0.0 start
> node ./src/main.js

[2022-03-24T19:39:20.137] [INFO] default - 23712-31312 Loading ./config/prod/common-conf.json
[2022-03-24T19:39:20.309] [INFO] default - 23712-31312 MailManager transport [object Object]
[2022-03-24T19:39:20.343] [INFO] default - 23712-31312 RepositoryFactory [object Object]
[2022-03-24T19:39:20.359] [INFO] default - 23712-31312 RepositoryFactory - Create MongoDbRepository.
[2022-03-24T19:39:32.301] [INFO] default - 23712-31312 RepositoryFactory - Create MongoDbRepository.
[2022-03-24T19:39:32.336] [INFO] default - 23712-31312 RepositoryFactory - Create MongoDbRepository.
[2022-03-24T19:39:32.369] [INFO] default - 23712-31312 RepositoryFactory - Create MongoDbRepository.
[2022-03-24T19:39:32.404] [INFO] default - 23712-31312 RepositoryFactory - Create MongoDbRepository.
[2022-03-24T19:39:32.447] [INFO] default - 23712-31312 SessionManagerFactory [object Object]
[2022-03-24T19:39:32.467] [INFO] default - 23712-31312 SessionManagerFactory - Create MongoStore.
[2022-03-24T19:39:33.009] [INFO] default - 23712-31312 AuthenticationManagerFactory [object Object]
[2022-03-24T19:39:33.029] [INFO] default - 23712-31312 RepositoryFactory - Create MongoDbRepository.
[2022-03-24T19:39:33.064] [INFO] default - 23712-31312 AuthenticationManagerFactory - Create PassportLocal.
[2022-03-24T19:39:36.001] [INFO] default - 23712-31312 PID 31312
[2022-03-24T19:39:36.019] [INFO] default - 23712-31312 Server context [object Object]
[2022-03-24T19:39:36.041] [INFO] default - 23712-31312 Creating server ..........................
[2022-03-24T19:39:36.120] [INFO] default - 23712-31312 Server created ..........................
[2022-03-24T19:39:36.147] [INFO] default - 23712-31312 Servidor express escuchando en el puerto 8080 - PID 31312

````

### Deploy en Heroku
En https://ecommerce-jpi.herokuapp.com/ se encuentra disponible una versión con persistencia en MongoDB.



#

  

Autor: jpiturralde@gmail.com (U610166)
