
  

# WebSockets

  

  

## Desafío entregable

  

Formato: link a un repositorio en Github con el proyecto cargado.

  

Sugerencia: no incluir los node_modules.

  

  

### Consigna 1

  

Modificar el último entregable para que disponga de un canal de websocket que permita representar, por debajo del formulario de ingreso, una tabla con la lista de productos en tiempo real.

  

- Puede haber varios clientes conectados simultáneamente y en cada uno de ellos se reflejarán los cambios que se realicen en los productos sin necesidad de recargar la vista.

  

- Cuando un cliente se conecte, recibirá la lista de productos a representar en la vista.

  

#### Aspectos a incluir en el entregable

  

Para construir la tabla dinámica con los datos recibidos por websocket utilizar Handlebars en el frontend. Considerar usar archivos públicos para alojar la plantilla vacía, y obtenerla usando la función fetch( ). Recordar que fetch devuelve una promesa.

  

  

### Consigna 2

  

Añadiremos al proyecto un canal de chat entre los clientes y el servidor.

  

#### Aspectos a incluir en el entregable

  

- En la parte inferior del formulario de ingreso se presentará el centro de mensajes almacenados en el servidor, donde figuren los mensajes de todos los usuarios identificados por su email.

  

- El formato a representar será: email (texto negrita en azul) [fecha y hora (DD/MM/YYYY HH:MM:SS)](texto normal en marrón) : mensaje (texto italic en verde)

  

- Además incorporar dos elementos de entrada: uno para que el usuario ingrese su email (obligatorio para poder utilizar el chat) y otro para ingresar mensajes y enviarlos mediante un botón.

  

Los mensajes deben persistir en el servidor en un archivo (ver segundo entregable).

  

## Nueva versión

