
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
	-	Para poder utilizar este mecanismo se tiene que ejecutar previamente el script [websocketsdb_ddl.sql](https://github.com/jpiturralde/cursoBackend/blob/master/WebSockets/scripts/websocketsdb_ddl.sql) para crear la BD y tabla correspondiente.
 
## MOCKS
Sobre el desafío entregable de la clase 16, crear una vista en forma de tabla que consuma desde la ruta ‘/api/productos-test’ del servidor una lista con 5 productos generados al azar utilizando **Faker.js** como generador de información aleatoria de test (en lugar de tomarse desde la base de datos). Elegir apropiadamente los temas para conformar el objeto ‘producto’ (nombre, precio y foto).


#

Autor: jpiturralde@gmail.com (U610166)