const { Like } = require('./likes.model');
const { Post } = require('../posts/posts.model');

function obtenerTodosLosLikes() {
  return Like.find({});
}

function obtenerLikes(postId) {
  return Like.find({
    post: postId
  });
}

function obtenerLike(postId, usuarioId) {
  return Like.findOne({
    post: postId,
    usuario: usuarioId
  });
}

async function agregarLike(postId, usuarioId) {
  const likeYaExiste = await Like.findOne({
    post: postId,
    usuario: usuarioId
  });

  if (likeYaExiste) {
    let err = new Error(
      `Usuario con id [${usuarioId}] ya tiene un like grabado en post con id [${postId}].`
    );
    err.status = 409;
    throw err;
  }

  const post = await Post.findOneAndUpdate(
    { _id: postId },
    {
      $inc: { numLikes: 1 }
    }
  );

  if (!post) {
    let err = new Error(`Post con id [${postId}] no existe.`);
    err.status = 404;
    throw err;
  }

  return new Like({
    post: postId,
    usuario: usuarioId
  }).save();
}

async function quitarLike(postId, usuarioId) {
  const like = await Like.findOneAndRemove({
    post: postId,
    usuario: usuarioId
  });

  if (!like) {
    let err = new Error(
      `Usuario con id [${usuarioId}] no dejo un like en post con id [${postId}].`
    );
    err.status = 404;
    throw err;
  }

  const post = await Post.findOneAndUpdate(
    { _id: postId },
    {
      $inc: { numLikes: -1 }
    }
  );

  if (!post) {
    let err = new Error(`Post con id [${postId}] no existe.`);
    err.status = 404;
    throw err;
  }

  return like;
}

module.exports = {
  obtenerTodosLosLikes,
  obtenerLikes,
  obtenerLike,
  agregarLike,
  quitarLike
};
