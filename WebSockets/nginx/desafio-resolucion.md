
  

# SERVIDOR CON BALANCE DE CARGA
**Retomemos nuestro trabajo para poder ejecutar el servidor en modo fork o cluster, ajustando el balance de carga a través de Nginx.**

## EJECUTAR SERVIDORES NODE

### Consigna

Tomando con base el proyecto que vamos realizando, agregar un parámetro más en la ruta de comando que permita ejecutar al servidor en modo fork o cluster. Dicho parámetro será 'FORK' en el primer caso y 'CLUSTER' en el segundo, y de no pasarlo, el servidor iniciará en modo fork.

-   Agregar en la vista info, el número de procesadores presentes en el servidor.
    
    ![datos-proceso](https://github.com/jpiturralde/cursoBackend/blob/nginx/WebSockets/nginx/datos-proceso.PNG)
    
-   Ejecutar el servidor (modos FORK y CLUSTER) con nodemon verificando el número de procesos tomados por node.
     
     ``nodemon ./src/main.js``
    ![nodemon-fork](https://github.com/jpiturralde/cursoBackend/blob/nginx/WebSockets/nginx/nodemon-fork.PNG) 

     ``nodemon ./src/main.js -m CLUSTER``
    ![nodemon-cluster](https://github.com/jpiturralde/cursoBackend/blob/nginx/WebSockets/nginx/nodemon-cluster.PNG) 

-   Ejecutar el servidor (con los parámetros adecuados) utilizando Forever, verificando su correcta operación. Listar los procesos por Forever y por sistema operativo.

     ``forever``
    ![forever](https://github.com/jpiturralde/cursoBackend/blob/nginx/WebSockets/nginx/forever.PNG) 


- Ejecutar el servidor (con los parámetros adecuados: modo FORK) utilizando PM2 en sus modos modo fork y cluster. Listar los procesos por PM2 y por sistema operativo.

     ``./node_modules/.bin/pm2 start ./src/main.js --watch -- --PORT=8082``
    ![pm2-fork](https://github.com/jpiturralde/cursoBackend/blob/nginx/WebSockets/nginx/pm2-fork.PNG) 

     ``./node_modules/.bin/pm2 start ./src/main.js --watch -- --PORT=8082 --MODE=CLUSTER``
    ![pm2-cluster](https://github.com/jpiturralde/cursoBackend/blob/nginx/WebSockets/nginx/pm2-cluster.PNG) 

     ``./node_modules/.bin/pm2 start ./src/main.js -i max --watch -- --PORT=8083``
    ![pm2-cluster-imax](https://github.com/jpiturralde/cursoBackend/blob/nginx/WebSockets/nginx/pm2-cluster-imax.PNG) 
    **Aclaración:** En este escenario se generó el error mostrado a continuación. Si bien el listado de procesos no mostraba nada, la aplicación no respondía. Por temas de tiempo no llegué a revisar la causa.
    
    ``
    You have triggered an unhandledRejection, you may have forgotten to catch a Promise rejection:
    Error [ERR_UNSUPPORTED_ESM_URL_SCHEME]: Only file and data URLs are supported by the default ESM loader. On Windows, absolute paths must be valid file:// URLs. Received protocol 'c:'
    at new NodeError (node:internal/errors:371:5)
    at defaultResolve (node:internal/modules/esm/resolve:1016:11)
    at ESMLoader.resolve (node:internal/modules/esm/loader:422:30)
    at ESMLoader.getModuleJob (node:internal/modules/esm/loader:222:40)
    at ESMLoader.import (node:internal/modules/esm/loader:276:22)
    at importModuleDynamically (node:internal/modules/cjs/loader:1041:29)
    at importModuleDynamicallyWrapper (node:internal/vm/module:437:21)
    at importModuleDynamically (node:vm:381:46)
    at importModuleDynamicallyCallback (node:internal/process/esm_loader:35:14)
    at C:\Users\u610166\Documents\curso\cursoBackend\WebSockets\node_modules\pm2\lib\ProcessContainer.js:301:26
    ``

-   Tanto en Forever como en PM2 permitir el modo escucha, para que la actualización del código del servidor se vea reflejado inmediatamente en todos los procesos.
    
-   Hacer pruebas de finalización de procesos fork y cluster en los casos que corresponda.

## SERVIDOR NGINX

### Consigna

Configurar Nginx para balancear cargas de nuestro servidor de la siguiente manera:

Redirigir todas las consultas a /api/randoms a un cluster de servidores escuchando en el puerto 8081. El cluster será creado desde node utilizando el módulo nativo cluster.

El resto de las consultas, redirigirlas a un servidor individual escuchando en el puerto 8080.

Verificar que todo funcione correctamente.

Luego, modificar la configuración para que todas las consultas a /api/randoms sean redirigidas a un cluster de servidores gestionado desde nginx, repartiéndolas equitativamente entre 4 instancias escuchando en los puertos 8082, 8083, 8084 y 8085 respectivamente.

**Aspectos a incluir en el entregable**

Incluir el archivo de configuración de nginx junto con el proyecto.

Incluir también un pequeño documento en donde se detallen los comandos que deben ejecutarse por línea de comandos y los argumentos que deben enviarse para levantar todas las instancias de servidores de modo que soporten la configuración detallada en los puntos anteriores.

Ejemplo:
 - pm2 start ./miservidor.js -- --port=8080 --modo=fork
 - pm2 start ./miservidor.js -- --port=8081 --modo=cluster
 - pm2 start ./miservidor.js -- --port=8082 --modo=fork
   ...

**RESOLUCIÓN**

[Archivo de configuración de nginx](https://github.com/jpiturralde/cursoBackend/blob/nginx/WebSockets/nginx/conf/nginx.conf)

Pasos para levantar servidores:

````
 ./node_modules/.bin/pm2 start ./src/main.js --name="ApiServer" -f --watch -- --PORT=8082 --MODE=CLUSTER
 
 ./node_modules/.bin/pm2 start ./src/main.js --name="WebServer" -f --watch -- --PORT=8080 --MODE=FORK

````

**Aclaración**
Debido al error antes mencionado al levantar cluster en pm2, terminé usando cluster de node y el balanceo de carga por default de dicho cluster.
#
Autor: jpiturralde@gmail.com (U610166)
