const { Amistad } = require('./amistades.model');

function obtenerAmistades() {
  return Amistad.find({});
}

function obtenerAmistad(usuarioId, seguidorId) {
  return Amistad.findOne({
    usuario: usuarioId,
    seguidor: seguidorId
  });
}

function obtenerSeguidores(usuarioId) {
  return Amistad.find({ seguidor: usuarioId });
}

function obtenerSiguiendo(usuarioId) {
  return Amistad.find({ usuario: usuarioId });
}

function crearAmistad(usuarioId, seguidorId) {
  return new Amistad({
    usuario: usuarioId,
    seguidor: seguidorId
  }).save();
}

function eliminarAmistad(usuarioId, seguidorId) {
  return Amistad.findOneAndRemove({ usuario: usuarioId, seguidor: seguidorId });
}

module.exports = {
  obtenerSeguidores,
  obtenerSiguiendo,
  crearAmistad,
  eliminarAmistad,
  obtenerAmistades,
  obtenerAmistad
};
