const express = require('express');
const passport = require('passport');

const log = require('./../../../utils/logger');
const comentariosController = require('./comentarios.controller');
const procesarErrores = require('../../libs/errorHandler').procesarErrores;
const { validarId } = require('../../libs/mongoUtils');

const jwtAuthenticate = passport.authenticate('jwt', { session: false });
const comentariosRouter = express.Router();

comentariosRouter.get(
  '/all/comments',
  procesarErrores((req, res) => {
    return comentariosController
      .obtenerTodosLosComentarios()
      .then(comentarios => {
        res.json(comentarios);
      });
  })
);

comentariosRouter.get(
  '/:id/comentarios',
  [jwtAuthenticate, validarId],
  procesarErrores((req, res) => {
    const idFoto = req.params.id;
    log.info(
      `Usuario [${
        req.user.username
      }] pidió comentarios para foto con id [${idFoto}]`
    );
    return comentariosController
      .obtenerComentarios(idFoto)
      .then(comentarios => {
        res.json(comentarios);
      });
  })
);

comentariosRouter.post(
  '/:id/comentarios',
  [jwtAuthenticate, validarId],
  procesarErrores((req, res) => {
    let mensaje = req.body.mensaje;
    if (!mensaje || mensaje.length === 0) {
      let err = new Error(`Comentario debe incluir un mensaje`);
      err.status = 400;
      throw err;
    } else if (mensaje.length > 180) {
      let err = new Error(`Comentario no puede tener más de 180 caracteres`);
      err.status = 400;
      throw err;
    }

    const idFoto = req.params.id;
    return comentariosController
      .guardarComentario(idFoto, req.user.id, req.body.mensaje)
      .then(post => {
        if (!post) {
          let err = new Error(`Post con id [${idFoto}] no existe.`);
          err.status = 404;
          throw err;
        }

        log.info(`Comentario agregado a post con id [${idFoto}]`, post);
        res.status(201).json(post);
      });
  })
);

module.exports = comentariosRouter;
