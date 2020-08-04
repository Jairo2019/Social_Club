const { Comentario } = require('./comentarios.model');
const { Post } = require('../posts/posts.model');

function obtenerTodosLosComentarios() {
  return Comentario.find({}).populate('usuario', '_id username');
}

function obtenerComentarios(postId) {
  return Comentario.find({ post: postId }).populate('usuario', '_id username');
}

async function guardarComentario(postId, usuarioId, mensaje) {
  const post = await Post.findOneAndUpdate(
    { _id: postId },
    {
      $inc: { numComentarios: 1 }
    }
  );

  if (!post) {
    let err = new Error(`Post con id [${postId}] no existe.`);
    err.status = 404;
    throw err;
  }

  return new Comentario({
    post: postId,
    usuario: usuarioId,
    mensaje
  }).save();
}

module.exports = {
  obtenerTodosLosComentarios,
  obtenerComentarios,
  guardarComentario
};
