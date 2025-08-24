// Middleware simple que muestra por consola el metodo y url de la peticion
function loggingMdw(req, res, next) {
  console.log(`Request made to ${req.url} with method: ${req.method}.`);
  next();
}
module.exports = loggingMdw
