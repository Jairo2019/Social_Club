// Funcion de Conmutador de Entidades del Api
var express= require('express');
var router = express.Router();

var secRoutes = require('./sec');
var mocionRoutes = require('./mocion');
var alumnosRoutes = require('./alumnos');

router.use("/sec", secRoutes);
router.use("/mocion", mocionRoutes);
router.use("/alumnos", alumnosRoutes);

module.exports = router;
