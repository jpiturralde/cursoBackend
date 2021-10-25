export const unkownRoute = (req, res) => {
    // Invalid request
          res.status(404).json(UNKNOWN_ROUTE(req));
    }

const UNKNOWN_ROUTE = (req) => { 
    return  {
        error : -2, 
        descripcion: `${req.method} ${req.path} no implementada`
    } 
}