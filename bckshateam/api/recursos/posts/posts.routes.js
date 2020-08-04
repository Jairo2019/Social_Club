const express = require('express');
const uuidv4 = require('uuid/v4');
const passport = require('passport');

const { validarMetadataDePost, validarImagen } = require('./posts.validate');
const log = require('../../../utils/logger');
const {
  obtenerPosts,
  obtenerPost,
  crearPost,
  guardarImagen,
  obtenerPostsParaUsuario,
  obtenerFeed
} = require('./posts.controller');
const procesarErrores = require('../../libs/errorHandler').procesarErrores;
const { validarId } = require('../../libs/mongoUtils');

const jwtAuthenticate = passport.authenticate('jwt', { session: false });
const postsRouter = express.Router();

postsRouter.get(
  '/',
  procesarErrores((req, res) => {
    return obtenerPosts().then(posts => {
      res.json(posts);
    });
  })
);

postsRouter.get(
  '/explore',
  procesarErrores((req, res) => {
    return obtenerPosts().then(posts => {
      res.json(posts);
    });
  })
);

postsRouter.get(
  '/feed',
  [jwtAuthenticate],
  procesarErrores((req, res) => {
    const buscarAntesDeFecha = req.query.fecha || new Date();
    log.info(
      `Buscando posts para el feed antes de la fecha [${buscarAntesDeFecha}]`
    );
    return obtenerFeed(req.user.id, buscarAntesDeFecha).then(posts => {
      res.json(posts);
    });
  })
);

postsRouter.get(
  '/usuario/:id',
  [validarId, jwtAuthenticate],
  procesarErrores((req, res) => {
    let id = req.params.id;
    return obtenerPostsParaUsuario(id).then(posts => {
      res.json(posts);
    });
  })
);

postsRouter.get(
  '/:id',
  [jwtAuthenticate, validarId],
  procesarErrores((req, res) => {
    let id = req.params.id;
    return obtenerPost(id, req.user.id).then(post => {
      if (!post) {
        let err = new Error(`Post con id [${id}] no existe.`);
        err.status = 404;
        throw err;
      }
      res.json(post);
    });
  })
);

postsRouter.post(
  '/',
  [jwtAuthenticate, validarMetadataDePost],
  procesarErrores((req, res) => {
    return crearPost(req.body, req.user.id).then(post => {
      log.info('Post agregada a la colección de posts', post);
      res.status(201).json(post);
    });
  })
);

postsRouter.post(
  '/upload',
  [jwtAuthenticate, validarImagen],
  procesarErrores(async (req, res) => {
    const usuario = req.user.username;
    log.info(`Request recibido de usuario [${usuario}] para subir imagen`);

    const nombreRandomizado = `${uuidv4()}.${req.extensionDeArchivo}`;
    const urlDeImagen = await guardarImagen(req.body, nombreRandomizado);

    log.info(
      `Link a nueva imagen [${urlDeImagen}]. Subida por dueño [${usuario}]`
    );
    res.json({ url: urlDeImagen });
  })
);

module.exports = postsRouter;
