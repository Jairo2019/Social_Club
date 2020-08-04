const passportJWT = require('passport-jwt');

const log = require('./../../utils/logger');
const config = require('../../config');
const usuarioController = require('../recursos/usuarios/usuarios.controller');

// Token debe ser especificado mediante el header "Authorization". Ejemplo:
// Authorization: bearer xxxx.yyyy.zzzz
let jwtOptions = {
  secretOrKey: config.jwt.secreto,
  jwtFromRequest: passportJWT.ExtractJwt.fromAuthHeaderAsBearerToken()
};

module.exports = new passportJWT.Strategy(jwtOptions, (jwtPayload, next) => {
  usuarioController
    .obtenerUsuario({ id: jwtPayload.id })
    .then(usuario => {
      if (!usuario) {
        log.info(
          `JWT token no es válido. Usuario con id ${jwtPayload.id} no existe.`
        );
        next(null, false);
        return;
      }

      log.info(
        `Usuario ${
          usuario.username
        } suministro un token valido. Autenticación completada.`
      );
      next(null, usuario);
    })
    .catch(err => {
      log.error('Error ocurrió al tratar de validar un token.', err);
      next(err);
    });
});
