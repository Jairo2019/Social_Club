// Rutas de la Entidad de Seguridad
var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
  res.status(200).json(
    [
      {
        route: "/",
        description: "Muestra Documentación del API de Seguridad",
        body: "",
        params: "",
        resp: "json"
      }
    ]
  )
}); //get /


module.exports = router;
