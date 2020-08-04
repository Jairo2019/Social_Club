const express = require('express');
const passport = require('passport');

const log = require('./../../../utils/logger');

const procesarErrores = require('../../libs/errorHandler').procesarErrores;
const { validarId } = require('../../libs/mongoUtils');

const amistadesController = require('./amistades.controller');

const jwtAuthenticate = passport.authenticate('jwt', { session: false });
const amistadesRouter = express.Router();

amistadesRouter.get(
  '/',
  procesarErrores((req, res) => {
    return amistadesController.obtenerAmistades().then(amistades => {
      res.json(amistades);
    });
  })
);

// Ruta que responde ¿Estoy siguiendo al usuario con el :id?
amistadesRouter.get(
  '/:id/siguiendo',
  [jwtAuthenticate, validarId],
  procesarErrores(async (req, res) => {
    const amistad = await amistadesController.obtenerAmistad(
      req.user.id,
      req.params.id
    );
    log.info(`Amistad agregada ${req.user.id} sigue a ${req.query.id}`);
    res.json({ siguiendo: !!amistad });
  })
);

amistadesRouter.post(
  '/:id/seguir',
  [jwtAuthenticate, validarId],
  procesarErrores(async (req, res) => {
    const amistad = await amistadesController.crearAmistad(
      req.user.id,
      req.params.id
    );
    log.info(`Amistad agregada ${req.user.id} sigue a ${req.query.id}`);
    res.status(201).json(amistad);
  })
);

amistadesRouter.delete(
  '/:id/eliminar',
  [jwtAuthenticate, validarId],
  procesarErrores(async (req, res) => {
    const amistad = await amistadesController.eliminarAmistad(
      req.user.id,
      req.params.id
    );
    log.info(`Amistad eliminada ${req.user.id} ya no sigue a ${req.query.id}`);
    res.json(amistad);
  })
);

module.exports = amistadesRouter;
