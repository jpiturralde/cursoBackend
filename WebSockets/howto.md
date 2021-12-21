
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
Si no se especifica repositorio de usuarios, por defectose utiliza repositorio en memoria.
  

## Persistencia
Se necesitan repositorios para productos y mensajes. En ambos casos, por defecto se utiliza repositorio en memoria.
También en ambos casos es posible utilizar repositorio en file system.
Sólo para productos es posible utilizar SQLite3.
En config/persistence/exmples se pueden ver alternativas de configuración.
  

## Sesión

  
  
  

#

Autor: jpiturralde@gmail.com (U610166)