Luego de implementar desafío [PrimeraDB](https://github.com/jpiturralde/cursoBackend/tree/master/PrimeraBD) se agregan nuevos mecanismos de persistencia:

  

- Cambia la persistencia de los mensajes de filesystem a base de datos SQLite3.

- Cambia la persistencia de los productos de memoria a base de datos MariaDB.

- Para poder utilizar este mecanismo se tiene que ejecutar previamente el script [websocketsdb_ddl.sql](https://github.com/jpiturralde/cursoBackend/blob/master/WebSockets/scripts/websocketsdb_ddl.sql) para crear la BD y tabla correspondiente.

## MOCKS

Sobre el desafío entregable de la clase 16, crear una vista en forma de tabla que consuma desde la ruta ‘/api/productos-test’ del servidor una lista con 5 productos generados al azar utilizando **Faker.js** como generador de información aleatoria de test (en lugar de tomarse desde la base de datos). Elegir apropiadamente los temas para conformar el objeto ‘producto’ (nombre, precio y foto).

 ## NORMALIZACIÓN 
 Ahora, vamos a **reformar el formato de los mensajes** y la forma de comunicación del chat (centro de mensajes).

El nuevo formato de mensaje será:
``
{
	author: {
		id:  'mail del usuario',
		nombre:  'nombre del usuario',
		apellido:  'apellido del usuario',
		edad:  'edad del usuario',
		alias:  'alias del usuario',
		avatar:  'url avatar (foto, logo) del usuario'
	},
	text:  'mensaje del usuario'
}
``
**Aspectos a incluir en el entregable**

 1. Modificar la persistencia de los mensajes para que utilicen un contenedor que permita guardar objetos anidados (archivos, mongodb, firebase).
 2. El mensaje se envía del frontend hacia el backend, el cual lo almacenará en la base de datos elegida. Luego cuando el cliente se conecte o envie un mensaje, recibirá un **array de mensajes** a representar en su vista.
 3. El array que se devuelve debe estar **normalizado con normalizr**, conteniendo una entidad de autores. Considerar que el array tiene sus autores con su correspondiente id (mail del usuario), pero necesita incluir para el proceso de normalización un **id para todo el array** en su conjunto (podemos asignarle nosotros un valor fijo). 
	 Ejemplo: ``{ id: ‘mensajes’, mensajes: [ ] }``
 4. El frontend debería poseer el mismo esquema de normalización que el backend, para que este pueda desnormalizar y presentar la información adecuada en la vista.
 5. Considerar que se puede cambiar el nombre del id que usa normalizr, agregando un tercer parametro a la función schema.Entity, por ejemplo:
  ``const schemaAuthor = new schema.Entity('author',{...},{idAttribute: 'email'});`` 
  En este schema cambia el nombre del id con que se normaliza el nombre de los autores a 'email'. Más info en la [web oficial](https://github.com/paularmstrong/normalizr/blob/master/docs/api.md).
 6. Presentar en el frontend (a modo de test) el porcentaje de compresión de los mensajes recibidos. Puede ser en el título del centro de mensajes.

**NOTA:** Incluir en el frontend el script de normalizr de la siguiente cdn: https://cdn.jsdelivr.net/npm/normalizr@3.6.1/dist/normalizr.browser.min.js

Así podremos utilizar los mismos métodos de normalizr que en el backend. Por ejemplo:
``new normalizr.schema.Entity, normalizr.denormalize(..,..,..)``

## LOG-IN POR FORMULARIO

Continuando con el desafío de la clase anterior, vamos a incorporar un mecanismo sencillo que permite loguear un cliente por su nombre, mediante un formulario de ingreso.

Luego de que el usuario esté logueado, se mostrará sobre el contenido del sitio un cartel con el mensaje “Bienvenido” y el nombre de usuario. Este cartel tendrá un botón de deslogueo a su derecha.

Verificar que el cliente permanezca logueado en los reinicios de la página, mientras no expire el tiempo de inactividad de un minuto, que se recargará con cada request. En caso de alcanzarse ese tiempo, el próximo request de usuario nos llevará al formulario de login.

Al desloguearse, se mostrará una vista con el mensaje de 'Hasta luego' más el nombre y se retornará automáticamente, luego de dos segundos, a la vista de login de usuario.

**Aspectos a incluir en el entregable**
 - La solución entregada deberá persistir las sesiones de usuario en Mongo Atlas.
 - Verificar que en los reinicios del servidor, no se pierdan las sesiones activas de los clientes.
 - Mediante el cliente web de Mongo Atlas, revisar los id de sesión correspondientes a cada cliente y sus datos.
 - Borrar una sesión de cliente en la base y comprobar que en el próximo request al usuario se le presente la vista de login.
 - Fijar un tiempo de expiración de sesión de 10 minutos recargable con cada visita del cliente al sitio y verificar que si pasa ese tiempo de inactividad el cliente quede deslogueado.

## INICIO DE SESIÓN 
Implementar sobre el entregable que venimos realizando un mecanismo de autenticación. Para ello:

 - Se incluirá una vista de registro, en donde se pidan email y contraseña. Estos datos se persistirán usando MongoDb, en una (nueva) colección de usuarios, cuidando que la contraseña quede encriptada (sugerencia: usar la librería bcrypt).

 - Una vista de login, donde se pida email y contraseña, y que realice la autenticación del lado del servidor a través de una estrategia de passport local.
 
 - Cada una de las vistas (logueo - registro) deberá tener un botón para ser redirigido a la otra.

Una vez logueado el usuario, se lo redirigirá al inicio, el cual ahora mostrará también su email, y un botón para desolguearse.

Además, se activará un espacio de sesión controlado por la sesión de passport. Esta estará activa por 10 minutos y en cada acceso se recargará este tiempo.

Agregar también vistas de error para login (credenciales no válidas) y registro (usuario ya registrado).

El resto de la funciones, deben quedar tal cual estaban el proyecto original.


#
Autor: jpiturralde@gmail.com (U610166)
