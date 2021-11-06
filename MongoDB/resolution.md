
# MONGODB

  

## Desafío entregable

Formato: Archivo de texto con las consultas realizadas y la carpeta de la base de datos comprimida en un zip.

Sugerencia: Si es un archivo en línea, configurar los permisos de acceso.

  

### Consigna

Utilizando Mongo Shell, crear una base de datos llamada ecommerce que contenga dos colecciones: mensajes y productos.



>**Resolución**
```
use ecommerce
db.createCollection('mensajes')
db.createCollection('productos')
```

>**Validación**

>  \>db

>>ecommerce

>\> show collections

>>mensajes
>>productos

  
  

1. Agregar 10 documentos con valores distintos a las colecciones mensajes y productos. El formato de los documentos debe estar en correspondencia con el que venimos utilizando en el entregable con base de datos MariaDB.

>**Resolución**

  
```
db.mensajes.insertMany([

{id: 1, ts: Date.now(), author: 'author1@gmail.com', msg:'mensaje1'},

{id: 2, ts: Date.now(), author: 'author2@gmail.com', msg:'mensaje2'},

{id: 3, ts: Date.now(), author: 'author3@gmail.com', msg:'mensaje3'},

{id: 4, ts: Date.now(), author: 'author4@gmail.com', msg:'mensaje4'},

{id: 5, ts: Date.now(), author: 'author5@gmail.com', msg:'mensaje5'},

{id: 6, ts: Date.now(), author: 'author6@gmail.com', msg:'mensaje6'},

{id: 7, ts: Date.now(), author: 'author7@gmail.com', msg:'mensaje7'},

{id: 8, ts: Date.now(), author: 'author8@gmail.com', msg:'mensaje8'},

{id: 9, ts: Date.now(), author: 'author9@gmail.com', msg:'mensaje9'},

{id: 10, ts: Date.now(), author: 'author10@gmail.com', msg:'mensaje10'}

])

db.productos.insertMany([

{id: 1, title: 'Articulo1', price: 120, thumbnail: 'http://foto.del.articulo1.com'},

{id: 2, title: 'Articulo2', price: 580, thumbnail: 'http://foto.del.articulo2.com'},

{id: 3, title: 'Articulo3', price: 900, thumbnail: 'http://foto.del.articulo3.com'},

{id: 4, title: 'Articulo4', price: 1280, thumbnail: 'http://foto.del.articulo4.com'},

{id: 5, title: 'Articulo5', price: 1700, thumbnail: 'http://foto.del.articulo5.com'},

{id: 6, title: 'Articulo6', price: 2300, thumbnail: 'http://foto.del.articulo6.com'},

{id: 7, title: 'Articulo7', price: 2860, thumbnail: 'http://foto.del.articulo7.com'},

{id: 8, title: 'Articulo8', price: 3350, thumbnail: 'http://foto.del.articulo8.com'},

{id: 9, title: 'Articulo9', price: 4320, thumbnail: 'http://foto.del.articulo9.com'},

{id: 10, title: 'Articulo10', price: 4990, thumbnail: 'http://foto.del.articulo10.com'}

])
```
  

2. Definir las claves de los documentos en relación a los campos de las tablas de esa base. En el caso de los productos, poner valores al campo precio entre los 100 y 5000 pesos(eligiendo valores intermedios, ej: 120, 580, 900, 1280, 1700, 2300, 2860, 3350, 4320, 4990).

3. Listar todos los documentos en cada colección.
>**Resolución**
````
db.mensajes.find()
db.productos.find()
````
4. Mostrar la cantidad de documentos almacenados en cada una de ellas.
>**Resolución**
````
db.mensajes.countDocuments({})
db.productos.countDocuments({})
````
  

5. Realizar un CRUD sobre la colección de productos:

a. Agregar un producto más en la colección de productos.
>**Resolución**
````
db.productos.insertOne({id: 11, title: 'Articulo11', price: 4900, thumbnail: 'http://foto.del.articulo11.com'})
````
b. Realizar una consulta por nombre de producto específico:

1. Listar los productos con precio menor a 1000 pesos.

2. Listar los productos con precio entre los 1000 a 3000 pesos.

3. Listar los productos con precio mayor a 3000 pesos.

4. Realizar una consulta que traiga sólo el nombre del tercer producto más barato.

  

c. Hacer una actualización sobre todos los productos, agregando el campo stock a todos ellos con un valor de 100.

d. Cambiar el stock a cero de los productos con precios mayores a 4000 pesos.

e. Borrar los productos con precio menor a 1000 pesos.

6. Crear un usuario 'pepe' clave: 'asd456' que sólo pueda leer la base de datos ecommerce. Verificar que pepe no pueda cambiar la información.

#

Autor: jpiturralde@gmail.com (U610166)
