/*
En el caso de requerir una ruta no implementada en el servidor, este debe contestar un objeto de error.
ej { error : -2, descripcion: ruta 'x' método 'y' no implementada}
*/
export const unkownRoute = (req, res) => {
          res.status(404).json(UNKNOWN_ROUTE(req));
    }

const UNKNOWN_ROUTE = (req) => { 
    return  {
        error : -2, 
        descripcion: `${req.method} ${req.path} no implementada`
    } 
}