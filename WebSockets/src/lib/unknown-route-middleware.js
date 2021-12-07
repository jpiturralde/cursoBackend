/*
En el caso de requerir una ruta no implementada en el servidor, este debe contestar un objeto de error.
ej { error : -2, descripcion: ruta 'x' método 'y' no implementada}
*/
import { UNKNOWN_ROUTE_ERROR_MSG } from "./index.js"

export const unkownRoute = (req, res) => {
    res.status(404).json(UNKNOWN_ROUTE_ERROR_MSG(req));
}
