const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const comentarioSchema = new mongoose.Schema(
  {
    post: {
      type: ObjectId,
      required: [true, 'Comentario debe estar asociado a un post'],
      ref: 'post',
      index: true
    },
    usuario: {
      type: ObjectId,
      required: [true, 'Comentario debe estar asociada a un usuario'],
      ref: 'usuario'
    },
    mensaje: {
      type: String,
      required: [true, 'Comentario debe tener un mensaje']
    }
  },
  { timestamps: { createdAt: 'fecha_creado', updatedAt: 'fecha_actualizado' } }
);

const Comentario = mongoose.model('comentario', comentarioSchema);

module.exports = {
  Comentario
};
