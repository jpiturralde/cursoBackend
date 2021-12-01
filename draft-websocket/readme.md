# Problema con Fetch
![problemaConFetch](https://github.com/jpiturralde/cursoBackend/blob/login/draft-websocket/problemaConFetch.PNG)  
Al server llegan los 2 request a /api/login, pero en el cliente el primero da error y el segundo termina bien. Como consecuencia, en el server quedan 2 sesiones generadas para el mismo usuario.

El error no ocurre siempre. Algunas veces, el primer request se ejecuta bien en el servidor y termina bien en el cliente.

Adicionalmente a este problema, en la consola del browser siempre sale el error de “***Uncaught SyntaxError: Identifier 'socket' has already been declared***”. Este error lo vengo arrastrando desde la entrega inicial de websockets pero no me ha traído síntomas en cuanto a la funcionalidad.
