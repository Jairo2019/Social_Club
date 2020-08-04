const AWS = require('aws-sdk');
const fs = require('fs').promises
const { Post } = require('./posts.model');
const { Amistad } = require('../amistades/amistades.model');
const { Like } = require('../likes/likes.model');
const config = require('../../../config');

var s3Client = new AWS.S3({ ...config.s3 });

function obtenerPosts() {
  return Post.find({})
    .populate('usuario', '_id username')
    .populate({
      path: 'comentarios',
      populate: {
        path: 'usuario',
        select: '_id username imagen'
      }
    })
    .sort({ fecha_creado: -1 });
}

function obtenerFeed(idUsuario, buscarAntesDeFecha) {
  return Amistad.find({ usuario: idUsuario }, 'seguidor').then(arr => {
    const idsDeLosUsuariosQueElUsuarioSigue = arr.map(r => r.seguidor);
    const posts = Post.find({
      usuario: idsDeLosUsuariosQueElUsuarioSigue,
      fecha_creado: { $lt: buscarAntesDeFecha }
    })
      .sort({ fecha_creado: -1 })
      .limit(3)
      .populate('usuario', '_id username imagen')
      .populate({
        path: 'comentarios',
        populate: {
          path: 'usuario',
          select: '_id username'
        }
      })
      .then(posts => agregarEstadoLike(idUsuario, posts));

    return posts;
  });
}

async function agregarEstadoLike(usuarioId, posts) {
  const postIds = posts.map(post => post._id);

  return Like.find({
    usuario: usuarioId,
    post: { $in: postIds }
  }).then(likes => {
    const idDeLosPostsConLike = likes.map(like => like.post);

    posts.forEach(post => {
      // Revisar si el usuario loggeado le dío like a la foto
      if (idDeLosPostsConLike.some(id => id.equals(post._id))) {
        post.estaLike = true;
      }
    });

    return posts;
  });
}

function obtenerPostsParaUsuario(usuarioId) {
  return Post.find({ usuario: usuarioId });
}

function obtenerPost(id, usuarioId) {
  return Post.findById(id)
    .populate('usuario', '_id username imagen')
    .populate({
      path: 'comentarios',
      populate: {
        path: 'usuario',
        select: '_id username'
      }
    })
    .then(post => {
      if (!post) {
        let err = new Error(`Post con id [${id}] no existe.`);
        err.status = 404;
        throw err;
      }

      return agregarEstadoLike(usuarioId, [post]);
    })
    .then(([post]) => post); // Unwrap el post del array luego de agregar "estaLike"
}

function crearPost(post, usuarioId) {
  return new Post({
    ...post,
    usuario: usuarioId
  }).save();
}

async function guardarImagen(imageData, nombreDelArchivo) {
  if (!config.guardarImagenesEnS3) {
    // Guardar imagenes en la carpeta /public/imagenes
    await fs.writeFile(`${__dirname}/../../../public/imagenes/${nombreDelArchivo}`, imageData)
    return `/imagenes/${nombreDelArchivo}`
  }

  const destinacionDeImagen = `${config.pathEnBucket}/${nombreDelArchivo}`
  await s3Client.putObject({
    Body: imageData,
    Bucket: config.s3BucketName,
    Key: destinacionDeImagen
  }).promise()
  
  return `https://s3.amazonaws.com/${config.s3BucketName}/${destinacionDeImagen}`;
}

module.exports = {
  obtenerPosts,
  obtenerPost,
  crearPost,
  guardarImagen,
  obtenerPostsParaUsuario,
  obtenerFeed
};
