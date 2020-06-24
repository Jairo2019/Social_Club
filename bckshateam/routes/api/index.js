// Funcion de Conmutador de Entidades del Api
var express= require('express');
var router = express.Router();

var secRoutes = require('./sec');
var publicacionesRoutes = require('./publicaciones');
var alumnosRoutes = require('./perfiles');

router.use("/sec", secRoutes);
router.use("/publicaciones", publicacionesRoutes);
router.use("/perfiles", alumnosRoutes);

module.exports = router;
