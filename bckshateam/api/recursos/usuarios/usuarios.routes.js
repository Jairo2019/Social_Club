const express = require('express');
const _ = require('underscore');
const uuidv4 = require('uuid/v4');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const passport = require('passport');

const log = require('../../../utils/logger');
const validarUsuario = require('./usuarios.validate').validarUsuario;
const validarPedidoDeLogin = require('./usuarios.validate')
  .validarPedidoDeLogin;
const { validarImagen } = require('../posts/posts.validate');
const { guardarImagen } = require('../posts/posts.controller');
const config = require('../../../config');
const usuarioController = require('./usuarios.controller');
const procesarErrores = require('../../libs/errorHandler').procesarErrores;
const {
  DatosDeUsuarioYaEnUso,
  CredencialesIncorrectas
} = require('./usuarios.error');
const jwtAuthenticate = passport.authenticate('jwt', { session: false });

const amistadesController = require('../amistades/amistades.controller');

const usuariosRouter = express.Router();

function transformarBodyALowercase(req, res, next) {
  req.body.username && (req.body.username = req.body.username.toLowerCase());
  req.body.email && (req.body.email = req.body.email.toLowerCase());
  next();
}

usuariosRouter.get(
  '/',
  procesarErrores((req, res) => {
    return usuarioController.obtenerUsuarios().then(usuarios => {
      res.json(usuarios);
    });
  })
);

usuariosRouter.get(
  '/explore',
  [jwtAuthenticate],
  procesarErrores(async (req, res) => {
    usuarioController
      .obtenerUsuariosExplore(req.user.id)
      .then(usuarios => res.json(usuarios));

    // return usuarioController.obtenerUsuarios().then(usuarios => {
    //   res.json(usuarios);
    // });
  })
);

usuariosRouter.get(
  '/whoami',
  [jwtAuthenticate],
  procesarErrores(async (req, res) => {
    res.json(esconderCamposSensibles(req.user));
  })
);

usuariosRouter.get(
  '/:username',
  [jwtAuthenticate],
  procesarErrores(async (req, res) => {
    const username = req.params.username;
    const usuario = await usuarioController.obtenerUsuario(
      { username },
      req.user.id
    );

    if (!usuario) {
      let err = new Error(`Usuario con username [${username}] no existe.`);
      err.status = 404;
      throw err;
    }

    res.json(esconderCamposSensibles(usuario));
  })
);

usuariosRouter.post(
  '/signup',
  [validarUsuario, transformarBodyALowercase],
  procesarErrores((req, res) => {
    let nuevoUsuario = req.body;

    return usuarioController
      .usuarioExiste(nuevoUsuario.username, nuevoUsuario.email)
      .then(usuarioExiste => {
        if (usuarioExiste) {
          log.warn(
            `Email [${nuevoUsuario.email}] o username [${
              nuevoUsuario.username
            }] ya existen en la base de datos`
          );
          throw new DatosDeUsuarioYaEnUso();
        }

        return bcrypt.hash(nuevoUsuario.password, 10);
      })
      .then(hash => {
        return usuarioController
          .crearUsuario(nuevoUsuario, hash)
          .then(nuevoUsario => {
            res.status(201).json({
              token: crearToken(nuevoUsario._id),
              usuario: esconderCamposSensibles(nuevoUsario)
            });

            return nuevoUsario;
          })
          .then(nuevoUsario => {
            // El usuario creado se sigue a si mismo
            amistadesController.crearAmistad(nuevoUsario._id, nuevoUsario._id);
          });
      });
  })
);

usuariosRouter.post(
  '/login',
  [validarPedidoDeLogin, transformarBodyALowercase],
  procesarErrores(async (req, res) => {
    let usuarioNoAutenticado = req.body;

    let usuarioRegistrado = await usuarioController.obtenerUsuario({
      email: usuarioNoAutenticado.email
    });
    if (!usuarioRegistrado) {
      log.info(
        `Usuario con email [${
          usuarioNoAutenticado.email
        }] no existe. No pudo ser autenticado`
      );
      throw new CredencialesIncorrectas();
    }

    let contraseñaCorrecta = await bcrypt.compare(
      usuarioNoAutenticado.password,
      usuarioRegistrado.password
    );
    if (contraseñaCorrecta) {
      let token = crearToken(usuarioRegistrado.id);

      log.info(
        `Usuario con email ${
          usuarioNoAutenticado.email
        } completo autenticación exitosamente.`
      );

      const usuario = esconderCamposSensibles(usuarioRegistrado);

      res.status(200).json({ token, usuario });
    } else {
      log.info(
        `Usuario con email ${
          usuarioNoAutenticado.email
        } no completo autenticación. Contraseña incorrecta`
      );
      throw new CredencialesIncorrectas();
    }
  })
);

usuariosRouter.post(
  '/upload',
  [jwtAuthenticate, validarImagen],
  procesarErrores(async (req, res) => {
    const username = req.user.username;
    const usuario = req.user;
    log.info(`Request recibido de usuario [${username}] para subir imagen`);

    const nombreRandomizado = `${uuidv4()}.${req.extensionDeArchivo}`;
    const urlDeImagen = await guardarImagen(req.body, nombreRandomizado);

    req.user.imagen = urlDeImagen;
    await usuario.save();

    log.info(
      `El usuario [${username}] ha actualizado su imagen de perfil [${urlDeImagen}].`
    );

    res.json({ url: urlDeImagen });
  })
);

function crearToken(usuarioId) {
  return jwt.sign({ id: usuarioId }, config.jwt.secreto, {
    expiresIn: config.jwt.tiempoDeExpiración
  });
}

function esconderCamposSensibles(usuario) {
  return {
    _id: usuario._id || usuario.id, // Cuando el usuario viene de req.user el id es "id" en vez de "_id"
    email: usuario.email,
    username: usuario.username,
    bio: usuario.bio,
    nombre: usuario.nombre,
    imagen: usuario.imagen,
    siguiendo: usuario.siguiendo,
    // Restar 1 porqe el usuario se sigue a si mismo para calcular el feed
    numSeguidores: usuario.numSeguidores - 1,
    numSiguiendo: usuario.numSiguiendo - 1
  };
}

module.exports = usuariosRouter;
